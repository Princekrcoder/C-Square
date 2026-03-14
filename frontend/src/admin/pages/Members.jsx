import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2, Plus, Eye, X, Users, Search, Ban } from 'lucide-react'

const MEMBER_STATUSES = ['Pending', 'Active', 'Alumni', 'Banned']
const TRACKS = ['All', 'Web Dev', 'DSA', 'AI/ML', 'DevOps', 'General']
const ROLES = ['All', 'Member', 'Core']
const STATUS_ALL = ['All', ...MEMBER_STATUSES]

const empty = { name: '', email: '', phone: '', track: 'General', role: 'Member', batch: '', github: '', linkedin: '', status: 'Pending' }

const StatusBadge = ({ s }) => {
    const m = { Pending: 'badge-yellow', Active: 'badge-green', Alumni: 'badge-blue', Banned: 'badge-red' }
    return <span className={`badge ${m[s] || 'badge-gray'}`}>{s}</span>
}
const TrackBadge = ({ t }) => {
    const m = { 'Web Dev': 'badge-cyan', 'DSA': 'badge-blue', 'AI/ML': 'badge-purple', 'DevOps': 'badge-orange', 'General': 'badge-gray' }
    return <span className={`badge ${m[t] || 'badge-gray'}`}>{t}</span>
}
const RoleBadge = ({ r }) => {
    const m = { Core: 'badge-green', Member: 'badge-blue' }
    return <span className={`badge ${m[r] || 'badge-gray'}`}>{r}</span>
}

const SAMPLE_MEMBERS = [
    { id: 1, name: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '9876543210', track: 'Web Dev', role: 'Core', batch: '2024', github: 'aarav-dev', linkedin: 'aaravsharma', status: 'Active', joinDate: '2024-08-15' },
    { id: 2, name: 'Priya Gupta', email: 'priya.g@example.com', phone: '9812345678', track: 'AI/ML', role: 'Core', batch: '2023', github: 'priya-ml', linkedin: 'priyagupta', status: 'Active', joinDate: '2023-08-10' },
    { id: 3, name: 'Rishabh Kumar', email: 'rishabh.k@example.com', phone: '9934567810', track: 'DSA', role: 'Member', batch: '2024', github: 'rishabh-cp', linkedin: 'rishabhkumar', status: 'Active', joinDate: '2024-09-01' },
    { id: 4, name: 'Sneha Verma', email: 'sneha.v@example.com', phone: '9811122334', track: 'DevOps', role: 'Member', batch: '2024', github: 'sneha-ops', linkedin: 'snehaverma', status: 'Pending', joinDate: '2024-11-15' },
    { id: 5, name: 'Arjun Patel', email: 'arjun.p@example.com', phone: '9871122334', track: 'Web Dev', role: 'Member', batch: '2022', github: 'arjun-web', linkedin: 'arjunpatel', status: 'Alumni', joinDate: '2022-08-20' },
    { id: 6, name: 'Meera Singh', email: 'meera.s@example.com', phone: '9844112233', track: 'AI/ML', role: 'Core', batch: '2023', github: 'meera-ai', linkedin: 'meerasingh', status: 'Active', joinDate: '2023-09-05' },
    { id: 7, name: 'Kartik Yadav', email: 'kartik.y@example.com', phone: '9856781234', track: 'DSA', role: 'Member', batch: '2025', github: 'kartik-dsa', linkedin: 'kartikyadav', status: 'Pending', joinDate: '2025-01-10' },
    { id: 8, name: 'Divya Nair', email: 'divya.n@example.com', phone: '9823344556', track: 'General', role: 'Member', batch: '2024', github: '', linkedin: 'divyanair', status: 'Active', joinDate: '2024-08-25' },
    { id: 9, name: 'Rohan Mehta', email: 'rohan.m@example.com', phone: '9867788990', track: 'Web Dev', role: 'Core', batch: '2023', github: 'rohan-dev', linkedin: 'rohanmehta', status: 'Active', joinDate: '2023-08-18' },
    { id: 10, name: 'Ananya Das', email: 'ananya.d@example.com', phone: '9890011223', track: 'AI/ML', role: 'Member', batch: '2024', github: 'ananya-ml', linkedin: 'ananyadAs', status: 'Active', joinDate: '2024-10-01' },
    { id: 11, name: 'Vikram Rao', email: 'vikram.r@example.com', phone: '9811001100', track: 'DevOps', role: 'Member', batch: '2022', github: 'vikram-ops', linkedin: 'vikramrao', status: 'Alumni', joinDate: '2022-09-12' },
    { id: 12, name: 'Pooja Jaiswal', email: 'pooja.j@example.com', phone: '9823112233', track: 'Web Dev', role: 'Member', batch: '2025', github: '', linkedin: '', status: 'Pending', joinDate: '2025-02-01' },
]

const Clients = () => {
    const navigate = useNavigate()
    const [clients, setClients] = useState(SAMPLE_MEMBERS)
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('All')
    const [trackFilter, setTrackFilter] = useState('All')
    const [roleFilter, setRoleFilter] = useState('All')
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(empty)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchClients()
    }, [])

    const fetchClients = async () => {
        setLoading(false)
    }

    const openAdd = () => { setEditing(null); setForm(empty); setModal(true) }
    const openEdit = (c) => {
        setEditing(c.id)
        setForm({ 
            name: c.name, 
            email: c.email, 
            phone: c.phone || '', 
            track: c.track || 'General', 
            role: c.role || 'Member', 
            batch: c.batch || '', 
            github: c.github || '', 
            linkedin: c.linkedin || '', 
            status: c.status || 'Pending'
        })
        setModal(true)
    }
    
    const save = async () => {
        if (!form.name.trim() || !form.email.trim()) return
        
        try {
            setSaving(true)
            const clientData = {
                ...form
            }
            
            if (editing) {
                await clientsAPI.update(editing, clientData)
            } else {
                await clientsAPI.create(clientData)
            }
            
            await fetchClients()
            setModal(false)
        } catch (error) {
            console.error('Failed to save client:', error)
            alert(error.message || 'Failed to save client')
        } finally {
            setSaving(false)
        }
    }
    
    const disable = async (id) => {
        if (confirm('Disable this client?')) {
            try {
                await clientsAPI.update(id, { status: 'Banned' })
                await fetchClients()
            } catch (error) {
                console.error('Failed to disable client:', error)
            }
        }
    }

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', color: 'var(--admin-muted)' }}>Loading clients...</div>
    }

    const filtered = clients.filter(c => {
        const mS = statusFilter === 'All' || c.status === statusFilter
        const mT = trackFilter === 'All' || c.track === trackFilter
        const mP = roleFilter === 'All' || c.role === roleFilter
        const mQ = c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.batch || '').toLowerCase().includes(search.toLowerCase())
        return mS && mT && mP && mQ
    })

    return (
        <>
            <div className="admin-page-header">
                <div>
                    <h2>Members Directory</h2>
                    <p>{clients.length} members · {clients.filter(c => c.status === 'Active').length} active</p>
                </div>
                <button className="btn-primary" onClick={openAdd}><Plus size={14} /> Add Member</button>
            </div>

            {/* Filters */}
            <div className="admin-filter-bar" style={{ flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Search size={14} style={{ position: 'absolute', left: 10, color: 'var(--admin-muted)' }} />
                    <input style={{ background: 'var(--admin-surface2)', border: '1px solid var(--admin-border)', borderRadius: 10, padding: '0.45rem 0.9rem 0.45rem 2rem', color: 'var(--admin-text)', fontFamily: 'Outfit,sans-serif', fontSize: '0.82rem', outline: 'none', width: 200 }}
                        placeholder="Search clients…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                <span style={{ color: 'var(--admin-muted)', fontSize: '0.75rem', fontWeight: 600 }}>Status:</span>
                {STATUS_ALL.map(s => <button key={s} className={`filter-tab ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>{s}</button>)}

                <span style={{ color: 'var(--admin-muted)', fontSize: '0.75rem', fontWeight: 600, marginLeft: 8 }}>Track:</span>
                {TRACKS.map(t => <button key={t} className={`filter-tab ${trackFilter === t ? 'active' : ''}`} onClick={() => setTrackFilter(t)}>{t}</button>)}

                <span style={{ color: 'var(--admin-muted)', fontSize: '0.75rem', fontWeight: 600, marginLeft: 8 }}>Role:</span>
                {ROLES.map(p => <button key={p} className={`filter-tab ${roleFilter === p ? 'active' : ''}`} onClick={() => setRoleFilter(p)}>{p}</button>)}
            </div>

            {/* Status stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 16 }}>
                {MEMBER_STATUSES.map(s => {
                    const count = clients.filter(c => c.status === s).length
                    const colors = { Pending: '#eab308', Active: '#22c55e', Alumni: '#6366f1', Banned: '#ef4444' }
                    return (
                        <div key={s} className="admin-stat-card" style={{ padding: '0.8rem 1rem', cursor: 'pointer', borderColor: statusFilter === s ? colors[s] : undefined }}
                            onClick={() => setStatusFilter(statusFilter === s ? 'All' : s)}>
                            <div>
                                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: colors[s] }}>{count}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--admin-muted)', fontWeight: 600 }}>{s}</div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Table */}
            <div className="admin-card">
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Member</th>
                                <th>Batch</th>
                                <th>Status</th>
                                <th>Track</th>
                                <th>Role</th>
                                <th>Events Attended</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && <tr><td colSpan={9}><div className="admin-empty"><Users size={40} strokeWidth={1.5} color="var(--admin-muted)" style={{ marginBottom: 10 }} /><p>No members found</p></div></td></tr>}
                            {filtered.map(c => (
                                <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/members/${c.id}`)}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div className="team-avatar">{c.name.slice(0, 2).toUpperCase()}</div>
                                            <div>
                                                <strong>{c.name}</strong>
                                                <div style={{ fontSize: '0.72rem', color: 'var(--admin-muted)' }}>{c.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '0.8rem', color: 'var(--admin-muted2)' }}>{c.batch || '—'}</td>
                                    <td><StatusBadge s={c.status} /></td>
                                    <td><TrackBadge t={c.track || 'General'} /></td>
                                    <td><RoleBadge r={c.role || 'Member'} /></td>
                                    <td><strong>{c.eventsAttended || 0}</strong></td>
                                    <td style={{ color: 'var(--admin-muted)', fontSize: '0.78rem' }}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                                    <td onClick={e => e.stopPropagation()}>
                                        <div className="action-btns">
                                            <button className="btn-icon" onClick={() => navigate(`/admin/members/${c.id}`)} title="View Profile"><Eye size={14} /></button>
                                            <button className="btn-icon" onClick={() => openEdit(c)} title="Edit"><Pencil size={14} /></button>
                                            <button className="btn-icon danger" onClick={() => disable(c.id)} title="Ban"><Ban size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {modal && (
                <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
                    <div className="admin-modal" style={{ maxWidth: 560 }}>
                        <div className="admin-modal-header">
                            <h3>{editing ? 'Edit Member' : 'Add New Member'}</h3>
                            <button className="btn-icon" onClick={() => setModal(false)}><X size={16} /></button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="admin-form-grid">
                                <div className="admin-form-group full"><label>Full Name *</label><input placeholder="Member name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                                <div className="admin-form-group"><label>Email *</label><input type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                                <div className="admin-form-group"><label>Phone</label><input placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                                <div className="admin-form-group"><label>Batch (Year of Graduation)</label><input placeholder="e.g. 2027" value={form.batch} onChange={e => setForm({ ...form, batch: e.target.value })} /></div>
                                <div className="admin-form-group"><label>Team / Track</label>
                                    <select value={form.track} onChange={e => setForm({ ...form, track: e.target.value })}>
                                        {TRACKS.filter(t => t !== 'All').map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="admin-form-group"><label>Role</label>
                                    <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                                        {ROLES.filter(r => r !== 'All').map(r => <option key={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div className="admin-form-group"><label>Status</label>
                                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                        {MEMBER_STATUSES.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="admin-form-group full"><label>GitHub URL</label><input placeholder="https://github.com/..." value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} /></div>
                                <div className="admin-form-group full"><label>LinkedIn URL</label><input placeholder="https://linkedin.com/in/..." value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} /></div>
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={save} disabled={saving}>{editing ? 'Save Changes' : 'Add Member'}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Clients
