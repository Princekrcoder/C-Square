import { useState } from 'react'
import { Save, Download, Upload, Shield, Mail, Palette, Building2, History, UserPlus, RefreshCcw, CheckCircle2, Users, CreditCard } from 'lucide-react'

const TABS = [
    { key: 'company', label: 'Company', Icon: Building2 },
    { key: 'appearance', label: 'Appearance', Icon: Palette },
    { key: 'smtp', label: 'SMTP', Icon: Mail },
    { key: 'roles', label: 'Roles', Icon: Shield },
    { key: 'backup', label: 'Backup', Icon: Download },
]

const Settings = ({ theme, toggleTheme }) => {
    const [tab, setTab] = useState('company')
    const [company, setCompany] = useState({ name: 'c-square Studio', tagline: 'Building Digital Experiences', email: 'hello@c-square.in', phone: '+91 98765 43210', address: 'Chandigarh, India', website: 'https://c-square.in' })
    const [smtp, setSmtp] = useState({ host: 'smtp.gmail.com', port: '587', user: 'admin@c-square.in', password: '', from: 'c-square Studio <hello@c-square.in>' })
    const [saved, setSaved] = useState(false)

    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

    return (
        <>
            <div className="admin-page-header">
                <div><h2>Settings</h2><p>Configure c-square Studio</p></div>
                <button className="btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Save size={14} /> {saved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: 12, padding: 4, marginBottom: '1.5rem', width: 'fit-content', flexWrap: 'wrap' }}>
                {TABS.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)} style={{
                        padding: '7px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
                        fontFamily: 'Outfit,sans-serif', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.18s',
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: tab === t.key ? 'var(--admin-primary)' : 'none',
                        color: tab === t.key ? '#fff' : 'var(--admin-muted)'
                    }}><t.Icon size={14} /> {t.label}</button>
                ))}
            </div>

            {/* Company */}
            {tab === 'company' && (
                <div className="admin-card">
                    <div className="admin-card-header"><h3>Company Information</h3></div>
                    <div className="admin-modal-body" style={{ padding: '1.5rem' }}>
                        <div className="admin-form-grid">
                            {[['Studio Name', 'name', 'c-square Studio'], ['Tagline', 'tagline', ''], ['Email', 'email', ''], ['Phone', 'phone', ''], ['Address', 'address', ''], ['Website', 'website', '']].map(([lbl, key, ph]) => (
                                <div className={`admin-form-group${lbl === 'Address' || lbl === 'Website' ? '' : (lbl === 'Studio Name' || lbl === 'Tagline' ? ' full' : '')}`} key={key}>
                                    <label>{lbl}</label>
                                    <input value={company[key]} placeholder={ph} onChange={e => setCompany({ ...company, [key]: e.target.value })} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Appearance */}
            {tab === 'appearance' && (
                <div className="admin-card">
                    <div className="admin-card-header"><h3>Appearance</h3></div>
                    <div style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--admin-surface2)', borderRadius: 12, marginBottom: '1rem' }}>
                            <div>
                                <strong style={{ color: 'var(--admin-text)' }}>Theme Mode</strong>
                                <div style={{ fontSize: '0.8rem', color: 'var(--admin-muted)' }}>Currently: {theme === 'light' ? 'Light' : 'Dark'} Mode</div>
                            </div>
                            <button className="btn-primary" onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
                                <Palette size={14} /> Switch to {theme === 'light' ? 'Dark' : 'Light'}
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            {[['--admin-primary', 'Primary', '#6366f1'], ['--admin-accent', 'Accent', '#a855f7'], ['--admin-green', 'Success', '#22c55e'], ['--admin-red', 'Danger', '#ef4444']].map(([v, l, c]) => (
                                <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.6rem 1rem', background: 'var(--admin-surface2)', borderRadius: 10, border: '1px solid var(--admin-border)' }}>
                                    <div style={{ width: 14, height: 14, borderRadius: 4, background: c }} />
                                    <span style={{ fontSize: '0.82rem', color: 'var(--admin-text)' }}>{l}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* SMTP */}
            {tab === 'smtp' && (
                <div className="admin-card">
                    <div className="admin-card-header"><h3>SMTP Configuration</h3></div>
                    <div className="admin-modal-body" style={{ padding: '1.5rem' }}>
                        <div className="admin-form-grid">
                            <div className="admin-form-group"><label>SMTP Host</label><input value={smtp.host} onChange={e => setSmtp({ ...smtp, host: e.target.value })} /></div>
                            <div className="admin-form-group"><label>Port</label><input value={smtp.port} onChange={e => setSmtp({ ...smtp, port: e.target.value })} /></div>
                            <div className="admin-form-group"><label>Username</label><input value={smtp.user} onChange={e => setSmtp({ ...smtp, user: e.target.value })} /></div>
                            <div className="admin-form-group"><label>Password</label><input type="password" value={smtp.password} onChange={e => setSmtp({ ...smtp, password: e.target.value })} /></div>
                            <div className="admin-form-group full"><label>From Address</label><input value={smtp.from} onChange={e => setSmtp({ ...smtp, from: e.target.value })} /></div>
                        </div>
                        <button className="btn-ghost" style={{ marginTop: '0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 5 }}><Mail size={13} /> Send Test Email</button>
                    </div>
                </div>
            )}

            {/* Roles */}
            {tab === 'roles' && (
                <div className="admin-card">
                    <div className="admin-card-header"><h3>Roles & Permissions</h3></div>
                    {[{ role: 'Super Admin', desc: 'Full access to all features', perms: ['Manage Users', 'Billing', 'Settings', 'All Modules'] }, { role: 'Manager', desc: 'Can manage clients, projects, leads', perms: ['Clients', 'Projects', 'Leads', 'Payments'] }, { role: 'Developer', desc: 'Project and task access only', perms: ['Projects', 'Team Tasks'] }].map(r => (
                        <div key={r.role} style={{ padding: '1.25rem', borderBottom: '1px solid var(--admin-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <div>
                                    <strong style={{ color: 'var(--admin-text)' }}>{r.role}</strong>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--admin-muted)' }}>{r.desc}</div>
                                </div>
                                <Shield size={16} color="var(--admin-primary)" strokeWidth={1.8} />
                            </div>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {r.perms.map(p => <span key={p} className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{p}</span>)}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Backup */}
            {tab === 'backup' && (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div className="admin-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ color: 'var(--admin-text)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 8 }}><Download size={16} /> Export Data</h3>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            {['Clients', 'Projects', 'Leads', 'Invoices', 'Full Backup'].map(item => (
                                <button key={item} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.82rem' }}>
                                    <Download size={12} /> {item} (.json)
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="admin-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ color: 'var(--admin-text)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 8 }}><Upload size={16} /> Import Data</h3>
                        <div style={{ border: '2px dashed var(--admin-border)', borderRadius: 12, padding: '2rem', textAlign: 'center' }}>
                            <Upload size={28} color="var(--admin-muted)" strokeWidth={1.4} />
                            <p style={{ color: 'var(--admin-muted)', marginTop: '0.75rem', fontSize: '0.85rem' }}>Drop a JSON file or click to upload</p>
                            <button className="btn-ghost" style={{ marginTop: '0.75rem', fontSize: '0.82rem' }}>Choose File</button>
                        </div>
                    </div>
                    <div className="admin-card">
                        <div className="admin-card-header"><h3><History size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />Activity Log</h3></div>
                        <div className="activity-feed">
                            <div className="admin-empty"><p>No recent activity</p></div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Settings
