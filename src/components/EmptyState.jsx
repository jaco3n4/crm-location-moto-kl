export default function EmptyState({ hasAgencies, onAdd }) {
  return (
    <div className="empty-state">
      <div className="empty-emoji" aria-hidden="true">🏍️</div>
      {hasAgencies ? (
        <>
          <h2>Aucune agence ne correspond aux filtres</h2>
          <p>Essaie de modifier ta recherche ou de réinitialiser les filtres.</p>
        </>
      ) : (
        <>
          <h2>Aucune agence pour l’instant</h2>
          <p>
            Cherche « motorbike rental Kuala Lumpur » sur Google Maps, puis ajoute les agences ici
            pour les contacter et suivre leurs réponses.
          </p>
          <button type="button" className="btn btn-primary" onClick={onAdd}>
            ＋ Ajouter une agence
          </button>
        </>
      )}
    </div>
  )
}
