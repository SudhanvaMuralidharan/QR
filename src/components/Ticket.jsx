import { buildQRPayload, cleanEventName, formatDate } from '../utils/parser'
import styles from './Ticket.module.css'

function QRImage({ data }) {
  const encoded = encodeURIComponent(data)
  // Low error correction (L = 7%) generates fewer, LARGER blocks for better scanning at normal zoom.
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encoded}&color=000000&bgcolor=ffffff&margin=2&ecc=L`
  return (
    <div className={styles.qrFrame}>
      <img src={url} alt="QR Code" className={styles.qrImg} />
    </div>
  )
}

/** Compress into URL-safe base64 to drastically reduce QR code complexity */
const compressTicket = (reg) => {
  const str = JSON.stringify(reg);
  const b64 = window.btoa(unescape(encodeURIComponent(str)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export default function Ticket({ reg, index, isScannedView }) {
  // Use a fallback domain if testing on localhost so printed QR codes still point to production.
  // This will automatically be the correct domain once deployed!
  const host = window.location.hostname === 'localhost' ? 'https://deployed-app.vercel.app' : window.location.origin;
  const baseUrl = host + window.location.pathname;
  
  // Notice we use highly compressed 't' instead of 'ticket'
  const qrData = `${baseUrl}?t=${compressTicket(reg)}`;
  const eventName = cleanEventName(reg['EVENT NAME'])
  const festName = 'LUMINUS TECH FEST'
  const txnRef = String(reg['Transaction Ref No'] || '')
  const shortRef = txnRef.slice(-10)

  return (
    <article className={`${styles.ticket} ticket`}>
      <div className={styles.topBar} />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.festBadge}>{festName}</span>
          <h2 className={styles.eventName}>{eventName}</h2>
          <p className={styles.eventSub}>Registration Confirmation</p>
        </div>
        <div className={styles.statusPill}>
          <span className={styles.statusDot} />
          Paid
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {/* Details column */}
        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.label}>Registrant</span>
            <span className={`${styles.value} ${styles.bigName}`}>
              {reg['TEAM LEADER NAME'] || '—'}
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Institution</span>
            <span className={styles.value}>{reg['COLLEGE NAME'] || '—'}</span>
          </div>

          <div className={styles.grid2}>
            <div className={styles.detailRow}>
              <span className={styles.label}>Student ID</span>
              <span className={`${styles.value} ${styles.mono}`}>
                {reg['STUDENT ID'] || '—'}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Mobile</span>
              <span className={`${styles.value} ${styles.mono}`}>
                {reg['MOBILE NO'] || '—'}
              </span>
            </div>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Amount Paid</span>
            <div className={styles.amountPill}>
              <span className={styles.rupee}>₹</span>
              {reg['Transaction Amount'] || '0'}
            </div>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Email</span>
            <span className={`${styles.value} ${styles.emailVal}`}>
              {reg['EMAIL ID'] || '—'}
            </span>
          </div>
        </div>

        {/* Only show QR stub if not in scanned view */}
        {!isScannedView && (
          <>
            <div className={styles.perforation}>
              <div className={styles.cutTop} />
              <div className={styles.cutBottom} />
            </div>

            <div className={styles.qrSection}>
              <QRImage data={qrData} />
              <p className={styles.scanText}>Scan to Verify</p>
              <p className={styles.txnChip}>{txnRef}</p>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerDate}>
          Registered on <strong>{formatDate(reg['Transaction Date'])}</strong>
        </div>
        <div className={styles.ticketNum}>
          #{String(index + 1).padStart(3, '0')} · {shortRef}
        </div>
      </div>
    </article>
  )
}
