import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Bell, Building2, FileCheck2, LayoutDashboard, Package, Truck, UserRound, Users } from 'lucide-react'
import { InventoryModule } from './InventoryModule'
import { OperationsModule } from './OperationsModule'
import { VehicleModule } from './VehicleModule'
import './styles.css'

const peopleSeed = [
  { id: 1, firstName: 'Ahmet', lastName: 'Yılmaz', company: 'Anadolu Enerji A.Ş.', role: 'Sayaç Okuma Personeli', department: 'Saha Operasyon', city: 'Ankara', status: 'Aktif' },
  { id: 2, firstName: 'Zeynep', lastName: 'Kaya', company: 'Marmara Doğalgaz Ltd.', role: 'Bölge Sorumlusu', department: 'Operasyon', city: 'İstanbul', status: 'Aktif' },
]
const companySeed = [
  { id: 1, name: 'Anadolu Enerji A.Ş.', city: 'Ankara', status: 'Aktif' },
  { id: 2, name: 'Marmara Doğalgaz Ltd.', city: 'İstanbul', status: 'Aktif' },
]
const navItems = [
  ['Genel Bakış', LayoutDashboard],
  ['Personeller', Users],
  ['Şirketler', Building2],
  ['Belgeler', FileCheck2],
  ['Depolar', Package],
  ['Yakıt & Bakım', Truck],
  ['Araç Filosu', Truck],
]
const nameOf = (person) => `${person.firstName} ${person.lastName}`

function App() {
  const [active, setActive] = useState('Genel Bakış')
  const [query, setQuery] = useState('')
  const [people] = useState(() => JSON.parse(localStorage.getItem('personel360_people') || 'null') || peopleSeed)
  const [companies] = useState(() => JSON.parse(localStorage.getItem('personel360_companies') || 'null') || companySeed)
  const filteredPeople = useMemo(() => people.filter((person) => `${nameOf(person)} ${person.company} ${person.role} ${person.city}`.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr'))), [people, query])

  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon"><Users size={20} /></div><div><b>Personel<span>360</span></b><small>Yönetim Sistemi</small></div></div>
      <div className="workspace"><Building2 size={16} /><div><small>Çalışma alanı</small><strong>Merkez Yönetim</strong></div></div>
      <small className="nav-label">MENÜ</small>
      {navItems.map(([label, Icon]) => <button key={label} className={`nav-item ${active === label ? 'active' : ''}`} onClick={() => setActive(label)}><Icon size={18} />{label}</button>)}
      <div className="account"><div className="avatar dark">FA</div><div><b>Fatih Ayka</b><small>Sistem Yöneticisi</small></div></div>
    </aside>
    <main className="main-panel">
      <header><div className="breadcrumb">Yönetim <b>/</b> <strong>{active}</strong></div><div className="userbar"><button className="icon-button"><Bell size={18} /></button><div className="avatar">FA</div><span>Fatih Ayka</span></div></header>
      <section className="content-shell">
        {active === 'Genel Bakış' && <Dashboard people={people} setActive={setActive} />}
        {active === 'Personeller' && <PeoplePage people={filteredPeople} query={query} setQuery={setQuery} />}
        {active === 'Şirketler' && <CompaniesPage companies={companies} people={people} />}
        {active === 'Belgeler' && <Placeholder title="Belge Takibi" text="Personel belgeleri bu modülde yönetilecek." />}
        {active === 'Depolar' && <InventoryModule />}
        {active === 'Yakıt & Bakım' && <OperationsModule />}
        {active === 'Araç Filosu' && <VehicleModule />}
      </section>
    </main>
  </div>
}

function Dashboard({ people, setActive }) {
  return <div className="page-stack"><div className="page-heading"><div><small className="eyebrow">GENEL BAKIŞ</small><h1>Gösterge Paneli</h1></div></div><div className="card-grid"><Stat title="Toplam Personel" value={people.length} icon={Users} tone="teal" /><Stat title="Aktif Personel" value={people.filter((person) => person.status === 'Aktif').length} icon={UserRound} tone="green" /><Stat title="Depo Modülü" value="Hazır" icon={Package} tone="blue" /><Stat title="Yakıt & Bakım" value="Hazır" icon={Truck} tone="amber" /></div><div className="content-grid"><div className="panel"><h3>Modüller</h3><div className="stack-list"><button className="mini-button" onClick={() => setActive('Depolar')}><Package size={16} /> Depo ve Envanteri Aç</button><button className="mini-button" onClick={() => setActive('Yakıt & Bakım')}><Truck size={16} /> Yakıt ve Bakımı Aç</button><button className="mini-button" onClick={() => setActive('Araç Filosu')}><Truck size={16} /> Araç Filosunu Aç</button></div></div></div></div>
}

function Stat({ title, value, icon: Icon, tone }) { return <div className="stat-card"><div className={`icon-box ${tone}`}><Icon size={18} /></div><div><small>{title}</small><strong>{value}</strong></div></div> }

function PeoplePage({ people, query, setQuery }) { return <div className="page-stack"><div className="page-heading"><div><small className="eyebrow">PERSONEL</small><h1>Personeller</h1></div></div><div className="toolbar-row"><div className="search-box"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Personel, şirket veya şehir ara..." /></div></div><div className="panel table-panel"><table><thead><tr><th>Personel</th><th>Şirket</th><th>Görev</th><th>Şehir</th><th>Durum</th></tr></thead><tbody>{people.map((person) => <tr key={person.id}><td><strong>{nameOf(person)}</strong><small>{person.department}</small></td><td>{person.company}</td><td>{person.role}</td><td>{person.city}</td><td><span className="status-badge success">{person.status}</span></td></tr>)}</tbody></table></div></div> }

function CompaniesPage({ companies, people }) { return <div className="page-stack"><div className="page-heading"><div><small className="eyebrow">ŞİRKET</small><h1>Şirketler</h1></div></div><div className="panel table-panel"><table><thead><tr><th>Şirket</th><th>Şehir</th><th>Personel</th><th>Durum</th></tr></thead><tbody>{companies.map((company) => <tr key={company.id}><td><strong>{company.name}</strong></td><td>{company.city}</td><td>{people.filter((person) => person.company === company.name).length}</td><td><span className="status-badge success">{company.status}</span></td></tr>)}</tbody></table></div></div> }

function Placeholder({ title, text }) { return <div className="page-stack"><div className="page-heading"><div><small className="eyebrow">MODÜL</small><h1>{title}</h1></div></div><div className="panel"><p>{text}</p></div></div> }

createRoot(document.getElementById('root')).render(<App />)
