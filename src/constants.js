// ── Pipeline de prospection ────────────────────────────────────────────────
// Chaque statut a une couleur utilisée pour les badges et la barre de stats.
export const STATUSES = [
  { id: 'a_contacter',    label: 'À contacter',    color: '#64748b' },
  { id: 'contacte',       label: 'Contacté',       color: '#3b82f6' },
  { id: 'a_repondu',      label: 'A répondu',      color: '#8b5cf6' },
  { id: 'prix_recu',      label: 'Prix reçu',      color: '#0ea5e9' },
  { id: 'en_negociation', label: 'En négociation', color: '#f59e0b' },
  { id: 'valide',         label: 'Validé',         color: '#22c55e' },
  { id: 'pas_de_reponse', label: 'Pas de réponse', color: '#a1a1aa' },
  { id: 'pas_interesse',  label: 'Pas intéressé',  color: '#ef4444' },
]

export const STATUS_MAP = Object.fromEntries(STATUSES.map((s) => [s.id, s]))
export const DEFAULT_STATUS = 'a_contacter'

// Statuts mis en avant dans la barre de statistiques.
export const STAT_STATUSES = ['a_contacter', 'contacte', 'prix_recu', 'valide']

// ── Zones / quartiers de Kuala Lumpur ──────────────────────────────────────
export const ZONES = [
  'Bukit Bintang',
  'KLCC',
  'Chinatown / Petaling',
  'Bukit Nanas',
  'Chow Kit',
  'Brickfields',
  'Bangsar',
  'Cheras',
  'Ampang',
  'Sentul',
  'Petaling Jaya',
  'Autre',
]

// ── Canaux de contact ──────────────────────────────────────────────────────
export const CHANNELS = ['WhatsApp', 'Téléphone', 'Email', 'Instagram', 'Sur place']

// Devise : Ringgit malaisien
export const CURRENCY = 'RM'

// Clé de stockage localStorage (versionnée pour les migrations futures).
export const STORAGE_KEY = 'crm-moto-kl:v1'
