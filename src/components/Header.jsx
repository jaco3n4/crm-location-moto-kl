export default function Header({ total }) {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="brand">
          <span className="brand-logo" aria-hidden="true">🏍️</span>
          <div>
            <h1 className="brand-title">CRM Location Moto</h1>
            <p className="brand-subtitle">Agences de location · Kuala Lumpur 🇲🇾</p>
          </div>
        </div>
        <div className="header-count" title="Nombre d'agences suivies">
          <strong>{total}</strong>
          <span>agence{total > 1 ? 's' : ''}</span>
        </div>
      </div>
    </header>
  )
}
