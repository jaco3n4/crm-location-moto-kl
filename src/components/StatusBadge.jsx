import { STATUS_MAP } from '../constants.js'

export default function StatusBadge({ statusId }) {
  const s = STATUS_MAP[statusId]
  if (!s) return null
  return (
    <span className="badge" style={{ '--badge-color': s.color }}>
      <span className="badge-dot" aria-hidden="true" />
      {s.label}
    </span>
  )
}
