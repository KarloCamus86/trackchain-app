/**
 * Mock data — reemplazar con llamadas reales a contrato/API.
 * Cada producto incluye su cadena de custodia (steps).
 */
export const products = [
  {
    id: 'prod-001',
    name: 'Café Orgánico Sierra Nevada',
    origin: 'Colombia',
    category: 'Alimentos',
    status: 'Verificado',
    txHash: '0xabc123...def456',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400',
    steps: [
      { label: 'Cosecha',       location: 'Finca El Paraíso, Huila',     date: '2024-09-01', verified: true },
      { label: 'Procesado',     location: 'Planta Don Gregorio, Pitalito', date: '2024-09-10', verified: true },
      { label: 'Exportación',   location: 'Puerto de Cartagena',           date: '2024-10-05', verified: true },
      { label: 'Importación',   location: 'Puerto de Barcelona',           date: '2024-10-28', verified: true },
      { label: 'Distribución',  location: 'Centro Logístico Madrid',       date: '2024-11-03', verified: false },
    ],
  },
  {
    id: 'prod-002',
    name: 'Aceite de Oliva Extra Virgen',
    origin: 'España',
    category: 'Alimentos',
    status: 'En tránsito',
    txHash: '0x789abc...012ghi',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
    steps: [
      { label: 'Recolección',   location: 'Hacienda Los Olivos, Jaén',    date: '2024-10-15', verified: true },
      { label: 'Prensado',      location: 'Almazara San Marcos, Jaén',    date: '2024-10-18', verified: true },
      { label: 'Embotellado',   location: 'Planta Sevilla',               date: '2024-11-01', verified: false },
    ],
  },
  {
    id: 'prod-003',
    name: 'Cacao Fino de Aroma',
    origin: 'Ecuador',
    category: 'Materias primas',
    status: 'Verificado',
    txHash: '0xdef456...789jkl',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400',
    steps: [
      { label: 'Fermentación',  location: 'Finca Hacienda Cacao, Guayas', date: '2024-08-20', verified: true },
      { label: 'Secado',        location: 'Finca Hacienda Cacao, Guayas', date: '2024-08-28', verified: true },
      { label: 'Exportación',   location: 'Puerto de Guayaquil',          date: '2024-09-12', verified: true },
      { label: 'Recepción EU',  location: 'Puerto de Amberes',            date: '2024-10-01', verified: true },
    ],
  },
]

export function getProductById(id) {
  return products.find((p) => p.id === id) ?? null
}
