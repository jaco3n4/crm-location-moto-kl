import { useEffect, useRef, useState } from 'react'
import { STATUSES, ZONES, CURRENCY } from '../constants.js'

export default function AgencyModal({ agency, onSave, onClose }) {
  const [form, setForm] = useState(agency)
  const [error, setError] = useState('')
  const firstFieldRef = useRef(null)
  const titleId = 'modal-title'

  useEffect(() => {
    firstFieldRef.current?.focus()
  }, [])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.nom.trim()) {
      setError('Le nom de l’agence est obligatoire.')
      firstFieldRef.current?.focus()
      return
    }
    onSave({ ...form, nom: form.nom.trim() })
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id={titleId}>{agency.nom ? 'Modifier l’agence' : 'Nouvelle agence'}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <fieldset className="form-section">
            <legend>Identité</legend>
            <div className="form-grid">
              <label className="form-field span-2">
                <span>Nom de l’agence *</span>
                <input
                  ref={firstFieldRef}
                  type="text"
                  value={form.nom}
                  onChange={(e) => set('nom', e.target.value)}
                  required
                />
              </label>
              <label className="form-field">
                <span>Quartier</span>
                <select value={form.zone} onChange={(e) => set('zone', e.target.value)}>
                  {ZONES.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </label>
              <label className="form-field span-3">
                <span>Adresse</span>
                <input type="text" value={form.adresse} onChange={(e) => set('adresse', e.target.value)} />
              </label>
            </div>
          </fieldset>

          <fieldset className="form-section">
            <legend>Contact</legend>
            <div className="form-grid">
              <label className="form-field">
                <span>Téléphone / WhatsApp</span>
                <input
                  type="tel"
                  placeholder="+60 12-345 6789"
                  value={form.telephone}
                  onChange={(e) => set('telephone', e.target.value)}
                />
              </label>
              <label className="form-field">
                <span>Email</span>
                <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
              </label>
              <label className="form-field">
                <span>Site web</span>
                <input
                  type="text"
                  placeholder="exemple.my"
                  value={form.siteWeb}
                  onChange={(e) => set('siteWeb', e.target.value)}
                />
              </label>
              <label className="form-field">
                <span>Instagram</span>
                <input
                  type="text"
                  placeholder="@agence"
                  value={form.instagram}
                  onChange={(e) => set('instagram', e.target.value)}
                />
              </label>
            </div>
          </fieldset>

          <fieldset className="form-section">
            <legend>Suivi</legend>
            <div className="form-grid">
              <label className="form-field">
                <span>Statut</span>
                <select value={form.statut} onChange={(e) => set('statut', e.target.value)}>
                  {STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="form-field">
                <span>Dernier contact</span>
                <input
                  type="date"
                  value={form.dernierContact}
                  onChange={(e) => set('dernierContact', e.target.value)}
                />
              </label>
              <label className="form-field">
                <span>Note</span>
                <div className="star-input" role="radiogroup" aria-label="Note sur 5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      className={'star' + (n <= form.note ? ' on' : '')}
                      aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
                      aria-pressed={n === form.note}
                      onClick={() => set('note', n === form.note ? 0 : n)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </label>
            </div>
          </fieldset>

          <fieldset className="form-section">
            <legend>Tarifs ({CURRENCY})</legend>
            <div className="form-grid">
              <label className="form-field">
                <span>Prix / jour</span>
                <input type="number" min="0" value={form.prixJour} onChange={(e) => set('prixJour', e.target.value)} />
              </label>
              <label className="form-field">
                <span>Prix / semaine</span>
                <input type="number" min="0" value={form.prixSemaine} onChange={(e) => set('prixSemaine', e.target.value)} />
              </label>
              <label className="form-field">
                <span>Prix / mois</span>
                <input type="number" min="0" value={form.prixMois} onChange={(e) => set('prixMois', e.target.value)} />
              </label>
              <label className="form-field">
                <span>Caution</span>
                <input type="number" min="0" value={form.caution} onChange={(e) => set('caution', e.target.value)} />
              </label>
              <label className="form-field span-4">
                <span>Modèles disponibles</span>
                <input
                  type="text"
                  placeholder="Yamaha LC135, scooter 125cc…"
                  value={form.modeles}
                  onChange={(e) => set('modeles', e.target.value)}
                />
              </label>
            </div>
          </fieldset>

          <label className="form-field">
            <span>Commentaires / historique des échanges</span>
            <textarea
              rows="3"
              value={form.commentaires}
              onChange={(e) => set('commentaires', e.target.value)}
            />
          </label>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
