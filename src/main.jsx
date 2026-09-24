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
  Package,
  Plus,
  Search,
  Truck,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import './styles.css'

const initialPeople = [
  {
    id: 1,
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    company: 'Anadolu Enerji A.Ş.',
    role: 'Sayaç Okuma Personeli',
    department: 'Saha Operasyon',
    city: 'Ankara',
    office: 'Çankaya',
    phone: '0532 111 22 33',
    email: 'ahmet@anadoluenerji.com',
    status: 'Aktif',
    topSize: 'L',
    bottomSize: '48',
    shoeSize: '42',
    documents: { myk: '2027-02-15', src: '2026-12-10', psychotechnic: '2027-01-20', license: '2028-05-10' },
    vehicle: { brand: '', plate: '' },
  },
  {
    id: 2,
    firstName: 'Zeynep',
    lastName: 'Kaya',
    company: 'Marmara Doğalgaz Ltd.',
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
    role: 'Sayaç Okuma Personeli',
    department: 'Saha Operasyon',
    city: 'Konya',
    office: 'Selçuklu',
    phone: '0534 333 44 55',
    email: 'mehmet@anadoluenerji.com',
    status: 'Ayrıldı',
    topSize: 'M',
    bottomSize: '46',
    shoeSize: '41',
    documents: { myk: '2026-09-27', src: '', psychotechnic: '', license: '' },
    vehicle: { brand: '', plate: '34 ABC 123' },
  },
]

const blankPerson = {
  firstName: '',
  lastName: '',
  company: '',
  role: '',
  department: '',
  city: '',
  office: '',
  phone: '',
  email: '',
  tcNo: '',
  birthDate: '',
  address: '',
  emergencyPhone: '',
  blood: '',
  iban: '',
  military: '',
  education: '',
  school: '',
  hireDate: '',
  leaveDate: '',
  status: 'Aktif',
  topSize: '',
  bottomSize: '',
  shoeSize: '',
  documents: { myk: '', src: '', psychotechnic: '', license: '' },
  vehicle: { brand: '', plate: '' },
}

const navItems = [
  ['Genel Bakış', LayoutDashboard],
  ['Personeller', Users],
  ['Belgeler', FileCheck2],
  ['Depolar', Package],
  ['Araç Filosu', Truck],
]

function displayName(person) {
  return `${person.firstName || ''} ${person.lastName || ''}`.trim()
}

function documentStatus(date) {
  if (!date) return 'Eksik'
  const diffDays = Math.ceil((new Date(date) - new Date()) / 86400000)
  if (diffDays < 0) return 'Süresi doldu'
  if (diffDays <= 60) return `${diffDays} gün kaldı`
  return 'Geçerli'
}

function App() {
  const [people, setPeople] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('personel360_people') || 'null') || initialPeople
    } catch {
      return initialPeople
    }
  })
  const [active, setActive] = useState('Genel Bakış')
  const [query, setQuery] = useState('')
  const [editor, setEditor] = useState(null)
  const [selected, setSelected] = useState(null)

  const warningCount = useMemo(() => {
    let total = 0
    people.forEach((person) => {
      Object.values(person.documents || {}).forEach((date) => {
        if (documentStatus(date) !== 'Geçerli') total += 1
      })
    })
    return total
  }, [people])

  const filteredPeople = useMemo(() => {
    return people.filter((person) => {
      const value = `${displayName(person)} ${person.company} ${person.role} ${person.city}`.toLocaleLowerCase('tr')
      return value.includes(query.toLocaleLowerCase('tr'))
    })
  }, [people, query])

  const savePerson = (person) => {
    const clean = { ...person, id: person.id || Date.now() }
    const next = person.id ? people.map((item) => (item.id === person.id ? clean : item)) : [clean, ...people]
    setPeople(next)
    localStorage.setItem('personel360_people', JSON.stringify(next))
    setEditor(null)
  }

  const deletePerson = (id) => {
    const person = people.find((item) => item.id === id)
    if (!person) return
    const hasVehicle = person.vehicle && person.vehicle.plate
    if (hasVehicle) {
      if (!window.confirm(`${displayName(person)} kişisine ait araç zimmeti var. Silmek istediğinize emin misiniz?`)) return
    }
    const next = people.filter((item) => item.id !== id)
    setPeople(next)
    localStorage.setItem('personel360_people', JSON.stringify(next))
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(people, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'personel360-yedek.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = function () {
      try {
        const data = JSON.parse(reader.result)
        if (Array.isArray(data)) {
          setPeople(data)
          localStorage.setItem('personel360_people', JSON.stringify(data))
        }
      } catch {
        alert('Geçersiz dosya formatı.')
      }
      event.target.value = ''
    }
    reader.readAsText(file)
  }

  const newPerson = () => setEditor({ ...blankPerson, documents: { ...blankPerson.documents }, vehicle: { ...blankPerson.vehicle } })

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
            {label === 'Belgeler' && <em>{warningCount}</em>}
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
            <button className="icon-button" onClick={exportData} title="Yedekle"><Bell size={18} /></button>
            <label className="icon-button import-button" title="Yedekten yükle">
              <input type="file" accept=".json" onChange={importData} />
              <Package size={18} />
            </label>
            <div className="avatar">FA</div>
            <span>Fatih Ayka</span>
            <ChevronDown size={15} />
          </div>
        </header>

        <section className="content-shell">
          {active === 'Genel Bakış' && (
            <div className="page-stack">
              <div className="page-heading">
                <div>
                  <small className="eyebrow">GENEL BAKIŞ</small>
                  <h1>Gösterge Paneli</h1>
                </div>
                <button className="primary" onClick={newPerson}><Plus size={18} /> Yeni Personel</button>
              </div>

              <div className="card-grid three">
                <StatCard title="Toplam Personel" value={people.length} icon={Users} tone="teal" />
                <StatCard title="Aktif Personel" value={people.filter((x) => x.status === 'Aktif').length} icon={UserRound} tone="green" />
                <StatCard title="Belge Uyarıları" value={warningCount} icon={AlertTriangle} tone="amber" />
                <StatCard title="Araç Sayısı" value={people.filter((x) => x.vehicle && x.vehicle.plate).length} icon={Truck} tone="blue" />
              </div>

              <div className="content-grid">
                <div className="panel">
                  <h3>Son belge uyarıları</h3>
                  <div className="stack-list">
                    {people.flatMap((person) =>
                      Object.entries(person.documents || {}).filter(([, value]) => documentStatus(value) !== 'Geçerli').map(([key, value]) => (
                        <div key={`${person.id}-${key}`} className="list-row">
                          <div>
                            <strong>{displayName(person)}</strong>
                            <small>{key === 'myk' ? 'MYK' : key === 'src' ? 'SRC' : key === 'psychotechnic' ? 'Psikoteknik' : 'Ehliyet'}</small>
                          </div>
                          <span className="badge warn">{documentStatus(value)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="panel">
                  <h3>İşlem hızlı erişim</h3>
                  <div className="stack-list">
                    <button className="mini-button" onClick={newPerson}><Plus size={16} /> Personel Ekle</button>
                    <button className="mini-button" onClick={() => setActive('Belgeler')}><CalendarDays size={16} /> Belgeleri Gör</button>
                    <button className="mini-button" onClick={() => setActive('Depolar')}><Package size={16} /> Depo İzleme</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {active === 'Personeller' && (
            <div className="page-stack">
              <div className="toolbar-row">
                <div className="search-box">
                  <Search size={16} />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ad, şirket, görev veya il ara..." />
                </div>
                <button className="primary" onClick={newPerson}><Plus size={18} /> Yeni Personel</button>
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
                    {filteredPeople.map((person) => {
                      const docs = Object.values(person.documents || {})
                      const validCount = docs.filter((date) => documentStatus(date) === 'Geçerli').length
                      return (
                        <tr key={person.id}>
                          <td>
                            <strong>{displayName(person)}</strong>
                            <small>{person.phone || 'Telefon yok'}</small>
                          </td>
                          <td>
                            <strong>{person.company || '-'}</strong>
                            <small>{person.department || person.role || '-'}</small>
                          </td>
                          <td>{person.city || '-'} / {person.office || '-'}</td>
                          <td>{validCount} / {docs.length}</td>
                          <td><span className={`status-badge ${person.status === 'Aktif' ? 'success' : 'warn'}`}>{person.status}</span></td>
                          <td className="action-col">
                            <button className="simple-button" onClick={() => setSelected(person)}>Detay</button>
                            <button className="simple-button" onClick={() => setEditor(person)}>Düzenle</button>
                            <button className="simple-button danger" onClick={() => deletePerson(person.id)}>Sil</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {active === 'Belgeler' && (
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
                        <td><strong>{displayName(person)}</strong><small>{person.company}</small></td>
                        <td>{documentStatus(person.documents?.myk)}</td>
                        <td>{documentStatus(person.documents?.src)}</td>
                        <td>{documentStatus(person.documents?.psychotechnic)}</td>
                        <td>{documentStatus(person.documents?.license)}</td>
                        <td><span className={`status-badge ${Object.values(person.documents || {}).some((date) => documentStatus(date) !== 'Geçerli') ? 'warn' : 'success'}`}>Takip</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {active === 'Depolar' && (
            <div className="page-stack">
              <div className="page-heading">
                <div>
                  <small className="eyebrow">DEPO</small>
                  <h1>Depo ve stok görünümü</h1>
                </div>
              </div>
              <div className="card-grid three">
                <StatCard title="Toplam Demirbaş" value={people.length + 12} icon={Package} tone="blue" />
                <StatCard title="Müsait Stok" value={18} icon={Package} tone="teal" />
                <StatCard title="Zimmetli" value={7} icon={Users} tone="green" />
              </div>
            </div>
          )}

          {active === 'Araç Filosu' && (
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
                        <td>{displayName(person)}</td>
                        <td>{person.vehicle.brand || '-'}</td>
                        <td>{person.vehicle.plate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>

      {editor && <PersonModal person={editor} onClose={() => setEditor(null)} onSave={savePerson} />}
      {selected && <PersonDetail person={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function StatCard({ title, value, icon: Icon, tone }) {
  return (
    <div className="stat-card">
      <div className={`icon-box ${tone}`}><Icon size={18} /></div>
      <div>
        <small>{title}</small>
        <strong>{value}</strong>
      </div>
    </div>
  )
}

function PersonModal({ person, onClose, onSave }) {
  const [tab, setTab] = useState('personal')
  const [form, setForm] = useState(person)
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const updateNested = (group, key, value) => setForm((current) => ({ ...current, [group]: { ...current[group], [key]: value } }))

  const tabs = [['personal', 'Kişisel'], ['career', 'Kariyer'], ['sizes', 'KKD'], ['documents', 'Belgeler'], ['vehicle', 'Araç']]

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={onClose}><X size={16} /></button>
        <div className="modal-header">
          <h2>{form.id ? 'Personel Kartı' : 'Yeni Personel'}</h2>
          <p>AyKa personel kart örneğine göre düzenlenir.</p>
        </div>
        <div className="tab-list">
          {tabs.map(([key, label]) => (
            <button key={key} className={tab === key ? 'tab active' : 'tab'} onClick={() => setTab(key)}>{label}</button>
          ))}
        </div>
        <div className="modal-body">
          {tab === 'personal' && (
            <div className="form-grid">
              <Field label="Ad" value={form.firstName} onChange={(event) => update('firstName', event.target.value)} />
              <Field label="Soyad" value={form.lastName} onChange={(event) => update('lastName', event.target.value)} />
              <Field label="Telefon" value={form.phone} onChange={(event) => update('phone', event.target.value)} />
              <Field label="E-posta" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} />
              <Field label="T.C. Kimlik" value={form.tcNo} onChange={(event) => update('tcNo', event.target.value.replace(/\D/g, '').slice(0, 11))} />
              <Field label="Doğum Tarihi" type="date" value={form.birthDate} onChange={(event) => update('birthDate', event.target.value)} />
              <Field label="Acil Durum Telefonu" value={form.emergencyPhone} onChange={(event) => update('emergencyPhone', event.target.value)} />
              <Field label="Kan Grubu" value={form.blood} options={['A Rh+', 'A Rh-', 'B Rh+', 'B Rh-', 'AB Rh+', 'AB Rh-', '0 Rh+', '0 Rh-']} onChange={(event) => update('blood', event.target.value)} />
              <div className="full-width">
                <Field label="İkametgah Adresi" value={form.address} onChange={(event) => update('address', event.target.value)} />
              </div>
            </div>
          )}

          {tab === 'career' && (
            <div className="form-grid">
              <Field label="Şirket" value={form.company} onChange={(event) => update('company', event.target.value)} />
              <Field label="Departman" value={form.department} onChange={(event) => update('department', event.target.value)} />
              <Field label="Görev / Unvan" value={form.role} onChange={(event) => update('role', event.target.value)} />
              <Field label="İl" value={form.city} onChange={(event) => update('city', event.target.value)} />
              <Field label="Ofis / Şantiye" value={form.office} onChange={(event) => update('office', event.target.value)} />
              <Field label="İşe Giriş Tarihi" type="date" value={form.hireDate} onChange={(event) => update('hireDate', event.target.value)} />
              <Field label="İşten Çıkış" type="date" value={form.leaveDate} onChange={(event) => update('leaveDate', event.target.value)} />
              <Field label="Durum" value={form.status} options={['Aktif', 'Ayrıldı']} onChange={(event) => update('status', event.target.value)} />
            </div>
          )}

          {tab === 'sizes' && (
            <div className="form-grid">
              <Field label="Ayakkabı Numarası" value={form.shoeSize} onChange={(event) => update('shoeSize', event.target.value)} />
              <Field label="Üst Beden" value={form.topSize} options={['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']} onChange={(event) => update('topSize', event.target.value)} />
              <Field label="Alt Beden" value={form.bottomSize} onChange={(event) => update('bottomSize', event.target.value)} />
            </div>
          )}

          {tab === 'documents' && (
            <div className="document-grid">
              <DocumentField label="MYK" value={form.documents.myk} onChange={(value) => updateNested('documents', 'myk', value)} />
              <DocumentField label="SRC" value={form.documents.src} onChange={(value) => updateNested('documents', 'src', value)} />
              <DocumentField label="Psikoteknik" value={form.documents.psychotechnic} onChange={(value) => updateNested('documents', 'psychotechnic', value)} />
              <DocumentField label="Ehliyet" value={form.documents.license} onChange={(value) => updateNested('documents', 'license', value)} />
            </div>
          )}

          {tab === 'vehicle' && (
            <div className="form-grid">
              <Field label="Araç Marka / Model" value={form.vehicle.brand} onChange={(event) => updateNested('vehicle', 'brand', event.target.value)} />
              <Field label="Araç Plakası" value={form.vehicle.plate} onChange={(event) => updateNested('vehicle', 'plate', event.target.value.toUpperCase())} />
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>Vazgeç</button>
          <button className="primary" onClick={() => onSave(form)} disabled={!form.firstName || !form.lastName}>Kaydet</button>
        </div>
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

function DocumentField({ label, value, onChange }) {
  return (
    <div className="doc-box">
      <strong>{label}</strong>
      <input type="date" value={value || ''} onChange={(event) => onChange(event.target.value)} />
      <small className={documentStatus(value) === 'Geçerli' ? 'success-text' : 'warning-text'}>{documentStatus(value)}</small>
    </div>
  )
}

function PersonDetail({ person, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal detail-modal" onClick={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={onClose}><X size={16} /></button>
        <div className="detail-head">
          <div className="big-avatar">{displayName(person).split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
          <div>
            <h3>{displayName(person)}</h3>
            <p>{person.role} · {person.company}</p>
          </div>
        </div>
        <div className="detail-grid">
          <div><small>Telefon</small><strong>{person.phone || '-'}</strong></div>
          <div><small>E-posta</small><strong>{person.email || '-'}</strong></div>
          <div><small>İl / Ofis</small><strong>{person.city || '-'} / {person.office || '-'}</strong></div>
          <div><small>KKD</small><strong>{person.topSize || '-'} / {person.bottomSize || '-'} / {person.shoeSize || '-'}</strong></div>
        </div>
        <div className="doc-detail-list">
          {Object.entries(person.documents || {}).map(([key, value]) => (
            <div className="doc-detail-item" key={key}>
              <span>{key === 'myk' ? 'MYK' : key === 'src' ? 'SRC' : key === 'psychotechnic' ? 'Psikoteknik' : 'Ehliyet'}</span>
              <strong>{documentStatus(value)}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)









































































































































































































































































































































