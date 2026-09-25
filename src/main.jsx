import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  AlertTriangle,
  Bell,
  Building2,
  CalendarDays,
  ChevronDown,
  FileCheck2,
  LayoutDashboard,
  MapPinned,
  Package,
  Plus,
  Search,
  Truck,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import './styles.css'

const peopleSeed = [
  {
    id: 1,
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    company: 'Anadolu Enerji A.Ş.',
    assignedCompany: 'Ayka Doğalgaz',
    region: 'Ankara',
    role: 'Sayaç Okuma Personeli',
    department: 'Saha Operasyon',
    city: 'Ankara',
    office: 'Çankaya',
    phone: '0532 111 22 33',
    email: 'ahmet@anadoluenerji.com',
    status: 'Aktif',
    documents: { myk: '2027-02-15', src: '2026-12-10', psychotechnic: '2027-01-20', license: '2028-05-10' },
    vehicle: { brand: '', plate: '' },
  },
  {
    id: 2,
    firstName: 'Zeynep',
    lastName: 'Kaya',
    company: 'Marmara Doğalgaz Ltd.',
    assignedCompany: 'Ayka Yatırım',
    region: 'İstanbul',
    role: 'Bölge Sorumlusu',
    department: 'Operasyon',
    city: 'İstanbul',
    office: 'Kadıköy',
    phone: '0533 222 33 44',
    email: '',
    status: 'Aktif',
    documents: { myk: '2027-05-10', src: '2027-05-10', psychotechnic: '2027-05-10', license: '' },
    vehicle: { brand: '', plate: '' },
  },
  {
    id: 3,
    firstName: 'Mehmet',
    lastName: 'Demir',
    company: 'Anadolu Enerji A.Ş.',
    assignedCompany: 'Ayka Doğalgaz',
    region: 'Konya',
    role: 'Sayaç Okuma Personeli',
    department: 'Saha Operasyon',
    city: 'Konya',
    office: 'Selçuklu',
    phone: '0534 333 44 55',
    email: 'mehmet@anadoluenerji.com',
    status: 'Ayrıldı',
    documents: { myk: '2026-09-27', src: '', psychotechnic: '', license: '' },
    vehicle: { brand: '', plate: '34 ABC 123' },
  },
]

const companySeed = [
  { id: 1, name: 'Ayka Doğalgaz', companyType: 'own_company', city: 'Ankara', phone: '0312 000 00 00', email: 'info@aykadoalgaz.com', status: 'Aktif' },
  { id: 2, name: 'Ayka Yatırım', companyType: 'own_company', city: 'Ankara', phone: '0312 111 11 11', email: 'info@aykayatirim.com', status: 'Aktif' },
  { id: 3, name: 'Anadolu Enerji A.Ş.', companyType: 'client_company', city: 'Ankara', phone: '0312 222 22 22', email: 'info@anadoluenerji.com', status: 'Aktif' },
  { id: 4, name: 'Marmara Doğalgaz Ltd.', companyType: 'client_company', city: 'İstanbul', phone: '0216 333 33 33', email: 'info@marmaradogalgaz.com', status: 'Aktif' },
  { id: 5, name: 'Enerya', companyType: 'client_company', city: 'Ankara', phone: '0312 444 44 44', email: 'info@enerya.com', status: 'Aktif' },
  { id: 6, name: 'YEDAŞ', companyType: 'client_company', city: 'İzmir', phone: '0232 555 55 55', email: 'info@yedas.com', status: 'Aktif' },
]

const regionSeed = [
  { id: 1, name: 'Ankara', companyId: 1, status: 'Aktif' },
  { id: 2, name: 'İstanbul', companyId: 2, status: 'Aktif' },
  { id: 3, name: 'Konya', companyId: 1, status: 'Aktif' },
  { id: 4, name: 'Samsun', companyId: 5, status: 'Aktif' },
  { id: 5, name: 'Sivas', companyId: 6, status: 'Aktif' },
]

const departmentSeed = [
  { id: 1, name: 'Saha Operasyon', companyId: 1, status: 'Aktif' },
  { id: 2, name: 'Operasyon', companyId: 2, status: 'Aktif' },
  { id: 3, name: 'Teknik Destek', companyId: 3, status: 'Aktif' },
  { id: 4, name: 'Yönetim', companyId: 1, status: 'Aktif' },
]

const roleSeed = [
  { id: 1, name: 'Sayaç Okuma Personeli', departmentId: 1, companyId: 1, status: 'Aktif' },
  { id: 2, name: 'Bölge Sorumlusu', departmentId: 2, companyId: 2, status: 'Aktif' },
  { id: 3, name: 'Saha Müdürü', departmentId: 1, companyId: 1, status: 'Aktif' },
  { id: 4, name: 'Operasyon Elemanı', departmentId: 2, companyId: 2, status: 'Aktif' },
]

const emptyPerson = {
  firstName: '',
  lastName: '',
  company: '',
  assignedCompany: '',
  region: '',
  role: '',
  department: '',
  city: '',
  office: '',
  phone: '',
  email: '',
  status: 'Aktif',
  documents: { myk: '', src: '', psychotechnic: '', license: '' },
  vehicle: { brand: '', plate: '' },
}

const emptyCompany = { name: '', companyType: 'own_company', city: '', phone: '', email: '', status: 'Aktif' }
const emptyRegion = { name: '', companyId: '', status: 'Aktif' }
const emptyDepartment = { name: '', companyId: '', status: 'Aktif' }
const emptyRole = { name: '', companyId: '', departmentId: '', status: 'Aktif' }
const docs = { myk: 'MYK', src: 'SRC', psychotechnic: 'Psikoteknik', license: 'Ehliyet' }

const navItems = [
  ['Genel Bakış', LayoutDashboard],
  ['Personeller', Users],
  ['Şirketler', Building2],
  ['Tanımlar', MapPinned],
  ['Belgeler', FileCheck2],
  ['Depolar', Package],
  ['Araç Filosu', Truck],
]

const nameOf = (person) => `${person.firstName || ''} ${person.lastName || ''}`.trim()
const docStatus = (date) => {
  if (!date) return 'Eksik'
  const diffDays = Math.ceil((new Date(date) - new Date()) / 86400000)
  if (diffDays < 0) return 'Süresi doldu'
  if (diffDays <= 60) return `${diffDays} gün kaldı`
  return 'Geçerli'
}

function App() {
  const [people, setPeople] = useState(() => JSON.parse(localStorage.getItem('personel360_people') || 'null') || peopleSeed)
  const [companies, setCompanies] = useState(() => JSON.parse(localStorage.getItem('personel360_companies') || 'null') || companySeed)
  const [regions, setRegions] = useState(() => JSON.parse(localStorage.getItem('personel360_regions') || 'null') || regionSeed)
  const [departments, setDepartments] = useState(() => JSON.parse(localStorage.getItem('personel360_departments') || 'null') || departmentSeed)
  const [roles, setRoles] = useState(() => JSON.parse(localStorage.getItem('personel360_roles') || 'null') || roleSeed)

  const [active, setActive] = useState('Genel Bakış')
  const [query, setQuery] = useState('')
  const [personForm, setPersonForm] = useState(null)
  const [companyForm, setCompanyForm] = useState(null)
  const [definitionForm, setDefinitionForm] = useState(null)
  const [detail, setDetail] = useState(null)

  const warnings = people.reduce((total, person) => total + Object.values(person.documents || {}).filter((date) => docStatus(date) !== 'Geçerli').length, 0)

  const filteredPeople = useMemo(() => {
    return people.filter((person) => {
      const value = `${nameOf(person)} ${person.company} ${person.assignedCompany || ''} ${person.role} ${person.region || ''} ${person.city}`.toLocaleLowerCase('tr')
      return value.includes(query.toLocaleLowerCase('tr'))
    })
  }, [people, query])

  const savePeople = (nextPeople) => {
    setPeople(nextPeople)
    localStorage.setItem('personel360_people', JSON.stringify(nextPeople))
  }

  const saveCompanies = (next) => {
    setCompanies(next)
    localStorage.setItem('personel360_companies', JSON.stringify(next))
  }

  const saveRegions = (next) => {
    setRegions(next)
    localStorage.setItem('personel360_regions', JSON.stringify(next))
  }

  const saveDepartments = (next) => {
    setDepartments(next)
    localStorage.setItem('personel360_departments', JSON.stringify(next))
  }

  const saveRoles = (next) => {
    setRoles(next)
    localStorage.setItem('personel360_roles', JSON.stringify(next))
  }

  const savePerson = (person) => {
    const clean = { ...person, id: person.id || Date.now() }
    const next = person.id ? people.map((item) => (item.id === person.id ? clean : item)) : [{ ...clean }, ...people]
    savePeople(next)
    setPersonForm(null)
  }

  const saveCompany = (company) => {
    const clean = { ...company, id: company.id || Date.now() }
    const next = company.id ? companies.map((item) => (item.id === company.id ? clean : item)) : [{ ...clean }, ...companies]
    saveCompanies(next)
    setCompanyForm(null)
  }

  const saveDefinition = (type, item) => {
    if (type === 'company') saveCompany(item)
    if (type === 'region') {
      const clean = { ...item, id: item.id || Date.now() }
      const next = item.id ? regions.map((current) => (current.id === item.id ? clean : current)) : [{ ...clean }, ...regions]
      saveRegions(next)
    }
    if (type === 'department') {
      const clean = { ...item, id: item.id || Date.now() }
      const next = item.id ? departments.map((current) => (current.id === item.id ? clean : current)) : [{ ...clean }, ...departments]
      saveDepartments(next)
    }
    if (type === 'role') {
      const clean = { ...item, id: item.id || Date.now() }
      const next = item.id ? roles.map((current) => (current.id === item.id ? clean : current)) : [{ ...clean }, ...roles]
      saveRoles(next)
    }
    setDefinitionForm(null)
  }

  const deletePerson = (id) => {
    const person = people.find((item) => item.id === id)
    if (!person) return
    if (person.vehicle && person.vehicle.plate && !window.confirm(`${nameOf(person)} kişisine ait araç zimmeti var. Silmek istediğinize emin misiniz?`)) return
    if (window.confirm(`${nameOf(person)} silinsin mi?`)) {
      savePeople(people.filter((item) => item.id !== id))
    }
  }

  const deleteCompany = (id) => {
    const company = companies.find((item) => item.id === id)
    if (!company || !window.confirm(`${company.name} şirketi silinsin mi?`)) return
    saveCompanies(companies.filter((item) => item.id !== id))
  }

  const deleteRegion = (id) => {
    if (!window.confirm('Bölge silinsin mi?')) return
    saveRegions(regions.filter((item) => item.id !== id))
  }

  const deleteDepartment = (id) => {
    if (!window.confirm('Departman silinsin mi?')) return
    saveDepartments(departments.filter((item) => item.id !== id))
  }

  const deleteRole = (id) => {
    if (!window.confirm('Unvan silinsin mi?')) return
    saveRoles(roles.filter((item) => item.id !== id))
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Users size={20} /></div>
          <div>
            <b>Personel<span>360</span></b>
            <small>Yönetim Sistemi</small>
          </div>
        </div>

        <div className="workspace">
          <Building2 size={16} />
          <div>
            <small>Çalışma alanı</small>
            <strong>Merkez Yönetim</strong>
          </div>
          <ChevronDown size={15} />
        </div>

        <small className="nav-label">MENÜ</small>
        {navItems.map(([label, Icon]) => (
          <button key={label} className={`nav-item ${active === label ? 'active' : ''}`} onClick={() => setActive(label)}>
            <Icon size={18} />
            {label}
            {label === 'Belgeler' && <em>{warnings}</em>}
          </button>
        ))}

        <div className="account">
          <div className="avatar dark">FA</div>
          <div>
            <b>Fatih Ayka</b>
            <small>Sistem Yöneticisi</small>
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <header>
          <div className="breadcrumb">Yönetim <b>/</b> <strong>{active}</strong></div>
          <div className="userbar">
            <button className="icon-button" title="Yedekle"><Bell size={18} /></button>
            <div className="avatar">FA</div>
            <span>Fatih Ayka</span>
            <ChevronDown size={15} />
          </div>
        </header>

        <section className="content-shell">
          {active === 'Genel Bakış' && (
            <Dashboard
              people={people}
              setActive={setActive}
              warnings={warnings}
              openPerson={() => setPersonForm({ ...emptyPerson, documents: { ...emptyPerson.documents }, vehicle: { ...emptyPerson.vehicle } })}
            />
          )}

          {active === 'Personeller' && (
            <PeoplePage
              people={filteredPeople}
              query={query}
              setQuery={setQuery}
              openPerson={() => setPersonForm({ ...emptyPerson, documents: { ...emptyPerson.documents }, vehicle: { ...emptyPerson.vehicle } })}
              edit={setPersonForm}
              detail={setDetail}
              remove={deletePerson}
            />
          )}

          {active === 'Şirketler' && (
            <CompaniesPage
              companies={companies}
              people={people}
              query={query}
              setQuery={setQuery}
              add={() => setCompanyForm({ ...emptyCompany })}
              edit={setCompanyForm}
              remove={deleteCompany}
            />
          )}

          {active === 'Tanımlar' && (
            <DefinitionsPage
              companies={companies}
              regions={regions}
              departments={departments}
              roles={roles}
              addDefinition={setDefinitionForm}
              deleteRegion={deleteRegion}
              deleteDepartment={deleteDepartment}
              deleteRole={deleteRole}
            />
          )}

          {active === 'Belgeler' && <DocumentsPage people={people} />}

          {active === 'Depolar' && (
            <SimplePage
              title="Depo ve stok görünümü"
              eyebrow="DEPO"
              cards={[
                ['Toplam Demirbaş', people.length + 12, Package, 'blue'],
                ['Müsait Stok', 18, Package, 'teal'],
                ['Zimmetli', 7, Users, 'green'],
              ]}
            />
          )}

          {active === 'Araç Filosu' && <VehiclesPage people={people} />}
        </section>
      </main>

      {personForm && (
        <PersonModal
          value={personForm}
          close={() => setPersonForm(null)}
          save={savePerson}
          companies={companies}
          regions={regions}
          departments={departments}
          roles={roles}
        />
      )}
      {companyForm && <CompanyModal value={companyForm} close={() => setCompanyForm(null)} save={saveCompany} />}
      {definitionForm && (
        <DefinitionModal
          type={definitionForm.type}
          value={definitionForm.value}
          companies={companies}
          departments={departments}
          close={() => setDefinitionForm(null)}
          save={(item) => saveDefinition(definitionForm.type, item)}
        />
      )}
      {detail && <PersonDetail person={detail} close={() => setDetail(null)} />}
    </div>
  )
}

function Dashboard({ people, warnings, setActive, openPerson }) {
  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <small className="eyebrow">GENEL BAKIŞ</small>
          <h1>Gösterge Paneli</h1>
        </div>
        <button className="primary" onClick={openPerson}><Plus size={18} /> Yeni Personel</button>
      </div>

      <div className="card-grid">
        <StatCard title="Toplam Personel" value={people.length} icon={Users} tone="teal" />
        <StatCard title="Aktif Personel" value={people.filter((x) => x.status === 'Aktif').length} icon={UserRound} tone="green" />
        <StatCard title="Belge Uyarıları" value={warnings} icon={AlertTriangle} tone="amber" />
        <StatCard title="Araç Sayısı" value={people.filter((x) => x.vehicle && x.vehicle.plate).length} icon={Truck} tone="blue" />
      </div>

      <div className="content-grid">
        <div className="panel">
          <h3>Son belge uyarıları</h3>
          <div className="stack-list">
            {people.flatMap((person) =>
              Object.entries(person.documents || {}).filter(([, value]) => docStatus(value) !== 'Geçerli').map(([key, value]) => (
                <div key={`${person.id}-${key}`} className="list-row">
                  <div>
                    <strong>{nameOf(person)}</strong>
                    <small>{docs[key]}</small>
                  </div>
                  <span className="badge warn">{docStatus(value)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="panel">
          <h3>İşlem hızlı erişim</h3>
          <div className="stack-list">
            <button className="mini-button" onClick={openPerson}><Plus size={16} /> Personel Ekle</button>
            <button className="mini-button" onClick={() => setActive('Şirketler')}><Building2 size={16} /> Şirketleri Gör</button>
            <button className="mini-button" onClick={() => setActive('Tanımlar')}><MapPinned size={16} /> Tanımları Gör</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PeoplePage({ people, query, setQuery, openPerson, edit, detail, remove }) {
  return (
    <div className="page-stack">
      <div className="toolbar-row">
        <div className="search-box">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ad, şirket, görev veya il ara..." />
        </div>
        <button className="primary" onClick={openPerson}><Plus size={18} /> Yeni Personel</button>
      </div>

      <div className="panel table-panel">
        <table>
          <thead>
            <tr>
              <th>Personel</th>
              <th>Şirket / Görev</th>
              <th>Bölge</th>
              <th>Belge</th>
              <th>Durum</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => {
              const docsList = Object.values(person.documents || {})
              const validCount = docsList.filter((date) => docStatus(date) === 'Geçerli').length
              return (
                <tr key={person.id}>
                  <td>
                    <strong>{nameOf(person)}</strong>
                    <small>{person.phone || 'Telefon yok'}</small>
                  </td>
                  <td>
                    <strong>{person.company || person.assignedCompany || '-'}</strong>
                    <small>{person.department || person.role || '-'}</small>
                  </td>
                  <td>{person.region || person.city || '-'} / {person.office || '-'}</td>
                  <td>{validCount} / {docsList.length}</td>
                  <td><span className={`status-badge ${person.status === 'Aktif' ? 'success' : 'warn'}`}>{person.status}</span></td>
                  <td className="action-col">
                    <button className="simple-button" onClick={() => detail(person)}>Detay</button>
                    <button className="simple-button" onClick={() => edit(person)}>Düzenle</button>
                    <button className="simple-button danger" onClick={() => remove(person.id)}>Sil</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function CompaniesPage({ companies, people, query, setQuery, add, edit, remove }) {
  const list = companies.filter((company) => `${company.name} ${company.city} ${company.companyType}`.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr')))

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <small className="eyebrow">ŞİRKET YÖNETİMİ</small>
          <h1>Şirketler</h1>
        </div>
        <button className="primary" onClick={add}><Plus size={18} /> Yeni Şirket</button>
      </div>

      <div className="toolbar-row">
        <div className="search-box">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Şirket, şehir veya tür ara..." />
        </div>
      </div>

      <div className="panel table-panel">
        <table>
          <thead>
            <tr>
              <th>Şirket</th>
              <th>Tür</th>
              <th>Şehir</th>
              <th>Personel</th>
              <th>İletişim</th>
              <th>Durum</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {list.map((company) => (
              <tr key={company.id}>
                <td><strong>{company.name}</strong></td>
                <td>{company.companyType || '-'}</td>
                <td>{company.city || '-'}</td>
                <td><span className="status-badge success">{people.filter((person) => person.company === company.name || person.assignedCompany === company.name).length} kişi</span></td>
                <td>
                  <strong>{company.phone || '-'}</strong>
                  <small>{company.email || '-'}</small>
                </td>
                <td><span className={`status-badge ${company.status === 'Aktif' ? 'success' : 'warn'}`}>{company.status}</span></td>
                <td className="action-col">
                  <button className="simple-button" onClick={() => edit(company)}>Düzenle</button>
                  <button className="simple-button danger" onClick={() => remove(company.id)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DefinitionsPage({ companies, regions, departments, roles, addDefinition, deleteRegion, deleteDepartment, deleteRole }) {
  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <small className="eyebrow">TANIMLAR</small>
          <h1>Şirket, bölge ve görev tanımları</h1>
        </div>
      </div>

      <div className="panel">
        <div className="definition-grid">
          <DefinitionCard title="Şirketler" items={companies} addLabel="Şirket Ekle" onAdd={() => addDefinition({ type: 'company', value: { ...emptyCompany } })} />
          <DefinitionCard title="Bölgeler" items={regions} addLabel="Bölge Ekle" onAdd={() => addDefinition({ type: 'region', value: { ...emptyRegion, companyId: companies[0]?.id || '' } })} onDelete={deleteRegion} />
          <DefinitionCard title="Departmanlar" items={departments} addLabel="Departman Ekle" onAdd={() => addDefinition({ type: 'department', value: { ...emptyDepartment, companyId: companies[0]?.id || '' } })} onDelete={deleteDepartment} />
          <DefinitionCard title="Unvanlar" items={roles} addLabel="Unvan Ekle" onAdd={() => addDefinition({ type: 'role', value: { ...emptyRole, companyId: companies[0]?.id || '', departmentId: departments[0]?.id || '' } })} onDelete={deleteRole} />
        </div>
      </div>
    </div>
  )
}

function DefinitionCard({ title, items, addLabel, onAdd, onDelete }) {
  return (
    <div className="definition-card">
      <div className="definition-header">
        <h3>{title}</h3>
        <button className="simple-button" onClick={onAdd}>{addLabel}</button>
      </div>
      <div className="definition-list">
        {items.map((item) => (
          <div key={item.id} className="definition-row">
            <span>{item.name || item.title || 'İsim yok'}</span>
            {onDelete && <button className="simple-button danger" onClick={() => onDelete(item.id)}>Sil</button>}
          </div>
        ))}
      </div>
    </div>
  )
}

function DocumentsPage({ people }) {
  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <small className="eyebrow">BELGE TAKİBİ</small>
          <h1>Belge ve geçerlilik yönetimi</h1>
        </div>
      </div>

      <div className="panel table-panel">
        <table>
          <thead>
            <tr>
              <th>Personel</th>
              <th>MYK</th>
              <th>SRC</th>
              <th>Psikoteknik</th>
              <th>Ehliyet</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.id}>
                <td><strong>{nameOf(person)}</strong><small>{person.company}</small></td>
                <td>{docStatus(person.documents?.myk)}</td>
                <td>{docStatus(person.documents?.src)}</td>
                <td>{docStatus(person.documents?.psychotechnic)}</td>
                <td>{docStatus(person.documents?.license)}</td>
                <td><span className={`status-badge ${Object.values(person.documents || {}).some((date) => docStatus(date) !== 'Geçerli') ? 'warn' : 'success'}`}>Takip</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function VehiclesPage({ people }) {
  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <small className="eyebrow">ARAÇ</small>
          <h1>Hizmet aracı listesi</h1>
        </div>
      </div>

      <div className="panel table-panel">
        <table>
          <thead>
            <tr>
              <th>Personel</th>
              <th>Marka / Model</th>
              <th>Plaka</th>
            </tr>
          </thead>
          <tbody>
            {people.filter((x) => x.vehicle && x.vehicle.plate).map((person) => (
              <tr key={person.id}>
                <td>{nameOf(person)}</td>
                <td>{person.vehicle.brand || '-'}</td>
                <td>{person.vehicle.plate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SimplePage({ title, eyebrow, cards }) {
  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <small className="eyebrow">{eyebrow}</small>
          <h1>{title}</h1>
        </div>
      </div>
      <div className="card-grid">
        {cards.map(([label, value, Icon, tone]) => (
          <StatCard key={label} title={label} value={value} icon={Icon} tone={tone} />
        ))}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', options }) {
  return (
    <label className="field">
      <span>{label}</span>
      {options ? (
        <select value={value || ''} onChange={onChange}>
          <option value="">Seçiniz</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : (
        <input type={type} value={value || ''} onChange={onChange} />
      )}
    </label>
  )
}

function PersonModal({ value, close, save, companies, regions, departments, roles }) {
  const [form, setForm] = useState(value)
  const update = (key, nextValue) => setForm((current) => ({ ...current, [key]: nextValue }))
  const updateNested = (group, key, nextValue) => setForm((current) => ({ ...current, [group]: { ...current[group], [key]: nextValue } }))

  const companyOptions = companies.map((item) => item.name)
  const regionOptions = regions.map((item) => item.name)
  const departmentOptions = departments.map((item) => item.name)
  const roleOptions = roles.map((item) => item.name)

  return (
    <div className="overlay" onClick={close}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={close}><X size={16} /></button>
        <div className="modal-header">
          <h2>{form.id ? 'Personel Kartı' : 'Yeni Personel'}</h2>
          <p>Şirket, bölge ve görev tanımlarıyla uyumlu çalışan kartı.</p>
        </div>

        <div className="modal-body">
          <div className="form-grid">
            <Field label="Ad" value={form.firstName} onChange={(event) => update('firstName', event.target.value)} />
            <Field label="Soyad" value={form.lastName} onChange={(event) => update('lastName', event.target.value)} />
            <Field label="Çalıştığı Şirket" value={form.company} options={companyOptions} onChange={(event) => update('company', event.target.value)} />
            <Field label="Görev Yaptığı Şirket" value={form.assignedCompany} options={companyOptions} onChange={(event) => update('assignedCompany', event.target.value)} />
            <Field label="Bölge" value={form.region} options={regionOptions} onChange={(event) => update('region', event.target.value)} />
            <Field label="Departman" value={form.department} options={departmentOptions} onChange={(event) => update('department', event.target.value)} />
            <Field label="Görev / Unvan" value={form.role} options={roleOptions} onChange={(event) => update('role', event.target.value)} />
            <Field label="Şehir" value={form.city} onChange={(event) => update('city', event.target.value)} />
            <Field label="Ofis / Şantiye" value={form.office} onChange={(event) => update('office', event.target.value)} />
            <Field label="Telefon" value={form.phone} onChange={(event) => update('phone', event.target.value)} />
            <Field label="E-posta" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} />
            <Field label="Durum" value={form.status} options={['Aktif', 'Ayrıldı']} onChange={(event) => update('status', event.target.value)} />
            <Field label="Plaka" value={form.vehicle.plate} onChange={(event) => updateNested('vehicle', 'plate', event.target.value.toUpperCase())} />
          </div>
        </div>

        <div className="modal-actions">
          <button className="cancel-button" onClick={close}>Vazgeç</button>
          <button className="primary" onClick={() => save(form)} disabled={!form.firstName || !form.lastName}>Kaydet</button>
        </div>
      </div>
    </div>
  )
}

function CompanyModal({ value, close, save }) {
  const [form, setForm] = useState(value)
  const update = (key, nextValue) => setForm((current) => ({ ...current, [key]: nextValue }))

  return (
    <div className="overlay" onClick={close}>
      <div className="modal small-modal" onClick={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={close}><X size={16} /></button>
        <div className="modal-header">
          <h2>{form.id ? 'Şirketi Düzenle' : 'Yeni Şirket'}</h2>
          <p>Kurum ve şirket tanım bilgilerini girin.</p>
        </div>

        <div className="modal-body">
          <div className="form-grid single">
            <Field label="Şirket adı" value={form.name} onChange={(event) => update('name', event.target.value)} />
            <Field label="Tür" value={form.companyType} options={['own_company', 'client_company', 'partner_company', 'fleet_owner_company']} onChange={(event) => update('companyType', event.target.value)} />
            <Field label="Şehir" value={form.city} onChange={(event) => update('city', event.target.value)} />
            <Field label="Telefon" value={form.phone} onChange={(event) => update('phone', event.target.value)} />
            <Field label="E-posta" value={form.email} onChange={(event) => update('email', event.target.value)} />
            <Field label="Durum" value={form.status} options={['Aktif', 'Pasif']} onChange={(event) => update('status', event.target.value)} />
          </div>
        </div>

        <div className="modal-actions">
          <button className="cancel-button" onClick={close}>Vazgeç</button>
          <button className="primary" onClick={() => save(form)} disabled={!form.name}>Kaydet</button>
        </div>
      </div>
    </div>
  )
}

function DefinitionModal({ type, value, companies, departments, close, save }) {
  const [form, setForm] = useState(value)
  const update = (key, nextValue) => setForm((current) => ({ ...current, [key]: nextValue }))

  return (
    <div className="overlay" onClick={close}>
      <div className="modal small-modal" onClick={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={close}><X size={16} /></button>
        <div className="modal-header">
          <h2>{type === 'company' ? 'Şirket Ekle' : type === 'region' ? 'Bölge Ekle' : type === 'department' ? 'Departman Ekle' : 'Unvan Ekle'}</h2>
        </div>

        <div className="modal-body">
          <div className="form-grid single">
            {type === 'company' && (
              <>
                <Field label="Şirket adı" value={form.name} onChange={(event) => update('name', event.target.value)} />
                <Field label="Tür" value={form.companyType} options={['own_company', 'client_company', 'partner_company', 'fleet_owner_company']} onChange={(event) => update('companyType', event.target.value)} />
              </>
            )}
            {type === 'region' && (
              <>
                <Field label="Bölge adı" value={form.name} onChange={(event) => update('name', event.target.value)} />
                <Field label="Şirket" value={form.companyId} options={companies.map((company) => company.name)} onChange={(event) => update('companyId', companies.find((company) => company.name === event.target.value)?.id || '')} />
              </>
            )}
            {type === 'department' && (
              <>
                <Field label="Departman adı" value={form.name} onChange={(event) => update('name', event.target.value)} />
                <Field label="Şirket" value={form.companyId} options={companies.map((company) => company.name)} onChange={(event) => update('companyId', companies.find((company) => company.name === event.target.value)?.id || '')} />
              </>
            )}
            {type === 'role' && (
              <>
                <Field label="Unvan adı" value={form.name} onChange={(event) => update('name', event.target.value)} />
                <Field label="Şirket" value={form.companyId} options={companies.map((company) => company.name)} onChange={(event) => update('companyId', companies.find((company) => company.name === event.target.value)?.id || '')} />
                <Field label="Departman" value={form.departmentId} options={departments.map((department) => department.name)} onChange={(event) => update('departmentId', departments.find((department) => department.name === event.target.value)?.id || '')} />
              </>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button className="cancel-button" onClick={close}>Vazgeç</button>
          <button className="primary" onClick={() => save(form)} disabled={type === 'company' ? !form.name : !form.name || !form.companyId}>Kaydet</button>
        </div>
      </div>
    </div>
  )
}

function PersonDetail({ person, close }) {
  return (
    <div className="overlay" onClick={close}>
      <div className="modal detail-modal" onClick={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={close}><X size={16} /></button>
        <div className="detail-head">
          <div className="big-avatar">{nameOf(person).split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
          <div>
            <h3>{nameOf(person)}</h3>
            <p>{person.role} · {person.company}</p>
          </div>
        </div>

        <div className="detail-grid">
          <div><small>Telefon</small><strong>{person.phone || '-'}</strong></div>
          <div><small>E-posta</small><strong>{person.email || '-'}</strong></div>
          <div><small>İl / Ofis</small><strong>{person.city || '-'} / {person.office || '-'}</strong></div>
          <div><small>Şirket / Bölge</small><strong>{person.company || '-'} / {person.region || '-'}</strong></div>
        </div>

        <div className="doc-detail-list">
          {Object.entries(person.documents || {}).map(([key, value]) => (
            <div className="doc-detail-item" key={key}>
              <span>{docs[key]}</span>
              <strong>{docStatus(value)}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
