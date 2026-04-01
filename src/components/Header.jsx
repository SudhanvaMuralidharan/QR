import styles from './Header.module.css'

export default function Header({ hasTickets, onReset, onPrint, onUploadNew }) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logoMark}>QT</div>
        <div>
          <div className={styles.logoName}>QTicket Studio</div>
          <div className={styles.logoSub}>Event Ticket Generator</div>
        </div>
      </div>

      {hasTickets && (
        <div className={`${styles.actions} no-print`}>
          <button className={styles.btnPrint} onClick={onPrint}>
            🖨&nbsp; Print All Tickets
          </button>
          <button className={styles.btnGhost} onClick={onUploadNew}>
            ↑ New File
          </button>
          <button className={styles.btnDanger} onClick={onReset}>
            ✕ Clear
          </button>
        </div>
      )}
    </header>
  )
}
