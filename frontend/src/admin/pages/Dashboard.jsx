import { useState, useEffect } from 'react'
import {
    Users, FolderKanban, TrendingUp, Inbox, BarChart3,
    ArrowUp, ArrowDown, Plus, Zap, CreditCard, UserPlus,
    Globe, Activity, ArrowRight, RefreshCcw, CheckCircle2
} from 'lucide-react'

// Mock stats removed, fetching dynamically from backend API

const MONTHLY_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKLY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Animated counter hook
const useCount = (target, duration = 1200) => {
    const [count, setCount] = useState(0)
    useEffect(() => {
        let start = 0
        const step = target / (duration / 16)
        const t = setInterval(() => {
            start += step
            if (start >= target) { setCount(target); clearInterval(t) }
            else setCount(Math.floor(start))
        }, 16)
        return () => clearInterval(t)
    }, [target, duration])
    return count
}

const StatCard = ({ label, value, Icon, iconClass, change, up, spark, glowColor, prefix = '' }) => {
    const animated = useCount(typeof value === 'number' ? value : 0)
    const display = typeof value === 'number' ? `${prefix}${animated.toLocaleString('en-IN')}` : value

    return (
        <div className="admin-stat-card" style={{ '--card-glow': glowColor }}>
            <div className={`stat-icon ${iconClass}`}>
                <Icon size={20} strokeWidth={1.8} />
            </div>
            <div className="stat-value">{display}</div>
            <div className="stat-label">{label}</div>
            <div className={`stat-change ${up ? 'up' : 'dn'}`}>
                {up ? <ArrowUp size={11} /> : <ArrowDown size={11} />} {change}
            </div>
            {spark && (
                <div className="stat-sparkline" style={{ color: up ? 'var(--admin-green)' : 'var(--admin-red)' }}>
                    {spark.map((h, i) => <div key={i} className="spark-bar" style={{ height: h + '%' }} />)}
                </div>
            )}
        </div>
    )
}

const BarChart = ({ dashboardData }) => {
    const [view, setView] = useState('monthly')
    
    // Fallbacks just in case data hasn't arrived
    const monthlyData = dashboardData?.charts?.growth?.monthly || Array(12).fill(0)
    const weeklyData = dashboardData?.charts?.growth?.weekly || Array(7).fill(0)
    
    const data = view === 'monthly' ? monthlyData : weeklyData
    const labels = view === 'monthly' ? MONTHLY_LABELS : WEEKLY_LABELS
    const maxVal = Math.max(...data, 10)
    const currentIdx = view === 'monthly' ? new Date().getMonth() : (new Date().getDay() + 6) % 7

    return (
        <div className="chart-card">
            <div className="chart-header">
                <div>
                    <h3>Member Growth</h3>
                    <p>New club registrations over time</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--admin-text)' }}>
                        +{data[currentIdx]}
                    </span>
                    <div className="chart-toggle">
                        <button className={view === 'weekly' ? 'active' : ''} onClick={() => setView('weekly')}>Weekly</button>
                        <button className={view === 'monthly' ? 'active' : ''} onClick={() => setView('monthly')}>Monthly</button>
                    </div>
                </div>
            </div>
            <div className="chart-body">
                <div className="bar-chart">
                    <div className="bar-chart-yaxis">
                        {[maxVal, Math.round(maxVal * .75), Math.round(maxVal * .5), Math.round(maxVal * .25), 0].map((v, i) => (
                            <span key={i}>{v}</span>
                        ))}
                    </div>
                    <div className="bar-chart-inner">
                        {data.map((v, i) => (
                            <div className="bar-col" key={i}>
                                <div className="bar-wrap" style={{ height: 150 }}>
                                    <div className={`bar-fill ${i === currentIdx ? 'current' : ''}`}
                                        style={{ height: `${(v / maxVal) * 100}%` }}
                                        data-value={`+${v}`} />
                                </div>
                                <span className="bar-col-label">{labels[i]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const DonutChart = ({ dashboardData }) => {
    const paid = dashboardData?.charts?.memberStatus?.active || 0 
    const unpaid = dashboardData?.charts?.memberStatus?.pending || 0
    const total = paid + unpaid || 1
    
    const paidPct = Math.round((paid / total) * 100)
    const r = 54, cx = 70, cy = 70, circ = 2 * Math.PI * r
    const paidDash = (paid / total) * circ
    const unpaidDash = (unpaid / total) * circ

    return (
        <div className="chart-card">
            <div className="chart-header">
                <div><h3>Member Status</h3><p>Active vs Pending</p></div>
                <span className="badge badge-green">{paidPct}% Active</span>
            </div>
            <div className="chart-body">
                <div className="donut-wrap">
                    <svg width="140" height="140">
                        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
                        <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#grad1)" strokeWidth="14"
                            strokeDasharray={`${paidDash} ${circ}`} strokeLinecap="round"
                            transform={`rotate(-90 ${cx} ${cy})`} />
                        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(239,68,68,0.5)" strokeWidth="14"
                            strokeDasharray={`${unpaidDash} ${circ}`} strokeDashoffset={-paidDash}
                            strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} />
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                        </defs>
                        <text x={cx} y={cy - 4} textAnchor="middle" fill="var(--admin-text)" fontSize="16" fontWeight="800">{paidPct}%</text>
                        <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--admin-muted)" fontSize="9">Active</text>
                    </svg>
                    <div className="donut-legend">
                        {[['Active', '#6366f1', paid], ['Pending', '#ef4444', unpaid]].map(([l, c, v]) => (
                            <div className="donut-legend-item" key={l}>
                                <div className="donut-dot" style={{ background: c }} />
                                <span className="donut-legend-label">{l}</span>
                                <span className="donut-legend-val">{v}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const quickActions = [
    { Icon: UserPlus, label: 'Add Member', path: '/admin/members' },
    { Icon: FolderKanban, label: 'New Project', path: '/admin/projects' },
    { Icon: Inbox, label: 'Create Event', path: '/admin/events' },
    { Icon: CreditCard, label: 'Add Post', path: '/admin/cms' },
]

const Dashboard = ({ navigate }) => {
    const [dashboardData, setDashboardData] = useState(null)
    const [recentProjects, setRecentProjects] = useState([])
    const [recentLeads, setRecentLeads] = useState([])
    const [activityFeed, setActivityFeed] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/dashboard/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setDashboardData(data.stats)
                    setRecentProjects(data.recentProjects)
                    setRecentLeads(data.recentLeads)
                    
                    // Simple mock activity feed based on recent DB inserts
                    const mockFeed = [
                        ...data.recentLeads.map(l => ({ id: `l-${l.id}`, type: 'lead', action: 'New member registered', detail: l.name, time: 'Recently' })),
                        ...data.recentProjects.map(p => ({ id: `p-${p.id}`, type: 'client', action: 'Project created', detail: p.name, time: 'Recently' }))
                    ].slice(0, 5)
                    setActivityFeed(mockFeed)
                }
            } catch (error) { console.error('Dashboard fetch failed', error) }
            finally { setLoading(false) }
        }
        fetchDashboard()
    }, [])

    if (loading || !dashboardData) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--admin-muted)' }}>Loading dashboard...</div>
            </div>
        )
    }

    const stats = [
        { 
            label: 'Total Members', 
            value: dashboardData.totalMembers || 0,
            Icon: Users, 
            iconClass: 'blue', 
            change: '+2 this month', 
            up: true, 
            spark: [30, 45, 35, 55, 40, 65, 50, 70, 60, 85, 75, 95], 
            glowColor: 'rgba(99,102,241,0.12)' 
        },
        { 
            label: 'Upcoming Events', 
            value: dashboardData.upcomingEvents || 0, 
            Icon: FolderKanban, 
            iconClass: 'purple', 
            change: '2 this week', 
            up: true, 
            spark: [80, 65, 70, 55, 60, 50, 40, 55, 45, 60, 50, 65], 
            glowColor: 'rgba(168,85,247,0.12)' 
        },
        { 
            label: 'Open Projects', 
            value: dashboardData.activeProjects || 0, 
            Icon: TrendingUp, 
            iconClass: 'green', 
            change: 'Active contributions', 
            up: true, 
            spark: [40, 50, 45, 60, 55, 70, 65, 80, 75, 90, 85, 100], 
            glowColor: 'rgba(34,197,94,0.12)'
        },
        { 
            label: 'New Registrations', 
            value: recentLeads.length || 0, 
            Icon: Inbox, 
            iconClass: 'orange', 
            change: 'Needs approval', 
            up: true, 
            spark: [20, 35, 25, 40, 30, 45, 35, 50, 40, 30, 45, 35], 
            glowColor: 'rgba(249,115,22,0.12)' 
        },
    ]

    return (
        <>
            {/* Header */}
            <div className="admin-page-header">
                <div>
                    <h2>Good Evening, Team 👋</h2>
                    <p>Here's C-Square Club — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn-ghost" onClick={() => window.open('/', '_blank')}>
                        <Globe size={14} /> View Site
                    </button>
                    <button className="btn-primary" onClick={() => navigate('/admin/events')}>
                        <Plus size={14} /> New Event
                    </button>
                </div>
            </div>

            {/* Quick actions */}
            <div className="quick-actions">
                {quickActions.map(q => (
                    <button key={q.label} className="quick-action-btn" onClick={() => navigate(q.path)}>
                        <q.Icon size={24} strokeWidth={1.5} color="var(--admin-primary)" />
                        <span className="qa-label">{q.label}</span>
                    </button>
                ))}
            </div>

            {/* Stat Cards */}
            <div className="admin-stats-grid">
                {stats.map((s, i) => <StatCard key={i} {...s} />)}
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <BarChart dashboardData={dashboardData} /><DonutChart dashboardData={dashboardData} />
            </div>

            {/* Projects + Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.25rem' }}>
                {/* Recent projects */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3><FolderKanban size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />Active Projects</h3>
                        <button className="btn-ghost" style={{ fontSize: '0.78rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => navigate('/admin/projects')}>
                            View All <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead><tr><th>Project</th><th>Track</th><th>Status</th><th>Progress</th><th>Deadline</th></tr></thead>
                            <tbody>
                                {recentProjects.length > 0 ? recentProjects.map(p => (
                                    <tr key={p.id}>
                                        <td><strong style={{ fontSize: '0.85rem' }}>{p.name}</strong></td>
                                        <td><span className="badge badge-gray">{p.theme || 'General'}</span></td>
                                        <td><StatusBadge s={p.status} /></td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 110 }}>
                                                <div className="progress-bar" style={{ flex: 1 }}><div className="progress-fill" style={{ width: `${p.progress}%` }} /></div>
                                                <span style={{ fontSize: '0.73rem', color: 'var(--admin-muted)', width: 28 }}>{p.progress}%</span>
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--admin-muted)', fontSize: '0.78rem' }}>{p.deadline ? new Date(p.deadline).toLocaleDateString() : '—'}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--admin-muted)' }}>No projects found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Activity */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3><Activity size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />Recent Activity</h3>
                        <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>Live</span>
                    </div>
                    <div className="activity-feed">
                        {activityFeed.length > 0 ? activityFeed.map(a => (
                            <div className="activity-item" key={a.id}>
                                <div className={`activity-icon-wrap ${a.type}`}>
                                    {a.type === 'lead' && <UserPlus size={14} />}
                                    {a.type === 'payment' && <CreditCard size={14} />}
                                    {a.type === 'update' && <RefreshCcw size={14} />}
                                    {a.type === 'client' && <Users size={14} />}
                                    {a.type === 'task' && <CheckCircle2 size={14} />}
                                </div>
                                <div className="activity-text">
                                    <div className="activity-action">{a.action}</div>
                                    <div className="activity-detail">{a.detail}</div>
                                </div>
                                <div className="activity-time">{a.time}</div>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', color: 'var(--admin-muted)', padding: '20px' }}>No recent activity</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Leads */}
            <div className="admin-card" style={{ marginTop: '1.25rem' }}>
                <div className="admin-card-header">
                    <h3><Inbox size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />Recent Registrations</h3>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <span className="badge badge-red">{recentLeads.filter(l => l.status === 'Pending').length} Pending</span>
                        <button className="btn-ghost" style={{ fontSize: '0.78rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => navigate('/admin/members')}>
                            View All <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead><tr><th>Name</th><th>Track</th><th>Source</th><th>Status</th><th>Date</th></tr></thead>
                        <tbody>
                            {recentLeads.length > 0 ? recentLeads.map(l => (
                                <tr key={l.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div className="team-avatar" style={{ width: 28, height: 28, fontSize: '0.65rem' }}>{l.name.slice(0, 2).toUpperCase()}</div>
                                            <div><strong style={{ fontSize: '0.85rem' }}>{l.name}</strong><div style={{ fontSize: '0.73rem', color: 'var(--admin-muted)' }}>{l.email}</div></div>
                                        </div>
                                    </td>
                                    <td><span className="badge badge-blue">{l.track || 'General'}</span></td>
                                    <td><span className="badge badge-gray">{l.batch || '—'}</span></td>
                                    <td><LeadBadge s={l.status || 'Pending'} /></td>
                                    <td style={{ color: 'var(--admin-muted)', fontSize: '0.78rem' }}>{new Date(l.created_at || Date.now()).toLocaleDateString()}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--admin-muted)' }}>No leads found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

const StatusBadge = ({ s }) => {
    const m = { 'Delivered': 'badge-green', 'In Progress': 'badge-blue', 'Pending': 'badge-yellow' }
    return <span className={`badge ${m[s] || 'badge-gray'}`}>{s}</span>
}
const LeadBadge = ({ s }) => {
    const m = { 'New': 'badge-red', 'In Review': 'badge-yellow', 'Converted': 'badge-green' }
    return <span className={`badge ${m[s] || 'badge-gray'}`}>{s}</span>
}

export default Dashboard
