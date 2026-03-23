import { useState, useEffect } from 'react'
import { Pencil, Trash2, Plus, ToggleLeft, ToggleRight, FileText, BookOpen, Star, Zap, X, ExternalLink } from 'lucide-react'

const TABS = [
    { key: 'highlights', label: 'Highlights', Icon: Zap },
    { key: 'resources', label: 'Resources', Icon: BookOpen },
    { key: 'stories', label: 'Member Stories', Icon: Star },
    { key: 'blog', label: 'Blog / Posts', Icon: FileText },
]

const CMS = ({ searchTerm = '' }) => {
    const [tab, setTab] = useState('highlights')
    const [highlights, setHighlights] = useState([])
    const [resources, setResources] = useState([])
    const [stories, setStories] = useState([])
    const [blog, setBlog] = useState([])
    const [editHighlight, setEditHighlight] = useState(null)
    const [addModal, setAddModal] = useState(null) // 'resource' | 'story' | 'blog'
    const [form, setForm] = useState({})

    useEffect(() => { fetchCMS() }, [])

    const fetchCMS = async () => {
        try {
            const [hRes, rRes, sRes, bRes] = await Promise.all([
                fetch('http://localhost:5000/api/cms/highlights'),
                fetch('http://localhost:5000/api/cms/resources'),
                fetch('http://localhost:5000/api/cms/stories'),
                fetch('http://localhost:5000/api/cms/blog')
            ])
            if(hRes.ok) setHighlights(await hRes.json())
            if(rRes.ok) setResources(await rRes.json())
            if(sRes.ok) setStories(await sRes.json())
            if(bRes.ok) setBlog(await bRes.json())
        } catch (error) { console.error('CMS fetch failed:', error) }
    }

    const apiCall = async (endpoint, method, body = null) => {
        const token = localStorage.getItem('token')
        const opts = { method, headers: { 'Authorization': `Bearer ${token}` } }
        if (body) {
            opts.headers['Content-Type'] = 'application/json'
            opts.body = JSON.stringify(body)
        }
        const res = await fetch(`http://localhost:5000/api/cms/${endpoint}`, opts)
        if (res.ok) fetchCMS()
        return res
    }

    const toggleHighlight = (id) => {
        const h = highlights.find(i => i.id === id)
        apiCall(`highlights/${id}`, 'PUT', { active: !h.active })
    }
    const saveHighlight = (h) => {
        apiCall(`highlights/${h.id}`, 'PUT', { title: h.title, desc: h.desc })
        setEditHighlight(null)
    }
    
    const deleteResource = (id) => { if(confirm('Delete resource?')) apiCall(`resources/${id}`, 'DELETE') }
    const toggleFeatured = (id) => {
        const r = resources.find(i => i.id === id)
        apiCall(`resources/${id}`, 'PUT', { featured: !r.featured })
    }
    
    const deleteStory = (id) => { if(confirm('Delete story?')) apiCall(`stories/${id}`, 'DELETE') }
    
    const toggleBlog = (id) => {
        const b = blog.find(p => p.id === id)
        apiCall(`blog/${id}`, 'PUT', { status: b.status === 'Published' ? 'Draft' : 'Published' })
    }
    const deleteBlog = (id) => { if(confirm('Delete post?')) apiCall(`blog/${id}`, 'DELETE') }

    const openModal = (type) => {
        setAddModal(type)
        if (type === 'resource') setForm({ title: '', category: 'DSA', type: 'PDF Guide', link: '#' })
        if (type === 'story') setForm({ name: '', batch: '', achievement: '', text: '' })
        if (type === 'blog') setForm({ title: '', category: 'DSA', date: new Date().toISOString().split('T')[0] })
    }
    const saveModal = async () => {
        if (!form.title && !form.name) return
        await apiCall(addModal === 'resource' ? 'resources' : addModal === 'story' ? 'stories' : 'blog', 'POST', form)
        setAddModal(null)
    }

    const CAT_COLORS = { DSA: 'badge-blue', 'Web Dev': 'badge-cyan', 'AI/ML': 'badge-purple', 'DevOps': 'badge-orange', General: 'badge-gray', Events: 'badge-green' }

    const filterList = (list, textFields) => list.filter(item => 
        !searchTerm || textFields.some(tf => (item[tf] || '').toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const hList = filterList(highlights, ['title', 'desc'])
    const rList = filterList(resources, ['title', 'category'])
    const sList = filterList(stories, ['name', 'achievement'])
    const bList = filterList(blog, ['title', 'category'])

    return (
        <>
            <div className="admin-page-header">
                <div><h2>Content Management</h2><p>Manage website content for C-Square Club</p></div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 12, padding: 4, marginBottom: '1.5rem', width: 'fit-content' }}>
                {TABS.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} style={{
                        padding: '7px 18px', borderRadius: 9, border: 'none', cursor: 'pointer',
                        fontFamily: 'Outfit,sans-serif', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.18s',
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: tab === t.key ? 'var(--admin-primary)' : 'none',
                        color: tab === t.key ? '#fff' : 'var(--admin-muted)'
                    }}><t.Icon size={14} /> {t.label}</button>
                ))}
            </div>

            {/* ── Highlights ── */}
            {tab === 'highlights' && (
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div>
                            <h3>Club Highlights</h3>
                            <p style={{ fontSize: '0.78rem', color: 'var(--admin-muted)', margin: 0 }}>Showing on homepage — toggle to show/hide each highlight</p>
                        </div>
                    </div>
                    {hList.map(h => (
                        <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '1rem 1.25rem', borderBottom: '1px solid var(--admin-border)' }}>
                            {editHighlight === h.id ? (
                                <>
                                    <span style={{ fontSize: '1.4rem' }}>{h.emoji}</span>
                                    <input value={h.title} onChange={e => setHighlights(hl => hl.map(i => i.id === h.id ? { ...i, title: e.target.value } : i))}
                                        style={{ flex: 1, background: 'var(--admin-surface2)', border: '1px solid var(--admin-border)', borderRadius: 8, padding: '5px 10px', color: 'var(--admin-text)', fontFamily: 'Outfit,sans-serif' }} />
                                    <input value={h.desc || ''} onChange={e => setHighlights(hl => hl.map(i => i.id === h.id ? { ...i, desc: e.target.value } : i))}
                                        style={{ flex: 3, background: 'var(--admin-surface2)', border: '1px solid var(--admin-border)', borderRadius: 8, padding: '5px 10px', color: 'var(--admin-text)', fontFamily: 'Outfit,sans-serif' }} />
                                    <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '5px 12px' }} onClick={() => saveHighlight(h)}>Save</button>
                                </>
                            ) : (
                                <>
                                    <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{h.emoji}</span>
                                    <div style={{ flex: 1 }}>
                                        <strong style={{ color: 'var(--admin-text)' }}>{h.title}</strong>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--admin-muted)', marginTop: 2 }}>{h.desc}</div>
                                    </div>
                                    <span className={`badge ${h.active ? 'badge-green' : 'badge-gray'}`}>{h.active ? 'Visible' : 'Hidden'}</span>
                                    <div className="action-btns">
                                        <button className="btn-icon" onClick={() => toggleHighlight(h.id)} title={h.active ? 'Hide' : 'Show'}>
                                            {h.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                        </button>
                                        <button className="btn-icon" onClick={() => setEditHighlight(h.id)}><Pencil size={14} /></button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* ── Resources ── */}
            {tab === 'resources' && (
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div>
                            <h3>Learning Resources</h3>
                            <p style={{ fontSize: '0.78rem', color: 'var(--admin-muted)', margin: 0 }}>Guides, roadmaps, and notes shared with club members</p>
                        </div>
                        <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 5 }} onClick={() => openModal('resource')}>
                            <Plus size={13} /> Add Resource
                        </button>
                    </div>
                    {rList.map(r => (
                        <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '1rem 1.25rem', borderBottom: '1px solid var(--admin-border)' }}>
                            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--admin-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <BookOpen size={16} color="var(--admin-primary)" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <strong style={{ color: 'var(--admin-text)', display: 'block' }}>{r.title}</strong>
                                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                                    <span className={`badge ${CAT_COLORS[r.category] || 'badge-gray'}`} style={{ fontSize: '0.68rem' }}>{r.category}</span>
                                    <span className="badge badge-gray" style={{ fontSize: '0.68rem' }}>{r.type}</span>
                                </div>
                            </div>
                            {r.featured && <span className="badge badge-yellow" style={{ fontSize: '0.68rem' }}>Featured</span>}
                            <div className="action-btns">
                                <button className="btn-icon" onClick={() => toggleFeatured(r.id)} title={r.featured ? 'Unfeature' : 'Feature'}>
                                    <Star size={14} color={r.featured ? 'var(--admin-orange)' : undefined} />
                                </button>
                                <button className="btn-icon" title="Open link"><ExternalLink size={13} /></button>
                                <button className="btn-icon danger" onClick={() => deleteResource(r.id)}><Trash2 size={13} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Member Stories ── */}
            {tab === 'stories' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(310px,1fr))', gap: '1rem' }}>
                    {sList.map(s => (
                        <div key={s.id} className="admin-stat-card" style={{ padding: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
                                <div className="team-avatar" style={{ width: 38, height: 38, fontSize: '0.8rem' }}>{s.name.split(' ').map(n => n[0]).join('')}</div>
                                <div>
                                    <strong style={{ color: 'var(--admin-text)', display: 'block', fontSize: '0.9rem' }}>{s.name}</strong>
                                    <span style={{ fontSize: '0.74rem', color: 'var(--admin-muted)' }}>Batch of {s.batch}</span>
                                </div>
                            </div>
                            <div style={{ background: 'var(--admin-surface2)', borderRadius: 8, padding: '8px 10px', marginBottom: '0.65rem', fontSize: '0.78rem', color: 'var(--admin-green)', fontWeight: 600 }}>
                                🏆 {s.achievement}
                            </div>
                            <div style={{ color: 'var(--admin-orange)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{'★'.repeat(s.rating)}{'☆'.repeat(5 - s.rating)}</div>
                            <p style={{ color: 'var(--admin-muted)', fontSize: '0.82rem', lineHeight: 1.6, fontStyle: 'italic' }}>"{s.text}"</p>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                                <button className="btn-icon danger" onClick={() => deleteStory(s.id)}><Trash2 size={13} /></button>
                            </div>
                        </div>
                    ))}
                    <div className="admin-stat-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 200, border: '2px dashed var(--admin-border)', cursor: 'pointer' }}
                        onClick={() => openModal('story')}>
                        <Plus size={24} color="var(--admin-muted)" />
                        <span style={{ color: 'var(--admin-muted)', fontSize: '0.85rem' }}>Add Member Story</span>
                    </div>
                </div>
            )}

            {/* ── Blog / Posts ── */}
            {tab === 'blog' && (
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div>
                            <h3>Blog Posts</h3>
                            <p style={{ fontSize: '0.78rem', color: 'var(--admin-muted)', margin: 0 }}>Articles, tutorials, and announcements for club members</p>
                        </div>
                        <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 5 }} onClick={() => openModal('blog')}>
                            <Plus size={13} /> New Post
                        </button>
                    </div>
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Status</th><th>Views</th><th>Actions</th></tr></thead>
                            <tbody>
                                {bList.map(p => (
                                    <tr key={p.id}>
                                        <td><strong style={{ fontSize: '0.875rem' }}>{p.title}</strong></td>
                                        <td><span className={`badge ${CAT_COLORS[p.category] || 'badge-gray'}`} style={{ fontSize: '0.68rem' }}>{p.category}</span></td>
                                        <td style={{ color: 'var(--admin-muted)', fontSize: '0.8rem' }}>{p.date}</td>
                                        <td><span className={`badge ${p.status === 'Published' ? 'badge-green' : 'badge-gray'}`}>{p.status}</span></td>
                                        <td style={{ fontWeight: 600 }}>{p.views.toLocaleString()}</td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="btn-icon" onClick={() => toggleBlog(p.id)} title={p.status === 'Published' ? 'Unpublish' : 'Publish'} style={{ color: 'var(--admin-green)' }}>
                                                    {p.status === 'Published' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                                </button>
                                                <button className="btn-icon"><Pencil size={14} /></button>
                                                <button className="btn-icon danger" onClick={() => deleteBlog(p.id)}><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {/* Generic Add Modal */}
            {addModal && (
                <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setAddModal(null)}>
                    <div className="admin-modal">
                        <div className="admin-modal-header">
                            <h3>Add {addModal === 'resource' ? 'Resource' : addModal === 'story' ? 'Story' : 'Post'}</h3>
                            <button className="btn-icon" onClick={() => setAddModal(null)}><X size={16} /></button>
                        </div>
                        <div className="admin-modal-body">
                            <div className="admin-form-grid">
                                {addModal === 'resource' && (
                                    <>
                                        <div className="admin-form-group full"><label>Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                                        <div className="admin-form-group"><label>Category</label><input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
                                        <div className="admin-form-group"><label>Type</label><input value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} /></div>
                                        <div className="admin-form-group full"><label>Link</label><input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} /></div>
                                    </>
                                )}
                                {addModal === 'story' && (
                                    <>
                                        <div className="admin-form-group full"><label>Member Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                                        <div className="admin-form-group"><label>Batch</label><input type="text" inputMode="numeric" placeholder="e.g. 2027" value={form.batch} onChange={e => setForm({ ...form, batch: e.target.value.replace(/\D/g, '').slice(0, 4) })} /></div>
                                        <div className="admin-form-group"><label>Achievement</label><input value={form.achievement} onChange={e => setForm({ ...form, achievement: e.target.value })} /></div>
                                        <div className="admin-form-group full"><label>Testimonial / Story text</label><textarea value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} style={{ width: '100%', minHeight: 80, background: 'var(--admin-surface2)', border: '1px solid var(--admin-border)', borderRadius: 8, padding: 10, color: 'var(--admin-text)' }} /></div>
                                    </>
                                )}
                                {addModal === 'blog' && (
                                    <>
                                        <div className="admin-form-group full"><label>Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                                        <div className="admin-form-group"><label>Category</label><input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
                                        <div className="admin-form-group"><label>Date</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="btn-ghost" onClick={() => setAddModal(null)}>Cancel</button>
                            <button className="btn-primary" onClick={saveModal}>Save {addModal}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default CMS
