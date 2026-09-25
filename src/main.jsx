import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AlertTriangle, Bell, Building2, CalendarDays, ChevronDown, FileCheck2, LayoutDashboard, Package, Plus, Search, Truck, UserRound, Users, X } from 'lucide-react'
import { InventoryModule } from './InventoryModule'
import './styles.css'

const peopleSeed = [
  { id: 1, firstName: 'Ahmet', lastName: 'Yılmaz', company: 'Anadolu Enerji A.Ş.', role: 'Sayaç Okuma Personeli', department: 'Saha Operasyon', city: 'Ankara', office: 'Çankaya', phone: '0532 111 22 33', email: 'ahmet@anadoluenerji.com', status: 'Aktif', documents: { myk: '2027-02-15', src: '2026-12-10', psychotechnic: '2027-01-20', license: '2028-05-10' } },
  { id: 2, firstName: 'Zeynep', lastName: 'Kaya', company: 'Marmara Doğalgaz Ltd.', role: 'Bölge Sorumlusu', department: 'Operasyon', city: 'İstanbul', office: 'Kadıköy', phone: '0533 222 33 44', status: 'Aktif', documents: { myk: '2027-05-10', src: '2027-05-10', psychotechnic: '2027-05-10', license: '' } },
  { id: 3, firstName: 'Mehmet', lastName: 'Demir', company: 'Anadolu Enerji A.Ş.', role: 'Sayaç Okuma Personeli', department: 'Saha Operasyon', city: 'Konya', office: 'Selçuklu', phone: '0534 333 44 55', email: 'mehmet@anadoluenerji.com', status: 'Ayrıldı', documents: { myk: '2026-09-27', src: '', psychotechnic: '', license: '' } },
]
const companySeed = [
  { id: 1, name: 'Anadolu Enerji A.Ş.', sector: 'Enerji', city: 'Ankara', phone: '0312 000 00 00', email: 'info@anadoluenerji.com', status: 'Aktif' },
  { id: 2, name: 'Marmara Doğalgaz Ltd.', sector: 'Doğalgaz', city: 'İstanbul', phone: '0216 000 00 00', email: 'info@marmaradogalgaz.com', status: 'Aktif' },
]
const emptyPerson = { firstName: '', lastName: '', company: '', role: '', department: '', city: '', office: '', phone: '', email: '', status: 'Aktif', documents: { myk: '', src: '', psychotechnic: '', license: '' } }
const emptyCompany = { name: '', sector: '', city: '', phone: '', email: '', status: 'Aktif' }
const docs = { myk: 'MYK', src: 'SRC', psychotechnic: 'Psikoteknik', license: 'Ehliyet' }
const navItems = [['Genel Bakış', LayoutDashboard], ['Personeller', Users], ['Şirketler', Building2], ['Belgeler', FileCheck2], ['Depolar', Package], ['Araç Filosu', Truck]]
const nameOf = p => `${p.firstName || ''} ${p.lastName || ''}`.trim()
const docStatus = date => { if (!date) return 'Eksik'; const days = Math.ceil((new Date(date) - new Date()) / 86400000); return days < 0 ? 'Süresi doldu' : days <= 60 ? `${days} gün kaldı` : 'Geçerli' }

function App() {
  const [people, setPeople] = useState(() => JSON.parse(localStorage.getItem('personel360_people') || 'null') || peopleSeed)
  const [companies, setCompanies] = useState(() => JSON.parse(localStorage.getItem('personel360_companies') || 'null') || companySeed)
  const [active, setActive] = useState('Genel Bakış')
  const [query, setQuery] = useState('')
  const [personForm, setPersonForm] = useState(null)
  const [companyForm, setCompanyForm] = useState(null)
  const [detail, setDetail] = useState(null)

  const warnings = people.reduce((n, p) => n + Object.values(p.documents || {}).filter(d => docStatus(d) !== 'Geçerli').length, 0)
  const filteredPeople = useMemo(() => people.filter(p => `${nameOf(p)} ${p.company} ${p.role} ${p.city}`.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr'))), [people, query])
  const savePeople = next => { setPeople(next); localStorage.setItem('personel360_people', JSON.stringify(next)) }
  const saveCompanies = next => { setCompanies(next); localStorage.setItem('personel360_companies', JSON.stringify(next)) }
  const savePerson = p => { const next = p.id ? people.map(x => x.id === p.id ? p : x) : [{ ...p, id: Date.now() }, ...people]; savePeople(next); setPersonForm(null) }
  const saveCompany = c => { const next = c.id ? companies.map(x => x.id === c.id ? c : x) : [{ ...c, id: Date.now() }, ...companies]; saveCompanies(next); setCompanyForm(null) }
  const deleteCompany = id => { const c = companies.find(x => x.id === id); if (!c || !confirm(`${c.name} şirketi silinsin mi?`)) return; saveCompanies(companies.filter(x => x.id !== id)) }
  const deletePerson = id => { const p = people.find(x => x.id === id); if (p && confirm(`${nameOf(p)} silinsin mi?`)) savePeople(people.filter(x => x.id !== id)) }

  return <div className="app">
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon"><Users size={20} /></div>
        <div><b>Personel<span>360</span></b><small>Yönetim Sistemi</small></div>
      </div>
      <div className="workspace"><Building2 size={16} /><div><small>Çalışma alanı</small><strong>Merkez Yönetim</strong></div><ChevronDown size={15} /></div>
      <small className="nav-label">MENÜ</small>
      {navItems.map(([label, Icon]) => (
        <button key={label} className={`nav-item ${active === label ? 'active' : ''}`} onClick={() => setActive(label)}>
          <Icon size={18} />
          {label}
          {label === 'Belgeler' && <em>{warnings}</em>}
        </button>
      ))}
      <div className="account"><div className="avatar dark">FA</div><div><b>Fatih Ayka</b><small>Sistem Yöneticisi</small></div></div>
    </aside>

    <main className="main-panel">
      <header>
        <div className="breadcrumb">Yönetim <b>/</b> <strong>{active}</strong></div>
        <div className="userbar"><button className="icon-button"><Bell size={18} /></button><div className="avatar">FA</div><span>Fatih Ayka</span><ChevronDown size={15} /></div>
      </header>

      <section className="content-shell">
        {active === 'Genel Bakış' && <Dashboard people={people} warnings={warnings} setActive={setActive} openPerson={() => setPersonForm({ ...emptyPerson })} />}
        {active === 'Personeller' && <PeoplePage people={filteredPeople} query={query} setQuery={setQuery} openPerson={() => setPersonForm({ ...emptyPerson })} edit={setPersonForm} detail={setDetail} remove={deletePerson} />}
        {active === 'Şirketler' && <CompaniesPage companies={companies} people={people} query={query} setQuery={setQuery} add={() => setCompanyForm({ ...emptyCompany })} edit={setCompanyForm} remove={deleteCompany} />}
        {active === 'Belgeler' && <DocumentsPage people={people} />}
        {active === 'Depolar' && <InventoryModule />}
        {active === 'Araç Filosu' && <VehiclesPage people={people} />}
      </section>
    </main>

    {personForm && <PersonModal value={personForm} close={() => setPersonForm(null)} save={savePerson} />}
    {companyForm && <CompanyModal value={companyForm} close={() => setCompanyForm(null)} save={saveCompany} />}
    {detail && <PersonDetail person={detail} close={() => setDetail(null)} />}
  </div>
}

function Dashboard({ people, warnings, setActive, openPerson }) {
  return <div className="page-stack">
    <div className="page-heading"><div><small className="eyebrow">GENEL BAKIŞ</small><h1>Gösterge Paneli</h1></div><button className="primary" onClick={openPerson}><Plus size={18} /> Yeni Personel</button></div>
    <div className="card-grid">
      <Stat title="Toplam Personel" value={people.length} icon={Users} tone="teal" />
      <Stat title="Aktif Personel" value={people.filter(x => x.status === 'Aktif').length} icon={UserRound} tone="green" />
      <Stat title="Belge Uyarıları" value={warnings} icon={AlertTriangle} tone="amber" />
      <Stat title="Araç Sayısı" value={people.filter(x => x.vehicle && x.vehicle.plate).length} icon={Truck} tone="blue" />
    </div>
    <div className="content-grid">
      <div className="panel"><h3>Son belge uyarıları</h3><div className="stack-list">{people.flatMap(person => Object.entries(person.documents || {}).filter(([, value]) => docStatus(value) !== 'Geçerli').map(([key, value]) => <div key={`${person.id}-${key}`} className="list-row"><div><strong>{nameOf(person)}</strong><small>{docs[key]}</small></div><span className="badge warn">{docStatus(value)}</span></div>))}</div></div>
      <div className="panel"><h3>İşlem hızlı erişim</h3><div className="stack-list"><button className="mini-button" onClick={openPerson}><Plus size={16} /> Personel Ekle</button><button className="mini-button" onClick={() => setActive('Şirketler')}><Building2 size={16} /> Şirketleri Gör</button><button className="mini-button" onClick={() => setActive('Depolar')}><Package size={16} /> Depo Gör</button></div></div>
    </div>
  </div>
}

function Stat({ title, value, icon: Icon, tone }) {
  return <div className="stat-card"><div className={`icon-box ${tone}`}><Icon size={18} /></div><div><small>{title}</small><strong>{value}</strong></div></div>
}

function PeoplePage({ people, query, setQuery, openPerson, edit, detail, remove }) {
  return <div className="page-stack">
    <div className="toolbar-row"><div className="search-box"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Ad, şirket, görev veya il ara..." /></div><button className="primary" onClick={openPerson}><Plus size={18} /> Yeni Personel</button></div>
    <div className="panel table-panel"><table><thead><tr><th>Personel</th><th>Şirket / Görev</th><th>Bölge</th><th>Belge</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>{people.map(person => { const documents = Object.values(person.documents || {}); const validCount = documents.filter(date => docStatus(date) === 'Geçerli').length; return <tr key={person.id}><td><strong>{nameOf(person)}</strong><small>{person.phone || 'Telefon yok'}</small></td><td><strong>{person.company || '-'}</strong><small>{person.role || '-'}</small></td><td>{person.city || '-'} / {person.office || '-'}</td><td>{validCount} / {documents.length}</td><td><span className={`status-badge ${person.status === 'Aktif' ? 'success' : 'warn'}`}>{person.status}</span></td><td className="action-col"><button className="simple-button" onClick={() => detail(person)}>Detay</button><button className="simple-button" onClick={() => edit(person)}>Düzenle</button><button className="simple-button danger" onClick={() => remove(person.id)}>Sil</button></td></tr> })}</tbody></table></div>
  </div>
}

function CompaniesPage({ companies, people, query, setQuery, add, edit, remove }) {
  const list = companies.filter(company => `${company.name} ${company.city}`.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr')))
  return <div className="page-stack"><div className="page-heading"><div><small className="eyebrow">ŞİRKET YÖNETİMİ</small><h1>Şirketler</h1></div><button className="primary" onClick={add}><Plus size={18} /> Yeni Şirket</button></div><div className="toolbar-row"><div className="search-box"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Şirket ara..." /></div></div><div className="panel table-panel"><table><thead><tr><th>Şirket</th><th>Şehir</th><th>Personel</th><th>İletişim</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>{list.map(company => <tr key={company.id}><td><strong>{company.name}</strong></td><td>{company.city || '-'}</td><td><span className="status-badge success">{people.filter(person => person.company === company.name).length} kişi</span></td><td><strong>{company.phone || '-'}</strong><small>{company.email || '-'}</small></td><td><span className={`status-badge ${company.status === 'Aktif' ? 'success' : 'warn'}`}>{company.status}</span></td><td className="action-col"><button className="simple-button" onClick={() => edit(company)}>Düzenle</button><button className="simple-button danger" onClick={() => remove(company.id)}>Sil</button></td></tr>)}</tbody></table></div></div>
}

function DocumentsPage({ people }) {
  return <div className="page-stack"><div className="page-heading"><div><small className="eyebrow">BELGE TAKİBİ</small><h1>Belge ve geçerlilik yönetimi</h1></div></div><div className="panel table-panel"><table><thead><tr><th>Personel</th><th>MYK</th><th>SRC</th><th>Psikoteknik</th><th>Ehliyet</th></tr></thead><tbody>{people.map(person => <tr key={person.id}><td><strong>{nameOf(person)}</strong><small>{person.company}</small></td><td>{docStatus(person.documents?.myk)}</td><td>{docStatus(person.documents?.src)}</td><td>{docStatus(person.documents?.psychotechnic)}</td><td>{docStatus(person.documents?.license)}</td></tr>)}</tbody></table></div></div>
}

function VehiclesPage({ people }) {
  return <div className="page-stack"><div className="page-heading"><div><small className="eyebrow">ARAÇ</small><h1>Hizmet aracı listesi</h1></div></div><div className="panel table-panel"><table><thead><tr><th>Personel</th><th>Marka / Model</th><th>Plaka</th></tr></thead><tbody>{people.filter(x => x.vehicle && x.vehicle.plate).map(person => <tr key={person.id}><td>{nameOf(person)}</td><td>{person.vehicle.brand || '-'}</td><td>{person.vehicle.plate}</td></tr>)}</tbody></table></div></div>
}

function Field({ label, value, onChange, type = 'text', options }) {
  return <label className="field"><span>{label}</span>{options ? <select value={value || ''} onChange={onChange}><option value="">Seçiniz</option>{options.map(option => <option key={option} value={option}>{option}</option>)}</select> : <input type={type} value={value || ''} onChange={onChange} />}</label>
}

function PersonModal({ value, close, save }) {
  const [form, setForm] = useState(value)
  const update = (key, nextValue) => setForm(current => ({ ...current, [key]: nextValue }))
  return <div className="overlay" onClick={close}><div className="modal" onClick={event => event.stopPropagation()}><button className="close-button" onClick={close}><X size={16} /></button><div className="modal-header"><h2>{form.id ? 'Personel Kartı' : 'Yeni Personel'}</h2><p>Çalışan bilgilerini doldurun.</p></div><div className="modal-body"><div className="form-grid"><Field label="Ad" value={form.firstName} onChange={event => update('firstName', event.target.value)} /><Field label="Soyad" value={form.lastName} onChange={event => update('lastName', event.target.value)} /><Field label="Şirket" value={form.company} onChange={event => update('company', event.target.value)} /><Field label="Görev" value={form.role} onChange={event => update('role', event.target.value)} /><Field label="Departman" value={form.department} onChange={event => update('department', event.target.value)} /><Field label="Şehir" value={form.city} onChange={event => update('city', event.target.value)} /><Field label="Ofis / Şantiye" value={form.office} onChange={event => update('office', event.target.value)} /><Field label="Telefon" value={form.phone} onChange={event => update('phone', event.target.value)} /><Field label="E-posta" type="email" value={form.email} onChange={event => update('email', event.target.value)} /><Field label="Durum" value={form.status} options={['Aktif', 'Ayrıldı']} onChange={event => update('status', event.target.value)} /><Field label="Plaka" value={form.vehicle?.plate || ''} onChange={event => update('vehicle', { ...form.vehicle, plate: event.target.value.toUpperCase() })} /></div></div><div className="modal-actions"><button className="cancel-button" onClick={close}>Vazgeç</button><button className="primary" onClick={() => save(form)} disabled={!form.firstName || !form.lastName}>Kaydet</button></div></div></div>
}

function CompanyModal({ value, close, save }) {
  const [form, setForm] = useState(value)
  const update = (key, nextValue) => setForm(current => ({ ...current, [key]: nextValue }))
  return <div className="overlay" onClick={close}><div className="modal small-modal" onClick={event => event.stopPropagation()}><button className="close-button" onClick={close}><X size={16} /></button><div className="modal-header"><h2>{form.id ? 'Şirketi Düzenle' : 'Yeni Şirket'}</h2><p>Kurum bilgilerini girin.</p></div><div className="modal-body"><div className="form-grid single"><Field label="Şirket adı" value={form.name} onChange={event => update('name', event.target.value)} /><Field label="Sektör" value={form.sector} onChange={event => update('sector', event.target.value)} /><Field label="Şehir" value={form.city} onChange={event => update('city', event.target.value)} /><Field label="Telefon" value={form.phone} onChange={event => update('phone', event.target.value)} /><Field label="E-posta" value={form.email} onChange={event => update('email', event.target.value)} /><Field label="Durum" value={form.status} options={['Aktif', 'Pasif']} onChange={event => update('status', event.target.value)} /></div></div><div className="modal-actions"><button className="cancel-button" onClick={close}>Vazgeç</button><button className="primary" onClick={() => save(form)} disabled={!form.name}>Kaydet</button></div></div></div>
}

function PersonDetail({ person, close }) {
  return <div className="overlay" onClick={close}><div className="modal detail-modal" onClick={event => event.stopPropagation()}><button className="close-button" onClick={close}><X size={16} /></button><div className="detail-head"><div className="big-avatar">{nameOf(person).split(' ').map(part => part[0]).join('').slice(0, 2)}</div><div><h3>{nameOf(person)}</h3><p>{person.role} · {person.company}</p></div></div><div className="detail-grid"><div><small>Telefon</small><strong>{person.phone || '-'}</strong></div><div><small>E-posta</small><strong>{person.email || '-'}</strong></div><div><small>İl / Ofis</small><strong>{person.city || '-'} / {person.office || '-'}</strong></div><div><small>Şirket</small><strong>{person.company || '-'}</strong></div></div><div className="doc-detail-list">{Object.entries(person.documents || {}).map(([key, value]) => <div className="doc-detail-item" key={key}><span>{docs[key]}</span><strong>{docStatus(value)}</strong></div>)}</div></div></div>
}

createRoot(document.getElementById('root')).render(<App />)
