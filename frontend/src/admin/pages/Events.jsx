import { useState, useEffect } from 'react'
import { Pencil, Trash2, Plus, CheckCircle, FileText, X, Inbox, UserPlus, Eye, ThumbsUp } from 'lucide-react'

const STATUSES = ['All', 'Upcoming', 'Ongoing', 'Completed']
const TYPES = ['All', 'Workshop', 'Hackathon', 'Contest', 'Meetup']
const emptyForm = { title: '', type: 'Workshop', status: 'Upcoming', date: '', location: '', description: '' }

const EventBadge = ({ status }) => {
    const map = { 'Upcoming': 'badge-yellow', 'Ongoing': 'badge-cyan', 'Completed': 'badge-green' }
    return <span className={`badge ${map[status] || 'badge-gray'} `}>{status}</span>
}

const SAMPLE_EVENTS = [
    { id: 1, title: 'Web Dev Bootcamp', type: 'Workshop', status: 'Upcoming', date: '2026-03-20', location: 'CS Lab 301', description: 'Hands-on bootcamp covering HTML, CSS, React from scratch.', registered: 45 },
    { id: 2, title: 'Winter of Code 2025', type: 'Hackathon', status: 'Completed', date: '2025-12-10', location: 'Main Auditorium', description: 'Month-long open-source coding challenge for all members.', registered: 120 },
    { id: 3, title: 'CP Contest — March', type: 'Contest', status: 'Upcoming', date: '2026-03-25', location: 'Online (Codeforces)', description: 'Monthly competitive programming contest on Codeforces.', registered: 68 },
    { id: 4, title: 'AI/ML Study Group', type: 'Meetup', status: 'Ongoing', date: '2026-03-14', location: 'Room 204', description: 'Weekly discussions on ML concepts, papers, and projects.', registered: 22 },
    { id: 5, title: 'Git & Open Source Intro', type: 'Workshop', status: 'Completed', date: '2026-01-15', location: 'CS Lab 301', description: 'Introduction to Git workflow and contributing to open-source projects.', registered: 55 },
    { id: 6, title: 'DevSprint Spring 2026', type: 'Hackathon', status: 'Upcoming', date: '2026-04-12', location: 'Main Auditorium', description: '24-hour hackathon to build prototypes on real-world problems.', registered: 90 },
    { id: 7, title: 'DSA Deep Dive', type: 'Workshop', status: 'Completed', date: '2026-02-08', location: 'CS Lab 201', description: 'Advanced graphs, trees, and DP problem-solving session.', registered: 38 },
    { id: 8, title: 'Tech Talk: Web3 & Blockchain', type: 'Meetup', status: 'Upcoming', date: '2026-03-28', location: 'Seminar Hall', description: 'Guest speaker session on Web3 fundamentals and real-world use cases.', registered: 30 },
]

const AdminEvents = ({ searchTerm = '' }) => {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('All')
    const [typeFilter, setTypeFilter] = useState('All')
    const [modal, setModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [noteModal, setNoteModal] = useState(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        setLoading(true)
        try {
            const res = await fetch('http://localhost:5000/api/events')
            if (res.ok) {
                const data = await res.json()
                setEvents(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const openAdd = () => { setEditing(null); setForm({ ...emptyForm }); setModal(true) }
    const openEdit = (e) => { 
        setEditing(e.id)
        setForm({ 
            title: e.title || '', 
            type: e.type || e.mode || 'Workshop', 
            status: e.status || 'Upcoming', 
            date: e.date || '', 
            location: e.location || '', 
            description: e.description || e.notes || '' 
        })
        setModal(true) 
    }
    const save = async () => {
        if (!form.title.trim()) return
        
        setSaving(true)
        const token = localStorage.getItem('token')
        
        try {
            if (editing) {
                const res = await fetch(`http://localhost:5000/api/events/${editing}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(form)
                })
                if (res.ok) {
                    const updated = await res.json()
                    setEvents(prev => prev.map(e => e.id === editing ? updated : e))
                }
            } else {
                const res = await fetch('http://localhost:5000/api/events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(form)
                })
                if (res.ok) {
                    const created = await res.json()
                    setEvents(prev => [created, ...prev])
                }
            }
            setModal(false)
        } catch (err) {
            console.error(err)
            alert('Failed to save event')
        } finally {
            setSaving(false)
        }
    }
    
    const remove = async (id) => { 
        if (window.confirm('Delete event?')) {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch(`http://localhost:5000/api/events/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) {
                    setEvents(prev => prev.filter(e => e.id !== id))
                }
            } catch (err) {
                console.error(err)
            }
        }
    }

    const toggleStar = async (e) => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`http://localhost:5000/api/events/${e.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ is_starred: !e.is_starred })
            })
            if (res.ok) {
                const updated = await res.json()
                setEvents(prev => prev.map(item => item.id === e.id ? updated : item))
            }
        } catch (err) {
            console.error(err)
        }
    }
    
    const convert = async (e) => {
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`http://localhost:5000/api/events/${e.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ...e, status: 'Completed' })
            })
            if (res.ok) {
                const updated = await res.json()
                setEvents(prev => prev.map(item => item.id === e.id ? updated : item))
            }
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', color: 'var(--admin-muted)' }}>Loading events...</div>
    }

    const filtered = events.filter(e => {
        const mSt = filter === 'All' || e.status === filter
        const mT = typeFilter === 'All' || (e.type || e.source) === typeFilter
        const mQ = !searchTerm || (e.title || e.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (e.location || '').toLowerCase().includes(searchTerm.toLowerCase())
        return mSt && mT && mQ
    })

    const counts = {
        upcoming: events.filter(e => e.status === 'Upcoming').length,
        ongoing: events.filter(e => e.status === 'Ongoing').length,
        completed: events.filter(e => e.status === 'Completed').length
    }

    return (
        <>
            <div className="admin-page-header">
                <div><h2>Club Events</h2><p>{events.length} planned activities</p></div>
                <button className="btn-primary" onClick={openAdd}><Plus size={14} /> Schedule Event</button>
            </div>

            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                {[
                    ['Upcoming', counts.upcoming, UserPlus, '#eab308', 'rgba(234,179,8,0.12)'],
                    ['Ongoing', counts.ongoing, Eye, '#06b6d4', 'rgba(6,182,212,0.12)'],
                    ['Completed', counts.completed, ThumbsUp, '#22c55e', 'rgba(34,197,94,0.12)']
                ].map(([label, count, Icon, iconColor, iconBg]) => (
                    <div className="admin-stat-card" key={label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '1rem 1.25rem' }}>
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon size={20} color={iconColor} strokeWidth={1.8} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--admin-text)', lineHeight: 1 }}>{count}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--admin-muted)', fontWeight: 500, marginTop: 4 }}>{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="admin-filter-bar">
                {STATUSES.map(s => <button key={s} className={`filter-tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s}</button>)}
                <span style={{ color: 'var(--admin-muted)', fontSize: '0.8rem', marginLeft: 4 }}>Type:</span>
                {TYPES.map(s => <button key={s} className={`filter-tab ${typeFilter === s ? 'active' : ''}`} onClick={() => setTypeFilter(s)}>{s}</button>)}
            </div>

            <div className="admin-card">
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead><tr><th>Event Title</th><th>Type</th><th>Location</th><th>Status</th><th>Starred</th><th>Description</th><th>Date</th><th>Actions</th></tr></thead>
                        <tbody>
                            {filtered.length === 0 && <tr><td colSpan={7}><div className="admin-empty"><Inbox size={40} strokeWidth={1.5} color="var(--admin-muted)" style={{ marginBottom: 10 }} /><p>No events found</p></div></td></tr>}
                            {filtered.map(e => (
                                <tr key={e.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div className="team-avatar" style={{ width: 30, height: 30, fontSize: '0.7rem' }}>{(e.title || e.name || 'EV').slice(0, 2).toUpperCase()}</div>
                                            <div><strong>{e.title || e.name}</strong></div>
                                        </div>
                                    </td>
                                    <td><span className="badge badge-blue">{e.type || e.source}</span></td>
                                    <td style={{ fontSize: '0.8rem', color: 'var(--admin-muted)' }}>{e.location || 'TBA'}</td>
                                    <td><EventBadge status={e.status} /></td>
                                    <td>
                                        <button className={`btn-icon ${e.is_starred ? 'starred' : ''}`} onClick={() => toggleStar(e)} title={e.is_starred ? "Unstar event" : "Star event"} style={{ color: e.is_starred ? '#eab308' : 'var(--admin-muted)' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill={e.is_starred ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn-icon" onClick={() => setNoteModal(e)} title="View description" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--admin-muted)' }}>
                                            <FileText size={13} /> {(e.description || e.notes || '').length > 25 ? (e.description || e.notes || '').slice(0, 25) + '…' : e.description || e.notes || '—'}
                                        </button>
                                    </td>
                                    <td style={{ color: 'var(--admin-muted)', fontSize: '0.8rem' }}>{e.date || (e.created_at ? new Date(e.created_at).toLocaleDateString('en-IN') : 'TBA')}</td>
                                    <td>
                                        <div className="action-btns">
                                            {e.status !== 'Completed' && <button className="btn-icon" onClick={() => convert(e)} title="Mark Completed" style={{ color: 'var(--admin-green)' }}><CheckCircle size={14} /></button>}
                                            <button className="btn-icon" onClick={() => openEdit(e)} title="Edit"><Pencil size={14} /></button>
                                            <button className="btn-icon danger" onClick={() => remove(e.id)} title="Delete"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Note modal */}
            {noteModal && (
                <div className="admin-modal-overlay" onClick={() => setNoteModal(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header"><h3>Description — {noteModal.title || noteModal.name}</h3><button className="btn-icon" onClick={() => setNoteModal(null)}><X size={16} /></button></div>
                        <div className="admin-modal-body"><p style={{ color: 'var(--admin-muted)', lineHeight: 1.7 }}>{noteModal.description || noteModal.notes || 'No description provided.'}</p></div>
                    </div>
                </div>
            )}

            {/* Add/Edit modal */}
            {modal && (
                <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
                    <div className="admin-modal">
                        <div className="admin-modal-header"><h3>{editing ? 'Edit Event' : 'Schedule Event'}</h3><button className="btn-icon" onClick={() => setModal(false)}><X size={16} /></button></div>
                        <div className="admin-modal-body">
                            <div className="admin-form-grid">
                                <div className="admin-form-group full"><label>Event Title *</label><input placeholder="e.g. Intro to Git & GitHub" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                                <div className="admin-form-group"><label>Date & Time</label><input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
                                <div className="admin-form-group"><label>Location</label><input placeholder="e.g. Lab 3 / Online" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
                                <div className="admin-form-group"><label>Event Type</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>{TYPES.filter(t => t !== 'All').map(t => <option key={t}>{t}</option>)}</select></div>
                                <div className="admin-form-group"><label>Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{STATUSES.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}</select></div>
                                <div className="admin-form-group full"><label>Description</label><textarea rows={3} placeholder="Event details…" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={save}>{editing ? 'Save Changes' : 'Schedule Event'}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AdminEvents
