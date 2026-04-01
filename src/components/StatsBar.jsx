import styles from './StatsBar.module.css'
import { getUniqueEvents, getTotalAmount } from '../utils/parser'

export default function StatsBar({ registrations, search, onSearch }) {
  const events = getUniqueEvents(registrations)
  const total = getTotalAmount(registrations)

  return (
    <div className={`${styles.bar} no-print`}>
      <div className={styles.chips}>
        <div className={styles.chip}>
          <span className={styles.num}>{registrations.length}</span>
          <span className={styles.lbl}>Registrations</span>
        </div>
        <div className={styles.chip}>
          <span className={styles.num}>{events.length}</span>
          <span className={styles.lbl}>Events</span>
        </div>
        <div className={`${styles.chip} ${styles.chipGreen}`}>
          <span className={`${styles.num} ${styles.green}`}>
            ₹{total.toLocaleString('en-IN')}
          </span>
          <span className={styles.lbl}>Total Collected</span>
        </div>
      </div>

      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          placeholder="Search by name, event, college, ID..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
        {search && (
          <button className={styles.clearSearch} onClick={() => onSearch('')}>✕</button>
        )}
      </div>
    </div>
  )
}
