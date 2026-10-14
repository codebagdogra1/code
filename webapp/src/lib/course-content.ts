// Editorial copy for each course, keyed by the course name as it appears in the
// admin catalogue (the `courses` table). Prices, duration and the installment
// count always come from the database; this file only adds the words a visitor
// needs to choose. A course that exists in the catalogue but not here still
// renders with a generic description, so adding a course in /admin never breaks
// the site. Edit freely.

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced" | "Specialist";

export type CourseContent = {
  slug: string;
  /** Short heading shown on cards when the catalogue name is an acronym. */
  displayName: string;
  level: CourseLevel;
  track: "Computer Applications" | "Web Design" | "Ecommerce" | "Digital Marketing" | "AI";
  summary: string;
  whoFor: string;
  modules: string[];
  outcomes: string[];
  idealNext?: string;
};

export const COURSE_CONTENT: Record<string, CourseContent> = {
  CCA: {
    slug: "cca",
    displayName: "CCA — Certificate in Computer Application",
    level: "Beginner",
    track: "Computer Applications",
    summary:
      "The right first step. Computer fundamentals, typing, MS Office and everyday internet skills for school students, home-makers and anyone starting from zero.",
    whoFor:
      "Complete beginners, school and college students, and working adults who want to be comfortable with a computer for study, office work or daily life.",
    modules: [
      "Computer fundamentals and Windows",
      "Typing and keyboard confidence",
      "MS Word — letters, résumés, reports",
      "MS Excel — tables, formulas, simple accounts",
      "MS PowerPoint — presentations",
      "Internet, email, online forms and digital safety",
    ],
    outcomes: [
      "Operate a computer independently",
      "Prepare documents, sheets and presentations",
      "Use email, online services and government portals safely",
    ],
    idealNext: "DCA",
  },
  DCA: {
    slug: "dca",
    displayName: "DCA — Diploma in Computer Application",
    level: "Intermediate",
    track: "Computer Applications",
    summary:
      "A structured six-month diploma covering office automation, accounting basics, internet tools and an introduction to programming — the standard qualification for office and data-entry roles.",
    whoFor:
      "Students after Class 10/12, graduates applying for office or clerical jobs, and anyone who has finished CCA and wants a recognised diploma.",
    modules: [
      "Advanced MS Office (Word, Excel, PowerPoint, Access basics)",
      "Computerised accounting fundamentals",
      "Internet, email and cloud tools",
      "Introduction to programming logic",
      "Basic graphics and image editing",
      "Project work and assessment",
    ],
    outcomes: [
      "Handle office documentation and data work with confidence",
      "Maintain basic accounts and reports on a computer",
      "A diploma certificate for job applications",
    ],
    idealNext: "ADCA",
  },
  ADCA: {
    slug: "adca",
    displayName: "ADCA — Advanced Diploma in Computer Application",
    level: "Advanced",
    track: "Computer Applications",
    summary:
      "Our most complete twelve-month programme: everything in DCA plus programming, databases, web basics and software skills that open the door to technical careers.",
    whoFor:
      "Learners who want a serious, career-focused computer qualification — college students, job seekers and career switchers.",
    modules: [
      "Office automation and computerised accounting",
      "Programming fundamentals (C / Python basics)",
      "Database management and SQL basics",
      "HTML, CSS and web page basics",
      "Graphic design and multimedia basics",
      "Operating systems, networking and hardware basics",
      "Final project and viva",
    ],
    outcomes: [
      "A broad technical foundation across software, web and data",
      "Build small applications and web pages",
      "An advanced diploma for technical job applications",
    ],
    idealNext: "Web Design Basic",
  },
  "Web Design Basic": {
    slug: "web-design-basic",
    displayName: "Web Design — Basic",
    level: "Beginner",
    track: "Web Design",
    summary:
      "Build real web pages from scratch with HTML, CSS and a little JavaScript, and put your first site online.",
    whoFor:
      "Beginners curious about how websites are made, students adding a practical skill, and small-business owners who want their own web presence.",
    modules: [
      "How the web works: browsers, hosting, domains",
      "HTML — structure and content",
      "CSS — layout, colour, typography, responsive design",
      "JavaScript basics — interactivity",
      "Design principles for the web",
      "Publishing a portfolio site",
    ],
    outcomes: [
      "Hand-code a responsive multi-page website",
      "Publish a site with your own domain",
      "A portfolio to show employers or clients",
    ],
    idealNext: "Web Design Advanced",
  },
  "Web Design Advanced": {
    slug: "web-design-advanced",
    displayName: "Web Design — Advanced",
    level: "Advanced",
    track: "Web Design",
    summary:
      "Go from pages to products: modern JavaScript, a front-end framework, CMS-based sites and client-ready projects.",
    whoFor:
      "Learners who have completed Web Design Basic (or know HTML/CSS) and want freelance or junior developer-level skills.",
    modules: [
      "Modern JavaScript and the DOM",
      "A front-end framework (component-based UI)",
      "CMS websites (WordPress) — themes, plugins, forms",
      "UI/UX basics and design tools",
      "Performance, SEO basics and accessibility",
      "Client project: brief to launch",
    ],
    outcomes: [
      "Build and ship client websites end to end",
      "Work with a modern front-end stack",
      "A professional portfolio of real projects",
    ],
  },
  "Ecommerce Expert (Industry Level)": {
    slug: "ecommerce-expert-industry-level",
    displayName: "Ecommerce Expert — Industry Level",
    level: "Specialist",
    track: "Ecommerce",
    summary:
      "Learn to set up and run online stores the way agencies do: Shopify and marketplace stores, product listings, payments, shipping and the basics of selling online.",
    whoFor:
      "Shop owners going online, students who want ecommerce skills, and anyone planning to sell on Amazon, Flipkart, Meesho or their own store.",
    modules: [
      "Ecommerce fundamentals and business models",
      "Shopify store setup — theme, products, payments, shipping",
      "Marketplace selling: Amazon, Flipkart, Meesho",
      "Product photography, listings and catalogue management",
      "Order, inventory and customer handling",
      "Basic store marketing and analytics",
    ],
    outcomes: [
      "Launch and operate a working online store",
      "List and manage products across marketplaces",
      "Understand the full order-to-delivery flow",
    ],
    idealNext: "Ecommerce Expert (Job Ready)",
  },
  "Ecommerce Expert (Job Ready)": {
    slug: "ecommerce-expert-job-ready",
    displayName: "Ecommerce Expert — Job Ready",
    level: "Specialist",
    track: "Ecommerce",
    summary:
      "The complete eight-month ecommerce programme: store building, marketplace operations, paid ads, SEO and live projects to prepare you for ecommerce and agency jobs.",
    whoFor:
      "Learners targeting ecommerce executive, store manager or agency roles, and entrepreneurs who want to run everything themselves.",
    modules: [
      "Everything in Ecommerce Expert — Industry Level",
      "Store growth: Meta and Google ads for ecommerce",
      "SEO and content for product pages",
      "Email, WhatsApp and retention marketing",
      "Reporting, analytics and profitability",
      "Live client projects and interview preparation",
    ],
    outcomes: [
      "Run ecommerce operations and growth end to end",
      "A live-project portfolio for job applications",
      "Confidence in interviews for ecommerce and agency roles",
    ],
  },
  "Digital Marketing Basics": {
    slug: "digital-marketing-basics",
    displayName: "Digital Marketing — Basics",
    level: "Beginner",
    track: "Digital Marketing",
    summary:
      "A fast two-month introduction to promoting a business online: social media, Meta ads, Google basics, content and WhatsApp marketing.",
    whoFor:
      "Business owners, students and job seekers who want practical marketing skills quickly.",
    modules: [
      "Digital marketing landscape and strategy basics",
      "Social media marketing (Instagram, Facebook)",
      "Meta Ads — campaigns, audiences, creatives",
      "Google Business Profile and local SEO basics",
      "Content and design tools (Canva)",
      "WhatsApp marketing and lead handling",
    ],
    outcomes: [
      "Run your first ad campaigns with confidence",
      "Set up and grow business social accounts",
      "Measure what works and what doesn't",
    ],
  },
  "A.I. Prompt Engineering": {
    slug: "ai-prompt-engineering",
    displayName: "AI Prompt Engineering",
    level: "Specialist",
    track: "AI",
    summary:
      "Use AI tools like ChatGPT, Gemini and image generators productively: write effective prompts, automate everyday work and create content faster.",
    whoFor:
      "Students, professionals, teachers and business owners who want to work smarter with AI tools — no coding required.",
    modules: [
      "How AI assistants work (and where they fail)",
      "Prompt structure: role, context, task, format",
      "AI for writing, research, study and office work",
      "AI for images, presentations and design",
      "Automating repetitive tasks",
      "Responsible use, privacy and fact-checking",
    ],
    outcomes: [
      "Get reliable, useful results from AI tools",
      "Save hours each week on writing and research",
      "A personal toolkit of prompts and workflows",
    ],
  },
};

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function contentFor(name: string): CourseContent {
  return (
    COURSE_CONTENT[name] ?? {
      slug: slugify(name),
      displayName: name,
      level: "Beginner",
      track: "Computer Applications",
      summary: `${name} at CODE, Bagdogra — practical, instructor-led classes with a monthly fee plan. Contact us for the current batch and syllabus.`,
      whoFor: "Anyone who wants to learn this skill with hands-on practice and in-person guidance.",
      modules: [],
      outcomes: [],
    }
  );
}

// Visitor-facing FAQ (also emitted as FAQPage JSON-LD on the pages that show it).
export const FAQ = [
  {
    q: "Which computer course is best for beginners?",
    a: "Start with CCA (Certificate in Computer Application). It covers computer basics, typing, MS Office and internet skills in three months. If you want a recognised diploma, DCA is the next step.",
  },
  {
    q: "What is the difference between DCA and ADCA?",
    a: "DCA is a six-month diploma focused on office applications, accounting basics and an introduction to programming. ADCA is a twelve-month advanced diploma that adds programming, databases and web basics for technical careers.",
  },
  {
    q: "Can I pay the fee monthly?",
    a: "Yes. Every course has a full-payment price and a monthly plan. The monthly amount and number of installments are shown on each course page, and you get a printed receipt for every payment.",
  },
  {
    q: "Do you give a certificate after the course?",
    a: "Yes. Students who complete the course and assessment receive a certificate from CODE for the programme they have completed.",
  },
  {
    q: "What are the class timings?",
    a: "The centre is open Monday to Saturday, 11:00 AM to 9:00 PM. Batches run through the day; tell us your availability and we will suggest a slot.",
  },
  {
    q: "Where is CODE located?",
    a: "Lokenath Nagar Road, near K1 Fitness Gym, Bagdogra, Siliguri, West Bengal 734014. Open the map on the contact page for directions.",
  },
] as const;
