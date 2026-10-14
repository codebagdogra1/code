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
  /** Short name for titles and headings, e.g. "DCA" or "Web Design Basic". */
  shortName?: string;
  /** Search title; falls back to a generated one. */
  seoTitle?: string;
  /** One-paragraph, quotable definition shown at the top of the course page. */
  definition?: string;
  /** Course a learner should have done first, if any. */
  prerequisites?: string;
  /** Course-specific questions, shown on the page and emitted as FAQPage JSON-LD. */
  faq?: FaqItem[];
};

export type FaqItem = { q: string; a: string };

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
  const base = COURSE_CONTENT[name];
  if (base) return { ...base, ...COURSE_ANSWERS[name] };
  return (
    {
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
    a: "Yes. Every course can be paid in full or through a monthly plan. Ask at the desk or on WhatsApp for the current fee and installment schedule, and you get a printed receipt for every payment.",
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
    a: "Lokenath Nagar Road, near K1 Fitness Gym, Bagdogra, Siliguri, West Bengal 734014 — about 1.5 km from Bagdogra railway station and 2 km from Bagdogra Airport. Open the map on the contact page for directions.",
  },
  {
    q: "Is CODE reachable from Siliguri, Matigara and Naxalbari?",
    a: "Yes. The centre is about 5 km from Matigara, 10 km from Siliguri Junction and 12 km from Naxalbari, so students from Siliguri, Matigara, Naxalbari, Upper Bagdogra, Bihar More and Gossaipur can reach it easily by bus, auto or bike.",
  },
  {
    q: "In which language are classes taught?",
    a: "Trainers explain in Bengali, Hindi or English, whichever the batch is comfortable with. Course material and software are in English, so you also build the English vocabulary used in offices.",
  },
  {
    q: "How do I enrol at CODE?",
    a: "Visit the centre Monday to Saturday between 11 AM and 9 PM, or call or WhatsApp +91 96358 09537 to fix a time. Enrolment is done at the desk, you choose a batch slot and a fee plan, and you receive a printed receipt.",
  },
  {
    q: "Can I see the centre before joining?",
    a: "Yes. Walk in during opening hours or message on WhatsApp to book a time. You can see the computer lab, meet the trainer and ask about the course before deciding.",
  },
] as const;

// Answer-first copy for each course: a quotable definition, a search title and
// the questions people actually ask before joining. Facts here must stay
// consistent with the summaries above and with what the desk tells students.
// Fees are never stated online — they are quoted at the centre.
export const COURSE_ANSWERS: Record<string, Partial<CourseContent>> = {
  CCA: {
    shortName: "CCA",
    seoTitle: "CCA Course in Bagdogra — Certificate in Computer Application",
    definition:
      "CCA (Certificate in Computer Application) is a three-month beginner course in computer fundamentals, typing, MS Word, Excel, PowerPoint and safe internet use. At CODE in Bagdogra it is taught hands-on at a computer in a small batch, with a monthly fee plan and a certificate on completion.",
    faq: [
      {
        q: "Who should join the CCA course?",
        a: "Anyone starting from zero: school and college students, home-makers and working adults who want to use a computer confidently for study, office work or daily tasks. No previous computer knowledge is needed.",
      },
      {
        q: "How long is the CCA course at CODE?",
        a: "Three months. Batches run through the day, Monday to Saturday between 11 AM and 9 PM, so you can pick a slot around school, college or work.",
      },
      {
        q: "What will I learn in CCA?",
        a: "Windows and computer basics, typing, MS Word, MS Excel, MS PowerPoint, email, internet, online forms and digital safety. Every topic is practised on a computer in class.",
      },
      {
        q: "What should I do after CCA?",
        a: "Most students continue to DCA (Diploma in Computer Application), the six-month diploma that adds advanced Office, accounting basics and an introduction to programming.",
      },
    ],
  },
  DCA: {
    shortName: "DCA",
    seoTitle: "DCA Course in Bagdogra — Diploma in Computer Application",
    definition:
      "DCA (Diploma in Computer Application) is a six-month diploma covering office automation, computerised accounting basics, internet and cloud tools, and an introduction to programming. It is the standard qualification asked for in office, clerical and data-entry roles, and CODE teaches it in Bagdogra with a monthly fee plan.",
    faq: [
      {
        q: "What is the eligibility for DCA?",
        a: "Students after Class 10 or 12, graduates and working adults can join. No earlier course is required, though CCA or basic computer familiarity makes the first weeks easier.",
      },
      {
        q: "How long is the DCA course?",
        a: "Six months, including project work and the final assessment. You can start as soon as a batch at your preferred time has a seat.",
      },
      {
        q: "What is the difference between DCA and ADCA?",
        a: "DCA is a six-month diploma focused on office applications, accounting basics and programming logic. ADCA is a twelve-month advanced diploma that adds programming, databases, HTML/CSS and hardware and networking basics for technical careers.",
      },
      {
        q: "Is DCA useful for office and data-entry jobs?",
        a: "Yes. DCA is one of the most commonly requested computer qualifications for office, clerical and data-entry roles, and the course covers exactly the MS Office, accounting and internet skills those roles use daily.",
      },
      {
        q: "Can I pay the DCA fee monthly?",
        a: "Yes. DCA can be paid in full or through a monthly plan, with a printed receipt for every payment. Ask at the desk or on WhatsApp for the current fee and schedule.",
      },
    ],
  },
  ADCA: {
    shortName: "ADCA",
    seoTitle: "ADCA Course in Bagdogra — Advanced Diploma in Computer Application",
    definition:
      "ADCA (Advanced Diploma in Computer Application) is CODE's most complete twelve-month programme: office automation and accounting, programming fundamentals in C or Python, databases and SQL basics, HTML and CSS, graphics and multimedia basics, and operating-system, networking and hardware fundamentals, finishing with a project and viva.",
    faq: [
      {
        q: "What is covered in the ADCA course?",
        a: "Everything in DCA plus programming fundamentals (C / Python basics), database management and SQL, HTML and CSS web basics, graphic design and multimedia basics, operating systems, networking and hardware basics, and a final project with viva.",
      },
      {
        q: "How long is ADCA?",
        a: "Twelve months. It is a full diploma programme, so expect regular practice and a final project.",
      },
      {
        q: "Do I need to finish DCA before ADCA?",
        a: "No. ADCA includes the office-automation and accounting content, so you can join directly. Students who have done CCA or DCA move through the early modules faster.",
      },
      {
        q: "What can I do after ADCA?",
        a: "ADCA gives a broad technical foundation across software, web and data. Graduates use it for computer-operator, technical-support and data roles, or continue into the Web Design track at CODE to specialise.",
      },
    ],
  },
  "Web Design Basic": {
    shortName: "Web Design Basic",
    seoTitle: "Web Design Course in Bagdogra — HTML, CSS & JavaScript Basics",
    definition:
      "Web Design — Basic is a beginner course at CODE, Bagdogra, where you hand-code responsive web pages with HTML, CSS and a little JavaScript, learn how hosting and domains work, and publish your own portfolio site by the end.",
    faq: [
      {
        q: "Do I need coding knowledge to join Web Design Basic?",
        a: "No. The course starts with how the web works and teaches HTML and CSS from the first tag. Comfort with using a computer is enough.",
      },
      {
        q: "What will I build in the course?",
        a: "A responsive, multi-page website that you publish online with your own domain. It doubles as a portfolio to show employers or clients.",
      },
      {
        q: "Which technologies does the course cover?",
        a: "HTML for structure, CSS for layout, colour, typography and responsive design, JavaScript basics for interactivity, web design principles, and publishing a site.",
      },
      {
        q: "What comes after Web Design Basic?",
        a: "Web Design — Advanced, which adds modern JavaScript, a front-end framework, WordPress sites and a client project from brief to launch.",
      },
    ],
  },
  "Web Design Advanced": {
    shortName: "Web Design Advanced",
    seoTitle: "Advanced Web Design Course in Bagdogra — JavaScript, Frameworks & WordPress",
    prerequisites: "Web Design — Basic, or working knowledge of HTML and CSS",
    definition:
      "Web Design — Advanced takes learners who know HTML and CSS to client-ready work: modern JavaScript and the DOM, a component-based front-end framework, WordPress themes, plugins and forms, UI/UX basics, performance, SEO and accessibility, and a real client project from brief to launch.",
    faq: [
      {
        q: "What are the prerequisites for Web Design Advanced?",
        a: "Web Design — Basic at CODE, or equivalent knowledge of HTML and CSS. If you are unsure, show us something you have built and we will suggest the right starting point.",
      },
      {
        q: "Does the course cover WordPress?",
        a: "Yes. One module builds CMS websites with WordPress — themes, plugins and forms — alongside the hand-coded, framework-based work.",
      },
      {
        q: "Can I freelance after Web Design Advanced?",
        a: "The course is designed for freelance and junior-developer-level work. You finish with a portfolio of real projects, including a client project taken from brief to launch.",
      },
      {
        q: "How is the course taught?",
        a: "In person at the centre in Bagdogra, at a computer, in a small batch with the trainer in the room. Monthly fee plans are available.",
      },
    ],
  },
  "Ecommerce Expert (Industry Level)": {
    shortName: "Ecommerce Expert (Industry Level)",
    seoTitle: "Ecommerce Course in Bagdogra — Shopify, Amazon, Flipkart & Meesho Selling",
    definition:
      "Ecommerce Expert — Industry Level teaches you to set up and run online stores the way agencies do: Shopify store setup with products, payments and shipping, selling on Amazon, Flipkart and Meesho, product photography and listings, and order, inventory and customer handling.",
    faq: [
      {
        q: "Do I need my own shop or products to join?",
        a: "No. The course walks through building a store from scratch. Shop owners who already sell can apply every step to their own products as they go.",
      },
      {
        q: "Which marketplaces and platforms does the course cover?",
        a: "Shopify for your own store, and Amazon, Flipkart and Meesho for marketplace selling, including listings, catalogue management and the order-to-delivery flow.",
      },
      {
        q: "Is this course suitable for a small business owner in Siliguri or Bagdogra?",
        a: "Yes. It is built for local shop owners who want to sell online as much as for students, and classes are explained in Bengali, Hindi or English as the batch prefers.",
      },
      {
        q: "What is the difference between Industry Level and Job Ready?",
        a: "Industry Level covers store setup and operations. Job Ready is the longer eight-month programme that adds Meta and Google ads, SEO, retention marketing, reporting, live client projects and interview preparation.",
      },
    ],
  },
  "Ecommerce Expert (Job Ready)": {
    shortName: "Ecommerce Expert (Job Ready)",
    seoTitle: "Ecommerce Job-Ready Course in Bagdogra — Stores, Ads, SEO & Live Projects",
    definition:
      "Ecommerce Expert — Job Ready is CODE's complete eight-month ecommerce programme: everything in the Industry Level course plus Meta and Google ads for ecommerce, SEO and content for product pages, email and WhatsApp retention marketing, reporting and profitability, and live client projects with interview preparation.",
    faq: [
      {
        q: "How long is the Ecommerce Job Ready course?",
        a: "Eight months, paid in full or through a monthly plan with a printed receipt for every payment.",
      },
      {
        q: "Who is the Job Ready programme for?",
        a: "Learners targeting ecommerce executive, store manager or agency roles, and entrepreneurs who want to run store building, marketing and operations themselves.",
      },
      {
        q: "Does the course include paid advertising?",
        a: "Yes. Store growth with Meta and Google ads for ecommerce is a dedicated module, alongside SEO for product pages and retention marketing on email and WhatsApp.",
      },
      {
        q: "Will I have projects to show employers?",
        a: "Yes. The programme ends with live client projects and interview preparation, so you leave with a working portfolio and practice answering real interview questions.",
      },
    ],
  },
  "Digital Marketing Basics": {
    shortName: "Digital Marketing Basics",
    seoTitle: "Digital Marketing Course in Bagdogra — Social Media, Meta Ads & Local SEO",
    definition:
      "Digital Marketing — Basics is a two-month introduction to promoting a business online: Instagram and Facebook marketing, Meta Ads campaigns, Google Business Profile and local SEO basics, Canva for content, and WhatsApp marketing with lead handling.",
    faq: [
      {
        q: "How long is the Digital Marketing Basics course?",
        a: "Two months. It is designed as a fast, practical start for business owners, students and job seekers.",
      },
      {
        q: "Do I need a business to join?",
        a: "No. Students and job seekers practise on sample accounts and campaigns. Business owners work directly on their own pages and ads.",
      },
      {
        q: "Which platforms and tools are covered?",
        a: "Instagram and Facebook, Meta Ads Manager, Google Business Profile and local SEO basics, Canva for content and design, and WhatsApp marketing.",
      },
      {
        q: "Is it useful for a local shop in Bagdogra or Siliguri?",
        a: "Yes. Google Business Profile, local SEO basics and WhatsApp marketing are exactly the channels a local shop uses to get found and get enquiries.",
      },
    ],
  },
  "A.I. Prompt Engineering": {
    shortName: "AI Prompt Engineering",
    seoTitle: "AI Prompt Engineering Course in Bagdogra — ChatGPT & Gemini for Work",
    definition:
      "AI Prompt Engineering at CODE, Bagdogra, teaches students, professionals, teachers and business owners to use AI tools such as ChatGPT, Gemini and image generators productively: how assistants work and where they fail, prompt structure, AI for writing, research, study, office work and design, automating repetitive tasks, and responsible, fact-checked use. No coding is required.",
    faq: [
      {
        q: "Do I need to know programming for AI Prompt Engineering?",
        a: "No. The course is for everyday users — students, teachers, office staff and business owners. It is about writing effective prompts and workflows, not code.",
      },
      {
        q: "Which AI tools are used in the course?",
        a: "Text assistants such as ChatGPT and Gemini, plus AI tools for images, presentations and design. The skills transfer to whichever tool you use at work or study.",
      },
      {
        q: "What will I be able to do after the course?",
        a: "Get reliable, useful results from AI tools, save hours each week on writing and research, and leave with a personal toolkit of prompts and workflows for your own work.",
      },
      {
        q: "Does the course cover safe and responsible use?",
        a: "Yes. Privacy, fact-checking and responsible use are a dedicated module, so you know what to trust and what to verify.",
      },
    ],
  },
};

// Last significant edit to the course copy above. Shown on every course page,
// sent as WebPage.dateModified and used as the sitemap lastmod. Bump it when
// the words change, not on deploy.
export const COURSE_CONTENT_UPDATED = "2026-10-14";
