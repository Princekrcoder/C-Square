import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import SEO from './SEO';
import projectThumb from '../assets/project-thumb.png'

const EventsPage = ({ theme, toggleTheme }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchAllEvents = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/events`);
                if (res.ok) {
                    const data = await res.json();
                    setEvents(data);
                }
            } catch (error) {
                console.error("Failed to fetch events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllEvents();
    }, []);

    const displayEvents = events;

    return (
        <>
            <SEO
                title="All Events | C-Square"
                description="Discover all upcoming, ongoing, and past events at C-Square including hackathons, bootcamps, and coding challenges."
            />
            <div className="App">
                <div className="bg-blob blob-1"></div>
                <div className="bg-blob blob-2"></div>

                <Navbar theme={theme} toggleTheme={toggleTheme} />

                <div className="pt-[10px] pb-[80px] px-6 relative bg-transparent min-h-screen">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="text-center mb-[60px]">
                            <h1 className="text-[3rem] md:text-[4rem] font-[800] mb-5 text-textMain">All <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">Events</span></h1>
                            <p className="max-w-[680px] mx-auto text-textMuted text-[1.15rem] leading-[1.7]">
                                Discover all upcoming, ongoing, and past events at C-Square.
                            </p>
                        </div>

                        {loading ? (
                            <div className="text-center text-textMuted py-20">Loading events...</div>
                        ) : displayEvents.length === 0 ? (
                            <div className="text-center text-textMuted py-20">No events found.</div>
                        ) : (
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
                                                    {tags.map((tech, i) => (
                                                        <span key={i} className="text-[0.75rem] px-3 py-1 bg-subtleBg border border-subtleBorder rounded-full text-textMain font-[500]">{tech}</span>
                                                    ))}
                                                </div>

                                                <div className="flex flex-wrap gap-3 mt-auto pt-5 border-t border-subtleBorder">
                                                    <a href={event.demoLink || "#"} className="flex-1 text-center py-[10px] rounded-xl font-[600] no-underline text-[0.95rem] transition-all duration-300 ease-out bg-primary text-[#111111] shadow-[0_4px_15px_rgba(255,215,0,0.2)] hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(255,215,0,0.3)]">
                                                        Register Now
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
};

export default EventsPage;
