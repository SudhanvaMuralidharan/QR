import { useState, useRef, useCallback } from 'react'
import Header from './components/Header'
import UploadZone from './components/UploadZone'
import StatsBar from './components/StatsBar'
import Ticket from './components/Ticket'
import { parseRegistrationFile, cleanEventName } from './utils/parser'
import styles from './App.module.css'

export default function App() {
  // Check if we are in ticket view mode (from QR scan)
  const searchParams = new URLSearchParams(window.location.search);
  const tParam = searchParams.get('t');
  const ticketDataParam = searchParams.get('ticket'); // backwards compatible
  
  let singleTicketReg = null;
  if (tParam) {
    try {
      let b64 = tParam.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      singleTicketReg = JSON.parse(decodeURIComponent(escape(window.atob(b64))));
    } catch (err) {
      console.error("Invalid compressed ticket data in URL", err);
    }
  } else if (ticketDataParam) {
    try {
      singleTicketReg = JSON.parse(decodeURIComponent(ticketDataParam));
    } catch (err) {
      console.error("Invalid ticket data in URL", err);
    }
  }

  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const fileInputRef = useRef()

  const handleFile = useCallback(async (file) => {
    setLoading(true)
    setError(null)
    try {
      const data = await parseRegistrationFile(file)
      if (data.length === 0) throw new Error('No registration data found in this file.')
      setRegistrations(data)
      setSearch('')
    } catch (err) {
      setError(err.message || 'Failed to parse file.')
      setRegistrations([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleReset = useCallback(() => {
    setRegistrations([])
    setSearch('')
    setError(null)
  }, [])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleUploadNew = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const filteredRegistrations = registrations.filter((reg) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      String(reg['TEAM LEADER NAME'] || '').toLowerCase().includes(q) ||
      cleanEventName(reg['EVENT NAME']).toLowerCase().includes(q) ||
      String(reg['COLLEGE NAME'] || '').toLowerCase().includes(q) ||
      String(reg['STUDENT ID'] || '').toLowerCase().includes(q) ||
      String(reg['MOBILE NO'] || '').toLowerCase().includes(q)
    )
  })

  const hasTickets = registrations.length > 0

  if (singleTicketReg) {
    return (
      <div className={styles.app} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
        <div className={styles.bgGlow1} />
        <div className={styles.bgGlow2} />
        <Ticket reg={singleTicketReg} index={0} isScannedView={true} />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      {/* Background glow */}
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />

      <Header
        hasTickets={hasTickets}
        onReset={handleReset}
        onPrint={handlePrint}
        onUploadNew={handleUploadNew}
        fileInputRef={fileInputRef}
        onFileChange={handleFile}
      />

      {/* Hidden input wired to header "New File" button */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files[0]
          if (f) handleFile(f)
          e.target.value = ''
        }}
      />

      {/* Error message */}
      {error && (
        <div className={`${styles.errorBanner} no-print`}>
          <span>⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* Loading spinner */}
      {loading && (
        <div className={`${styles.loadingWrap} no-print`}>
          <div className={styles.spinner} />
          <p>Parsing registrations & generating tickets…</p>
        </div>
      )}

      {/* Upload screen */}
      {!hasTickets && !loading && (
        <UploadZone onFile={handleFile} />
      )}

      {/* Tickets view */}
      {hasTickets && !loading && (
        <main className={styles.main}>
          <StatsBar
            registrations={registrations}
            search={search}
            onSearch={setSearch}
          />

          <div className={styles.ticketsArea}>
            <div className={`${styles.sectionTitle} no-print`}>
              <span>
                {filteredRegistrations.length} Ticket
                {filteredRegistrations.length !== 1 ? 's' : ''}
                {search && ` · "${search}"`}
              </span>
              <div className={styles.titleLine} />
            </div>

            {filteredRegistrations.length === 0 ? (
              <div className={`${styles.noResults} no-print`}>
                <div className={styles.noResultsIcon}>🎫</div>
                <p>No tickets match your search.</p>
                <button className={styles.clearBtn} onClick={() => setSearch('')}>
                  Clear search
                </button>
              </div>
            ) : (
              <div className={`${styles.grid} tickets-grid`}>
                {filteredRegistrations.map((reg, i) => (
                  <Ticket key={reg['Transaction Ref No'] || i} reg={reg} index={i} />
                ))}
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  )
}
