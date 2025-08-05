// Generate structured data for different content types

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Daily Opportunities",
  "url": "https://daily-opportunities.lovable.app",
  "logo": "https://daily-opportunities.lovable.app/og-image.png",
  "description": "Platform for discovering scholarships, grants, and job opportunities worldwide",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "contact.dailyopportunities@gmail.com",
    "contactType": "customer service"
  },
  "sameAs": [
    "https://www.facebook.com/profile.php?id=61575299694285",
    "https://twitter.com/DailyOpport2925"
  ]
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Daily Opportunities",
  "url": "https://daily-opportunities.lovable.app",
  "description": "Discover latest scholarships, grants, and job opportunities from top universities and organizations worldwide",
  "publisher": generateOrganizationSchema(),
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://daily-opportunities.lovable.app/scholarships?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});

export const generateScholarshipSchema = (opportunity: {
  id: string;
  title: string;
  organization: string;
  description: string;
  deadline?: string;
  type: string;
  created_at: string;
  external_url?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "EducationalOccupationalProgram",
  "name": opportunity.title,
  "description": opportunity.description.replace(/<[^>]*>/g, '').substring(0, 300),
  "provider": {
    "@type": "Organization",
    "name": opportunity.organization
  },
  "url": `https://daily-opportunities.lovable.app/opportunity/${opportunity.id}`,
  "applicationDeadline": opportunity.deadline,
  "datePosted": opportunity.created_at,
  "occupationalCategory": "Education",
  "educationalCredentialAwarded": "Scholarship",
  ...(opportunity.external_url && {
    "applicationUrl": opportunity.external_url
  })
});

export const generateJobSchema = (opportunity: {
  id: string;
  title: string;
  organization: string;
  description: string;
  deadline?: string;
  type: string;
  created_at: string;
  external_url?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": opportunity.title,
  "description": opportunity.description.replace(/<[^>]*>/g, '').substring(0, 300),
  "hiringOrganization": {
    "@type": "Organization",
    "name": opportunity.organization
  },
  "url": `https://daily-opportunities.lovable.app/opportunity/${opportunity.id}`,
  "validThrough": opportunity.deadline,
  "datePosted": opportunity.created_at,
  "employmentType": "FULL_TIME",
  "jobLocation": {
    "@type": "Place",
    "address": "Various Locations Worldwide"
  },
  ...(opportunity.external_url && {
    "applicationUrl": opportunity.external_url
  })
});

export const generateBreadcrumbSchema = (items: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const generateFAQSchema = (faqs: Array<{question: string, answer: string}>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});