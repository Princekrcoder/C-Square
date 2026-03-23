import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/yellow-logo.png';
import {
    ArrowLeft,
    Moon,
    Sun,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Github,
    Hash
} from 'lucide-react';
import '../styles/Register.css';

const Register = ({ theme, toggleTheme }) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        club_uid: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok) {
                // Registration successful, navigate to login
                navigate('/login');
            } else {
                alert(data.error || 'Registration failed');
            }
        } catch (err) {
            console.error(err);
            alert('Server error. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="reg-blob blob-a"></div>
            <div className="reg-blob blob-b"></div>

            <header className="reg-header">
                <Link to="/" className="reg-logo">
                    <img src={logo} alt="C-Square" width="60px" height="auto" />
                </Link>
                <div className="reg-header-actions">
                    <Link to="/" className="back-link">
                        <ArrowLeft className="back-icon" />
                        <span>Back</span>
                    </Link>
                    <button className="reg-theme-btn" onClick={toggleTheme}>
                        {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </header>

            <main className="reg-main">
                <div className="reg-card">
                    <div className="reg-icon-wrap">
                        <User className="reg-icon" />
                    </div>

                    <h1 className="reg-title">Create Account</h1>
                    <p className="reg-subtitle">Join the C-Square coding community</p>

                    <form className="reg-form" onSubmit={handleSubmit}>
                        <div className="reg-input-group">
                            <label htmlFor="name">Full Name</label>
                            <div className="reg-input-wrapper">
                                <span className="reg-icon-field">
                                    <User />
                                </span>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="reg-input-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="reg-input-wrapper">
                                <span className="reg-icon-field">
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

                        <div className="reg-input-group">
                            <label htmlFor="club_uid">Club UID</label>
                            <div className="reg-input-wrapper">
                                <span className="reg-icon-field">
                                    <Hash />
                                </span>
                                <input
                                    type="text"
                                    id="club_uid"
                                    name="club_uid"
                                    placeholder="Enter your Club UID"
                                    value={formData.club_uid}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="reg-input-group">
                            <label htmlFor="password">Password</label>
                            <div className="reg-input-wrapper">
                                <span className="reg-icon-field">
                                    <Lock />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="reg-eye"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </div>

                        <div className="reg-terms">
                            By signing up, you agree to our{' '}
                            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                        </div>

                        <button type="submit" className="reg-btn" disabled={isLoading}>
                            {isLoading ? (
                                <div className="reg-spinner"></div>
                            ) : (
                                <>
                                    Create Account <ArrowRight className="reg-arrow" size={18} />
                                </>
                            )}
                        </button>

                        <div className="reg-divider">
                            <span>or sign up with</span>
                        </div>

                        <div className="reg-social">
                            <button type="button" className="reg-social-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4" /></svg>
                                Google
                            </button>
                            <button type="button" className="reg-social-btn">
                                <Github size={18} />
                                GitHub
                            </button>
                        </div>

                        <div className="reg-login-link">
                            Already have an account? <Link to="/login">Sign in</Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Register;
