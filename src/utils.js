import { CURRENCY } from './constants.js'

// Identifiant court unique (suffisant pour un usage local).
export function uid() {
  return 'a_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4)
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatPrice(value) {
  if (value === '' || value === null || value === undefined) return null
  const n = Number(value)
  if (Number.isNaN(n)) return null
  return `${CURRENCY} ${n.toLocaleString('en-MY')}`
}

function num(value) {
  if (value === '' || value === null || value === undefined) return null
  const n = Number(value)
  return Number.isNaN(n) ? null : n
}

export function hasAnyPrice(agency) {
  return num(agency.prixJour) != null || num(agency.prixSemaine) != null || num(agency.prixMois) != null
}

// Coût journalier « effectif » le plus bas : on ramène la semaine (/7) et le
// mois (/30) à un prix par jour pour comparer les offres sur la même base.
export function effectiveDaily(agency) {
  const day = num(agency.prixJour)
  const week = num(agency.prixSemaine)
  const month = num(agency.prixMois)
  const candidates = [day, week != null ? week / 7 : null, month != null ? month / 30 : null].filter(
    (v) => v != null && v > 0,
  )
  if (candidates.length === 0) return null
  return Math.min(...candidates)
}

export function formatEffective(value) {
  if (value == null) return null
  return `${CURRENCY} ${Math.round(value).toLocaleString('en-MY')}/j`
}

// ── Génération du message de prospection ───────────────────────────────────
// Message en anglais (langue commune à KL) pour demander les tarifs et infos.
export function defaultEnquiry(agency) {
  const hi = agency?.nom ? `Hi ${agency.nom},` : 'Hi,'
  return (
    `${hi}\n\n` +
    `I'm interested in renting a motorbike in Kuala Lumpur. ` +
    `Could you please share:\n` +
    `• your rental prices (per day / week / month)\n` +
    `• the available models\n` +
    `• the security deposit required\n` +
    `• and whether delivery / helmet are included.\n\n` +
    `Thank you very much!`
  )
}

// Nettoie un numéro pour wa.me (chiffres uniquement, sans + ni espaces).
// Astuce : saisir le numéro au format international (ex. +60 12-345 6789).
export function toWhatsAppNumber(phone) {
  if (!phone) return ''
  return String(phone).replace(/[^\d]/g, '')
}

export function whatsAppLink(agency) {
  const num = toWhatsAppNumber(agency?.telephone)
  if (!num) return null
  const text = encodeURIComponent(defaultEnquiry(agency))
  return `https://wa.me/${num}?text=${text}`
}

export function mailtoLink(agency) {
  if (!agency?.email) return null
  const subject = encodeURIComponent('Motorbike rental enquiry — Kuala Lumpur')
  const body = encodeURIComponent(defaultEnquiry(agency))
  return `mailto:${agency.email}?subject=${subject}&body=${body}`
}

export function telLink(phone) {
  if (!phone) return null
  return `tel:${String(phone).replace(/[^\d+]/g, '')}`
}

export function normalizeUrl(url) {
  if (!url) return null
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}

// Téléchargement d'un objet JSON (export de sauvegarde).
export function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
