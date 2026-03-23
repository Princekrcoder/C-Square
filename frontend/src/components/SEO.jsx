import { Helmet } from "react-helmet-async";

const SEO = ({
  title = "Top Web Development Agency in Mohali | c-square Studio",
  description = "c-square Studio is a premier web development company in Mohali, Punjab offering custom React web apps, e-commerce solutions, and tech consulting for modern businesses.",
  canonical = "https://csquare.vercel.app/",
  ogImage = "/og-image.png",
}) => {

  // ✅ Base site URL (for social share absolute image)
  const SITE_URL = "https://csquare.vercel.app";

  // ✅ Absolute OG Image URL (important for WhatsApp/LinkedIn share previews)
  const OG_IMAGE_ABS = ogImage.startsWith("http")
    ? ogImage
    : `${SITE_URL}${ogImage}`;

  // ✅ Replace these when social links are ready
  const SOCIAL_LINKS = [
    "https://www.linkedin.com/in/princekrcoder", // later
    "https://github.com/princekrcoder", // later
    "https://www.instagram.com/princekrcoder", // later
    "https://twitter.com/princekrcoder", // later
  ];

  const schemaOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "c-square Studio",
    alternateName: ["c-square", "c-square Studio"],
    url: SITE_URL + "/",
    email: "csquare@gmail.com",
    telephone: "+918092701770",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mohali",
      addressRegion: "Punjab",
      postalCode: "140413",
      addressCountry: "IN",
    },

    // ✅ Brand authority (helps brand keyword ranking)
    founder: {
      "@type": "Person",
      name: "PrinceKRCoder",
      url: SITE_URL + "/",
    },

    sameAs: SOCIAL_LINKS,
  };

  const schemaLocalBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "c-square Studio",
    alternateName: ["c-square", "c-square Studio"],
    url: SITE_URL + "/",
    telephone: "+918092701770",
    email: "csquare@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mohali",
      addressRegion: "Punjab",
      postalCode: "140413",
      addressCountry: "IN",
    },

    // ✅ for “PrinceKRCoder” search ranking
    founder: {
      "@type": "Person",
      name: "PrinceKRCoder",
    },

    areaServed: ["IN", "US", "CA", "GB"],
    knowsAbout: [
      "Web Development",
      "Web Applications",
      "E-commerce Development",
      "Portfolio Websites",
      "Tech Consulting",
    ],

    sameAs: SOCIAL_LINKS,
  };

  return (
    <Helmet>
      {/* ✅ Primary SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* ✅ Keyword Boost for brand search */}
      <meta
        name="keywords"
        content="c-square, c-square studio, princekrcoder, web development mohali, web development punjab, web applications, e-commerce development, portfolio websites, tech consulting"
      />

      {/* Recommended */}
      <meta name="robots" content="index,follow" />
      <meta name="theme-color" content="#050505" />

      {/* ✅ Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />

      {/* ✅ MUST be absolute for social share */}
      <meta property="og:image" content={OG_IMAGE_ABS} />
      <meta property="og:image:secure_url" content={OG_IMAGE_ABS} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta property="og:site_name" content="c-square Studio" />
      <meta property="og:locale" content="en_IN" />

      {/* ✅ Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* ✅ MUST be absolute */}
      <meta name="twitter:image" content={OG_IMAGE_ABS} />

      {/* ✅ Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrganization)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(schemaLocalBusiness)}
      </script>
    </Helmet>
  );
};

export default SEO;
