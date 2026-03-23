import React, { useState, useEffect } from 'react';

const Team = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/team`);
                if (res.ok) {
                    const data = await res.json();
                    setTeamMembers(data.filter(m => m.status === 'Active').slice(0, 3));
                }
            } catch (error) {
                console.error("Failed to fetch team:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);

    return (
        <section className="py-[140px] px-6 relative" id="team">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-[80px]">
                    <h2 className="text-[2.5rem] md:text-[3.2rem] font-[800] mb-5 text-textMain">Core <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">Team</span></h2>
                    <p className="max-w-[680px] mx-auto text-textMuted text-[1.15rem] leading-[1.7]">
                        Meet the passion-driven students leading C-Square forward.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                    {teamMembers.map((item) => (
                        <div key={item.id} className="bg-glassBg border border-glassBorder backdrop-blur-[18px] p-[30px] lg:p-[40px_32px] rounded-[24px] transition-all duration-400 ease flex flex-col justify-between h-full hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.2)] hover:border-[rgba(255,215,0,0.3)] hover:shadow-primaryGlow">
                            <div className="text-[3rem] leading-none text-primary opacity-30 mb-5 font-serif">"</div>

                            <div className="mb-4 flex gap-1 text-[#fbbf24]">
                                {[...Array(item.rating || 5)].map((_, i) => (
                                    <span key={i}>★</span>
                                ))}
                            </div>

                            <p className="text-[1.05rem] leading-[1.7] text-textMain mb-[30px] italic flex-grow">"{item.feedback || 'Dedicated team member passionate about coding and technology.'}"</p>

                            <div className="flex items-center gap-4 mt-auto pt-5 border-t border-glassBorder">
                                <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-[700] text-[#111111] text-[1.2rem] shrink-0">
                                    {(item.name || 'CN').slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="text-[1rem] font-[700] text-textMain mb-1">{item.name}</h4>
                                    <span className="text-[0.85rem] text-textMuted block">{item.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && <p className="text-textMuted text-center col-span-full">Loading team members...</p>}
                    {!loading && teamMembers.length === 0 && <p className="text-textMuted text-center col-span-full">Team information updating soon.</p>}
                </div>
            </div>
        </section>
    )
}

export default Team
