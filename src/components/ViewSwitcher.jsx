const VIEWS = [
  { id: 'cards', label: 'Cartes', icon: '🗂️' },
  { id: 'compare', label: 'Comparateur', icon: '📊' },
]

export default function ViewSwitcher({ view, onChange }) {
  return (
    <div className="view-switcher" role="tablist" aria-label="Mode d'affichage">
      {VIEWS.map((v) => (
        <button
          key={v.id}
          type="button"
          role="tab"
          aria-selected={view === v.id}
          className={'view-tab' + (view === v.id ? ' is-active' : '')}
          onClick={() => onChange(v.id)}
        >
          <span aria-hidden="true">{v.icon}</span> {v.label}
        </button>
      ))}
    </div>
  )
}
