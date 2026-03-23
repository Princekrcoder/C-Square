import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/yellow-logo.png';
import {
    ArrowLeft,
    Moon,
    Sun,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Github,
    LogOut // as fallback icon
} from 'lucide-react';
import '../styles/Login.css';

const Login = ({ theme, toggleTheme }) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok) {
                // Store token and user
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Navigate based on role
                if (data.user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                setErrorMsg(data.error || 'Login failed');
            }
        } catch (err) {
            console.error(err);
            setErrorMsg('Server error. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-blob blob-a"></div>
            <div className="login-blob blob-b"></div>

            <header className="login-header">
                <Link to="/" className="login-logo">
                    <img src={logo} alt="C-Square" width="60px" height="auto" />
                </Link>
                <div className="login-header-actions">
                    <Link to="/" className="back-link">
                        <ArrowLeft className="back-icon" />
                        <span>Back</span>
                    </Link>
                    <button className="login-theme-btn" onClick={toggleTheme}>
                        {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </header>

            <main className="login-main">
                <div className="login-card">
                    <div className="login-icon-wrap">
                        <Lock className="login-icon" />
                    </div>

                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">Sign in to your C-Square account</p>

                    {errorMsg && (
                        <div className="error-msg" style={{ marginBottom: '1rem', textAlign: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                            {errorMsg}
                        </div>
                    )}

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <Mail />
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <Lock />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </div>

                        <div className="login-options">
                            <label className="remember-label">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="forgot-link">Forgot password?</a>
                        </div>

                        <button type="submit" className="login-btn" disabled={isLoading}>
                            {isLoading ? (
                                <div className="spinner"></div>
                            ) : (
                                <>
                                    Sign In <ArrowRight className="btn-arrow" size={18} />
                                </>
                            )}
                        </button>

                        <div className="login-divider">
                            <span>or continue with</span>
                        </div>

                        <div className="social-btns">
                            <button type="button" className="social-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4" /></svg>
                                Google
                            </button>
                            <button type="button" className="social-btn">
                                <Github size={18} />
                                GitHub
                            </button>
                        </div>

                        <div className="login-register">
                            Don't have an account? <Link to="/register">Sign up</Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Login;
