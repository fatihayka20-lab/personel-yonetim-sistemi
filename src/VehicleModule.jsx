import React, { useMemo, useState } from 'react'
import { Car, Plus, Search, X } from 'lucide-react'

const vehicleTypes = ['Otomobil', 'Kamyonet', 'Panelvan', 'Minibüs', 'Kamyon', 'Diğer']
const fuelTypes = ['Benzin', 'Dizel', 'LPG', 'Elektrik', 'Hibrit']
const statuses = ['Aktif', 'Serviste', 'Pasif', 'Satıldı']

const emptyVehicle = {
  plate: '',
  brand: '',
  model: '',
  modelYear: '',
  vehicleType: 'Otomobil',
  fuelType: 'Dizel',
  ownerCompany: '',
  usingCompany: '',
  region: '',
  assignedPerson: '',
  currentKm: 0,
  status: 'Aktif',
}

const vehicleSeed = [
  { id: 1, plate: '06 ABC 123', brand: 'Fiat', model: 'Doblo', modelYear: '2024', vehicleType: 'Kamyonet', fuelType: 'Dizel', ownerCompany: 'Ayka Yatırım', usingCompany: 'Ayka Doğalgaz', region: 'Ankara', assignedPerson: 'Ahmet Yılmaz', currentKm: 84500, status: 'Aktif' },
  { id: 2, plate: '19 AHA 088', brand: 'Fiat', model: 'Egea', modelYear: '2023', vehicleType: 'Otomobil', fuelType: 'Dizel', ownerCompany: 'Ayka Yatırım', usingCompany: 'Enerya', region: 'Denizli', assignedPerson: 'Fatih Durmuş', currentKm: 15745, status: 'Aktif' },
]

export function VehicleModule() {
  const [vehicles, setVehicles] = useState(() => {
    try { return JSON.parse(localStorage.getItem('personel360_vehicles') || 'null') || vehicleSeed } catch { return vehicleSeed }
  })
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [editor, setEditor] = useState(null)

  const filteredVehicles = useMemo(() => vehicles.filter((vehicle) => {
    const text = `${vehicle.plate} ${vehicle.brand} ${vehicle.model} ${vehicle.assignedPerson} ${vehicle.region} ${vehicle.usingCompany}`.toLocaleLowerCase('tr')
    return text.includes(query.toLocaleLowerCase('tr')) && (!status || vehicle.status === status)
  }), [vehicles, query, status])

  const persist = (next) => {
    setVehicles(next)
    localStorage.setItem('personel360_vehicles', JSON.stringify(next))
  }

  const save = (value) => {
    const vehicle = { ...value, id: value.id || Date.now(), plate: value.plate.trim().toUpperCase(), currentKm: Number(value.currentKm) || 0 }
    persist(value.id ? vehicles.map((item) => item.id === value.id ? vehicle : item) : [vehicle, ...vehicles])
    setEditor(null)
  }

  const remove = (id) => {
    if (window.confirm('Bu araç silinsin mi?')) persist(vehicles.filter((vehicle) => vehicle.id !== id))
  }

  const activeCount = vehicles.filter((vehicle) => vehicle.status === 'Aktif').length
  const serviceCount = vehicles.filter((vehicle) => vehicle.status === 'Serviste').length

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div><small className="eyebrow">ARAÇ FİLOSU</small><h1>Araç yönetimi</h1></div>
        <button className="primary" onClick={() => setEditor({ ...emptyVehicle })}><Plus size={18} /> Yeni Araç</button>
      </div>

      <div className="card-grid">
        <div className="stat-card"><div className="icon-box blue"><Car size={18} /></div><div><small>Toplam Araç</small><strong>{vehicles.length}</strong></div></div>
        <div className="stat-card"><div className="icon-box green"><Car size={18} /></div><div><small>Aktif Araç</small><strong>{activeCount}</strong></div></div>
        <div className="stat-card"><div className="icon-box amber"><Car size={18} /></div><div><small>Serviste</small><strong>{serviceCount}</strong></div></div>
      </div>

      <div className="toolbar-row">
        <div className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Plaka, marka, personel veya bölge ara..." /></div>
        <select className="filter-select" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Tüm durumlar</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select>
      </div>

      <div className="panel table-panel">
        <table>
          <thead><tr><th>Plaka</th><th>Araç</th><th>Şirket / Bölge</th><th>Personel</th><th>Km</th><th>Durum</th><th>İşlem</th></tr></thead>
          <tbody>{filteredVehicles.map((vehicle) => <tr key={vehicle.id}>
            <td><strong>{vehicle.plate}</strong><small>{vehicle.vehicleType} · {vehicle.fuelType}</small></td>
            <td><strong>{vehicle.brand} {vehicle.model}</strong><small>{vehicle.modelYear || '-'}</small></td>
            <td><strong>{vehicle.usingCompany || '-'}</strong><small>{vehicle.region || '-'}</small></td>
            <td>{vehicle.assignedPerson || <span className="muted">Atanmadı</span>}</td>
            <td>{vehicle.currentKm.toLocaleString('tr-TR')} km</td>
            <td><span className={`status-badge ${vehicle.status === 'Aktif' ? 'success' : 'warn'}`}>{vehicle.status}</span></td>
            <td className="action-col"><button className="simple-button" onClick={() => setEditor(vehicle)}>Düzenle</button><button className="simple-button danger" onClick={() => remove(vehicle.id)}>Sil</button></td>
          </tr>)}</tbody>
        </table>
      </div>

      {editor && <VehicleModal value={editor} close={() => setEditor(null)} save={save} />}
    </div>
  )
}

function VehicleModal({ value, close, save }) {
  const [form, setForm] = useState(value)
  const update = (key, nextValue) => setForm((current) => ({ ...current, [key]: nextValue }))
  return <div className="overlay" onClick={close}><div className="modal" onClick={(event) => event.stopPropagation()}>
    <button className="close-button" onClick={close}><X size={16} /></button>
    <div className="modal-header"><h2>{form.id ? 'Araç Kartını Düzenle' : 'Yeni Araç'}</h2><p>Aracı personele, şirkete ve bölgeye bağlayın.</p></div>
    <div className="modal-body"><div className="form-grid">
      <VehicleField label="Plaka" value={form.plate} onChange={(event) => update('plate', event.target.value.toUpperCase())} />
      <VehicleField label="Marka" value={form.brand} onChange={(event) => update('brand', event.target.value)} />
      <VehicleField label="Model" value={form.model} onChange={(event) => update('model', event.target.value)} />
      <VehicleField label="Model yılı" type="number" value={form.modelYear} onChange={(event) => update('modelYear', event.target.value)} />
      <VehicleField label="Araç tipi" value={form.vehicleType} options={vehicleTypes} onChange={(event) => update('vehicleType', event.target.value)} />
      <VehicleField label="Yakıt türü" value={form.fuelType} options={fuelTypes} onChange={(event) => update('fuelType', event.target.value)} />
      <VehicleField label="Sahibi şirket" value={form.ownerCompany} onChange={(event) => update('ownerCompany', event.target.value)} />
      <VehicleField label="Kullanılan şirket" value={form.usingCompany} onChange={(event) => update('usingCompany', event.target.value)} />
      <VehicleField label="Bölge" value={form.region} onChange={(event) => update('region', event.target.value)} />
      <VehicleField label="Atanan personel" value={form.assignedPerson} onChange={(event) => update('assignedPerson', event.target.value)} />
      <VehicleField label="Güncel kilometre" type="number" value={form.currentKm} onChange={(event) => update('currentKm', event.target.value)} />
      <VehicleField label="Durum" value={form.status} options={statuses} onChange={(event) => update('status', event.target.value)} />
    </div></div>
    <div className="modal-actions"><button className="cancel-button" onClick={close}>Vazgeç</button><button className="primary" disabled={!form.plate || !form.brand || !form.model} onClick={() => save(form)}>Kaydet</button></div>
  </div></div>
}

function VehicleField({ label, value, onChange, type = 'text', options }) {
  return <label className="field"><span>{label}</span>{options ? <select value={value || ''} onChange={onChange}>{options.map((item) => <option key={item}>{item}</option>)}</select> : <input type={type} value={value || ''} onChange={onChange} />}</label>
}
