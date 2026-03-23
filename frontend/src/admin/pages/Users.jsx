import { useState, useEffect } from 'react'
import { Pencil, Trash2, Plus, X, Users as UsersIcon, Search, Shield, ShieldAlert } from 'lucide-react'

const ROLES = ['All', 'admin', 'member']

const emptyUser = { name: '', email: '', password: '', club_uid: '', role: 'member' }

const RoleBadge = ({ r }) => {
    const m = { admin: 'badge-purple', member: 'badge-blue' }
    return <span className={`badge ${m[r.toLowerCase()] || 'badge-gray'}`}>{r.charAt(0).toUpperCase() + r.slice(1)}</span>
}

const Users = ({ searchTerm = '' }) => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [roleFilter, setRoleFilter] = useState('All')
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(emptyUser)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setUsers(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const openAdd = () => { setEditing(null); setForm(emptyUser); setModal(true) }
    const openEdit = (u) => {
        setEditing(u.id)
        setForm({ 
            name: u.name, 
            email: u.email, 
            password: '', 
            club_uid: u.club_uid || '',
            role: u.role || 'member' 
        })
        setModal(true)
    }
    
    const save = async () => {
        if (!form.name.trim() || !form.email.trim()) return
        if (!editing && !form.password) return alert("Password is required for new users!")
        
        try {
            setSaving(true)
            const token = localStorage.getItem('token')
            const userData = { ...form }
            if (editing && !userData.password) delete userData.password // don't send empty pass
            
            if (editing) {
                const res = await fetch(`http://localhost:5000/api/users/${editing}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(userData)
                })
                if (res.ok) await fetchUsers()
                else alert(await res.text())
            } else {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(userData)
                })
                if (res.ok) await fetchUsers()
                else alert(await res.text())
            }
            
            setModal(false)
        } catch (error) {
            console.error('Failed to save user:', error)
            alert(error.message || 'Failed to save user')
        } finally {
            setSaving(false)
        }
    }
    
    const remove = async (id) => {
        if (confirm('Permanently delete this user?')) {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch(`http://localhost:5000/api/users/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) await fetchUsers()
            } catch (error) {
                console.error('Failed to delete user:', error)
            }
        }
    }

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', color: 'var(--admin-muted)' }}>Loading users...</div>
    }

    const filtered = users.filter(u => {
        const mR = roleFilter === 'All' || u.role === roleFilter
        const activeSearch = searchTerm || search
        const mQ = !activeSearch || u.name.toLowerCase().includes(activeSearch.toLowerCase()) || u.email.toLowerCase().includes(activeSearch.toLowerCase())
        return mR && mQ
    })

    return (
        <>
            <div className="admin-page-header">
                <div>
                    <h2>System Users</h2>
                    <p>{users.length} accounts · {users.filter(u => u.role === 'admin').length} admins</p>
                </div>
                <button className="btn-primary" onClick={openAdd}><Plus size={14} /> Add User</button>
            </div>

            {/* Filters */}
            <div className="admin-filter-bar" style={{ flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Search size={14} style={{ position: 'absolute', left: 10, color: 'var(--admin-muted)' }} />
                    <input style={{ background: 'var(--admin-surface2)', border: '1px solid var(--admin-border)', borderRadius: 10, padding: '0.45rem 0.9rem 0.45rem 2rem', color: 'var(--admin-text)', fontFamily: 'Outfit,sans-serif', fontSize: '0.82rem', outline: 'none', width: 200 }}
                        placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                <span style={{ color: 'var(--admin-muted)', fontSize: '0.75rem', fontWeight: 600, marginLeft: 8 }}>Role:</span>
                {ROLES.map(r => <button key={r} className={`filter-tab ${roleFilter === r ? 'active' : ''}`} onClick={() => setRoleFilter(r)}>{r === 'All' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}</button>)}
            </div>

            {/* Table */}
            <div className="admin-card">
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Club UID</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && <tr><td colSpan={5}><div className="admin-empty"><UsersIcon size={40} strokeWidth={1.5} color="var(--admin-muted)" style={{ marginBottom: 10 }} /><p>No users found</p></div></td></tr>}
                            {filtered.map(u => (
                                <tr key={u.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div className="team-avatar">{u.name.slice(0, 2).toUpperCase()}</div>
                                            <div>
                                                <strong>{u.name}</strong>
                                                {u.role === 'admin' && <ShieldAlert size={12} style={{ marginLeft: 6, color: 'var(--admin-primary)', verticalAlign: 'middle' }} />}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '0.8rem', color: 'var(--admin-muted2)' }}>{u.email}</td>
                                    <td style={{ fontSize: '0.8rem', color: 'var(--admin-muted2)' }}>{u.club_uid || '—'}</td>
                                    <td><RoleBadge r={u.role || 'member'} /></td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="btn-icon" onClick={() => openEdit(u)} title="Edit"><Pencil size={14} /></button>
                                            <button className="btn-icon danger" onClick={() => remove(u.id)} title="Delete"><Trash2 size={14} /></button>
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
                    <div className="admin-modal" style={{ maxWidth: 500 }}>
                        <div className="admin-modal-header">
                            <h3>{editing ? 'Edit User' : 'Add New User'}</h3>
                            <button className="btn-icon" onClick={() => setModal(false)}><X size={16} /></button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="admin-form-grid">
                                <div className="admin-form-group full"><label>Full Name *</label><input placeholder="User name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                                <div className="admin-form-group full"><label>Email *</label><input type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                                {!editing && (
                                    <div className="admin-form-group full"><label>Password *</label><input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
                                )}
                                <div className="admin-form-group"><label>Club UID</label><input placeholder="CSQ-1234" value={form.club_uid} onChange={e => setForm({ ...form, club_uid: e.target.value })} /></div>
                                <div className="admin-form-group"><label>Role</label>
                                    <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                                        <option value="member">Member</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={save} disabled={saving}>{editing ? 'Save Changes' : 'Create User'}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Users
