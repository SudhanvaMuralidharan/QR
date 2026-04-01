import { useRef, useState, useCallback } from 'react'
import styles from './UploadZone.module.css'

export default function UploadZone({ onFile }) {
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  const handleFile = useCallback((file) => {
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['xlsx', 'xls'].includes(ext)) {
      alert('Please upload an Excel file (.xlsx or .xls)')
      return
    }
    onFile(file)
  }, [onFile])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  return (
    <div className={styles.wrapper}>
      <div className={styles.eyebrow}>Organiser Dashboard</div>
      <h1 className={styles.headline}>
        Generate Event<br />Tickets Instantly
      </h1>
      <p className={styles.sub}>
        Upload your registration Excel sheet and get print-ready, QR-coded tickets for every participant — in seconds.
      </p>

      <div
        className={`${styles.dropZone} ${dragOver ? styles.active : ''}`}
        onClick={() => fileRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && fileRef.current.click()}
        aria-label="Upload registration Excel file"
      >
        <div className={styles.dropGlow} />
        <div className={styles.dropIcon}>📋</div>
        <div className={styles.dropText}>
          <strong>Drop your Excel file here</strong> or click to browse
        </div>
        <div className={styles.dropHint}>.xlsx · .xls · Registration sheet format</div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files[0])}
      />

      <div className={styles.formatNote}>
        <span className={styles.noteIcon}>ℹ️</span>
        Expected columns: Transaction Ref No, EVENT NAME, TEAM LEADER NAME, COLLEGE NAME, STUDENT ID, MOBILE NO, EMAIL ID, Transaction Amount, Transaction Date, Group Name
      </div>
    </div>
  )
}
