const Collaborations = () => {
  const partners = [
    {
      title: "TechCorp Global",
      description: "Our primary industry sponsor providing mentorship and compute resources for club hackathons."
    },
    {
      title: "University CS Department",
      description: "Official partner providing academic guidance, lab space, and certification support."
    },
    {
      title: "Open Source Initiative",
      description: "Collaborating on global open-source projects where students contribute real code."
    },
    {
      title: "Dev Student Clubs",
      description: "Partnering with Google DSC to bring specialized mobile and cloud workshops to campus."
    },
    {
      title: "Local Tech Incubator",
      description: "Connecting our top members with startup opportunities and seed funding guidance."
    },
    {
      title: "Alumni Network",
      description: "Our strong network of past members now working at FAANG companies worldwide."
    }
  ]

  return (
    <section className="py-[100px] px-6 relative" id="collaborations">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-[100px]">
          <h2 className="text-[2.4rem] sm:text-[3.2rem] font-[800] mb-[18px]">Our <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">Collaborations</span></h2>
          <p className="max-w-[680px] mx-auto text-textMuted text-[1.15rem] leading-[1.7]">
            We partner with the best organizations and academic bodies to bring you premium opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner, index) => (
            <div key={index} className="bg-glassBg border border-glassBorder backdrop-blur-[18px] rounded-[20px] p-[36px_32px] transition-all duration-[350ms] ease-out shadow-[0_18px_45px_rgba(0,0,0,0.25)] hover:-translate-y-2 hover:shadow-[0_30px_65px_var(--tw-shadow-color)] hover:shadow-primaryGlow hover:border-primary/40">
              <h3 className="text-[1.4rem] mb-[14px] text-primary">{partner.title}</h3>
              <p className="text-textMuted leading-[1.7] text-base">{partner.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Collaborations