/**
 * Fixed strings lifted verbatim from grandmarkca.com.
 * Nothing here is rewritten, shortened or invented.
 */

export const site = {
  name: 'GRANDMARK & ASSOCIATES',
  /** the firm styles its own name letter-spaced throughout its copy */
  spacedName: 'G R A N D M A R K & ASSOCIATES',
  shortSpaced: 'G R A N D M A R K',
  logo: '/img/GM_Logo_updated-new-1.png',
  phones: ['+91-9811085147', '+91-11-42705151'],
  phoneLine: '+91-9811085147 , +91-11-42705151',
  email: 'info@grandmarkca.com',
  copyright: 'Grandmark & Associates © 2019',
  sourceUrl: 'https://www.grandmarkca.com/',
}

/** Footer intro — exact wording from the current footer. */
export const footerIntro = [
  'More than 750 man-years of experience.',
  '18 Partners, 14 Offices across India.',
  'Access to 100 plus professional experts and advisers across Indian and overseas.',
]

export const footerLinksTitle = 'Know more about us'

export const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Knowledge Pool', href: '/knowledge-pool' },
  { label: 'About Us', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
]

export const footerPresence = 'We are Present in 14 cities'

/** Home page H1, verbatim. */
export const homeHeading = 'Now we have presence in 14 Cities Across India'

/** Home page intro paragraphs, verbatim. */
export const homeIntro = [
  'G R A N D M A R K & ASSOCIATES has its presence since 1991 and many of our clients are associated with us for over decades. The name of Firm has changed recently and now we are counted as one of India’s Leading CA Firms. As a Firm we are constantly evolving and today we are a proud team of 18 Partners at 14 locations. Going ahead, we aspire to be India’s biggest Accounting Firm having presence at all the important Business Centres of India.',
  'The Firm is looking after Audits, Taxation, Accounting, Valuation, Merger & Acquisition, Corporate Compliance, Financial and business affairs of Corporate, Firms, individuals, families and not-for-profit entities for nearly THREE decades now.',
]

/** The firm's core values acrostic (W-E-S-S-E-L), verbatim. */
export const coreValuesHome = [
  { letter: 'W', rest: 'ork Ethics' },
  { letter: 'E', rest: 'mployees – Our most valuable asset' },
  { letter: 'S', rest: 'ervice to our clients' },
  { letter: 'S', rest: 'ervice to the Community' },
  { letter: 'E', rest: 'xpert business partner' },
  { letter: 'L', rest: 'eadership' },
]

/** About / About-the-Firm ordering of the same acrostic, verbatim. */
export const coreValuesAbout = [
  { letter: 'W', rest: 'ork Ethics' },
  { letter: 'E', rest: 'mployees – Our most valuable asset' },
  { letter: 'L', rest: 'eadership' },
  { letter: 'S', rest: 'ervice to Client' },
  { letter: 'E', rest: 'xpert business partner' },
  { letter: 'S', rest: 'ervice to Community' },
]

/**
 * Home-page figures. `group` says whether thousands separators apply — a year
 * is a label, not a quantity, so it must read "1991" and never "1,991".
 * Every figure below is stated on the firm's own site.
 */
export const homeStats: {
  value: number
  label: string
  prefix?: string
  group: boolean
}[] = [
  { value: 1991, label: 'Present since', group: false },
  { value: 18, label: 'Partners', group: true },
  { value: 14, label: 'Offices across India', group: true },
  { value: 750, label: 'Man-years of experience', prefix: 'More than', group: true },
]

/** Office cities, in the exact order and casing the Contact page lists them. */
export const cityLine =
  'BENGALURU | CHENNAI | COIMBATORE | GURUGRAM | HYDERABAD | INDORE | KOCHI | KOLKATA | LUCKNOW | MUMBAI | NEW DELHI | RAIPUR | UDAIPUR | THIRUVANANTHAPURAM'

export const cities = cityLine.split(' | ')

/** Home page service tiles — labels and destinations exactly as they appear. */
export const homeServices = [
  { label: 'Tax Consulting', href: '/services/tax-consulting', img: '/img/GM_Services_LandingP_img_Tax-consulting.jpg' },
  { label: 'Audit & Assurance', href: '/services/audit-assurance', img: '/img/GM_Services_LandingP_img_AUDIT-ASSURANCE.jpg' },
  { label: 'Business Consulting & Outsourcing Services', href: '/services/business-consulting-outsourcing-services', img: '/img/GM_Services_LandingP_img_Business-Consulting.jpg' },
  { label: 'Forensic Audit & Fraud Detection', href: '/services/forensic-audit-and-fraud-detection', img: '/img/GM_Services_LandingP_img_Forensics.jpg' },
  { label: 'Corporate Law & Compliances', href: '/services/corporate-law-compliances', img: '/img/GM_Services_LandingP_img_Corporate-Law-Compliances.jpg' },
  { label: 'Insolvency Professionals', href: '/services/insolvency-professionals', img: '/img/GM_Services_LandingP_img_Insolvency-Professionals.jpg' },
  { label: 'Global Services', href: '/global-services', img: '/img/world_connection-scaled-1.jpg' },
  { label: 'Legal Desk', href: '/legal-desk', img: '/img/GM_Services_Banner_Registration-1.jpg' },
  { label: 'NRI Desk', href: '/services/tax-consulting/nri-desk', img: '/img/GM_Services_LandingP_img_NRI-Desk.jpg' },
]

/** The shared "Ask the Expert" block used across service pages, verbatim. */
export const askExpert = {
  title: 'Ask the Expert',
  lines: [
    'More than 500 man-years of experience',
    'Access to 100 plus professional experts and advisers across Indian and overseas',
  ],
  teamCta: 'Meet out team',
  mailPrompt: 'Have Questions? Have discussion over email:',
}

/** Contact-page form, exactly as currently presented. */
export const contactForm = {
  heading: 'Contact Us',
  fields: {
    name: 'Your Name (required)',
    email: 'Your Email (required)',
    phone: 'Your Phone(required)',
    subject: 'Subject',
    message: 'Your Message',
  },
  pointOfContact: 'Point of Contact:',
  subjects: [
    'Tax Consulting',
    'Audit & Assurance',
    'Business Consulting & Outsourcing Services',
    'Forensics - Forensic Audit And Fraud Detection',
    'Corporate Law & Compliances',
    'Insolvency Professionals',
  ],
  generalEnquiry: 'For general enquiry, please contact',
}

/** Legal Opinion Desk form, exactly as currently presented. */
export const legalForm = {
  heading: 'Legal Opinion Desk',
  fields: {
    name: 'Your Name (required)',
    org: 'Name of Organisation (required)',
    mobile: 'Mobile Number (required)',
    email: 'Your Email (required)',
    subject: 'Subject',
    message: 'Your Message',
  },
  subjects: [
    'Audit and Assurance', 'Banking', 'Benami and PMLA', 'CFOServices and Accounting',
    'Corporate Law and Secretarial Support', 'Cyber Security Audit',
    'Energy Sector (Oil, Gas, Coal and Power)', 'FEMA and RBI', 'Financing Services',
    'Forensic Advisory and Audits', 'GST', 'Income Tax', 'International Taxation',
    'IPR', 'IT Audit', 'Legal Documentation', 'M&A and Due Diligence', 'NGO-NPAs',
    'NRI Taxation', 'Registration Services', 'Search and Seizure', 'Tax Litigations',
    'Valuation',
  ],
  mailPrompt: 'Have Questions? Have discussion over email:',
}

/** Global Services landing — capability labels and desks, verbatim. */
export const globalPitch = 'A complete Global Business Consulting'

export const globalCapabilities = [
  'TAX FILINGS',
  'REGISTRATIONS',
  'CROSS BOARDER TRANSACTIONS',
  'BUSINESS ADVISING',
  'DUE DILIGENCE',
]

export const desks = [
  { label: 'USA', href: '/global-services/usa-desk', code: 'US' },
  { label: 'UK', href: '/global-services/united-kingdom-desk', code: 'GB' },
  { label: 'SINGAPORE', href: '/global-services/singapore-desk', code: 'SG' },
  { label: 'UAE', href: '/global-services/uae-desk', code: 'AE' },
  { label: 'Australia', href: '/global-services/australia-desk', code: 'AU' },
  { label: 'Canada', href: '/global-services/canada-desk', code: 'CA' },
]

/** Service landing tiles, with the firm's own imagery and exact card titles. */
export const serviceIndex = [
  { title: 'Tax Consulting', href: '/services/tax-consulting', img: '/img/GM_Services_LandingP_img_Tax-consulting.jpg' },
  { title: 'AUDIT And ASSURANCE', href: '/services/audit-assurance', img: '/img/GM_Services_LandingP_img_AUDIT-ASSURANCE.jpg' },
  { title: 'Business Consulting and Outsourcing Services', href: '/services/business-consulting-outsourcing-services', img: '/img/GM_Services_LandingP_img_Business-Consulting.jpg' },
  { title: 'Forensic Audit And Fraud Detection', href: '/services/forensic-audit-and-fraud-detection', img: '/img/GM_Services_LandingP_img_Forensics.jpg' },
  { title: 'Corporate Law & Compliances', href: '/services/corporate-law-compliances', img: '/img/GM_Services_LandingP_img_Corporate-Law-Compliances.jpg' },
  { title: 'Insolvency Professionals', href: '/services/insolvency-professionals', img: '/img/GM_Services_LandingP_img_Insolvency-Professionals.jpg' },
]

export const knowMore = 'Know More...'
