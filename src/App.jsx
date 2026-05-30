import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_STATUS } from './constants.js'
import { loadAgencies, saveAgencies, blankAgency, parseImport } from './storage.js'
import { downloadJSON, todayISO } from './utils.js'

import Header from './components/Header.jsx'
import StatsBar from './components/StatsBar.jsx'
import Toolbar from './components/Toolbar.jsx'
import ViewSwitcher from './components/ViewSwitcher.jsx'
import AgencyCard from './components/AgencyCard.jsx'
import PriceComparator from './components/PriceComparator.jsx'
import AgencyModal from './components/AgencyModal.jsx'
import ConfirmDialog from './components/ConfirmDialog.jsx'
import EmptyState from './components/EmptyState.jsx'

// Les statuts « contactés » déclenchent l'auto-remplissage du dernier contact.
const CONTACTED_STATUSES = new Set(['contacte', 'a_repondu', 'prix_recu', 'en_negociation', 'valide'])

export default function App() {
  const [agencies, setAgencies] = useState(() => loadAgencies())
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [zoneFilter, setZoneFilter] = useState('all')
  const [sort, setSort] = useState('recent')
  const [view, setView] = useState('cards') // 'cards' | 'compare'

  const [editing, setEditing] = useState(null) // fiche en cours d'édition (ou null)
  const [confirm, setConfirm] = useState(null) // { title, message, onConfirm }
  const [toast, setToast] = useState('')

  // Sauvegarde automatique à chaque changement.
  useEffect(() => {
    saveAgencies(agencies)
  }, [agencies])

  function flash(msg) {
    setToast(msg)
    window.clearTimeout(flash._t)
    flash._t = window.setTimeout(() => setToast(''), 2600)
  }

  // ── Statistiques (counts par statut) ─────────────────────────────────────
  const counts = useMemo(() => {
    const c = {}
    for (const a of agencies) c[a.statut] = (c[a.statut] || 0) + 1
    return c
  }, [agencies])

  // ── Liste filtrée + triée ────────────────────────────────────────────────
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = agencies.filter((a) => {
      if (statusFilter !== 'all' && a.statut !== statusFilter) return false
      if (zoneFilter !== 'all' && a.zone !== zoneFilter) return false
      if (!q) return true
      return [a.nom, a.zone, a.adresse, a.modeles, a.commentaires, a.email]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    })

    list = [...list]
    if (sort === 'nom') {
      list.sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
    } else if (sort === 'prixJour') {
      list.sort((a, b) => (Number(a.prixJour) || Infinity) - (Number(b.prixJour) || Infinity))
    } else {
      list.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
    }
    return list
  }, [agencies, query, statusFilter, zoneFilter, sort])

  // ── CRUD ─────────────────────────────────────────────────────────────────
  function handleAdd() {
    setEditing(blankAgency())
  }

  function handleEdit(agency) {
    setEditing({ ...agency })
  }

  function handleSave(form) {
    const stamped = { ...form, updatedAt: new Date().toISOString() }
    setAgencies((prev) => {
      const exists = prev.some((a) => a.id === stamped.id)
      return exists ? prev.map((a) => (a.id === stamped.id ? stamped : a)) : [stamped, ...prev]
    })
    setEditing(null)
    flash('Fiche enregistrée ✓')
  }

  function handleDelete(agency) {
    setConfirm({
      title: 'Supprimer cette agence ?',
      message: `« ${agency.nom} » sera définitivement retirée de ta liste.`,
      confirmLabel: 'Supprimer',
      onConfirm: () => {
        setAgencies((prev) => prev.filter((a) => a.id !== agency.id))
        setConfirm(null)
        flash('Agence supprimée')
      },
    })
  }

  function handleStatusChange(id, statut) {
    setAgencies((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a
        const next = { ...a, statut, updatedAt: new Date().toISOString() }
        // Renseigne automatiquement la date de dernier contact si pertinent.
        if (CONTACTED_STATUSES.has(statut) && !a.dernierContact) next.dernierContact = todayISO()
        return next
      }),
    )
  }

  // ── Export / Import / Reset ──────────────────────────────────────────────
  function handleExport() {
    downloadJSON('crm-moto-kl-sauvegarde.json', agencies)
    flash('Sauvegarde exportée ✓')
  }

  function handleImportFile(file) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const imported = parseImport(String(reader.result))
        setConfirm({
          title: 'Importer cette sauvegarde ?',
          message: `${imported.length} agence(s) trouvée(s). Cela remplacera ta liste actuelle (${agencies.length}).`,
          confirmLabel: 'Importer',
          onConfirm: () => {
            setAgencies(imported)
            setConfirm(null)
            flash(`${imported.length} agence(s) importée(s) ✓`)
          },
        })
      } catch (err) {
        flash('Import impossible : fichier JSON invalide')
        console.error(err)
      }
    }
    reader.readAsText(file)
  }

  function handleResetStatuses() {
    setConfirm({
      title: 'Réinitialiser tous les statuts ?',
      message: 'Toutes les agences repasseront à « À contacter ». Les autres infos sont conservées.',
      confirmLabel: 'Réinitialiser',
      onConfirm: () => {
        setAgencies((prev) => prev.map((a) => ({ ...a, statut: DEFAULT_STATUS })))
        setConfirm(null)
        flash('Statuts réinitialisés')
      },
    })
  }

  return (
    <div className="app">
      <Header total={agencies.length} />

      <main className="container">
        <StatsBar
          total={agencies.length}
          counts={counts}
          statusFilter={statusFilter}
          onPick={setStatusFilter}
        />

        <Toolbar
          query={query}
          onQuery={setQuery}
          statusFilter={statusFilter}
          onStatusFilter={setStatusFilter}
          zoneFilter={zoneFilter}
          onZoneFilter={setZoneFilter}
          sort={sort}
          onSort={setSort}
          counts={counts}
          onAdd={handleAdd}
          onExport={handleExport}
          onImportFile={handleImportFile}
          onResetStatuses={handleResetStatuses}
        />

        <div className="view-bar">
          <ViewSwitcher view={view} onChange={setView} />
          <span className="result-count">
            {visible.length} agence{visible.length > 1 ? 's' : ''} affichée{visible.length > 1 ? 's' : ''}
          </span>
        </div>

        {visible.length === 0 ? (
          <EmptyState hasAgencies={agencies.length > 0} onAdd={handleAdd} />
        ) : view === 'compare' ? (
          <PriceComparator agencies={visible} onEdit={handleEdit} />
        ) : (
          <section className="grid" aria-label="Liste des agences">
            {visible.map((a) => (
              <AgencyCard
                key={a.id}
                agency={a}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Données stockées dans ton navigateur (localStorage). Pense à <strong>Exporter</strong> pour
          sauvegarder. {visible.length} / {agencies.length} agence(s) affichée(s).
        </p>
      </footer>

      {editing && <AgencyModal agency={editing} onSave={handleSave} onClose={() => setEditing(null)} />}
      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          onConfirm={confirm.onConfirm}
          onClose={() => setConfirm(null)}
        />
      )}

      {toast && (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  )
}
