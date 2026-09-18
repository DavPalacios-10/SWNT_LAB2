import { ActivityCategory, EmissionBreakdownItem, EmissionCalculationResult, ExtractedEntity } from '../types';

/**
 * Factores de emisión aproximados basados en estándares públicos internacionales
 * (GHG Protocol, DEFRA 2023, IPCC).
 * Documentados para máxima transparencia auditaba.
 */
export const EMISSION_FACTORS: Record<string, { factor: number; unit: string; description: string }> = {
  // Energía y electricidad
  'electricidad_kwh': {
    factor: 0.385,
    unit: 'kg CO2e / kWh',
    description: 'Factor promedio de red eléctrica comercial (0.385 kg CO2e por kWh consumido).'
  },
  'gas_natural_m3': {
    factor: 2.02,
    unit: 'kg CO2e / m3',
    description: 'Combustión directa de gas natural comercial (2.02 kg CO2e por m3).'
  },
  'glp_balon': {
    factor: 13.3,
    unit: 'kg CO2e / balón (10kg)',
    description: 'Combustión de GLP embotellado en cilindros de 10kg.'
  },

  // Transporte y combustible
  'transporte_diesel_km': {
    factor: 0.22,
    unit: 'kg CO2e / km',
    description: 'Emisión estimada por kilómetro recorrido en furgón o camioneta diésel ligera.'
  },
  'transporte_gasolina_km': {
    factor: 0.18,
    unit: 'kg CO2e / km',
    description: 'Emisión estimada por kilómetro recorrido en vehículo ligero a gasolina.'
  },
  'transporte_diesel_litros': {
    factor: 2.68,
    unit: 'kg CO2e / L',
    description: 'Combustión directa de diésel vehicular (2.68 kg CO2e por litro).'
  },
  'transporte_gasolina_litros': {
    factor: 2.31,
    unit: 'kg CO2e / L',
    description: 'Combustión directa de gasolina de motor (2.31 kg CO2e por litro).'
  },

  // Residuos
  'residuos_generales_kg': {
    factor: 0.45,
    unit: 'kg CO2e / kg',
    description: 'Residuos sólidos urbanos mixtos sin clasificar destinados a vertedero.'
  },
  'residuos_plastico_kg': {
    factor: 1.85,
    unit: 'kg CO2e / kg',
    description: 'Huella de ciclo de vida de residuos plásticos no reciclados.'
  },
  'residuos_carton_kg': {
    factor: 0.65,
    unit: 'kg CO2e / kg',
    description: 'Residuos de papel o cartón no reciclados.'
  },

  // Agua
  'agua_m3': {
    factor: 0.30,
    unit: 'kg CO2e / m3',
    description: 'Tratamiento y distribución de agua potable municipal (0.30 kg CO2e por m3).'
  },

  // Valor por defecto para imprevistos
  'default': {
    factor: 0.50,
    unit: 'kg CO2e / unidad',
    description: 'Estimado genérico conservador para operaciones comerciales.'
  }
};

/**
 * Calcula las emisiones estimadas de CO2 para una lista de entidades extraídas.
 */
export function calculateEmissions(entities: ExtractedEntity[]): EmissionCalculationResult {
  const items: EmissionBreakdownItem[] = [];
  let totalKgCO2 = 0;

  for (const entity of entities) {
    let factorKey = 'default';
    const sub = (entity.subType || '').toLowerCase();
    const unit = (entity.unit || '').toLowerCase();

    if (entity.category === 'energy') {
      if (unit.includes('kwh') || entity.name.toLowerCase().includes('luz') || entity.name.toLowerCase().includes('electricidad')) {
        factorKey = 'electricidad_kwh';
      } else if (sub.includes('gas') || entity.name.toLowerCase().includes('gas')) {
        factorKey = 'gas_natural_m3';
      } else {
        factorKey = 'electricidad_kwh';
      }
    } else if (entity.category === 'transport') {
      if (unit.includes('litro') || unit.includes('l')) {
        factorKey = sub.includes('gasolina') ? 'transporte_gasolina_litros' : 'transporte_diesel_litros';
      } else {
        factorKey = sub.includes('gasolina') ? 'transporte_gasolina_km' : 'transporte_diesel_km';
      }
    } else if (entity.category === 'waste') {
      if (sub.includes('plastico') || entity.name.toLowerCase().includes('plastico')) {
        factorKey = 'residuos_plastico_kg';
      } else if (sub.includes('carton') || entity.name.toLowerCase().includes('carton') || entity.name.toLowerCase().includes('papel')) {
        factorKey = 'residuos_carton_kg';
      } else {
        factorKey = 'residuos_generales_kg';
      }
    } else if (entity.category === 'water') {
      factorKey = 'agua_m3';
    } else if (entity.category === 'operations') {
      if (sub.includes('balon') || entity.name.toLowerCase().includes('balon')) {
        factorKey = 'glp_balon';
      } else if (sub.includes('gas') || entity.name.toLowerCase().includes('gas')) {
        factorKey = 'gas_natural_m3';
      }
    }

    const factorConfig = EMISSION_FACTORS[factorKey] || EMISSION_FACTORS['default'];
    const calculatedKg = Number((entity.quantity * factorConfig.factor).toFixed(2));
    totalKgCO2 += calculatedKg;

    items.push({
      entityId: entity.id,
      category: entity.category,
      name: entity.name,
      quantity: entity.quantity,
      unit: entity.unit,
      kgCO2: calculatedKg,
      factorUsed: factorConfig.factor,
      factorUnit: factorConfig.unit,
      explanation: `${entity.quantity} ${entity.unit} × ${factorConfig.factor} ${factorConfig.unit}`
    });
  }

  const roundedTotal = Number(totalKgCO2.toFixed(2));
  const recommendations = generateRecommendations(items);
  const summaryMessage = generateSummaryMessage(roundedTotal, items.length);

  return {
    totalKgCO2: roundedTotal,
    items,
    summaryMessage,
    recommendations
  };
}

function generateSummaryMessage(totalKg: number, itemIndexCount: number): string {
  if (totalKg === 0) {
    return 'No se detectaron actividades con huella directa en la descripción.';
  }

  if (totalKg < 15) {
    return `¡Excelente! Registraste una huella muy ligera de ${totalKg} kg CO2e en ${itemIndexCount} actividad(es).`;
  } else if (totalKg < 60) {
    return `Se calcularon un total de ${totalKg} kg CO2e para tus actividades descritas.`;
  } else {
    return `Se registró una huella considerable de ${totalKg} kg CO2e. Revisa las recomendaciones para optimizar tus consumos.`;
  }
}

function generateRecommendations(items: EmissionBreakdownItem[]): string[] {
  const tips: string[] = [];

  const hasTransport = items.some(i => i.category === 'transport');
  const hasEnergy = items.some(i => i.category === 'energy');
  const hasWaste = items.some(i => i.category === 'waste');
  const hasWater = items.some(i => i.category === 'water');

  if (hasTransport) {
    tips.push('Agrupar rutas de entrega o cambiar a vehículos eléctricos/híbridos reduce hasta un 35% las emisiones logísticas.');
  }
  if (hasEnergy) {
    tips.push('Apagar equipos en modo standby y pasar a iluminación LED inteligente ahorra entre 10% y 20% de kWh diarios.');
  }
  if (hasWaste) {
    tips.push('Separar y entregar cartón/plástico a centros de reciclaje evita hasta 1.2 kg CO2e por kg de residuo.');
  }
  if (hasWater) {
    tips.push('Instalar difusores de ahorro en grifos comerciales reduce el volumen de m3 consumidos sin perder presión.');
  }

  if (tips.length === 0) {
    tips.push('Mantener un registro constante te ayuda a identificar picos inusuales de consumo en tu negocio.');
  }

  return tips;
}
