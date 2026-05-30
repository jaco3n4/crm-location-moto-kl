import { STORAGE_KEY, DEFAULT_STATUS } from './constants.js'
import { SEED_AGENCIES } from './data/seed.js'
import { uid } from './utils.js'

// Schéma d'une fiche agence — sert de gabarit pour normaliser les données.
export function blankAgency() {
  return {
    id: uid(),
    nom: '',
    zone: 'Autre',
    adresse: '',
    telephone: '',
    email: '',
    siteWeb: '',
    instagram: '',
    statut: DEFAULT_STATUS,
    prixJour: '',
    prixSemaine: '',
    prixMois: '',
    caution: '',
    modeles: '',
    note: 0,
    dernierContact: '',
    commentaires: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// Complète une fiche partielle (seed ou import) avec les champs manquants.
function normalize(partial) {
  return { ...blankAgency(), ...partial, id: partial.id || uid() }
}

export function loadAgencies() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seeded = SEED_AGENCIES.map(normalize)
      saveAgencies(seeded)
      return seeded
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalize)
  } catch (err) {
    console.error('Lecture du stockage impossible :', err)
    return SEED_AGENCIES.map(normalize)
  }
}

export function saveAgencies(agencies) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(agencies))
  } catch (err) {
    console.error('Écriture du stockage impossible :', err)
  }
}

// Import : accepte un tableau brut OU un objet { agencies: [...] }.
export function parseImport(text) {
  const data = JSON.parse(text)
  const arr = Array.isArray(data) ? data : data.agencies
  if (!Array.isArray(arr)) throw new Error('Format JSON invalide : tableau attendu.')
  return arr.map(normalize)
}
