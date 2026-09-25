import React, { useMemo, useState } from 'react'
import { Package, Plus, Search, X } from 'lucide-react'

const emptyItem = {
  name: '',
  category: 'KKD',
  unit: 'Adet',
  stock: 0,
  minimumStock: 0,
  location: '',
  status: 'Aktif',
}

const categories = ['KKD', 'Elektronik', 'Ofis', 'Sarf Malzeme', 'Araç Ekipmanı', 'Diğer']

export function InventoryModule() {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('personel360_inventory') || 'null') || [
        { id: 1, name: 'Baret', category: 'KKD', unit: 'Adet', stock: 42, minimumStock: 10, location: 'Merkez Depo', status: 'Aktif' },
        { id: 2, name: 'Reflektörlü Yelek', category: 'KKD', unit: 'Adet', stock: 8, minimumStock: 15, location: 'Merkez Depo', status: 'Aktif' },
        { id: 3, name: 'Tablet', category: 'Elektronik', unit: 'Adet', stock: 12, minimumStock: 3, location: 'Ankara Depo', status: 'Aktif' },
      ]
    } catch {
      return []
    }
  })
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [editor, setEditor] = useState(null)

  const filtered = useMemo(() => items.filter((item) => {
    const matchesQuery = `${item.name} ${item.category} ${item.location}`.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr'))
    return matchesQuery && (!category || item.category === category)
  }), [items, query, category])

  const persist = (next) => {
    setItems(next)
    localStorage.setItem('personel360_inventory', JSON.stringify(next))
  }

  const save = (item) => {
    const clean = { ...item, stock: Number(item.stock) || 0, minimumStock: Number(item.minimumStock) || 0, id: item.id || Date.now() }
    persist(item.id ? items.map((current) => current.id === item.id ? clean : current) : [clean, ...items])
    setEditor(null)
  }

  const remove = (id) => {
    if (window.confirm('Bu stok kalemi silinsin mi?')) persist(items.filter((item) => item.id !== id))
  }

  const lowStock = items.filter((item) => item.stock <= item.minimumStock).length
  const totalStock = items.reduce((sum, item) => sum + Number(item.stock || 0), 0)

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <small className="eyebrow">DEPO VE ENVANTER</small>
          <h1>Depo ve envanter yönetimi</h1>
        </div>
        <button className="primary" onClick={() => setEditor({ ...emptyItem })}><Plus size={18} /> Yeni Stok Kalemi</button>
      </div>

      <div className="card-grid">
        <div className="stat-card"><div className="icon-box blue"><Package size={18} /></div><div><small>Stok Kalemi</small><strong>{items.length}</strong></div></div>
        <div className="stat-card"><div className="icon-box teal"><Package size={18} /></div><div><small>Toplam Miktar</small><strong>{totalStock}</strong></div></div>
        <div className="stat-card"><div className="icon-box amber"><Package size={18} /></div><div><small>Kritik Stok</small><strong>{lowStock}</strong></div></div>
      </div>

      <div className="toolbar-row">
        <div className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ürün, kategori veya depo ara..." /></div>
        <select className="filter-select" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">Tüm kategoriler</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
      </div>

      <div className="panel table-panel">
        <table>
          <thead><tr><th>Ürün</th><th>Kategori</th><th>Depo</th><th>Miktar</th><th>Min. Stok</th><th>Durum</th><th>İşlem</th></tr></thead>
          <tbody>{filtered.map((item) => {
            const critical = Number(item.stock) <= Number(item.minimumStock)
            return <tr key={item.id}>
              <td><strong>{item.name}</strong><small>{item.unit}</small></td>
              <td>{item.category}</td><td>{item.location || '-'}</td><td>{item.stock}</td><td>{item.minimumStock}</td>
              <td><span className={`status-badge ${critical ? 'warn' : 'success'}`}>{critical ? 'Kritik' : 'Yeterli'}</span></td>
              <td className="action-col"><button className="simple-button" onClick={() => setEditor(item)}>Düzenle</button><button className="simple-button danger" onClick={() => remove(item.id)}>Sil</button></td>
            </tr>
          })}</tbody>
        </table>
      </div>

      {editor && <InventoryModal value={editor} close={() => setEditor(null)} save={save} />}
    </div>
  )
}

function InventoryModal({ value, close, save }) {
  const [form, setForm] = useState(value)
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  return <div className="overlay" onClick={close}><div className="modal small-modal" onClick={(event) => event.stopPropagation()}>
    <button className="close-button" onClick={close}><X size={16} /></button>
    <div className="modal-header"><h2>{form.id ? 'Stok Kalemini Düzenle' : 'Yeni Stok Kalemi'}</h2><p>Depo ve envanter bilgilerini kaydedin.</p></div>
    <div className="modal-body"><div className="form-grid single">
      <label className="field"><span>Ürün adı</span><input value={form.name} onChange={(event) => update('name', event.target.value)} /></label>
      <label className="field"><span>Kategori</span><select value={form.category} onChange={(event) => update('category', event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className="field"><span>Birim</span><select value={form.unit} onChange={(event) => update('unit', event.target.value)}><option>Adet</option><option>Kutu</option><option>Set</option><option>Litre</option></select></label>
      <label className="field"><span>Mevcut stok</span><input type="number" min="0" value={form.stock} onChange={(event) => update('stock', event.target.value)} /></label>
      <label className="field"><span>Minimum stok</span><input type="number" min="0" value={form.minimumStock} onChange={(event) => update('minimumStock', event.target.value)} /></label>
      <label className="field"><span>Depo konumu</span><input value={form.location} onChange={(event) => update('location', event.target.value)} placeholder="Merkez Depo" /></label>
    </div></div>
    <div className="modal-actions"><button className="cancel-button" onClick={close}>Vazgeç</button><button className="primary" disabled={!form.name} onClick={() => save(form)}>Kaydet</button></div>
  </div></div>
}
