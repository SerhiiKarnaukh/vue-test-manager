// SVG path data for supported F1 circuits
// Each entry: { name, viewBox, path, sectors, drsZones }

export const CIRCUITS = {
  bahrain: {
    name: 'Bahrain International Circuit',
    viewBox: '0 0 800 600',
    path: '' // TODO: add SVG path data
  },
  monza: {
    name: 'Autodromo Nazionale Monza',
    viewBox: '0 0 800 600',
    path: '' // TODO: add SVG path data
  },
  silverstone: {
    name: 'Silverstone Circuit',
    viewBox: '0 0 800 600',
    path: '' // TODO: add SVG path data
  },
  spa: {
    name: 'Circuit de Spa-Francorchamps',
    viewBox: '0 0 800 600',
    path: '' // TODO: add SVG path data
  },
  monaco: {
    name: 'Circuit de Monaco',
    viewBox: '0 0 800 600',
    path: '' // TODO: add SVG path data
  }
}

export const GENERIC_CIRCUIT = {
  name: 'Circuit',
  viewBox: '0 0 800 600',
  path: 'M400,100 C600,100 700,200 700,300 C700,400 600,500 400,500 C200,500 100,400 100,300 C100,200 200,100 400,100 Z'
}

export function getCircuit(circuitName) {
  const key = circuitName?.toLowerCase().replace(/\s+/g, '')
  return CIRCUITS[key] ?? GENERIC_CIRCUIT
}
