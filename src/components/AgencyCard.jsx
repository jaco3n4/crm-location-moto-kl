import { STATUSES } from '../constants.js'
import StatusBadge from './StatusBadge.jsx'
import {
  whatsAppLink,
  mailtoLink,
  telLink,
  normalizeUrl,
  formatPrice,
  formatDate,
} from '../utils.js'

function Stars({ value }) {
  if (!value) return null
  return (
    <span className="stars" aria-label={`Note ${value} sur 5`} title={`Note ${value}/5`}>
      {'★'.repeat(value)}
      <span className="stars-empty">{'★'.repeat(5 - value)}</span>
    </span>
  )
}

export default function AgencyCard({ agency, onEdit, onDelete, onStatusChange }) {
  const wa = whatsAppLink(agency)
  const mail = mailtoLink(agency)
  const tel = telLink(agency.telephone)
  const web = normalizeUrl(agency.siteWeb)
  const insta = agency.instagram
    ? `https://instagram.com/${agency.instagram.replace(/^@/, '')}`
    : null

  const prices = [
    { label: '/ jour', value: formatPrice(agency.prixJour) },
    { label: '/ sem.', value: formatPrice(agency.prixSemaine) },
    { label: '/ mois', value: formatPrice(agency.prixMois) },
  ].filter((p) => p.value)

  return (
    <article className="card">
      <div className="card-top">
        <div className="card-title-wrap">
          <h2 className="card-title">{agency.nom || 'Sans nom'}</h2>
          <p className="card-zone">
            <span aria-hidden="true">📍</span> {agency.zone}
            {agency.adresse ? ` · ${agency.adresse}` : ''}
          </p>
        </div>
        <StatusBadge statusId={agency.statut} />
      </div>

      {(agency.note || prices.length > 0) && (
        <div className="card-meta">
          {prices.length > 0 && (
            <div className="prices">
              {prices.map((p) => (
                <span className="price-chip" key={p.label}>
                  <strong>{p.value}</strong> {p.label}
                </span>
              ))}
            </div>
          )}
          <Stars value={agency.note} />
        </div>
      )}

      {(agency.modeles || agency.caution) && (
        <dl className="card-details">
          {agency.modeles && (
            <div>
              <dt>Modèles</dt>
              <dd>{agency.modeles}</dd>
            </div>
          )}
          {agency.caution !== '' && agency.caution != null && formatPrice(agency.caution) && (
            <div>
              <dt>Caution</dt>
              <dd>{formatPrice(agency.caution)}</dd>
            </div>
          )}
        </dl>
      )}

      {agency.commentaires && <p className="card-notes">{agency.commentaires}</p>}

      <div className="card-contact">
        {wa ? (
          <a className="contact-btn wa" href={wa} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        ) : (
          <span className="contact-btn is-disabled" title="Ajoute un numéro pour activer WhatsApp">
            WhatsApp
          </span>
        )}
        {mail ? (
          <a className="contact-btn" href={mail}>
            Email
          </a>
        ) : (
          <span className="contact-btn is-disabled" title="Ajoute un email">
            Email
          </span>
        )}
        {tel && (
          <a className="contact-btn" href={tel}>
            Appeler
          </a>
        )}
        {web && (
          <a className="contact-btn" href={web} target="_blank" rel="noreferrer">
            Site
          </a>
        )}
        {insta && (
          <a className="contact-btn" href={insta} target="_blank" rel="noreferrer">
            Insta
          </a>
        )}
      </div>

      <div className="card-footer">
        <label className="status-select">
          <span className="sr-only">Changer le statut de {agency.nom}</span>
          <select value={agency.statut} onChange={(e) => onStatusChange(agency.id, e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <span className="card-date" title="Dernier contact">
          {agency.dernierContact ? `Vu le ${formatDate(agency.dernierContact)}` : ''}
        </span>
        <div className="card-actions">
          <button type="button" className="btn btn-sm" onClick={() => onEdit(agency)}>
            Éditer
          </button>
          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={() => onDelete(agency)}
            aria-label={`Supprimer ${agency.nom}`}
          >
            Suppr.
          </button>
        </div>
      </div>
    </article>
  )
}
