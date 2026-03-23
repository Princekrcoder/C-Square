import { useState, useRef, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import {
    LayoutDashboard, Users, FolderKanban, Inbox, CreditCard,
    Users2, PenSquare, Settings, LogOut, ChevronRight,
    Menu, Search, Bell, Sun, Moon, Globe, ChevronDown,
    TrendingUp, AlertCircle, CheckCircle2, RefreshCcw, BarChart3, Shield
} from 'lucide-react'
import '../styles/AdminLayout.css'

import Dashboard from './pages/Dashboard'
import Clients from './pages/Members' // Map to Members.jsx
import Projects from './pages/Projects'
import Events from './pages/Events'
import Team from './pages/Team'
import CMS from './pages/CMS'
import Settings2 from './pages/Settings'
import ClientDetail from './pages/MemberDetail' // Map to MemberDetail.jsx
import UsersAdmin from './pages/Users'

const NAV = [
    { section: 'Main' },
    { path: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
    { section: 'Club Management' },
    { path: '/admin/members', label: 'Members', Icon: Users },
    { path: '/admin/events', label: 'Events', Icon: FolderKanban },
    { path: '/admin/projects', label: 'Projects', Icon: Inbox },
    { section: 'Operations' },
    { path: '/admin/team', label: 'Core Team', Icon: Users2 },
    { path: '/admin/cms', label: 'CMS', Icon: PenSquare },
    { section: 'System' },
    { path: '/admin/users', label: 'System Users', Icon: Shield },
    { path: '/admin/settings', label: 'Settings', Icon: Settings },
]

const PAGE_TITLES = {
    '/admin': { title: 'Dashboard', subtitle: 'Welcome back, Admin 👋' },
    '/admin/members': { title: 'Members', subtitle: 'Manage club members' },
    '/admin/events': { title: 'Events', subtitle: 'Manage upcoming workshops and hackathons' },
    '/admin/projects': { title: 'Open Source Projects', subtitle: 'Track club open-source initiatives' },
    '/admin/team': { title: 'Core Committee', subtitle: 'Manage the core team' },
    '/admin/cms': { title: 'Content Management', subtitle: 'Edit website content' },
    '/admin/users': { title: 'System Users', subtitle: 'Manage admins and account access' },
    '/admin/settings': { title: 'Settings', subtitle: 'Configure club profile' },
}


const AdminLayout = ({ theme, toggleTheme }) => {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [notifOpen, setNotifOpen] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()
    const location = useLocation()
    const notifRef = useRef(null)

    // Check auth
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserstr = localStorage.getItem('user');
        
        if (!token || !storedUserstr) {
            navigate('/login');
            return;
        }
        
        try {
            const storedUser = JSON.parse(storedUserstr);
            if (storedUser.role !== 'admin') {
               navigate('/');
            }
        } catch (e) {
            navigate('/login');
        }
    }, [navigate]);

    // Hardcode user for UI purposes since backend/auth is removed
    const storedUser = localStorage.getItem('user');
    const userObj = storedUser ? JSON.parse(storedUser) : { name: 'Admin', role: 'admin' };
    const user = { name: userObj.name || 'C-Square Admin', role: userObj.role === 'admin' ? 'Admin' : 'Member' };

    const pageInfo = PAGE_TITLES[location.pathname] || { title: 'Admin', subtitle: '' }
    const unreadCount = notifications.filter(n => n.unread).length

    useEffect(() => {
        const fetchNotifs = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/dashboard/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    const feed = [
                        ...data.recentLeads.map(l => ({ id: `l-${l.id}`, Icon: Users, iconClass: 'blue', title: 'New Registration', desc: l.name, time: new Date(l.created_at || Date.now()).toLocaleDateString(), unread: l.status === 'Pending' })),
                        ...data.recentProjects.map(p => ({ id: `p-${p.id}`, Icon: FolderKanban, iconClass: 'green', title: 'New Project', desc: p.name, time: new Date(p.deadline || Date.now()).toLocaleDateString(), unread: p.status === 'Pending' }))
                    ].slice(0, 4);
                    setNotifications(feed);
                }
            } catch (err) {}
        };
        fetchNotifs();
    }, [location.pathname]);

    useEffect(() => {
        const h = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false) }
        document.addEventListener('mousedown', h)
        return () => document.removeEventListener('mousedown', h)
    }, [])

    const handleNav = (path) => { navigate(path); setMobileOpen(false) }
    const toggleSidebar = () => {
        if (window.innerWidth <= 900) setMobileOpen(o => !o)
        else setCollapsed(c => !c)
    }

    const handleLogout = () => {
        // Clear auth
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/')
    }

    const userInitials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AD'

    return (
        <div className="admin-shell">
            {mobileOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 199 }}
                    onClick={() => setMobileOpen(false)} />
            )}

            {/* ── Sidebar ── */}
            <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
                {/* Brand */}
                <div className="admin-sidebar-brand">
                    <div className="admin-brand-icon">
                        <BarChart3 size={18} color="#fff" />
                    </div>
                    <div className="admin-brand-logo">C-<span>Square</span></div>
                    <div className="admin-brand-badge">CLUB</div>
                </div>

                {/* Nav */}
                <nav className="admin-nav">
                    {NAV.map((item, i) => {
                        if (item.section) return (
                            <div key={i} className="admin-nav-section">{item.section}</div>
                        )
                        const isActive = item.path === '/admin'
                            ? location.pathname === '/admin'
                            : location.pathname.startsWith(item.path)
                        const { Icon } = item
                        return (
                            <button key={item.path}
                                className={`admin-nav-link ${isActive ? 'active' : ''}`}
                                onClick={() => handleNav(item.path)}>
                                <span className="nav-icon"><Icon size={17} strokeWidth={1.8} /></span>
                                <span className="nav-label">{item.label}</span>
                                {item.badge && <span className="nav-badge">{item.badge}</span>}
                            </button>
                        )
                    })}
                </nav>

                {/* Back to site */}
                <div style={{ padding: '0 0.6rem' }}>
                    <button className="admin-nav-link" onClick={() => navigate('/')}>
                        <span className="nav-icon"><Globe size={17} strokeWidth={1.8} /></span>
                        <span className="nav-label">Back to Site</span>
                    </button>
                    <button className="admin-nav-link" onClick={handleLogout} style={{ color: '#ef4444' }}>
                        <span className="nav-icon"><LogOut size={17} strokeWidth={1.8} /></span>
                        <span className="nav-label">Logout</span>
                    </button>
                </div>

                {/* Profile */}
                <div className="admin-sidebar-profile" onClick={() => handleNav('/admin/settings')}>
                    <div className="profile-avatar">{userInitials}</div>
                    <div className="profile-info">
                        <strong>{user.name || 'Admin'}</strong>
                        <span>{user.role || 'Super Admin'}</span>
                    </div>
                    <Settings size={14} color="var(--admin-muted)" />
                </div>
            </aside>

            {/* ── Body ── */}
            <div className={`admin-body ${collapsed ? 'collapsed' : ''}`}>

                {/* Topbar */}
                <header className="admin-topbar">
                    <button className="admin-topbar-toggle" onClick={toggleSidebar}>
                        <Menu size={20} strokeWidth={1.8} />
                    </button>

                    <div className="admin-breadcrumb">
                        <span>C-Square</span>
                        <ChevronRight size={14} />
                        <strong>{pageInfo.title}</strong>
                    </div>

                    <div className="admin-topbar-search">
                        <Search size={15} className="search-icon" />
                        <input 
                            placeholder="Search active page…" 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="admin-topbar-actions">
                        {/* Theme */}
                        <button className="admin-icon-btn" onClick={toggleTheme} title="Toggle theme">
                            {theme === 'light'
                                ? <Sun size={17} strokeWidth={1.8} />
                                : <Moon size={17} strokeWidth={1.8} />}
                        </button>

                        {/* Notifications */}
                        <div ref={notifRef} style={{ position: 'relative' }}>
                            <button className="admin-icon-btn" onClick={() => setNotifOpen(o => !o)}>
                                <Bell size={17} strokeWidth={1.8} />
                                {unreadCount > 0 && <span className="notif-dot" />}
                            </button>

                            {notifOpen && (
                                <div className="notif-panel">
                                    <div className="notif-header">
                                        <h4>Notifications</h4>
                                        <span className="badge badge-red">{unreadCount} new</span>
                                    </div>
                                    {notifications.length === 0 ? (
                                        <div style={{ padding: 20, textAlign: 'center', color: 'var(--admin-muted)', fontSize: '0.8rem' }}>No new notifications</div>
                                    ) : notifications.map(n => {
                                        const { Icon: NIcon } = n
                                        return (
                                            <div className="notif-item" key={n.id} style={{ opacity: n.unread ? 1 : 0.65 }}>
                                                <div className={`notif-icon ${n.iconClass}`}>
                                                    <NIcon size={16} strokeWidth={1.8} />
                                                </div>
                                                <div className="notif-text" style={{ flex: 1 }}>
                                                    <strong>{n.title}</strong>
                                                    <span>{n.desc}</span>
                                                </div>
                                                <span style={{ fontSize: '0.72rem', color: 'var(--admin-muted)', whiteSpace: 'nowrap', marginTop: 2 }}>{n.time}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="admin-topbar-avatar" title="Admin Profile">{userInitials}</div>
                    </div>
                </header>

                {/* Page content */}
                <main className="admin-main">
                    <Routes>
                        <Route path="/" element={<Dashboard navigate={navigate} searchTerm={searchTerm} />} />
                        <Route path="/members" element={<Clients searchTerm={searchTerm} />} />
                        <Route path="/members/:id" element={<ClientDetail searchTerm={searchTerm} />} />
                        <Route path="/events" element={<Events searchTerm={searchTerm} />} />
                        <Route path="/projects" element={<Projects searchTerm={searchTerm} />} />
                        <Route path="/team" element={<Team searchTerm={searchTerm} />} />
                        <Route path="/cms" element={<CMS searchTerm={searchTerm} />} />
                        <Route path="/users" element={<UsersAdmin searchTerm={searchTerm} />} />
                        <Route path="/settings" element={<Settings2 theme={theme} toggleTheme={toggleTheme} />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
