import { useEffect, useRef } from 'react'

export default function ConfirmDialog({ title, message, confirmLabel = 'Confirmer', onConfirm, onClose }) {
  const confirmRef = useRef(null)

  useEffect(() => {
    confirmRef.current?.focus()
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal modal-sm"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-body">
          <h2 id="confirm-title" className="confirm-title">
            {title}
          </h2>
          <p className="confirm-message">{message}</p>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Annuler
            </button>
            <button ref={confirmRef} type="button" className="btn btn-danger" onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
