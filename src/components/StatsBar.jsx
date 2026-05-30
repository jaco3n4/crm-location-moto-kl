import { STATUS_MAP, STAT_STATUSES } from '../constants.js'

export default function StatsBar({ total, counts, statusFilter, onPick }) {
  const cards = [
    { id: 'all', label: 'Total', color: '#0f172a', value: total },
    ...STAT_STATUSES.map((id) => ({
      id,
      label: STATUS_MAP[id].label,
      color: STATUS_MAP[id].color,
      value: counts[id] || 0,
    })),
  ]

  return (
    <div className="stats-bar" role="group" aria-label="Statistiques par statut">
      {cards.map((c) => {
        const active = statusFilter === c.id
        return (
          <button
            key={c.id}
            type="button"
            className={'stat-card' + (active ? ' is-active' : '')}
            style={{ '--stat-color': c.color }}
            aria-pressed={active}
            onClick={() => onPick(c.id)}
          >
            <span className="stat-value">{c.value}</span>
            <span className="stat-label">{c.label}</span>
          </button>
        )
      })}
    </div>
  )
}
