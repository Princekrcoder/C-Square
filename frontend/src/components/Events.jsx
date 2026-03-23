import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import projectThumb from '../assets/project-thumb.png'

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedEvents = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/events/featured`);
                if (res.ok) {
                    const data = await res.json();
                    setEvents(data);
                }
            } catch (error) {
                console.error("Failed to fetch featured events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedEvents();
    }, []);

    const displayEvents = events;

    if (loading) {
        return (
            <section className="py-[100px] px-6 relative bg-transparent" id="events">
                <div className="max-w-[1200px] mx-auto text-center">
                    <p className="text-textMuted">Loading events...</p>
                </div>
            </section>
        )
    }

    return (
        <section className="py-[100px] px-6 relative bg-transparent" id="events">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-[80px]">
                    <h2 className="text-[2.5rem] md:text-[3.2rem] font-[800] mb-5 text-textMain">Upcoming <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">Events</span></h2>
                    <p className="max-w-[680px] mx-auto text-textMuted text-[1.15rem] leading-[1.7]">
                        Don't miss our next workshop and coding contest — register now and level up your skills.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {displayEvents.map((event) => {
                        const tags = event.tags || [];
                        return (
                        <div
                            key={event.id}
                            className="bg-glassBg border border-glassBorder backdrop-blur-[18px] rounded-[24px] overflow-hidden flex flex-col h-full transition-all duration-400 ease hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:border-[rgba(255,215,0,0.3)] hover:shadow-primaryGlow"
                        >
                            <div className="w-full h-[220px] overflow-hidden relative border-b border-subtleBorder">
                                <img src={event.image_url || projectThumb} alt={event.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-110" />
                                <div className="absolute top-4 right-4 bg-primary text-[#111111] text-[0.8rem] font-bold px-3 py-1 rounded-full shadow-[0_4px_10px_rgba(255,215,0,0.3)]">
                                    {event.status || 'Upcoming'}
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                                <h3 className="text-[1.6rem] font-[700] text-textMain leading-[1.3] mb-4">{event.title}</h3>

                                <div className="flex-grow">
                                    <p className="text-[1.05rem] text-textMuted leading-[1.6] mb-6">{event.description || event.solution}</p>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {tags.slice(0, 3).map((tech, i) => (
                                        <span key={i} className="text-[0.75rem] px-3 py-1 bg-subtleBg border border-subtleBorder rounded-full text-textMain font-[500]">{tech}</span>
                                    ))}
                                    {tags.length > 3 && (
                                        <span className="text-[0.75rem] px-3 py-1 bg-subtleBg border border-subtleBorder rounded-full text-textMain font-[500]">+{tags.length - 3}</span>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-3 mt-auto pt-5 border-t border-subtleBorder">
                                    <a href={event.demoLink || "#"} className="flex-1 text-center py-[10px] rounded-xl font-[600] no-underline text-[0.95rem] transition-all duration-300 ease-out bg-primary text-[#111111] shadow-[0_4px_15px_rgba(255,215,0,0.2)] hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(255,215,0,0.3)]">
                                        Register Now
                                    </a>
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
                <div className="mt-12 text-center">
                    <Link to="/events" className="inline-block px-8 py-3 rounded-xl font-[600] no-underline text-[1rem] transition-all duration-300 ease-out bg-subtleBg text-textMain border border-subtleBorder hover:bg-subtleBorder hover:-translate-y-1">
                        View All Events
                    </Link>
                </div>
            </div>
        </section>
    )
}
export default Events
