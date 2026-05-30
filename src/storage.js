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

// Clé annexe : noms d'agences déjà « semées » (pour ne pas ré-ajouter une
// agence du seed que l'utilisateur a supprimée).
const SEEDED_KEY = STORAGE_KEY + ':seeded'
const keyName = (nom) => String(nom || '').trim().toLowerCase()

function loadLedger() {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEDED_KEY)) || [])
  } catch {
    return new Set()
  }
}
function saveLedger(set) {
  try {
    localStorage.setItem(SEEDED_KEY, JSON.stringify([...set]))
  } catch (err) {
    console.error('Écriture du registre impossible :', err)
  }
}

export function loadAgencies() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    // Première visite : on sème toutes les agences.
    if (!raw) {
      const seeded = SEED_AGENCIES.map(normalize)
      saveAgencies(seeded)
      saveLedger(new Set(SEED_AGENCIES.map((s) => keyName(s.nom))))
      return seeded
    }

    const parsed = JSON.parse(raw)
    const list = Array.isArray(parsed) ? parsed.map(normalize) : []

    // Fusion : ajoute les agences du seed jamais vues (ni présentes, ni déjà
    // semées puis supprimées). Préserve toutes les données de l'utilisateur.
    const ledger = loadLedger()
    const existing = new Set(list.map((a) => keyName(a.nom)))
    let added = false
    for (const s of SEED_AGENCIES) {
      const k = keyName(s.nom)
      if (!ledger.has(k) && !existing.has(k)) {
        list.unshift(normalize(s))
        existing.add(k)
        added = true
      }
      ledger.add(k)
    }
    saveLedger(ledger)
    if (added) saveAgencies(list)
    return list
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
