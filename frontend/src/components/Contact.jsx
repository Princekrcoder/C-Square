import { useState } from 'react'
import { FaLinkedinIn, FaGithub, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdLocationOn } from "react-icons/md";
import { HiOutlineMail } from "react-icons/hi";
import { FiPhoneCall } from "react-icons/fi";

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.name || !formData.email || !formData.message) {
            setError('Please fill in all fields')
            return
        }

        setLoading(true)
        // Simulate success since backend is not yet implemented
        setTimeout(() => {
            setSuccess(true)
            setFormData({ name: '', email: '', message: '' })
            setLoading(false)
            setTimeout(() => setSuccess(false), 5000)
        }, 800)
    }
    return (
        <section className="py-[100px] px-6 pb-[140px] relative" id="contact-form">
            <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-[60px] items-center">

                {/* Left Info Column */}
                <div className="flex flex-col gap-8 text-center lg:text-left items-center lg:items-start">
                    <div>
                        <h2 className="text-[3rem] font-[800] mb-5 text-textMain leading-[1.1]">Get in Touch with <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">C-Square</span></h2>
                    </div>

                    <p className="text-[1.15rem] leading-[1.7] text-textMuted max-w-[480px]">
                        Have questions about joining, upcoming events, workshops, or coding challenges?
                        We'd love to hear from you.
                    </p>

                    <div className="flex flex-col gap-5 mt-2.5 w-full">
                        <div className="group flex items-center justify-center lg:justify-start gap-5 bg-glassBg border border-glassBorder p-6 rounded-[20px] transition-all duration-300 ease hover:translate-x-2.5 hover:border-[rgba(255,215,0,0.4)] hover:bg-subtleBg text-left">
                            <div className="w-[52px] h-[52px] rounded-[14px] grid place-items-center bg-[rgba(255,215,0,0.10)] border border-[rgba(255,215,0,0.20)] text-primary shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 ease group-hover:scale-[1.06] group-hover:bg-[rgba(255,215,0,0.16)] group-hover:border-[rgba(255,215,0,0.35)] group-hover:shadow-[0_14px_40px_rgba(255,215,0,0.15)] text-[26px]">
                                <HiOutlineMail />
                            </div>
                            <div>
                                <h4 className="text-[0.95rem] text-textMuted mb-1 uppercase tracking-[1px]">Email Us</h4>
                                <a href="mailto:csquareclub@gmail.com" className="text-[1.1rem] text-textMain font-[600] no-underline color-inherit block">csquareclub@gmail.com</a>
                            </div>
                        </div>

                        {/* ✅ Phone Added */}
                        <div className="group flex items-center justify-center lg:justify-start gap-5 bg-glassBg border border-glassBorder p-6 rounded-[20px] transition-all duration-300 ease hover:translate-x-2.5 hover:border-[rgba(255,215,0,0.4)] hover:bg-subtleBg text-left">
                            <div className="w-[52px] h-[52px] rounded-[14px] grid place-items-center bg-[rgba(255,215,0,0.10)] border border-[rgba(255,215,0,0.20)] text-primary shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 ease group-hover:scale-[1.06] group-hover:bg-[rgba(255,215,0,0.16)] group-hover:border-[rgba(255,215,0,0.35)] group-hover:shadow-[0_14px_40px_rgba(255,215,0,0.15)] text-[26px]">
                                <FiPhoneCall />
                            </div>
                            <div>
                                <h4 className="text-[0.95rem] text-textMuted mb-1 uppercase tracking-[1px]">Call Us</h4>
                                <a href="tel:+919876543210" className="text-[1.1rem] text-textMain font-[600] no-underline color-inherit block">+91 98765 43210</a>
                            </div>
                        </div>

                        <div className="group flex items-center justify-center lg:justify-start gap-5 bg-glassBg border border-glassBorder p-6 rounded-[20px] transition-all duration-300 ease hover:translate-x-2.5 hover:border-[rgba(255,215,0,0.4)] hover:bg-subtleBg text-left">
                            <div className="w-[52px] h-[52px] rounded-[14px] grid place-items-center bg-[rgba(255,215,0,0.10)] border border-[rgba(255,215,0,0.20)] text-primary shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 ease group-hover:scale-[1.06] group-hover:bg-[rgba(255,215,0,0.16)] group-hover:border-[rgba(255,215,0,0.35)] group-hover:shadow-[0_14px_40px_rgba(255,215,0,0.15)] text-[26px]">
                                <MdLocationOn />
                            </div>
                            <div>
                                <h4 className="text-[0.95rem] text-textMuted mb-1 uppercase tracking-[1px]">Find Us</h4>
                                <p className="text-[1.1rem] text-textMain font-[600] m-0">Your College Name, City, India</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Form Column */}
                <div className="bg-glassBg border border-glassBorder backdrop-blur-[20px] rounded-[30px] p-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.3)]">

                    <div className="mb-[30px] pb-[24px] border-b border-glassBorder">
                        <h4 className="text-[0.95rem] text-textMuted mb-4 uppercase tracking-[1px]">Connect With C-Square</h4>

                        <div className="flex gap-3">
                            <a
                                href="https://www.linkedin.com/"
                                target="_blank"
                                rel="noreferrer"
                                className="group/social w-[45px] h-[45px] rounded-xl bg-glassBg border border-glassBorder flex items-center justify-center text-textMain no-underline transition-all duration-300 ease hover:bg-primary hover:text-[#111111] hover:border-primary hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,215,0,0.3)] text-[18px]"
                                aria-label="LinkedIn"
                            >
                                <FaLinkedinIn className="transition-transform duration-200 ease group-hover/social:scale-110" />
                            </a>

                            <a
                                href="https://twitter.com/"
                                target="_blank"
                                rel="noreferrer"
                                className="group/social w-[45px] h-[45px] rounded-xl bg-glassBg border border-glassBorder flex items-center justify-center text-textMain no-underline transition-all duration-300 ease hover:bg-primary hover:text-[#111111] hover:border-primary hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,215,0,0.3)] text-[18px]"
                                aria-label="Twitter"
                            >
                                <FaXTwitter className="transition-transform duration-200 ease group-hover/social:scale-110" />
                            </a>

                            <a
                                href="https://github.com/"
                                target="_blank"
                                rel="noreferrer"
                                className="group/social w-[45px] h-[45px] rounded-xl bg-glassBg border border-glassBorder flex items-center justify-center text-textMain no-underline transition-all duration-300 ease hover:bg-primary hover:text-[#111111] hover:border-primary hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,215,0,0.3)] text-[18px]"
                                aria-label="GitHub"
                            >
                                <FaGithub className="transition-transform duration-200 ease group-hover/social:scale-110" />
                            </a>

                            <a
                                href="https://www.instagram.com/"
                                target="_blank"
                                rel="noreferrer"
                                className="group/social w-[45px] h-[45px] rounded-xl bg-glassBg border border-glassBorder flex items-center justify-center text-textMain no-underline transition-all duration-300 ease hover:bg-primary hover:text-[#111111] hover:border-primary hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,215,0,0.3)] text-[18px]"
                                aria-label="Instagram"
                            >
                                <FaInstagram className="transition-transform duration-200 ease group-hover/social:scale-110" />
                            </a>
                        </div>
                    </div>

                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        {success && (
                            <div className="p-3 mb-4 bg-emerald-500 text-white rounded-lg text-center">
                                Message sent successfully! We'll get back to you soon.
                            </div>
                        )}

                        {error && (
                            <div className="p-3 mb-4 bg-red-500 text-white rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label className="text-[0.95rem] text-textMuted font-[500]">Your Name</label>
                            <input
                                type="text"
                                name="name"
                                className="w-full bg-[rgba(0,0,0,0.2)] border border-glassBorder rounded-xl p-4 text-[1rem] text-textMain font-inherit transition-all duration-300 ease outline-none focus:border-primary focus:bg-[rgba(255,215,0,0.05)] focus:shadow-[0_0_0_4px_rgba(255,215,0,0.1)]"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[0.95rem] text-textMuted font-[500]">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full bg-[rgba(0,0,0,0.2)] border border-glassBorder rounded-xl p-4 text-[1rem] text-textMain font-inherit transition-all duration-300 ease outline-none focus:border-primary focus:bg-[rgba(255,215,0,0.05)] focus:shadow-[0_0_0_4px_rgba(255,215,0,0.1)]"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[0.95rem] text-textMuted font-[500]">Message</label>
                            <textarea
                                name="message"
                                className="w-full bg-[rgba(0,0,0,0.2)] border border-glassBorder rounded-xl p-4 text-[1rem] text-textMain font-inherit transition-all duration-300 ease outline-none focus:border-primary focus:bg-[rgba(255,215,0,0.05)] focus:shadow-[0_0_0_4px_rgba(255,215,0,0.1)] min-h-[140px] resize-y"
                                placeholder="Your question or message..."
                                value={formData.message}
                                onChange={handleChange}
                                disabled={loading}
                            ></textarea>
                        </div>

                        <button type="submit" className="bg-primary text-[#111111] border-none p-[18px] rounded-xl text-[1.1rem] font-[700] cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] mt-2.5 outline-none hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,215,0,0.4)] hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed w-full" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>

                </div>

            </div>
        </section>
    )
}

export default Contact
