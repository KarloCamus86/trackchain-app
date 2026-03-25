/**
 * Mock data — cadena de suministro alimentaria.
 * Reemplazar con llamadas reales a contrato/API en sesiones futuras.
 */
export const mockProducts = [
  {
    id: 'prod-001',
    name: 'Café Orgánico Sierra Nevada',
    category: 'Alimentos',
    manufacturer: 'Cooperativa Café del Sur',
    createdAt: '2024-09-01',
    currentStatus: 'Verificado',
    events: [
      {
        stage: 'Fabricación',
        location: 'Finca El Paraíso, Huila, Colombia',
        timestamp: '2024-09-01T07:00:00',
        actor: 'Cooperativa Café del Sur',
        description: 'Cosecha manual de granos maduros en finca certificada orgánica.',
        verified: true,
      },
      {
        stage: 'Almacén',
        location: 'Planta Don Gregorio, Pitalito, Colombia',
        timestamp: '2024-09-10T09:30:00',
        actor: 'Procesadora Pitalito S.A.',
        description: 'Recepción, despulpado, fermentación y secado al sol durante 12 días.',
        verified: true,
      },
      {
        stage: 'Transporte',
        location: 'Puerto de Cartagena, Colombia',
        timestamp: '2024-10-05T14:00:00',
        actor: 'MarCargo Colombia',
        description: 'Contenedor refrigerado #MC-4421 despachado hacia Europa. Temperatura: 18 °C.',
        verified: true,
      },
      {
        stage: 'Transporte',
        location: 'Puerto de Barcelona, España',
        timestamp: '2024-10-28T08:15:00',
        actor: 'Aduana Española / MarCargo EU',
        description: 'Contenedor liberado tras inspección fitosanitaria. Certificado CE-7893.',
        verified: true,
      },
      {
        stage: 'Entrega',
        location: 'Centro Logístico Madrid, España',
        timestamp: '2024-11-03T11:00:00',
        actor: 'Distribuidora Verde S.L.',
        description: 'Distribución a puntos de venta en la Comunidad de Madrid. Pendiente confirmación.',
        verified: false,
      },
    ],
  },
  {
    id: 'prod-002',
    name: 'Aceite de Oliva Extra Virgen',
    category: 'Alimentos',
    manufacturer: 'Hacienda Los Olivos',
    createdAt: '2024-10-15',
    currentStatus: 'En tránsito',
    events: [
      {
        stage: 'Fabricación',
        location: 'Hacienda Los Olivos, Jaén, España',
        timestamp: '2024-10-15T06:30:00',
        actor: 'Hacienda Los Olivos',
        description: 'Recolección mecanizada de aceitunas variedad Picual. Rendimiento: 18 kg/árbol.',
        verified: true,
      },
      {
        stage: 'Fabricación',
        location: 'Almazara San Marcos, Jaén, España',
        timestamp: '2024-10-18T10:00:00',
        actor: 'Almazara San Marcos',
        description: 'Prensado en frío a menos de 27 °C. Acidez: 0.2 %. Extracción certificada.',
        verified: true,
      },
      {
        stage: 'Almacén',
        location: 'Planta de Embotellado, Sevilla, España',
        timestamp: '2024-11-01T09:00:00',
        actor: 'EuroOlive Packaging',
        description: 'Embotellado en vidrio oscuro. Lote #EO-2024-1101. Etiquetado DOP Jaén.',
        verified: false,
      },
    ],
  },
  {
    id: 'prod-003',
    name: 'Cacao Fino de Aroma',
    category: 'Materias primas',
    manufacturer: 'Finca Hacienda Cacao',
    createdAt: '2024-08-20',
    currentStatus: 'Verificado',
    events: [
      {
        stage: 'Fabricación',
        location: 'Finca Hacienda Cacao, Guayas, Ecuador',
        timestamp: '2024-08-20T07:00:00',
        actor: 'Finca Hacienda Cacao',
        description: 'Cosecha de mazorcas CCN-51 y Nacional. Selección manual de granos.',
        verified: true,
      },
      {
        stage: 'Almacén',
        location: 'Finca Hacienda Cacao, Guayas, Ecuador',
        timestamp: '2024-08-22T08:00:00',
        actor: 'Finca Hacienda Cacao',
        description: 'Fermentación en cajones de madera durante 6 días. Temperatura controlada.',
        verified: true,
      },
      {
        stage: 'Almacén',
        location: 'Finca Hacienda Cacao, Guayas, Ecuador',
        timestamp: '2024-08-28T09:00:00',
        actor: 'Finca Hacienda Cacao',
        description: 'Secado solar hasta 7 % de humedad. Control de calidad ANECACAO aprobado.',
        verified: true,
      },
      {
        stage: 'Transporte',
        location: 'Puerto de Guayaquil, Ecuador',
        timestamp: '2024-09-12T13:00:00',
        actor: 'PacificShip Ecuador',
        description: 'Exportación en sacos de 69 kg. Contenedor #PS-8812. Certificado Fair Trade.',
        verified: true,
      },
      {
        stage: 'Entrega',
        location: 'Puerto de Amberes, Bélgica',
        timestamp: '2024-10-01T10:30:00',
        actor: 'EuroImport BV',
        description: 'Recepción y análisis de calidad en laboratorio acreditado. Resultado: apto.',
        verified: true,
      },
    ],
  },
]

export function getProductById(id) {
  return mockProducts.find((p) => p.id === id) ?? null
}
