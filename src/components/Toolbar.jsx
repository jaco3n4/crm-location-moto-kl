import { useRef } from 'react'
import { STATUSES, ZONES } from '../constants.js'

export default function Toolbar({
  query,
  onQuery,
  statusFilter,
  onStatusFilter,
  zoneFilter,
  onZoneFilter,
  sort,
  onSort,
  counts,
  onAdd,
  onExport,
  onImportFile,
  onResetStatuses,
}) {
  const fileRef = useRef(null)

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (file) onImportFile(file)
    e.target.value = '' // permet de réimporter le même fichier
  }

  return (
    <div className="toolbar">
      <div className="toolbar-filters">
        <div className="search">
          <span className="search-icon" aria-hidden="true">🔎</span>
          <input
            type="search"
            className="search-input"
            placeholder="Rechercher une agence, un quartier, un modèle…"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            aria-label="Rechercher une agence"
          />
        </div>

        <label className="field-inline">
          <span className="sr-only">Filtrer par statut</span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilter(e.target.value)}
            aria-label="Filtrer par statut"
          >
            <option value="all">Tous les statuts</option>
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label} ({counts[s.id] || 0})
              </option>
            ))}
          </select>
        </label>

        <label className="field-inline">
          <span className="sr-only">Filtrer par quartier</span>
          <select
            value={zoneFilter}
            onChange={(e) => onZoneFilter(e.target.value)}
            aria-label="Filtrer par quartier"
          >
            <option value="all">Tous les quartiers</option>
            {ZONES.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </label>

        <label className="field-inline">
          <span className="sr-only">Trier</span>
          <select value={sort} onChange={(e) => onSort(e.target.value)} aria-label="Trier les agences">
            <option value="recent">Tri : récents</option>
            <option value="nom">Tri : nom (A→Z)</option>
            <option value="prixJour">Tri : prix/jour ↑</option>
          </select>
        </label>
      </div>

      <div className="toolbar-actions">
        <button type="button" className="btn btn-primary" onClick={onAdd}>
          <span aria-hidden="true">＋</span> Ajouter
        </button>
        <button type="button" className="btn" onClick={onExport} title="Sauvegarder en fichier JSON">
          Exporter
        </button>
        <button type="button" className="btn" onClick={() => fileRef.current?.click()} title="Importer un fichier JSON">
          Importer
        </button>
        <button type="button" className="btn btn-ghost" onClick={onResetStatuses} title="Remettre tous les statuts à « À contacter »">
          Réinit. statuts
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFile}
          hidden
        />
      </div>
    </div>
  )
}
