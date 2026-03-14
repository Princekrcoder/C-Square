import { useState } from 'react'
import { Pencil, Trash2, Plus, ToggleLeft, ToggleRight, FileText, BookOpen, Star, Zap, X, ExternalLink } from 'lucide-react'

const TABS = [
    { key: 'highlights', label: 'Highlights', Icon: Zap },
    { key: 'resources', label: 'Resources', Icon: BookOpen },
    { key: 'stories', label: 'Member Stories', Icon: Star },
    { key: 'blog', label: 'Blog / Posts', Icon: FileText },
]

const INIT_HIGHLIGHTS = [
    { id: 1, title: 'Competitive Programming', desc: 'Weekly CP contests, LeetCode challenges, and Codeforces rounds to sharpen your problem-solving skills.', active: true, emoji: '🏆' },
    { id: 2, title: 'Hands-on Workshops', desc: 'Practical workshops on Web Dev, AI/ML, DevOps, Git, and more — taught by club seniors and industry mentors.', active: true, emoji: '🛠️' },
    { id: 3, title: 'Open Source Projects', desc: 'Collaborate on real club-run open-source projects that are used by the college community.', active: true, emoji: '🌐' },
    { id: 4, title: 'Hackathons & Events', desc: 'Participate in national-level hackathons, coding challenges, and DevSprints organized by the club.', active: true, emoji: '⚡' },
    { id: 5, title: 'Mentorship Program', desc: 'Get paired with senior club members for guidance on competitive programming, projects, and placements.', active: false, emoji: '🤝' },
]

const INIT_RESOURCES = [
    { id: 1, title: 'CP Starter Roadmap', category: 'DSA', type: 'PDF Guide', link: '#', featured: true },
    { id: 2, title: 'Web Dev with React', category: 'Web Dev', type: 'Tutorial Series', link: '#', featured: true },
    { id: 3, title: 'Git & GitHub Basics', category: 'DevOps', type: 'Workshop Notes', link: '#', featured: false },
    { id: 4, title: 'ML Foundations with Python', category: 'AI/ML', type: 'PDF Guide', link: '#', featured: true },
    { id: 5, title: 'Interview Prep Sheet', category: 'DSA', type: 'Cheat Sheet', link: '#', featured: false },
    { id: 6, title: 'Open Source Contribution Guide', category: 'General', type: 'Handbook', link: '#', featured: false },
]

const INIT_STORIES = [
    { id: 1, name: 'Arjun Patel', batch: '2022', achievement: 'SDE Intern at Google via CP practice at C-Square', rating: 5, text: 'Regular CP contests at C-Square gave me the confidence to crack Google\'s coding rounds. The mentorship was phenomenal!' },
    { id: 2, name: 'Meera Singh', batch: '2023', achievement: 'Open source contributor to Mozilla Firefox', rating: 5, text: 'I had zero open-source experience before joining. The club\'s project workflow and senior guidance got me my first merged PR in 2 months!' },
    { id: 3, name: 'Vikram Rao', batch: '2022', achievement: 'Won HackIndia 2023 with club teammates', rating: 5, text: 'We formed a team within C-Square and won a national hackathon. Would not have been possible without the collaboration culture here.' },
]

const INIT_BLOG = [
    { id: 1, title: 'How to Start Competitive Programming in 2026', date: '2026-03-10', status: 'Published', views: 540, category: 'DSA' },
    { id: 2, title: 'Our Journey: Building the C-Square Club Website', date: '2026-02-28', status: 'Published', views: 320, category: 'Web Dev' },
    { id: 3, title: 'Top Resources for Learning AI/ML from Scratch', date: '2026-02-15', status: 'Published', views: 215, category: 'AI/ML' },
    { id: 4, title: 'What I Learned from Contributing to Open Source', date: '2026-01-20', status: 'Published', views: 180, category: 'General' },
    { id: 5, title: 'DevSprint 2025 Recap — Our Biggest Hackathon Yet!', date: '2026-01-05', status: 'Published', views: 410, category: 'Events' },
    { id: 6, title: 'Introduction to System Design for Beginners', date: '2026-03-14', status: 'Draft', views: 0, category: 'DSA' },
]

const CMS = () => {
    const [tab, setTab] = useState('highlights')
    const [highlights, setHighlights] = useState(INIT_HIGHLIGHTS)
    const [resources, setResources] = useState(INIT_RESOURCES)
    const [stories, setStories] = useState(INIT_STORIES)
    const [blog, setBlog] = useState(INIT_BLOG)
    const [editHighlight, setEditHighlight] = useState(null)

    const toggleHighlight = (id) => setHighlights(h => h.map(i => i.id === id ? { ...i, active: !i.active } : i))
    const deleteResource = (id) => setResources(r => r.filter(i => i.id !== id))
    const toggleFeatured = (id) => setResources(r => r.map(i => i.id === id ? { ...i, featured: !i.featured } : i))
    const deleteStory = (id) => setStories(s => s.filter(i => i.id !== id))
    const toggleBlog = (id) => setBlog(b => b.map(p => p.id === id ? { ...p, status: p.status === 'Published' ? 'Draft' : 'Published' } : p))
    const deleteBlog = (id) => setBlog(b => b.filter(p => p.id !== id))

    const CAT_COLORS = { DSA: 'badge-blue', 'Web Dev': 'badge-cyan', 'AI/ML': 'badge-purple', 'DevOps': 'badge-orange', General: 'badge-gray', Events: 'badge-green' }

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
                    {highlights.map(h => (
                        <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '1rem 1.25rem', borderBottom: '1px solid var(--admin-border)' }}>
                            {editHighlight === h.id ? (
                                <>
                                    <span style={{ fontSize: '1.4rem' }}>{h.emoji}</span>
                                    <input value={h.title} onChange={e => setHighlights(hl => hl.map(i => i.id === h.id ? { ...i, title: e.target.value } : i))}
                                        style={{ flex: 1, background: 'var(--admin-surface2)', border: '1px solid var(--admin-border)', borderRadius: 8, padding: '5px 10px', color: 'var(--admin-text)', fontFamily: 'Outfit,sans-serif' }} />
                                    <input value={h.desc} onChange={e => setHighlights(hl => hl.map(i => i.id === h.id ? { ...i, desc: e.target.value } : i))}
                                        style={{ flex: 3, background: 'var(--admin-surface2)', border: '1px solid var(--admin-border)', borderRadius: 8, padding: '5px 10px', color: 'var(--admin-text)', fontFamily: 'Outfit,sans-serif' }} />
                                    <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '5px 12px' }} onClick={() => setEditHighlight(null)}>Save</button>
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
                        <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Plus size={13} /> Add Resource
                        </button>
                    </div>
                    {resources.map(r => (
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
                    {stories.map(s => (
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
                    <div className="admin-stat-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 200, border: '2px dashed var(--admin-border)', cursor: 'pointer' }}>
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
                        <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Plus size={13} /> New Post
                        </button>
                    </div>
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Status</th><th>Views</th><th>Actions</th></tr></thead>
                            <tbody>
                                {blog.map(p => (
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
        </>
    )
}

export default CMS
