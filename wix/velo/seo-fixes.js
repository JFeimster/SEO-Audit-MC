// wix/velo/seo-fixes.js
// Purpose: reusable payload source for page-specific SEO fixes.
// Use this as the source-of-truth object if you later wire these values
// into page code, router logic, or a site-level SEO helper.

export const seoFixes = {
  "/privacy-policy": {
    metaDescription:
      "Read Moonshine Capital's privacy policy to understand what data we collect, how we use it, and what choices you have to manage your information.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Privacy Policy | Moonshine Capital",
      url: "https://www.distilledfunding.com/privacy-policy",
      description:
        "Read Moonshine Capital's privacy policy to understand what data we collect, how we use it, and what choices you have to manage your information.",
      isPartOf: {
        "@type": "WebSite",
        url: "https://www.distilledfunding.com/"
      },
      inLanguage: "en-US"
    }
  },
  "/revenuebased": {
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Revenue-Based Financing",
      serviceType: "Revenue-Based Financing",
      url: "https://www.distilledfunding.com/revenuebased",
      provider: {
        "@type": "Organization",
        name: "Moonshine Capital"
      },
      description: "Revenue-based financing options for business growth."
    }
  },
  "/industries/wix-seller-financing": {
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Wix Seller Financing",
      url: "https://www.distilledfunding.com/industries/wix-seller-financing",
      description:
        "Running a Wix store and need capital? Explore funding options, what lenders look for, and how to improve approval odds.",
      about: {
        "@type": "Thing",
        name: "Wix Seller Financing"
      },
      isPartOf: {
        "@type": "WebSite",
        url: "https://www.distilledfunding.com/"
      },
      inLanguage: "en-US"
    }
  }
};

export function getSeoFix(pathname) {
  const normalized = pathname && pathname !== "/" ? pathname.replace(/\/$/, "") : "/";
  return seoFixes[normalized] || null;
}
