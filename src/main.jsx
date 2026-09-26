import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AlertTriangle, Bell, Building2, CalendarDays, ChevronDown, FileCheck2, LayoutDashboard, Package, Plus, Search, Truck, UserRound, Users, X } from 'lucide-react'
import { AccidentModule } from './AccidentModule'
import './styles.css'

const peopleSeed = [
  { id: 1, firstName: 'Ahmet', lastName: 'Yılmaz', company: 'Anadolu Enerji A.Ş.', role: 'Sayaç Okuma Personeli', department: 'Saha Operasyon', city: 'Ankara', office: 'Çankaya', phone: '0532 111 22 33', email: 'ahmet@anadoluenerji.com', status: 'Aktif', documents: { myk: '2026-12-31', src: '2026-09-20', psychotechnic: '2026-11-05', license: '2028-06-09' } },
  { id: 2, firstName: 'Zeynep', lastName: 'Kaya', company: 'Marmara Doğalgaz Ltd.', role: 'Bölge Sorumlusu', department: 'Operasyon', city: 'İstanbul', office: 'Kadıköy', phone: '0533 222 33 44', email: 'zeynep@marmaradogalgaz.com', status: 'Aktif', documents: { myk: '2027-01-15', src: '2026-10-02', psychotechnic: '2026-12-12', license: '2027-02-28' } },
  { id: 3, firstName: 'Mehmet', lastName: 'Demir', company: 'Anadolu Enerji A.Ş.', role: 'Sayaç Okuma Personeli', department: 'Saha Operasyon', city: 'Konya', office: 'Selçuklu', phone: '0534 333 44 55', email: 'mehmet@anadoluenerji.com', status: 'Aktif', documents: { myk: '2026-10-04', src: '2026-08-22', psychotechnic: '', license: '2027-03-09' } },
]
const companySeed = [
  { id: 1, name: 'Anadolu Enerji A.Ş.', sector: 'Enerji', city: 'Ankara', phone: '0312 000 00 00', email: 'info@anadoluenerji.com', status: 'Aktif' },
  { id: 2, name: 'Marmara Doğalgaz Ltd.', sector: 'Doğalgaz', city: 'İstanbul', phone: '0216 000 00 00', email: 'info@marmaradogalgaz.com', status: 'Aktif' },
]
const emptyPerson = { firstName: '', lastName: '', company: '', role: '', department: '', city: '', office: '', phone: '', email: '', status: 'Aktif', documents: { myk: '', src: '', psychotechnic: '', license: '' } }
const emptyCompany = { name: '', sector: '', city: '', phone: '', email: '', status: 'Aktif' }
const docs = { myk: 'MYK', src: 'SRC', psychotechnic: 'Psikoteknik', license: 'Ehliyet' }
const navItems = [['Genel Bakış', LayoutDashboard], ['Personeller', Users], ['Şirketler', Building2], ['Belgeler', FileCheck2], ['Depolar', Package], ['Araç Filosu', Truck], ['Kaza & Hasar', AlertTriangle]]
const nameOf = p => `${p.firstName || ''} ${p.lastName || ''}`.trim()
const docStatus = date => {
  if (!date) return 'Eksik'
  const days = Math.ceil((new Date(date) - new Date()) / 86400000)
  if (days < 0) return 'Süresi doldu'
  if (days <= 60) return `${days} gün kaldı`
  return 'Geçerli'
}

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
      <div className="brand"><div className="brand-icon"><Users size={20} /></div><div><b>Personel<span>360</span></b><small>Yönetim Sistemi</small></div></div>
      <div className="workspace"><Building2 size={16} /><div><small>Çalışma alanı</small><strong>Merkez Yönetim</strong></div></div>
      <small className="nav-label">MENÜ</small>
      {navItems.map(([label, Icon]) => <button key={label} className={`nav-item ${active === label ? 'active' : ''}`} onClick={() => setActive(label)}><Icon size={18} />{label}</button>)}
      <div className="account"><div className="avatar dark">FA</div><div><b>Fatih Ayka</b><small>Sistem Yöneticisi</small></div></div>
    </aside>

    <main className="main-panel">
      <header>
        <div className="breadcrumb">Yönetim <b>/</b> <strong>{active}</strong></div>
        <div className="userbar"><button className="icon-button"><Bell size={18} /></button><div className="avatar">FA</div><span>Fatih Ayka</span></div>
      </header>

      <section className="content-shell">
        {active === 'Genel Bakış' && <Dashboard people={people} warnings={warnings} setActive={setActive} openPerson={() => setPersonForm({ ...emptyPerson, documents: { ...emptyPerson.documents } })} />}
        {active === 'Personeller' && <PeoplePage people={filteredPeople} query={query} setQuery={setQuery} openPerson={() => setPersonForm({ ...emptyPerson, documents: { ...emptyPerson.documents } })} edit={p => setPersonForm({ ...p, documents: { ...p.documents } })} detail={p => setDetail(p)} remove={deletePerson} />}
        {active === 'Şirketler' && <CompaniesPage companies={companies} people={people} query={query} setQuery={setQuery} add={() => setCompanyForm({ ...emptyCompany })} edit={c => setCompanyForm(c)} remove={deleteCompany} />}
        {active === 'Belgeler' && <DocumentsPage people={people} />}
        {active === 'Depolar' && <SimplePage title="Depo ve stok görünümü" eyebrow="DEPO" cards={[['Toplam Demirbaş', 16, Package, 'blue'], ['Müsait Stok', 18, Package, 'teal'], ['Zimmetli', 7, Package, 'amber'], ['Eksik', 2, Package, 'warn']]} />}
        {active === 'Araç Filosu' && <VehiclesPage people={people} />}
        {active === 'Kaza & Hasar' && <AccidentModule />}
      </section>
    </main>

    {personForm && <PersonModal value={personForm} close={() => setPersonForm(null)} save={savePerson} />}
    {companyForm && <CompanyModal value={companyForm} close={() => setCompanyForm(null)} save={saveCompany} />}
    {detail && <PersonDetail person={detail} close={() => setDetail(null)} />}
  </div>
}

function Dashboard({ people, warnings, setActive, openPerson }) {
  return <div className="page-stack">
    <div className="page-heading">
      <div><small className="eyebrow">GENEL BAKIŞ</small><h1>Gösterge Paneli</h1></div>
      <button className="primary" onClick={openPerson}><Plus size={18} /> Yeni personel</button>
    </div>
    <div className="card-grid">
      <Stat title="Toplam Personel" value={people.length} icon={Users} tone="teal" />
      <Stat title="Aktif Personel" value={people.filter(p => p.status === 'Aktif').length} icon={UserRound} tone="green" />
      <Stat title="Belge Uyarısı" value={warnings} icon={CalendarDays} tone="amber" />
      <Stat title="Kaza & Hasar" value="Hazır" icon={AlertTriangle} tone="blue" />
    </div>
    <div className="content-grid">
      <div className="panel"><h3>Modüller</h3><div className="stack-list"><button className="mini-button" onClick={() => setActive('Personeller')}><Users size={16} /> Personelleri Aç</button><button className="mini-button" onClick={() => setActive('Belgeler')}><FileCheck2 size={16} /> Belge Takibini Aç</button><button className="mini-button" onClick={() => setActive('Kaza & Hasar')}><AlertTriangle size={16} /> Kaza ve Hasar Takibini Aç</button></div></div>
      <div className="panel"><h3>Özet</h3><div className="stack-list"><div className="list-row"><span>Personel takibi</span><span className="badge success">Aktif</span></div><div className="list-row"><span>Belge denetimi</span><span className="badge warn">{warnings} uyarı</span></div><div className="list-row"><span>Aracı gezi</span><span className="badge success">Hazır</span></div></div></div>
    </div>
  </div>
}

function Stat({ title, value, icon: Icon, tone }) { return <div className="stat-card"><div className={`icon-box ${tone}`}><Icon size={18} /></div><div><small>{title}</small><strong>{value}</strong></div></div> }

function PeoplePage({ people, query, setQuery, openPerson, edit, detail, remove }) {
  return <div className="page-stack">
    <div className="page-heading"><div><small className="eyebrow">PERSONEL</small><h1>Personeller</h1></div><button className="primary" onClick={openPerson}><Plus size={18} />Yeni Personel</button></div>
    <div className="toolbar-row"><div className="search-box"><Search size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Personel, şirket veya şehir ara..." /></div></div>
    <div className="panel table-panel"><table><thead><tr><th>Personel</th><th>Şirket</th><th>Görev</th><th>Şehir</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>{people.map(person => <tr key={person.id}><td><strong>{nameOf(person)}</strong><small>{person.department}</small></td><td>{person.company}</td><td>{person.role}</td><td>{person.city}</td><td><span className="status-badge success">{person.status}</span></td><td className="action-col"><button className="simple-button" onClick={() => detail(person)}>Detay</button><button className="simple-button" onClick={() => edit(person)}>Düzenle</button><button className="simple-button danger" onClick={() => remove(person.id)}>Sil</button></td></tr>)}</tbody></table></div>
  </div>
}

function CompaniesPage({ companies, people, query, setQuery, add, edit, remove }) {
  const list = companies.filter(c => `${c.name} ${c.sector} ${c.city}`.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr')))
  return <div className="page-stack">
    <div className="page-heading"><div><small className="eyebrow">ŞİRKET</small><h1>Şirketler</h1></div><button className="primary" onClick={add}><Plus size={18} />Yeni Şirket</button></div>
    <div className="toolbar-row"><div className="search-box"><Search size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Şirket adı, sektör veya şehir ara..." /></div></div>
    <div className="panel table-panel"><table><thead><tr><th>Şirket</th><th>Sektör</th><th>Şehir</th><th>Personel</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>{list.map(company => <tr key={company.id}><td><strong>{company.name}</strong></td><td>{company.sector}</td><td>{company.city}</td><td>{people.filter(p => p.company === company.name).length}</td><td><span className="status-badge success">{company.status}</span></td><td className="action-col"><button className="simple-button" onClick={() => edit(company)}>Düzenle</button><button className="simple-button danger" onClick={() => remove(company.id)}>Sil</button></td></tr>)}</tbody></table></div>
  </div>
}

function DocumentsPage({ people }) {
  return <div className="page-stack"><div className="page-heading"><div><small className="eyebrow">BELGE TAKİBİ</small><h1>Belge ve geçerlilik yönetimi</h1></div></div><div className="panel table-panel"><table><thead><tr><th>Personel</th>{Object.keys(docs).map(key => <th key={key}>{docs[key]}</th>)}</tr></thead><tbody>{people.map(person => <tr key={person.id}><td><strong>{nameOf(person)}</strong><small>{person.company}</small></td>{Object.entries(docs).map(([key, label]) => <td key={key}><span className={`status-badge ${docStatus(person.documents?.[key]) === 'Geçerli' ? 'success' : 'warn'}`}>{docStatus(person.documents?.[key])}</span></td>)}</tr>)}</tbody></table></div></div>
}

function VehiclesPage({ people }) {
  return <div className="page-stack"><div className="page-heading"><div><small className="eyebrow">ARAÇ</small><h1>Hizmet aracı listesi</h1></div></div><div className="card-grid"><div className="stat-card"><div className="icon-box blue"><Truck size={18} /></div><div><small>Toplam Araç</small><strong>{people.length}</strong></div></div><div className="stat-card"><div className="icon-box green"><Truck size={18} /></div><div><small>Aktif Saha</small><strong>{people.filter(p => p.status === 'Aktif').length}</strong></div></div></div></div>
}

function SimplePage({ title, eyebrow, cards }) {
  return <div className="page-stack"><div className="page-heading"><div><small className="eyebrow">{eyebrow}</small><h1>{title}</h1></div></div><div className="card-grid">{cards.map(([label, value, Icon, tone]) => <div key={label} className="stat-card"><div className={`icon-box ${tone}`}><Icon size={18} /></div><div><small>{label}</small><strong>{value}</strong></div></div>)}</div></div>
}

function Field({ label, value, onChange, type = 'text', options }) {
  return <label className="field"><span>{label}</span>{options ? <select value={value || ''} onChange={onChange}>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : <input type={type} value={value || ''} onChange={onChange} />}</label>
}

function PersonModal({ value, close, save }) {
  const [f, setF] = useState(value)
  const u = (k, v) => setF(x => ({ ...x, [k]: v }))
  const n = (g, k, v) => setF(x => ({ ...x, [g]: { ...(x[g] || {}), [k]: v } }))
  return <div className="overlay" onClick={close}><div className="modal" onClick={e => e.stopPropagation()}><button className="close-button" onClick={close}><X size={16} /></button><div className="modal-header"><h2>{f.id ? 'Personel Düzenle' : 'Yeni Personel'}</h2><p>Şahsi bilgileri ve belgeleri kaydedin.</p></div><div className="modal-body"><div className="form-grid"><Field label="Ad" value={f.firstName} onChange={e => u('firstName', e.target.value)} /><Field label="Soyad" value={f.lastName} onChange={e => u('lastName', e.target.value)} /><Field label="Şirket" value={f.company} onChange={e => u('company', e.target.value)} /><Field label="Görev" value={f.role} onChange={e => u('role', e.target.value)} /><Field label="Departman" value={f.department} onChange={e => u('department', e.target.value)} /><Field label="Şehir" value={f.city} onChange={e => u('city', e.target.value)} /><Field label="Ofis" value={f.office} onChange={e => u('office', e.target.value)} /><Field label="Telefon" value={f.phone} onChange={e => u('phone', e.target.value)} /><Field label="E-posta" value={f.email} onChange={e => u('email', e.target.value)} /><Field label="Durum" value={f.status} onChange={e => u('status', e.target.value)} options={[{ value: 'Aktif', label: 'Aktif' }, { value: 'Pasif', label: 'Pasif' }]} /><div className="field full-width"><span>Belge tarihleri</span><div className="doc-grid">{Object.keys(docs).map(key => <div className="doc-item" key={key}><label>{docs[key]}<input type="date" value={f.documents?.[key] || ''} onChange={e => n('documents', key, e.target.value)} /></label></div>)}</div></div></div></div><div className="modal-actions"><button className="cancel-button" onClick={close}>Vazgeç</button><button className="primary" onClick={() => save(f)}>Kaydet</button></div></div></div>
}

function CompanyModal({ value, close, save }) {
  const [f, setF] = useState(value)
  const u = (k, v) => setF(x => ({ ...x, [k]: v }))
  return <div className="overlay" onClick={close}><div className="modal" onClick={e => e.stopPropagation()}><button className="close-button" onClick={close}><X size={16} /></button><div className="modal-header"><h2>{f.id ? 'Şirket Düzenle' : 'Yeni Şirket'}</h2><p>Şirket bilgilerini kaydedin.</p></div><div className="modal-body"><div className="form-grid"><Field label="Şirket Adı" value={f.name} onChange={e => u('name', e.target.value)} /><Field label="Sektör" value={f.sector} onChange={e => u('sector', e.target.value)} /><Field label="Şehir" value={f.city} onChange={e => u('city', e.target.value)} /><Field label="Telefon" value={f.phone} onChange={e => u('phone', e.target.value)} /><Field label="E-posta" value={f.email} onChange={e => u('email', e.target.value)} /><Field label="Durum" value={f.status} onChange={e => u('status', e.target.value)} options={[{ value: 'Aktif', label: 'Aktif' }, { value: 'Pasif', label: 'Pasif' }]} /></div></div><div className="modal-actions"><button className="cancel-button" onClick={close}>Vazgeç</button><button className="primary" onClick={() => save(f)}>Kaydet</button></div></div></div>
}

function PersonDetail({ person, close }) {
  return <div className="overlay" onClick={close}><div className="modal detail-modal" onClick={e => e.stopPropagation()}><button className="close-button" onClick={close}><X size={16} /></button><div className="modal-header"><h2>{nameOf(person)}</h2><p>{person.company} / {person.role}</p></div><div className="detail-grid"><div className="detail-item"><small>Telefon</small><strong>{person.phone}</strong></div><div className="detail-item"><small>E-posta</small><strong>{person.email}</strong></div><div className="detail-item"><small>Şehir</small><strong>{person.city}</strong></div><div className="detail-item"><small>Ofis</small><strong>{person.office}</strong></div></div><div className="doc-grid detail-docs">{Object.entries(docs).map(([key, label]) => <div className="doc-item" key={key}><label>{label}<input type="date" value={person.documents?.[key] || ''} readOnly /></label></div>)}</div></div></div>
}

createRoot(document.getElementById('root')).render(<App />)
