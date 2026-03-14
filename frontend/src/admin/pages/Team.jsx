import { useState, useEffect } from 'react'
import { Pencil, Trash2, Plus, ArrowRight, CheckCircle, Clock, Circle, X } from 'lucide-react'

const RoleBadge = ({ r }) => {
    const m = { 'Club Lead': 'badge-red', 'Tech Lead': 'badge-blue', 'Design Lead': 'badge-purple', 'Event Coordinator': 'badge-cyan', 'PR/Marketing': 'badge-green' }
    return <span className={`badge ${m[r] || 'badge-gray'}`}>{r}</span>
}

const TASK_COLS = [
    { key: 'Todo', label: 'To Do', Icon: Circle, iconClass: 'badge-gray' },
    { key: 'In Progress', label: 'In Progress', Icon: Clock, iconClass: 'badge-yellow' },
    { key: 'Done', label: 'Done', Icon: CheckCircle, iconClass: 'badge-green' },
]

const SAMPLE_TEAM = [
    { id: 1, name: 'Aarav Sharma', role: 'Club Lead', email: 'aarav@csquare.club', phone: '9876543210', status: 'Active' },
    { id: 2, name: 'Rohan Mehta', role: 'Tech Lead', email: 'rohan@csquare.club', phone: '9867788990', status: 'Active' },
    { id: 3, name: 'Priya Gupta', role: 'Tech Lead', email: 'priya@csquare.club', phone: '9812345678', status: 'Active' },
    { id: 4, name: 'Meera Singh', role: 'Design Lead', email: 'meera@csquare.club', phone: '9844112233', status: 'Active' },
    { id: 5, name: 'Karan Joshi', role: 'Event Coordinator', email: 'karan@csquare.club', phone: '9855566778', status: 'Active' },
    { id: 6, name: 'Neha Bhat', role: 'PR/Marketing', email: 'neha@csquare.club', phone: '9866677889', status: 'Active' },
]

const SAMPLE_TASKS = [
    { id: 1, title: 'Finalize March Workshop agenda', assignee: 'Karan Joshi', priority: 'High', status: 'In Progress', due: '2026-03-18' },
    { id: 2, title: 'Post recruitment banner on Instagram', assignee: 'Neha Bhat', priority: 'Medium', status: 'Todo', due: '2026-03-16' },
    { id: 3, title: 'Update website with new events', assignee: 'Rohan Mehta', priority: 'High', status: 'In Progress', due: '2026-03-15' },
    { id: 4, title: 'Design event poster for DevSprint', assignee: 'Meera Singh', priority: 'High', status: 'Todo', due: '2026-03-20' },
    { id: 5, title: 'Review new member applications', assignee: 'Aarav Sharma', priority: 'Medium', status: 'Done', due: '2026-03-10' },
    { id: 6, title: 'Setup Codeforces contest round', assignee: 'Priya Gupta', priority: 'High', status: 'Done', due: '2026-03-12' },
    { id: 7, title: 'Create onboarding docs for new members', assignee: 'Neha Bhat', priority: 'Low', status: 'Todo', due: '2026-03-30' },
    { id: 8, title: 'Coordinate with college for Auditorium booking', assignee: 'Karan Joshi', priority: 'Medium', status: 'In Progress', due: '2026-03-19' },
]

const Team = () => {
    const [team, setTeam] = useState(SAMPLE_TEAM)
    const [tasks, setTasks] = useState(SAMPLE_TASKS)
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({ name: '', role: 'Tech Lead', email: '', phone: '' })
    const [tab, setTab] = useState('team')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchTeam()
    }, [])

    const fetchTeam = async () => {
        setLoading(false)
    }

    const openAdd = () => { setEditing(null); setForm({ name: '', role: 'Tech Lead', email: '', phone: '' }); setModal(true) }
    const openEdit = (m) => { 
        setEditing(m.id)
        setForm({ 
            name: m.name, 
            role: m.role, 
            email: m.email, 
            phone: m.phone || '' 
        })
        setModal(true) 
    }
    const save = () => {
        if (!form.name.trim()) return
        setSaving(true)
        if (editing) {
            setTeam(prev => prev.map(t => t.id === editing ? { ...t, ...form } : t))
        } else {
            setTeam(prev => [{ id: Date.now(), ...form, status: 'Active' }, ...prev])
        }
        setModal(false)
        setSaving(false)
    }
    const remove = async (id) => { 
        if (confirm('Remove team member?')) {
            setTeam(prev => prev.filter(t => t.id !== id))
        }
    }
    const moveTask = (id, newStatus) => setTasks(ts => ts.map(t => t.id === id ? { ...t, status: newStatus } : t))

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', color: 'var(--admin-muted)' }}>Loading team...</div>
    }

    return (
        <>
            <div className="admin-page-header">
                <div><h2>Core Committee & Tasks</h2><p>{team.length} members · {tasks.length} tasks</p></div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ display: 'flex', background: 'var(--admin-surface2)', border: '1px solid var(--admin-border)', borderRadius: 10, padding: 3, gap: 2 }}>
                        {['team', 'tasks'].map(t => (
                            <button key={t} onClick={() => setTab(t)} style={{
                                padding: '5px 14px', borderRadius: 8, border: 'none',
                                fontFamily: 'Outfit,sans-serif', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                                background: tab === t ? 'var(--admin-primary)' : 'none',
                                color: tab === t ? '#fff' : 'var(--admin-muted)', transition: 'all 0.18s'
                            }}>{t === 'team' ? 'Team' : 'Tasks'}</button>
                        ))}
                    </div>
                    {tab === 'team' && <button className="btn-primary" onClick={openAdd}><Plus size={14} /> Add Member</button>}
                </div>
            </div>

            {/* Team table */}
            {tab === 'team' && (
                <div className="admin-card">
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead><tr><th>Member</th><th>Role</th><th>Email</th><th>Phone</th><th>Tasks</th><th>Joined</th><th>Actions</th></tr></thead>
                            <tbody>
                                {team.map(m => (
                                    <tr key={m.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div className="team-avatar">{m.name.slice(0, 2).toUpperCase()}</div>
                                                <strong style={{ fontSize: '0.875rem' }}>{m.name}</strong>
                                            </div>
                                        </td>
                                        <td><RoleBadge r={m.role} /></td>
                                        <td style={{ color: 'var(--admin-muted)', fontSize: '0.82rem' }}>{m.email}</td>
                                        <td style={{ color: 'var(--admin-muted)', fontSize: '0.82rem' }}>{m.phone || '—'}</td>
                                        <td><strong>{m.taskCount || 0}</strong></td>
                                        <td style={{ color: 'var(--admin-muted)', fontSize: '0.78rem' }}>{m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="btn-icon" onClick={() => openEdit(m)} title="Edit"><Pencil size={14} /></button>
                                                <button className="btn-icon danger" onClick={() => remove(m.id)} title="Remove"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Kanban task board */}
            {tab === 'tasks' && (
                <div className="kanban-board">
                    {TASK_COLS.map(col => {
                        const colTasks = tasks.filter(t => t.status === col.key)
                        return (
                            <div className="kanban-col" key={col.key}>
                                <div className="kanban-col-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                        <col.Icon size={15} strokeWidth={1.8} />
                                        <span>{col.label}</span>
                                    </div>
                                    <span className={`badge ${col.iconClass}`}>{colTasks.length}</span>
                                </div>
                                <div className="kanban-col-body">
                                    {colTasks.length === 0 && <div style={{ textAlign: 'center', color: 'var(--admin-muted)', fontSize: '0.8rem', padding: '1.5rem 0.5rem' }}>No tasks</div>}
                                    {colTasks.map(t => (
                                        <div className="kanban-card" key={t.id}>
                                            <div className="kanban-card-title">{t.title}</div>
                                            <div className="kanban-card-meta">
                                                <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>{t.assignee}</span>
                                                <span>{t.priority} priority</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                                                {TASK_COLS.filter(c => c.key !== col.key).map(c => (
                                                    <button key={c.key} className="btn-ghost" style={{ fontSize: '0.7rem', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 3 }}
                                                        onClick={() => moveTask(t.id, c.key)}>
                                                        <ArrowRight size={10} /> {c.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Modal */}
            {modal && (
                <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
                    <div className="admin-modal">
                        <div className="admin-modal-header"><h3>{editing ? 'Edit Member' : 'Add Member'}</h3><button className="btn-icon" onClick={() => setModal(false)}><X size={16} /></button></div>
                        <div className="admin-modal-body">
                            <div className="admin-form-grid">
                                <div className="admin-form-group full"><label>Name *</label><input placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                                <div className="admin-form-group"><label>Role</label><select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option>Club Lead</option><option>Tech Lead</option><option>Design Lead</option><option>Event Coordinator</option><option>PR/Marketing</option></select></div>
                                <div className="admin-form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                                <div className="admin-form-group full"><label>Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={save}>{editing ? 'Save' : 'Add'}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Team
