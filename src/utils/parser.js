import * as XLSX from 'xlsx'

/**
 * Parses a registration Excel file.
 * Expects: Row 0 = group headers, Row 1 = column names, Row 2+ = data
 */
export async function parseRegistrationFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1 })

        if (rows.length < 3) {
          throw new Error('File appears to be empty or has insufficient rows.')
        }

        const headers = rows[1]
        const dataRows = rows.slice(2).filter(r => r.some(c => c !== undefined && c !== ''))

        const parsed = dataRows.map(row => {
          const obj = {}
          headers.forEach((h, i) => {
            obj[h] = row[i] ?? ''
          })
          return obj
        })

        resolve(parsed)
      } catch (err) {
        reject(err)
      }
    }

    reader.onerror = () => reject(new Error('Failed to read file.'))
    reader.readAsArrayBuffer(file)
  })
}

export function cleanEventName(name) {
  if (!name) return '—'
  return String(name).replace(/\s*-\s*Rs\.\s*\d+/gi, '').trim()
}

export function formatDate(d) {
  if (!d) return '—'
  const s = String(d)
  if (s.match(/^\d{2}-\d{2}-\d{4}$/)) {
    const [dd, mm, yyyy] = s.split('-')
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return `${dd} ${months[parseInt(mm) - 1]} ${yyyy}`
  }
  return s
}

export function buildQRPayload(reg) {
  const parts = [
    `EVENT:${reg['EVENT NAME'] || ''}`,
    `NAME:${reg['TEAM LEADER NAME'] || ''}`,
    `COLLEGE:${reg['COLLEGE NAME'] || ''}`,
    `ID:${reg['STUDENT ID'] || ''}`,
    `MOBILE:${reg['MOBILE NO'] || ''}`,
    `TXN:${reg['Transaction Ref No'] || ''}`,
    `AMOUNT:Rs.${reg['Transaction Amount'] || ''}`,
    `DATE:${reg['Transaction Date'] || ''}`,
    `FEST:${reg['Group Name'] || ''}`,
  ]
  return parts.join(' | ')
}

export function getUniqueEvents(registrations) {
  return [...new Set(registrations.map(r => cleanEventName(r['EVENT NAME'])).filter(Boolean))]
}

export function getTotalAmount(registrations) {
  return registrations.reduce((sum, r) => sum + (parseFloat(r['Transaction Amount']) || 0), 0)
}
