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

const Team = ({ searchTerm = '' }) => {
    const [team, setTeam] = useState([])
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({ name: '', role: 'Tech Lead', email: '', phone: '' })
    const [taskForm, setTaskForm] = useState({ title: '', assignee: '', priority: 'Medium', due: '' })
    const [tab, setTab] = useState('team')
    const [saving, setSaving] = useState(false)
    const [taskModal, setTaskModal] = useState(false)

    useEffect(() => {
        fetchTeam()
    }, [])

    const fetchTeam = async () => {
        setLoading(true)
        try {
            const [teamRes, taskRes] = await Promise.all([
                fetch('http://localhost:5000/api/team'),
                fetch('http://localhost:5000/api/tasks')
            ])
            if (teamRes.ok) setTeam(await teamRes.json())
            if (taskRes.ok) setTasks(await taskRes.json())
        } catch (error) {
            console.error('Failed to fetch team data', error)
        } finally {
            setLoading(false)
        }
    }

    const openAdd = () => { setEditing(null); setForm({ name: '', role: 'Tech Lead', email: '', phone: '' }); setModal(true) }
    const openAddTask = () => { setEditing(null); setTaskForm({ title: '', assignee: '', priority: 'Medium', due: '' }); setTaskModal(true) }
    
    const save = async () => {
        if (!form.name.trim()) return
        try {
            setSaving(true)
            const token = localStorage.getItem('token')
            const dataToSave = { ...form }
            
            const url = editing ? `http://localhost:5000/api/team/${editing}` : 'http://localhost:5000/api/team'
            const method = editing ? 'PUT' : 'POST'
            
            const res = await fetch(url, {
                method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(dataToSave)
            })
            if (res.ok) await fetchTeam()
            setModal(false)
        } catch (e) {
            console.error(e)
        } finally {
            setSaving(false)
        }
    }

    const saveTask = async () => {
        if (!taskForm.title.trim()) return
        try {
            setSaving(true)
            const token = localStorage.getItem('token')
            const res = await fetch('http://localhost:5000/api/tasks', {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(taskForm)
            })
            if (res.ok) await fetchTeam()
            setTaskModal(false)
        } catch (e) { console.error(e) } finally { setSaving(false) }
    }

    const remove = async (id) => { 
        if (confirm('Remove team member?')) {
            try {
                const token = localStorage.getItem('token')
                await fetch(`http://localhost:5000/api/team/${id}`, {
                    method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
                })
                await fetchTeam()
            } catch (e) { console.error(e) }
        }
    }
    
    const moveTask = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token')
            setTasks(ts => ts.map(t => t.id === id ? { ...t, status: newStatus } : t))
            
            await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus })
            })
        } catch (e) { console.error(e); await fetchTeam() }
    }

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
                    {tab === 'tasks' && <button className="btn-primary" onClick={openAddTask}><Plus size={14} /> Add Task</button>}
                </div>
            </div>

            {/* Team table */}
            {tab === 'team' && (
                <div className="admin-card">
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead><tr><th>Member</th><th>Role</th><th>Email</th><th>Phone</th><th>Tasks</th><th>Joined</th><th>Actions</th></tr></thead>
                            <tbody>
                                {team.filter(m => !searchTerm || m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.role.toLowerCase().includes(searchTerm.toLowerCase())).map(m => (
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
                        const colTasks = tasks.filter(t => t.status === col.key && (!searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase()) || (t.assignee || '').toLowerCase().includes(searchTerm.toLowerCase())))
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
            {/* Task Modal */}
            {taskModal && (
                <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setTaskModal(false)}>
                    <div className="admin-modal">
                        <div className="admin-modal-header"><h3>Add Task</h3><button className="btn-icon" onClick={() => setTaskModal(false)}><X size={16} /></button></div>
                        <div className="admin-modal-body">
                            <div className="admin-form-grid">
                                <div className="admin-form-group full"><label>Task Title *</label><input placeholder="To do..." value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} /></div>
                                <div className="admin-form-group"><label>Assignee</label><input placeholder="Name" value={taskForm.assignee} onChange={e => setTaskForm({ ...taskForm, assignee: e.target.value })} /></div>
                                <div className="admin-form-group"><label>Priority</label><select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}><option>High</option><option>Medium</option><option>Low</option></select></div>
                                <div className="admin-form-group full"><label>Due Date</label><input type="date" value={taskForm.due} onChange={e => setTaskForm({ ...taskForm, due: e.target.value })} /></div>
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="btn-ghost" onClick={() => setTaskModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={saveTask}>Add Task</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Team
