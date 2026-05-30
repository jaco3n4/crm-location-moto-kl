import StatusBadge from './StatusBadge.jsx'
import {
  formatPrice,
  formatEffective,
  effectiveDaily,
  hasAnyPrice,
  whatsAppLink,
} from '../utils.js'

export default function PriceComparator({ agencies, onEdit }) {
  const rows = agencies
    .filter(hasAnyPrice)
    .map((a) => ({ a, eff: effectiveDaily(a) }))
    .sort((x, y) => (x.eff ?? Infinity) - (y.eff ?? Infinity))

  if (rows.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-emoji" aria-hidden="true">📊</div>
        <h2>Pas encore de tarifs à comparer</h2>
        <p>Renseigne au moins un prix (jour, semaine ou mois) sur une fiche pour la voir apparaître ici.</p>
      </div>
    )
  }

  const bestEff = Math.min(...rows.map((r) => r.eff ?? Infinity))

  return (
    <section className="compare" aria-label="Comparateur de prix">
      <p className="compare-hint">
        Trié du moins cher au plus cher selon le <strong>coût/jour effectif</strong> — la semaine est
        ramenée à /7 et le mois à /30 pour comparer sur la même base. 🏆 = meilleure offre.
      </p>
      <div className="table-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th scope="col">Agence</th>
              <th scope="col" className="num">Prix/jour</th>
              <th scope="col" className="num">Prix/sem.</th>
              <th scope="col" className="num">Prix/mois</th>
              <th scope="col" className="num">Caution</th>
              <th scope="col" className="num">≈ /jour</th>
              <th scope="col">Statut</th>
              <th scope="col" className="num">Contact</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ a, eff }) => {
              const isBest = eff != null && eff === bestEff
              const wa = whatsAppLink(a)
              return (
                <tr key={a.id} className={isBest ? 'is-best' : ''}>
                  <th scope="row" className="agency-cell">
                    <button type="button" className="linklike" onClick={() => onEdit(a)}>
                      {a.nom}
                    </button>
                    <span className="cell-zone">{a.zone}</span>
                  </th>
                  <td className="num">{formatPrice(a.prixJour) || '—'}</td>
                  <td className="num">{formatPrice(a.prixSemaine) || '—'}</td>
                  <td className="num">{formatPrice(a.prixMois) || '—'}</td>
                  <td className="num">{formatPrice(a.caution) || '—'}</td>
                  <td className="num eff">
                    {isBest && <span className="trophy" aria-label="Meilleure offre">🏆</span>}
                    {formatEffective(eff) || '—'}
                  </td>
                  <td>
                    <StatusBadge statusId={a.statut} />
                  </td>
                  <td className="num">
                    {wa ? (
                      <a className="contact-btn wa sm" href={wa} target="_blank" rel="noreferrer">
                        WhatsApp
                      </a>
                    ) : (
                      <span className="cell-zone">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
