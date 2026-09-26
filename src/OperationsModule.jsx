import React, { useMemo, useState } from 'react'
import { Fuel, Plus, Search, Wrench, X } from 'lucide-react'

const operationSeed = [
  { id: 1, type: 'Yakıt', vehiclePlate: '06 ABC 123', date: '2026-09-20', liters: 52, cost: 4260, vendor: 'Petrol Ofisi', status: 'Tamamlandı', notes: 'Merkez Ankara' },
  { id: 2, type: 'Bakım', vehiclePlate: '19 AHA 088', date: '2026-09-18', liters: 0, cost: 3180, vendor: 'Oto Servis', status: 'Planlandı', notes: 'Lastik kontrolü' },
  { id: 3, type: 'Yakıt', vehiclePlate: '06 ABC 123', date: '2026-09-15', liters: 41, cost: 3310, vendor: 'Shell', status: 'Tamamlandı', notes: 'Şantiye rotası' },
]

const operationTypes = ['Yakıt', 'Bakım', 'Muayene', 'Onarım']
const statuses = ['Tamamlandı', 'Planlandı', 'Bekliyor', 'Gecikmiş']

const emptyOperation = {
  type: 'Yakıt',
  vehiclePlate: '',
  date: new Date().toISOString().slice(0, 10),
  liters: 0,
  cost: 0,
  vendor: '',
  status: 'Tamamlandı',
  notes: '',
}

export function OperationsModule() {
  const [records, setRecords] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('personel360_operations') || 'null') || operationSeed
    } catch {
      return operationSeed
    }
  })
  const [query, setQuery] = useState('')
  const [type, setType] = useState('')
  const [editor, setEditor] = useState(null)

  const filtered = useMemo(() => records.filter((record) => {
    const haystack = `${record.type} ${record.vehiclePlate} ${record.vendor} ${record.notes}`.toLocaleLowerCase('tr')
    return haystack.includes(query.toLocaleLowerCase('tr')) && (!type || record.type === type)
  }), [records, query, type])

  const persist = (next) => {
    setRecords(next)
    localStorage.setItem('personel360_operations', JSON.stringify(next))
  }

  const save = (value) => {
    const clean = {
      ...value,
      id: value.id || Date.now(),
      liters: Number(value.liters) || 0,
      cost: Number(value.cost) || 0,
      vehiclePlate: (value.vehiclePlate || '').trim().toUpperCase(),
    }

    persist(value.id ? records.map((item) => item.id === value.id ? clean : item) : [clean, ...records])
    setEditor(null)
  }

  const remove = (id) => {
    if (window.confirm('Bu işlem silinsin mi?')) persist(records.filter((item) => item.id !== id))
  }

  const totalCost = records.reduce((sum, item) => sum + Number(item.cost || 0), 0)
  const fuelTotal = records.filter((item) => item.type === 'Yakıt').reduce((sum, item) => sum + Number(item.cost || 0), 0)
  const maintenanceCount = records.filter((item) => item.type === 'Bakım' || item.type === 'Onarım' || item.type === 'Muayene').length

  return <div className="page-stack">
    <div className="page-heading">
      <div><small className="eyebrow">YAKIT & BAKIM</small><h1>Operasyon takibi</h1></div>
      <button className="primary" onClick={() => setEditor({ ...emptyOperation })}><Plus size={18} /> Yeni İşlem</button>
    </div>

    <div className="card-grid">
      <div className="stat-card"><div className="icon-box blue"><Fuel size={18} /></div><div><small>Toplam Harcama</small><strong>{totalCost.toLocaleString('tr-TR')} ₺</strong></div></div>
      <div className="stat-card"><div className="icon-box green"><Fuel size={18} /></div><div><small>Yakıt Gideri</small><strong>{fuelTotal.toLocaleString('tr-TR')} ₺</strong></div></div>
      <div className="stat-card"><div className="icon-box amber"><Wrench size={18} /></div><div><small>Bakım / Onarım</small><strong>{maintenanceCount}</strong></div></div>
    </div>

    <div className="toolbar-row">
      <div className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Plaka, tür, satıcı veya not ara..." /></div>
      <select className="filter-select" value={type} onChange={(event) => setType(event.target.value)}>
        <option value="">Tüm işlemler</option>
        {operationTypes.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
    </div>

    <div className="panel table-panel">
      <table>
        <thead>
          <tr>
            <th>Tür</th>
            <th>Araç</th>
            <th>Tarih</th>
            <th>Yakıt / Tutar</th>
            <th>Satıcı</th>
            <th>Durum</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => <tr key={item.id}>
            <td><strong>{item.type}</strong><small>{item.notes || '-'}</small></td>
            <td><strong>{item.vehiclePlate}</strong><small>{item.type === 'Yakıt' ? `${Number(item.liters || 0).toLocaleString('tr-TR')} lt` : 'Servis / Bakım'}</small></td>
            <td>{item.date}</td>
            <td><strong>{Number(item.cost || 0).toLocaleString('tr-TR')} ₺</strong><small>{item.type === 'Yakıt' ? `${Number(item.liters || 0).toLocaleString('tr-TR')} lt` : 'Maliyet'}</small></td>
            <td>{item.vendor || '-'}</td>
            <td><span className={`status-badge ${item.status === 'Tamamlandı' ? 'success' : 'warn'}`}>{item.status}</span></td>
            <td className="action-col"><button className="simple-button" onClick={() => setEditor(item)}>Düzenle</button><button className="simple-button danger" onClick={() => remove(item.id)}>Sil</button></td>
          </tr>)}
        </tbody>
      </table>
    </div>

    {editor && <OperationModal value={editor} close={() => setEditor(null)} save={save} />}
  </div>
}

function OperationModal({ value, close, save }) {
  const [form, setForm] = useState(value)
  const update = (key, nextValue) => setForm((current) => ({ ...current, [key]: nextValue }))

  return <div className="overlay" onClick={close}><div className="modal" onClick={(event) => event.stopPropagation()}>
    <button className="close-button" onClick={close}><X size={16} /></button>
    <div className="modal-header"><h2>{form.id ? 'İşlem Düzenle' : 'Yeni İşlem'}</h2><p>Yakıt, bakım, muayene ve onarım işlemlerini kaydedin.</p></div>
    <div className="modal-body">
      <div className="form-grid">
        <label className="field"><span>İşlem türü</span><select value={form.type} onChange={(event) => update('type', event.target.value)}>{operationTypes.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label className="field"><span>Araç plakası</span><input value={form.vehiclePlate || ''} onChange={(event) => update('vehiclePlate', event.target.value.toUpperCase())} /></label>
        <label className="field"><span>Tarih</span><input type="date" value={form.date || ''} onChange={(event) => update('date', event.target.value)} /></label>
        <label className="field"><span>Durum</span><select value={form.status} onChange={(event) => update('status', event.target.value)}>{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label className="field"><span>Yakıt (lt)</span><input type="number" min="0" value={form.liters || 0} onChange={(event) => update('liters', event.target.value)} /></label>
        <label className="field"><span>Tutar (₺)</span><input type="number" min="0" value={form.cost || 0} onChange={(event) => update('cost', event.target.value)} /></label>
        <label className="field full-width"><span>Satıcı / servis</span><input value={form.vendor || ''} onChange={(event) => update('vendor', event.target.value)} /></label>
        <label className="field full-width"><span>Notlar</span><input value={form.notes || ''} onChange={(event) => update('notes', event.target.value)} /></label>
      </div>
    </div>
    <div className="modal-actions">
      <button className="cancel-button" onClick={close}>Vazgeç</button>
      <button className="primary" disabled={!form.vehiclePlate} onClick={() => save(form)}>Kaydet</button>
    </div>
  </div></div>
}
