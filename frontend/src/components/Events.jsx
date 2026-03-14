import projectThumb from '../assets/project-thumb.png'

const Events = () => {
    const events = [
        {
            id: 1,
            title: "Competitive Coding Challenge",
            image: projectThumb,
            solution: "Join our latest coding contest to compete with your peers and improve your DSA skills.",
            techStack: ["C++", "Python", "Algorithms", "DSA"],
            demoLink: "https://unstop.com/o/4zdBnm9?lb=Aexm91xM&utm_medium=Share&utm_source=WhatsApp",
            repoLink: "#"
        },
        {
            id: 2,
            title: "Web Development Bootcamp",
            image: projectThumb,
            solution: "An interactive bootcamp covering the fundamentals of modern web development.",
            techStack: ["HTML", "CSS", "React", "Node.js"],
            demoLink: "https://unstop.com/o/aJQEfLU?lb=7vD4WRl9&utm_medium=Share&utm_source=shortUrl",
            repoLink: "#"
        },
        {
            id: 3,
            title: "AI/ML Workshop",
            image: projectThumb,
            solution: "Dive into the world of Machine Learning with hands-on projects and expert guidance.",
            techStack: ["Python", "TensorFlow", "Pandas", "AI"],
            demoLink: "https://unstop.com/o/y4zYGhK?lb=Eaz0y9gv&utm_medium=Share&utm_source=WhatsApp",
            repoLink: "#"
        }
    ]

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
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="bg-glassBg border border-glassBorder backdrop-blur-[18px] rounded-[24px] overflow-hidden flex flex-col h-full transition-all duration-400 ease hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:border-[rgba(255,215,0,0.3)] hover:shadow-primaryGlow"
                        >
                            <div className="w-full h-[220px] overflow-hidden relative border-b border-subtleBorder">
                                <img src={event.image} alt={event.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-110" />
                                <div className="absolute top-4 right-4 bg-primary text-[#111111] text-[0.8rem] font-bold px-3 py-1 rounded-full shadow-[0_4px_10px_rgba(255,215,0,0.3)]">
                                    Upcoming
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                                <h3 className="text-[1.6rem] font-[700] text-textMain leading-[1.3] mb-4">{event.title}</h3>

                                <div className="flex-grow">
                                    <p className="text-[1.05rem] text-textMuted leading-[1.6] mb-6">{event.solution}</p>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {event.techStack.slice(0, 3).map((tech, i) => (
                                        <span key={i} className="text-[0.75rem] px-3 py-1 bg-subtleBg border border-subtleBorder rounded-full text-textMain font-[500]">{tech}</span>
                                    ))}
                                    {event.techStack.length > 3 && (
                                        <span className="text-[0.75rem] px-3 py-1 bg-subtleBg border border-subtleBorder rounded-full text-textMain font-[500]">+{event.techStack.length - 3}</span>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-3 mt-auto pt-5 border-t border-subtleBorder">
                                    <a href={event.demoLink} className="flex-1 text-center py-[10px] rounded-xl font-[600] no-underline text-[0.95rem] transition-all duration-300 ease-out bg-primary text-[#111111] shadow-[0_4px_15px_rgba(255,215,0,0.2)] hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(255,215,0,0.3)]">
                                        Register Now
                                    </a>
                                    <a href={event.repoLink} className="px-5 py-[10px] rounded-xl font-[600] no-underline text-[0.95rem] transition-all duration-300 ease-out bg-subtleBg text-textMain border border-subtleBorder hover:bg-subtleBorder hover:-translate-y-1">
                                        Details
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
export default Events
