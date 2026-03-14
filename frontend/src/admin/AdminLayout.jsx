import { useState, useRef, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import {
    LayoutDashboard, Users, FolderKanban, Inbox, CreditCard,
    Users2, PenSquare, Settings, LogOut, ChevronRight,
    Menu, Search, Bell, Sun, Moon, Globe, ChevronDown,
    TrendingUp, AlertCircle, CheckCircle2, RefreshCcw, BarChart3
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

const NAV = [
    { section: 'Main' },
    { path: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
    { section: 'Club Management' },
    { path: '/admin/members', label: 'Members', Icon: Users, badge: 12 },
    { path: '/admin/events', label: 'Events', Icon: FolderKanban, badge: 3 },
    { path: '/admin/projects', label: 'Projects', Icon: Inbox, badge: 2 },
    { section: 'Operations' },
    { path: '/admin/team', label: 'Core Team', Icon: Users2 },
    { path: '/admin/cms', label: 'CMS', Icon: PenSquare },
    { section: 'System' },
    { path: '/admin/settings', label: 'Settings', Icon: Settings },
]

const PAGE_TITLES = {
    '/admin': { title: 'Dashboard', subtitle: 'Welcome back, Admin 👋' },
    '/admin/members': { title: 'Members', subtitle: 'Manage club members' },
    '/admin/events': { title: 'Events', subtitle: 'Manage upcoming workshops and hackathons' },
    '/admin/projects': { title: 'Open Source Projects', subtitle: 'Track club open-source initiatives' },
    '/admin/team': { title: 'Core Committee', subtitle: 'Manage the core team' },
    '/admin/cms': { title: 'Content Management', subtitle: 'Edit website content' },
    '/admin/settings': { title: 'Settings', subtitle: 'Configure club profile' },
}

const NOTIFICATIONS = [
    { id: 1, Icon: TrendingUp, iconClass: 'green', title: 'New member registered', desc: 'Rishabh Kumar — Web Dev Track', time: '5 min ago', unread: true },
    { id: 2, Icon: CheckCircle2, iconClass: 'green', title: 'Workshop scheduled', desc: 'Intro to React — Tomorrow, 5 PM', time: '2 hrs ago', unread: true },
    { id: 3, Icon: RefreshCcw, iconClass: 'blue', title: 'Project PR merged', desc: 'CSquare Website — Homepage redesign', time: '4 hrs ago', unread: false },
    { id: 4, Icon: AlertCircle, iconClass: 'orange', title: 'Hackathon closing', desc: 'Winter of Code registration — 5 days left', time: 'Yesterday', unread: false },
]

const AdminLayout = ({ theme, toggleTheme }) => {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [notifOpen, setNotifOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const notifRef = useRef(null)

    // Hardcode user for UI purposes since backend/auth is removed
    const user = { name: 'C-Square Admin', role: 'Admin' }

    const pageInfo = PAGE_TITLES[location.pathname] || { title: 'Admin', subtitle: '' }
    const unreadCount = NOTIFICATIONS.filter(n => n.unread).length

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
        // Just redirect to homepage since auth is gone
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
                        <input placeholder="Search clients, projects…" />
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
                                    {NOTIFICATIONS.map(n => {
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
                        <Route path="/" element={<Dashboard navigate={navigate} />} />
                        <Route path="/members" element={<Clients />} />
                        <Route path="/members/:id" element={<ClientDetail />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/team" element={<Team />} />
                        <Route path="/cms" element={<CMS />} />
                        <Route path="/settings" element={<Settings2 theme={theme} toggleTheme={toggleTheme} />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
