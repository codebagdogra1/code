// Cornerstone guides and the glossary: the answer layer for questions people
// ask a search box or an AI assistant before they ask us. Everything here is
// built from the course catalogue and the centre's real facts (site.ts,
// course-content.ts). Durations are injected from the database at render time
// through the GuideContext so a guide can never contradict a course page.
//
// Rules: no fees, no placement claims, no student counts, no competitor names.
// Update `updated` whenever the words change — it is shown on the page, sent in
// Article.dateModified and used as the sitemap lastmod.

import type { FaqItem } from "./course-content";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; caption?: string; head: string[]; rows: string[][] }
  | { type: "callout"; text: string }
  | { type: "faq"; items: FaqItem[] };

export type GuideContext = {
  /** Duration of a catalogue course by its catalogue name, e.g. "6 months". */
  d: (courseName: string) => string;
  /** Markdown-style link to a course page by catalogue name. */
  c: (courseName: string, label?: string) => string;
};

export type Guide = {
  slug: string;
  title: string;
  /** Search title (≤ 60 chars where possible); falls back to title. */
  seoTitle?: string;
  description: string;
  /** The one-paragraph answer shown first and used as the quotable summary. */
  tldr: (ctx: GuideContext) => string;
  published: string; // ISO date
  updated: string; // ISO date
  /** Catalogue course names this guide is about (for schema + related links). */
  courses: string[];
  body: (ctx: GuideContext) => Block[];
};

const COURSE_FACTS = [
  "The centre is on Lokenath Nagar Road, near K1 Fitness Gym, Bagdogra, about 2 km from Bagdogra Airport and 10 km from Siliguri Junction.",
  "Classes run Monday to Saturday, 11 AM to 9 PM, and are explained in Bengali, Hindi or English.",
  "Every course has a full-payment fee and a monthly plan, a printed receipt is issued for every payment, and a CODE certificate is awarded on completion.",
];

export const GUIDES: Guide[] = [
  {
    slug: "dca-vs-adca",
    title: "DCA vs ADCA: syllabus, duration and which one to take",
    seoTitle: "DCA vs ADCA — Difference, Syllabus, Duration & Jobs",
    description:
      "DCA is a six-month diploma in office applications, accounting basics and programming logic. ADCA is a twelve-month advanced diploma that adds programming, databases, web and hardware. Here is how to choose, with the syllabus side by side.",
    tldr: ({ d }) =>
      `DCA (Diploma in Computer Application) is a diploma that takes ${d("DCA")} and prepares you for office, clerical and data-entry work: advanced MS Office, computerised accounting basics, internet tools and an introduction to programming. ADCA (Advanced Diploma in Computer Application) is a programme that takes ${d("ADCA")} and includes all of that and adds programming in C or Python, databases and SQL, HTML and CSS, graphics, and operating-system, networking and hardware basics. Choose DCA if you need a recognised office qualification quickly; choose ADCA if you want a technical foundation or plan to continue into web design.`,
    published: "2026-10-14",
    updated: "2026-10-14",
    courses: ["DCA", "ADCA", "CCA"],
    body: ({ d, c }) => [
      { type: "h2", text: "What is the difference between DCA and ADCA?" },
      {
        type: "p",
        text: `The difference is depth and time. DCA covers the applications an office uses every day and takes ${d("DCA")}. ADCA covers the same ground and then goes into how software is built — programming, databases, web pages and the hardware underneath — over ${d("ADCA")}. Both are taught at CODE in Bagdogra, in person, at a computer, in small batches.`,
      },
      {
        type: "table",
        caption: "DCA and ADCA at CODE, Bagdogra, side by side",
        head: ["", "DCA", "ADCA"],
        rows: [
          ["Full name", "Diploma in Computer Application", "Advanced Diploma in Computer Application"],
          ["Duration", d("DCA"), d("ADCA")],
          ["Level", "Intermediate", "Advanced"],
          ["Entry", "After Class 10 or 12, graduates, working adults; no earlier course required", "Same — DCA is not required first"],
          ["Office tools", "Advanced Word, Excel, PowerPoint, Access basics", "Included"],
          ["Accounting", "Computerised accounting fundamentals", "Included"],
          ["Programming", "Introduction to programming logic", "C / Python fundamentals"],
          ["Databases", "—", "Database management and SQL basics"],
          ["Web", "—", "HTML and CSS page basics"],
          ["Graphics", "Basic image editing", "Graphic design and multimedia basics"],
          ["Systems", "—", "Operating systems, networking, hardware basics"],
          ["Assessment", "Project work and assessment", "Final project and viva"],
          ["Typical goal", "Office, clerical, data-entry and computer-operator roles", "Technical support, data roles, a base for web design"],
        ],
      },
      { type: "h2", text: "Who should take DCA?" },
      {
        type: "ul",
        items: [
          "Students after Class 10 or 12 who want a diploma that employers in offices recognise.",
          "Graduates applying for clerical, back-office, data-entry or computer-operator posts, where DCA is one of the most commonly asked-for computer qualifications.",
          `Anyone who has finished ${c("CCA")} and wants the next, recognised step without a year-long commitment.`,
        ],
      },
      { type: "h2", text: "Who should take ADCA?" },
      {
        type: "ul",
        items: [
          "College students and job seekers who want one programme that covers software, data and the web.",
          "Learners planning a technical career who want programming, databases and hardware basics from the start.",
          `Anyone who intends to continue into ${c("Web Design Basic", "Web Design")} — ADCA's HTML/CSS module is a head start.`,
        ],
      },
      { type: "h2", text: "Do you need DCA before ADCA?" },
      {
        type: "p",
        text: "No. ADCA includes the office-automation and accounting content, so you can join ADCA directly. Students who have already done CCA or DCA move through the early modules faster, but it is not a requirement.",
      },
      { type: "h2", text: "Can you do DCA first and ADCA later?" },
      {
        type: "p",
        text: `Yes, and many students do: DCA for ${d("DCA")} to get a qualification quickly, a job or further study, then ADCA when they want the technical depth. The two courses overlap in the office and accounting modules, so expect the first part of ADCA to feel familiar.`,
      },
      { type: "h2", text: "How the courses are taught at CODE" },
      { type: "ul", items: COURSE_FACTS },
      { type: "callout", text: `Not sure which to pick? Visit the centre, see the lab and talk to the trainer before deciding — ${c("DCA", "DCA details")} · ${c("ADCA", "ADCA details")}.` },
      {
        type: "faq",
        items: [
          {
            q: "Is ADCA better than DCA?",
            a: "ADCA is longer and covers more, not automatically better. If your goal is an office or data-entry job soon, DCA gets you there in six months. If you want programming, databases and web basics as well, ADCA is the right programme.",
          },
          {
            q: "Which has more job scope, DCA or ADCA?",
            a: "DCA matches the requirement most often listed for office, clerical and data-entry roles. ADCA adds the technical modules that computer-operator, technical-support and data roles look for, and it is the stronger base for a web or software path.",
          },
          {
            q: "Can I pay DCA or ADCA fees monthly?",
            a: "Yes. Both courses have a full-payment fee and a monthly plan with one installment per month of the course, and a printed receipt for every payment. The current fee is quoted at the desk or on WhatsApp.",
          },
          {
            q: "Is there a certificate for DCA and ADCA?",
            a: "Yes. Students who complete the course and its assessment receive a certificate from CODE — Computer & Digital Excellence for the programme completed.",
          },
        ],
      },
    ],
  },

  {
    slug: "which-computer-course-after-class-10-or-12",
    title: "Which computer course should you take after Class 10 or 12 in Siliguri or Bagdogra?",
    seoTitle: "Which Computer Course After Class 10 or 12? (Siliguri · Bagdogra)",
    description:
      "A plain guide for students and parents in Bagdogra and Siliguri: match your goal — office job, diploma, websites, online selling, marketing or AI — to the right course and duration.",
    tldr: ({ d }) =>
      `If you have never used a computer properly, start with CCA (${d("CCA")}). If you want a recognised qualification for office or clerical jobs, take DCA (${d("DCA")}). If you want a technical foundation in one go, take ADCA (${d("ADCA")}). If you already know the basics and want a skill with its own career path, choose Web Design (${d("Web Design Basic")} to start), Ecommerce (${d("Ecommerce Expert (Industry Level)")} or ${d("Ecommerce Expert (Job Ready)")}), Digital Marketing (${d("Digital Marketing Basics")}) or AI Prompt Engineering (${d("A.I. Prompt Engineering")}). All are taught in person at CODE in Bagdogra.`,
    published: "2026-10-14",
    updated: "2026-10-14",
    courses: ["CCA", "DCA", "ADCA", "Web Design Basic", "Ecommerce Expert (Industry Level)", "Digital Marketing Basics", "A.I. Prompt Engineering"],
    body: ({ d, c }) => [
      { type: "h2", text: "Start with your goal, not the course name" },
      {
        type: "p",
        text: "Most students in Bagdogra and Siliguri come to us with one of six goals. Each maps to a different starting course. Pick the row that sounds like you.",
      },
      {
        type: "table",
        caption: "Goal → recommended first course at CODE",
        head: ["Your goal", "Start with", "Duration", "Then"],
        rows: [
          ["Be comfortable with a computer for school, college or daily life", c("CCA"), d("CCA"), "DCA"],
          ["A recognised diploma for office, clerical or data-entry jobs", c("DCA"), d("DCA"), "ADCA or Web Design"],
          ["A full technical foundation: programming, databases, web, hardware", c("ADCA"), d("ADCA"), "Web Design"],
          ["Build websites, freelance or work as a junior developer", c("Web Design Basic"), d("Web Design Basic"), c("Web Design Advanced")],
          ["Sell online — your own store or Amazon, Flipkart, Meesho", c("Ecommerce Expert (Industry Level)", "Ecommerce Expert"), d("Ecommerce Expert (Industry Level)"), c("Ecommerce Expert (Job Ready)", "Job Ready")],
          ["Promote a business on Instagram, Facebook and Google", c("Digital Marketing Basics"), d("Digital Marketing Basics"), "Ecommerce"],
          ["Use ChatGPT and other AI tools properly for study or work", c("A.I. Prompt Engineering", "AI Prompt Engineering"), d("A.I. Prompt Engineering"), "Any track"],
        ],
      },
      { type: "h2", text: "After Class 10: build the base first" },
      {
        type: "p",
        text: `After Class 10 the best investment is fluency: typing, Windows, Word, Excel, PowerPoint, email and online forms. That is exactly ${c("CCA")}, and it takes ${d("CCA")}. It makes every later course — and Class 11–12 project work — easier. Students who are already confident on a computer can go straight to DCA.`,
      },
      { type: "h2", text: "After Class 12: decide between a diploma and a skill track" },
      {
        type: "ul",
        items: [
          `**Diploma route.** ${c("DCA")} (${d("DCA")}) is the qualification most office job listings ask for. ${c("ADCA")} (${d("ADCA")}) is the longer, technical version. Read the full comparison in our DCA vs ADCA guide.`,
          `**Skill route.** If you already know the basics, a specialist track gives you something to show: a published website after ${c("Web Design Basic", "Web Design — Basic")}, a working online store after the ecommerce course, live campaigns after ${c("Digital Marketing Basics", "Digital Marketing")}.`,
          "**Both.** Many students take DCA alongside college and add a skill track afterwards. Batches run from 11 AM to 9 PM, so a slot around college hours is usually available.",
        ],
      },
      { type: "h2", text: "For parents: what to check before enrolling" },
      {
        type: "ol",
        items: [
          "Is every class at a computer, with the trainer in the room? Theory-only classes do not build skill.",
          "How big is the batch? Small batches mean doubts get answered the same day.",
          "Is there a printed receipt for every payment and a clear fee plan?",
          "Can you see the lab and meet the trainer before paying? At CODE you can walk in any working day.",
          "Is the syllabus written down, and does the certificate name the programme completed?",
        ],
      },
      { type: "h2", text: "Practical details" },
      { type: "ul", items: COURSE_FACTS },
      {
        type: "faq",
        items: [
          {
            q: "Which computer course is best after Class 10?",
            a: "CCA (Certificate in Computer Application) — three months of computer fundamentals, typing, MS Office and internet skills. It is the base every other course builds on.",
          },
          {
            q: "Which computer course is best after Class 12 for a job?",
            a: "DCA (Diploma in Computer Application) is the qualification most office, clerical and data-entry roles ask for and takes six months. ADCA is the twelve-month technical version for students who also want programming, databases and web basics.",
          },
          {
            q: "Can I do a computer course along with college?",
            a: "Yes. The centre is open Monday to Saturday from 11 AM to 9 PM, so most students pick a batch before or after college. Tell us your timetable and we will suggest a slot.",
          },
          {
            q: "Do I need to know English to join?",
            a: "No. Trainers explain in Bengali, Hindi or English, whichever the batch is comfortable with. The software itself is in English, so you also pick up the vocabulary offices use.",
          },
          {
            q: "Is there a computer course in Bagdogra near the airport?",
            a: "Yes. CODE is on Lokenath Nagar Road, near K1 Fitness Gym, about 2 km from Bagdogra Airport and 1.5 km from Bagdogra railway station.",
          },
        ],
      },
    ],
  },

  {
    slug: "how-to-choose-a-computer-institute-in-bagdogra",
    title: "How to choose a computer institute in Bagdogra or Siliguri: 8 things to check",
    seoTitle: "How to Choose a Computer Institute in Bagdogra or Siliguri",
    description:
      "Eight questions to ask any computer training centre near Bagdogra or Siliguri before you pay — about practice time, batch size, syllabus, fees, receipts, certificates, timings and reviews — and how CODE answers each.",
    tldr: () =>
      "Choose a computer institute on evidence you can see in one visit: every class at a computer, a small batch, a written syllabus, one clear fee with a monthly plan and a printed receipt, a certificate that names the course, timings you can keep, real reviews you can read on Google, and a location you can reach every day. Visit before you pay.",
    published: "2026-10-14",
    updated: "2026-10-14",
    courses: ["CCA", "DCA", "ADCA"],
    body: ({ c }) => [
      { type: "h2", text: "1. Is every class hands-on?" },
      {
        type: "p",
        text: "Ask where you will sit during a lesson. If the answer is a bench facing a whiteboard, keep looking. Computer skills are built by doing the task yourself while someone who knows it is in the room. At CODE every class is at a computer and a lesson is not finished until you have done it yourself.",
      },
      { type: "h2", text: "2. How big is the batch?" },
      {
        type: "p",
        text: "A trainer can only watch so many screens. In a small batch your doubt is answered the same day and the trainer knows your name and your pace. Ask how many students are in the batch you would join — not the centre's total.",
      },
      { type: "h2", text: "3. Is the syllabus written down?" },
      {
        type: "p",
        text: `A real course has a module list you can read before joining. Compare it with what jobs or colleges actually ask for. Ours are published on every course page — for example ${c("DCA")} and ${c("ADCA")} — and the detailed version is available at the desk.`,
      },
      { type: "h2", text: "4. Is the fee clear, and is there a receipt?" },
      {
        type: "p",
        text: "You should be told one full-payment fee and one monthly plan, nothing else, before you join. Every payment should come with a printed receipt that names the student, the course and the installment. If a centre cannot give receipts, that tells you how it keeps records.",
      },
      { type: "h2", text: "5. What does the certificate say?" },
      {
        type: "p",
        text: "Ask to see a sample certificate. It should name the institute, the programme and the student, and it should be issued only after an assessment. A certificate handed out for attendance is worth very little to an employer.",
      },
      { type: "h2", text: "6. Can you keep the timings for the whole course?" },
      {
        type: "p",
        text: "Dropping out halfway is the most common way to waste a fee. Check that a batch exists at a time you can keep for the full duration — around school, college or work — and ask what happens if you miss a week. CODE runs batches Monday to Saturday from 11 AM to 9 PM.",
      },
      { type: "h2", text: "7. What do real students say?" },
      {
        type: "p",
        text: "Read the Google reviews for the centre — the recent ones, not just the rating. Look for reviews that name a course and describe what was taught. Then visit and ask a current student in the lab. Testimonials printed on a brochure are not evidence; reviews on Google that anyone can read are.",
      },
      { type: "h2", text: "8. Can you reach it every day?" },
      {
        type: "p",
        text: "A centre you can reach in twenty minutes beats a better one you will stop attending in month three. For students from Bagdogra, Upper Bagdogra, Bihar More, Gossaipur, Matigara, Naxalbari and the Siliguri side, CODE is about 1.5 km from Bagdogra railway station and 2 km from the airport, on Lokenath Nagar Road near K1 Fitness Gym.",
      },
      { type: "h2", text: "Use the checklist on us" },
      {
        type: "p",
        text: "Walk in on any working day, see the lab, meet the trainer, read the syllabus, ask for the fee and a sample receipt, and only then decide. If something is not right for you, we would rather you choose a course that fits than join the wrong one.",
      },
      {
        type: "faq",
        items: [
          {
            q: "How do I know if a computer institute is genuine?",
            a: "Visit it. A genuine centre lets you see the lab and meet the trainer, shows you a written syllabus and a sample certificate, quotes one clear fee with a receipt for every payment, and has recent Google reviews that name real courses.",
          },
          {
            q: "Should I choose the cheapest computer course?",
            a: "Choose the course where you will actually practise and finish. A low fee for a class where you watch instead of do, or a batch at a time you cannot keep, costs more in the end. Compare what is taught per month, not just the total.",
          },
          {
            q: "Is a small institute better than a big brand?",
            a: "Neither is automatically better. What matters is the batch size you will sit in, the trainer who will teach you and whether the syllabus matches your goal. Judge the room you will learn in, not the signboard.",
          },
          {
            q: "Can I visit CODE before joining?",
            a: "Yes. Walk in Monday to Saturday between 11 AM and 9 PM, or message on WhatsApp to fix a time. You can see the computer lab, meet the trainer and ask about the course before deciding.",
          },
        ],
      },
    ],
  },

  {
    slug: "computer-course-fees-and-monthly-plans",
    title: "Computer course fees at CODE Bagdogra: how the monthly plans work",
    seoTitle: "Computer Course Fees in Bagdogra — How Monthly Plans Work",
    description:
      "How fees work at CODE, Bagdogra: one full-payment fee or a monthly plan with one installment per month of the course, a printed receipt every time, no hidden charges. Fees are quoted at the desk or on WhatsApp.",
    tldr: () =>
      "Every course at CODE has two ways to pay: a single full-payment fee, or a monthly plan with one installment for each month of the course — six installments for a six-month course, twelve for a twelve-month course. Paying in full costs less than the total of the monthly plan. Every payment gets a printed receipt. The exact fee for each course is quoted at the desk or on WhatsApp, not published online, because offers and batch timings change.",
    published: "2026-10-14",
    updated: "2026-10-14",
    courses: ["CCA", "DCA", "ADCA", "Web Design Basic", "Ecommerce Expert (Job Ready)"],
    body: ({ d, c }) => [
      { type: "h2", text: "Two ways to pay" },
      {
        type: "table",
        caption: "Payment options for every course",
        head: ["Option", "How it works", "Good for"],
        rows: [
          ["Full payment", "One payment at enrolment. Lower total than the monthly plan.", "Students who can pay once and prefer the lower total"],
          ["Monthly plan", "One installment per month of the course, paid at the centre. Printed receipt each time.", "Families who prefer to spread the cost over the course"],
        ],
      },
      { type: "h2", text: "How many installments is my course?" },
      {
        type: "p",
        text: "The monthly plan always matches the course length. The table below is generated from the current catalogue.",
      },
      {
        type: "table",
        caption: "Course length and number of monthly installments",
        head: ["Course", "Duration", "Monthly installments"],
        rows: [
          [c("CCA"), d("CCA"), d("CCA").replace(/\D.*$/, "")],
          [c("DCA"), d("DCA"), d("DCA").replace(/\D.*$/, "")],
          [c("ADCA"), d("ADCA"), d("ADCA").replace(/\D.*$/, "")],
          [c("Web Design Basic"), d("Web Design Basic"), d("Web Design Basic").replace(/\D.*$/, "")],
          [c("Web Design Advanced"), d("Web Design Advanced"), d("Web Design Advanced").replace(/\D.*$/, "")],
          [c("Ecommerce Expert (Industry Level)"), d("Ecommerce Expert (Industry Level)"), d("Ecommerce Expert (Industry Level)").replace(/\D.*$/, "")],
          [c("Ecommerce Expert (Job Ready)"), d("Ecommerce Expert (Job Ready)"), d("Ecommerce Expert (Job Ready)").replace(/\D.*$/, "")],
          [c("Digital Marketing Basics"), d("Digital Marketing Basics"), d("Digital Marketing Basics").replace(/\D.*$/, "")],
          [c("A.I. Prompt Engineering"), d("A.I. Prompt Engineering"), d("A.I. Prompt Engineering").replace(/\D.*$/, "")],
        ],
      },
      { type: "h2", text: "Why the fee is not printed on this page" },
      {
        type: "p",
        text: "Fees are quoted at the desk or on WhatsApp because admission offers, batch timings and the start date change through the year, and a number printed here would soon be wrong. What does not change: there is one fee per course, one monthly plan, no registration or hidden charges on top, and a receipt for every rupee.",
      },
      { type: "h2", text: "What you get for the fee" },
      {
        type: "ul",
        items: [
          "In-person classes at a computer, in a small batch, with the trainer in the room.",
          "The full published syllabus for the course, with topics updated as tools change.",
          "Assessment or project work at the end, and a CODE certificate naming the programme completed.",
          "A printed receipt for every payment, kept on record at the centre.",
        ],
      },
      { type: "h2", text: "How to get the current fee" },
      {
        type: "ol",
        items: [
          "Message +91 96358 09537 on WhatsApp with the course name — you get the full-payment fee, the monthly plan and the next batch time.",
          "Or visit the centre Monday to Saturday, 11 AM to 9 PM, Lokenath Nagar Road, near K1 Fitness Gym, Bagdogra.",
          "Check the Offers page for any admission offer running this month and mention it when you enquire.",
        ],
      },
      {
        type: "faq",
        items: [
          {
            q: "Can I pay the computer course fee monthly?",
            a: "Yes. Every course has a monthly plan with one installment per month of the course, paid at the centre with a printed receipt each time.",
          },
          {
            q: "Is paying in full cheaper than the monthly plan?",
            a: "Yes. For every course the full-payment fee is lower than the total of the monthly installments.",
          },
          {
            q: "Are there any extra charges?",
            a: "No. There is one fee per course and one monthly plan. There are no registration, exam or certificate charges on top.",
          },
          {
            q: "What is the DCA course fee in Bagdogra?",
            a: "The current DCA fee and monthly plan are quoted at the desk or on WhatsApp at +91 96358 09537. DCA runs six months, so the monthly plan has six installments.",
          },
          {
            q: "Do I get a receipt?",
            a: "Yes. A printed receipt is issued for every payment, full or monthly, naming the student, the course and the installment.",
          },
        ],
      },
    ],
  },

  {
    slug: "computer-courses-for-shop-owners-sell-online",
    title: "Computer courses for shop owners in Siliguri and Bagdogra who want to sell online",
    seoTitle: "Sell Online from Siliguri: Ecommerce & Marketing Courses for Shop Owners",
    description:
      "For shop and small-business owners around Siliguri and Bagdogra: which course teaches you to sell on Amazon, Flipkart, Meesho or your own Shopify store, run Meta ads, fix your Google Business Profile and use AI for daily work.",
    tldr: ({ d }) =>
      `A shop owner who wants to sell online has three practical courses at CODE in Bagdogra. Ecommerce Expert — Industry Level (${d("Ecommerce Expert (Industry Level)")}) teaches you to set up a Shopify store and sell on Amazon, Flipkart and Meesho, from listings to delivery. Digital Marketing — Basics (${d("Digital Marketing Basics")}) teaches Instagram and Facebook marketing, Meta ads, Google Business Profile and WhatsApp marketing. AI Prompt Engineering (${d("A.I. Prompt Engineering")}) teaches you to use ChatGPT and similar tools for product descriptions, replies and daily paperwork. You do not need a website, a product catalogue or any coding to start.`,
    published: "2026-10-14",
    updated: "2026-10-14",
    courses: ["Ecommerce Expert (Industry Level)", "Ecommerce Expert (Job Ready)", "Digital Marketing Basics", "A.I. Prompt Engineering"],
    body: ({ d, c }) => [
      { type: "h2", text: "Which course do I need?" },
      {
        type: "table",
        caption: "What you want to do → the course that teaches it",
        head: ["You want to…", "Course", "Duration", "What you leave with"],
        rows: [
          ["List and sell products on Amazon, Flipkart or Meesho", c("Ecommerce Expert (Industry Level)", "Ecommerce Expert — Industry Level"), d("Ecommerce Expert (Industry Level)"), "A working store and marketplace listings, and the order-to-delivery flow"],
          ["Run the whole online business, including ads and SEO, or get an ecommerce job", c("Ecommerce Expert (Job Ready)", "Ecommerce Expert — Job Ready"), d("Ecommerce Expert (Job Ready)"), "Growth skills (Meta and Google ads, SEO, retention) plus live projects"],
          ["Get more customers through Instagram, Facebook, Google and WhatsApp", c("Digital Marketing Basics", "Digital Marketing — Basics"), d("Digital Marketing Basics"), "Live pages, your first ad campaigns, a fixed Google Business Profile"],
          ["Write listings, replies and documents faster with AI", c("A.I. Prompt Engineering", "AI Prompt Engineering"), d("A.I. Prompt Engineering"), "A personal toolkit of prompts for your shop's daily work"],
        ],
      },
      { type: "h2", text: "Selling on marketplaces versus your own store" },
      {
        type: "p",
        text: "Amazon, Flipkart and Meesho bring the customers; you compete on listing quality, price and delivery. A Shopify store is yours — your brand, your customer list — but you bring the traffic yourself through ads, Instagram and WhatsApp. The ecommerce course covers both so you can start with a marketplace and add your own store when it makes sense.",
      },
      { type: "h2", text: "Why Google Business Profile comes first for a local shop" },
      {
        type: "p",
        text: "Before any ad, make sure your shop appears correctly when someone nearby searches for what you sell: the right category, photos, hours, phone and reviews. This is a module in the Digital Marketing course, and it is the cheapest customers you will ever get.",
      },
      { type: "h2", text: "What you need to join" },
      {
        type: "ul",
        items: [
          "Comfort using a computer and a smartphone. If you are starting from zero, do CCA first — it takes three months.",
          "No products, website or business registration are required for the course; you practise on a store you build in class. If you already sell, you apply every step to your own products as you go.",
          "No coding. Shopify, marketplaces, Meta Ads Manager and Canva are all point-and-click tools.",
        ],
      },
      { type: "h2", text: "Practical details" },
      { type: "ul", items: COURSE_FACTS },
      {
        type: "faq",
        items: [
          {
            q: "Can I learn to sell on Amazon and Flipkart in Siliguri?",
            a: "Yes. Ecommerce Expert — Industry Level at CODE, Bagdogra, covers marketplace selling on Amazon, Flipkart and Meesho — listings, catalogue management, orders, inventory and customer handling — plus setting up your own Shopify store.",
          },
          {
            q: "Do I need a GST number or a registered business to join the ecommerce course?",
            a: "No. The course does not require any registration to join. It explains what marketplaces ask for when you are ready to sell, and you practise on a store you build during the course.",
          },
          {
            q: "Which course teaches Meta (Facebook and Instagram) ads?",
            a: "Digital Marketing — Basics covers Meta Ads campaigns, audiences and creatives, alongside Instagram and Facebook marketing, Google Business Profile and WhatsApp marketing. Ecommerce Expert — Job Ready covers Meta and Google ads specifically for online stores.",
          },
          {
            q: "Can a shop owner attend classes around shop hours?",
            a: "Usually yes. The centre runs batches Monday to Saturday from 11 AM to 9 PM; tell us your shop timings and we will suggest a slot.",
          },
        ],
      },
    ],
  },

  {
    slug: "dca-course-details",
    title: "DCA course: full form, syllabus, duration, eligibility and jobs after DCA",
    seoTitle: "DCA Course — Full Form, Syllabus, Duration, Eligibility & Jobs",
    description:
      "DCA stands for Diploma in Computer Application. What the six-month diploma covers module by module, who can join, what the certificate is, which jobs ask for it, and how DCA compares with CCA, ADCA, CCC and BCA — from the trainers at CODE, Bagdogra.",
    tldr: ({ d }) =>
      `DCA is the Diploma in Computer Application: a ${d("DCA")} diploma in advanced MS Office (Word, Excel, PowerPoint, Access basics), computerised accounting fundamentals, internet, email and cloud tools, an introduction to programming logic, basic graphics and a project. Anyone who has passed Class 10 can join; no earlier computer course is required. It is the qualification most often listed for office assistant, data-entry, computer-operator and back-office roles. At CODE in Bagdogra it is taught in person at a computer with a monthly fee plan and a CODE certificate on completion.`,
    published: "2026-10-14",
    updated: "2026-10-14",
    courses: ["DCA", "CCA", "ADCA"],
    body: ({ d, c }) => [
      { type: "h2", text: "What is the full form of DCA?" },
      {
        type: "p",
        text: "DCA stands for **Diploma in Computer Application**. It is a short, job-oriented diploma that teaches the software an office uses every day — documents, spreadsheets, presentations, email, basic accounts — plus enough programming logic to understand how software works. It sits between CCA (the beginner certificate) and ADCA (the advanced diploma).",
      },
      { type: "h2", text: "DCA syllabus at CODE" },
      {
        type: "table",
        caption: "DCA modules and what each one is for",
        head: ["Module", "What you learn", "Where you use it"],
        rows: [
          ["Advanced MS Office", "Word (long documents, mail merge), Excel (formulas, charts, data tools), PowerPoint, Access basics", "Every office, school and shop"],
          ["Computerised accounting fundamentals", "Ledgers, vouchers, invoices and reports in accounting software", "Shops, agencies, accounts departments"],
          ["Internet, email and cloud tools", "Professional email, online forms, Google Drive and shared documents", "Remote and office work, government portals"],
          ["Introduction to programming logic", "Sequences, conditions, loops and variables", "The base for ADCA and web design"],
          ["Basic graphics and image editing", "Cropping, resizing and simple design for documents and social media", "Office and small-business work"],
          ["Project work and assessment", "A practical project using the tools above", "The certificate"],
        ],
      },
      {
        type: "p",
        text: `The DCA course at CODE takes ${d("DCA")}. Topics are indicative and are updated as software versions change; the detailed syllabus is available at the desk. See the ${c("DCA", "DCA course page")} for who it is for and the current batch.`,
      },
      { type: "h2", text: "Who can join DCA? Eligibility" },
      {
        type: "ul",
        items: [
          "Students who have passed Class 10 or Class 12, in any stream.",
          "College students and graduates applying for office or clerical posts.",
          "Working adults and home-makers who want a recognised computer qualification.",
          `No earlier computer course is required. If you have never used a computer, ${c("CCA")} first (${d("CCA")}) makes the first weeks of DCA much easier.`,
        ],
      },
      { type: "h2", text: "Jobs after DCA" },
      {
        type: "p",
        text: "DCA is the computer qualification most commonly listed for entry-level office roles. The job titles below are the ones students in the Siliguri and Bagdogra area most often apply for with a DCA; the course covers the exact skills those roles test.",
      },
      {
        type: "ul",
        items: [
          "**Data-entry operator** — typing speed, Excel data work, accuracy.",
          "**Computer operator** — Windows, MS Office, printing, email, basic troubleshooting.",
          "**Office assistant / back-office executive** — letters, reports, spreadsheets, records.",
          "**Accounts assistant** — computerised accounting fundamentals, invoices and ledgers.",
          "**Front-desk and reception** — email, forms, appointment and record keeping.",
          "**Self-employment** — running a cyber café, online-form centre or small shop's accounts and billing.",
        ],
      },
      {
        type: "callout",
        text: "CODE does not promise placements. What the course promises is that you will have done every task above yourself, on a computer, before you sit an interview or a typing test.",
      },
      { type: "h2", text: "Is DCA a government-recognised course?" },
      {
        type: "p",
        text: "The DCA certificate from CODE is issued by CODE — Computer & Digital Excellence, a private training centre, after you complete the course and its assessment. It is not a university degree or a government certificate. Private employers ask for DCA because of the skills it stands for; for a government post that names a specific certificate (for example NIELIT's CCC), read the recruitment notice and get that certificate as well. The skills tested in those exams — typing, MS Office, internet — are the skills DCA teaches.",
      },
      { type: "h2", text: "DCA vs CCA, ADCA, CCC and BCA" },
      {
        type: "table",
        caption: "How DCA compares with the courses people confuse it with",
        head: ["Course", "What it is", "Duration", "Best for"],
        rows: [
          [c("CCA"), "Beginner certificate: basics, typing, MS Office, internet", d("CCA"), "Starting from zero"],
          ["DCA", "Diploma: advanced Office, accounting basics, programming logic", d("DCA"), "Office, clerical and data-entry roles"],
          [c("ADCA"), "Advanced diploma: DCA plus C/Python, SQL, HTML/CSS, hardware basics", d("ADCA"), "Technical foundation, web design path"],
          ["CCC (NIELIT)", "Government 'Course on Computer Concepts' certificate exam", "Exam-based", "Posts that name CCC in the notification"],
          ["BCA", "Three-year university degree in computer applications", "3 years", "A full degree and software careers"],
        ],
      },
      { type: "h2", text: "DCA course fee in Bagdogra" },
      {
        type: "p",
        text: `The fee is quoted at the desk or on WhatsApp, not online, because admission offers and batch timings change through the year. What is fixed: one full-payment fee, one monthly plan with one installment per month of the course, a printed receipt for every payment and no extra charges. Read [how fees and monthly plans work](/guides/computer-course-fees-and-monthly-plans).`,
      },
      { type: "h2", text: "How DCA is taught at CODE" },
      { type: "ul", items: COURSE_FACTS },
      {
        type: "faq",
        items: [
          { q: "What is the full form of DCA?", a: "DCA stands for Diploma in Computer Application — a short diploma in office software, computerised accounting basics, internet tools and an introduction to programming." },
          { q: "How long is the DCA course?", a: "Six months at CODE, Bagdogra, including project work and the final assessment. The monthly plan therefore has six installments." },
          { q: "What is the eligibility for DCA?", a: "Class 10 pass or above. No earlier computer course is required; complete beginners can start with CCA first." },
          { q: "Which jobs can I get after DCA?", a: "DCA is the qualification most often asked for in data-entry operator, computer operator, office assistant, back-office, accounts assistant and front-desk roles. It is also the base for running a cyber café or small-business billing." },
          { q: "Is DCA enough for a government job?", a: "DCA gives you the skills — typing, MS Office, internet — that government computer tests check. If a recruitment notice names a specific certificate such as NIELIT CCC, you need that certificate too; DCA prepares you for its content." },
          { q: "Is there a DCA course in Siliguri or Bagdogra with monthly fees?", a: "Yes. CODE on Lokenath Nagar Road, Bagdogra — about 10 km from Siliguri Junction — teaches DCA in person with a monthly fee plan and a printed receipt for every payment." },
        ],
      },
    ],
  },

  {
    slug: "adca-course-details",
    title: "ADCA course: full form, syllabus, duration and what you can do after it",
    seoTitle: "ADCA Course — Full Form, Syllabus, Duration & Scope",
    description:
      "ADCA stands for Advanced Diploma in Computer Application. The twelve-month syllabus module by module — office automation, accounting, C/Python, databases and SQL, HTML/CSS, graphics, OS, networking and hardware — who should join, and what comes after.",
    tldr: ({ d }) =>
      `ADCA is the Advanced Diploma in Computer Application: a ${d("ADCA")} programme that includes everything in DCA — advanced MS Office and computerised accounting — and adds programming fundamentals in C or Python, database management and SQL basics, HTML and CSS web pages, graphic design and multimedia basics, and operating-system, networking and hardware fundamentals, finishing with a final project and viva. You can join directly after Class 10 or 12; DCA is not required first. It is the right choice if you want one programme that gives a technical foundation or plan to continue into web design.`,
    published: "2026-10-14",
    updated: "2026-10-14",
    courses: ["ADCA", "DCA", "Web Design Basic"],
    body: ({ d, c }) => [
      { type: "h2", text: "What is the full form of ADCA?" },
      {
        type: "p",
        text: "ADCA stands for **Advanced Diploma in Computer Application**. Where DCA teaches you to use software, ADCA also teaches you how software is built — programs, databases, web pages — and what runs underneath it: operating systems, networks and hardware. It is CODE's most complete computer-applications programme.",
      },
      { type: "h2", text: "ADCA syllabus at CODE" },
      {
        type: "table",
        caption: "ADCA modules in the order they are taught",
        head: ["Module", "What you learn"],
        rows: [
          ["Office automation and computerised accounting", "Advanced Word, Excel, PowerPoint and Access basics; ledgers, invoices and reports in accounting software"],
          ["Programming fundamentals (C / Python)", "Variables, conditions, loops, functions; writing and debugging small programs"],
          ["Database management and SQL basics", "Tables, keys, queries; building and querying a small database"],
          ["HTML, CSS and web page basics", "Structure and styling of web pages; a simple multi-page site"],
          ["Graphic design and multimedia basics", "Image editing, layout and simple design for print and screen"],
          ["Operating systems, networking and hardware basics", "Installing and configuring a PC, file systems, LAN and internet basics, common faults"],
          ["Final project and viva", "A project that combines the modules, presented to the trainer"],
        ],
      },
      {
        type: "p",
        text: `ADCA takes ${d("ADCA")}. Topics are indicative and change with software versions; the detailed syllabus is at the desk. The ${c("ADCA", "ADCA course page")} has the current batch and the full outcomes list.`,
      },
      { type: "h2", text: "Who should join ADCA?" },
      {
        type: "ul",
        items: [
          "College students and job seekers who want one programme covering software, data and the web.",
          "Learners planning a technical career who want programming, databases and hardware basics from the start.",
          `Students who intend to continue into ${c("Web Design Basic", "Web Design")} — the HTML/CSS module is a head start.`,
          "Anyone who has finished CCA or DCA and wants the technical depth; you will move through the early modules faster.",
        ],
      },
      { type: "h2", text: "Do you need DCA before ADCA?" },
      {
        type: "p",
        text: "No. ADCA includes the office-automation and accounting content, so you can join directly after Class 10 or 12. If you are completely new to computers, CCA first will make the programme more comfortable, but it is not a requirement. The full comparison is in [DCA vs ADCA](/guides/dca-vs-adca).",
      },
      { type: "h2", text: "What can you do after ADCA?" },
      {
        type: "ul",
        items: [
          "**Everything DCA qualifies you for** — data-entry, computer operator, office assistant and accounts assistant roles.",
          "**Technical-support and computer-maintenance roles**, because of the OS, networking and hardware modules.",
          "**Junior data roles** that need SQL and Excel together.",
          `**Web design**, by continuing into ${c("Web Design Basic", "Web Design — Basic")} and then ${c("Web Design Advanced", "Web Design — Advanced")}.`,
          "**Further study**, with programming and database basics already in hand.",
        ],
      },
      { type: "callout", text: "No placement is promised. The programme ends with a project you built and a viva you passed — that is what you show an employer." },
      { type: "h2", text: "ADCA fee and payment" },
      {
        type: "p",
        text: `The fee is quoted at the desk or on WhatsApp. ADCA has a full-payment fee and a monthly plan with one installment per month of the course — twelve for the ${d("ADCA")} programme — with a printed receipt each time. See [how fees and monthly plans work](/guides/computer-course-fees-and-monthly-plans).`,
      },
      { type: "h2", text: "How ADCA is taught at CODE" },
      { type: "ul", items: COURSE_FACTS },
      {
        type: "faq",
        items: [
          { q: "What is the full form of ADCA?", a: "ADCA stands for Advanced Diploma in Computer Application — a twelve-month programme that covers office software and accounting plus programming, databases, web basics and hardware fundamentals." },
          { q: "How long is the ADCA course?", a: "Twelve months at CODE, Bagdogra, ending with a final project and viva." },
          { q: "What is the eligibility for ADCA?", a: "Class 10 pass or above. DCA is not required first; ADCA includes the office modules." },
          { q: "Which programming languages are taught in ADCA?", a: "Programming fundamentals in C or Python, plus SQL for databases and HTML and CSS for web pages." },
          { q: "ADCA or BCA — which should I do?", a: "BCA is a three-year university degree; ADCA is a twelve-month institute diploma. If you want a degree and a software career, BCA; if you want a practical technical foundation in a year while studying or working, ADCA. Many students do ADCA alongside a degree in another subject." },
          { q: "Is there an ADCA course in Bagdogra or Siliguri?", a: "Yes. CODE teaches ADCA in person on Lokenath Nagar Road, Bagdogra, about 2 km from Bagdogra Airport and 10 km from Siliguri Junction, with a monthly fee plan." },
        ],
      },
    ],
  },

  {
    slug: "basic-computer-course-for-beginners",
    title: "Basic computer course for beginners in Bagdogra: what you learn in CCA and who it is for",
    seoTitle: "Basic Computer Course for Beginners in Bagdogra (CCA)",
    description:
      "Starting from zero? What a basic computer course should teach — Windows, typing, MS Word, Excel, PowerPoint, email, internet and digital safety — how long it takes, who joins (students, home-makers, shop staff, senior citizens) and how classes work in Bengali, Hindi or English.",
    tldr: ({ d }) =>
      `A basic computer course for beginners should get you to operate a computer on your own: switch it on, manage files, type at a usable speed, write a letter or résumé in Word, keep a simple account sheet in Excel, make a presentation, use email and fill online forms safely. That is exactly the CCA (Certificate in Computer Application) course at CODE, Bagdogra. It takes ${d("CCA")}, assumes nothing, is taught at a computer in a small batch explained in Bengali, Hindi or English, and has a monthly fee plan. Most students then continue to DCA.`,
    published: "2026-10-14",
    updated: "2026-10-14",
    courses: ["CCA", "DCA", "A.I. Prompt Engineering"],
    body: ({ d, c }) => [
      { type: "h2", text: "Who joins a basic computer course?" },
      {
        type: "ul",
        items: [
          "**School students** (Class 8 and up) who need typing, Word and PowerPoint for projects and want a head start before DCA.",
          "**College students** who have used a phone for everything and a computer for almost nothing.",
          "**Home-makers and parents** who want to handle online forms, banking, school portals and their children's homework with confidence.",
          "**Shop staff and small-business owners** who need billing, a stock sheet in Excel and email.",
          "**Working adults** whose job has just added a computer, and **senior citizens** who want independence online.",
        ],
      },
      { type: "h2", text: "What you learn in CCA, week by week" },
      {
        type: "table",
        caption: "CCA at CODE — the beginner syllabus",
        head: ["Topic", "By the end you can…"],
        rows: [
          ["Computer fundamentals and Windows", "Start, shut down, find and organise files and folders, use a pen drive, install a printer"],
          ["Typing and keyboard confidence", "Type without looking for every key; a usable speed for forms and documents"],
          ["MS Word", "Write and format a letter, a résumé and a report; print and save as PDF"],
          ["MS Excel", "Make a table, total a column, use simple formulas and keep a basic account sheet"],
          ["MS PowerPoint", "Build a clean presentation with images for school, college or work"],
          ["Internet, email and online forms", "Search well, send email with attachments, fill government and bank forms, pay bills"],
          ["Digital safety", "Recognise scams and fake messages, manage passwords, keep your phone and PC safe"],
        ],
      },
      {
        type: "p",
        text: `CCA takes ${d("CCA")}. Every lesson is practised on a computer in class, so there is nothing to memorise and nothing you have only watched. Details and the current batch are on the ${c("CCA", "CCA course page")}.`,
      },
      { type: "h2", text: "Do I need to know English?" },
      {
        type: "p",
        text: "No. The trainer explains in Bengali, Hindi or English, whichever the batch is comfortable with. The software itself is in English, and you pick up the words you need — File, Save, Print, Send — within the first week.",
      },
      { type: "h2", text: "Can I learn basic computers online instead?" },
      {
        type: "p",
        text: "Videos are a good supplement, but beginners get stuck on small things — a dialog box, a missing file, a keyboard shortcut — and stop. In a classroom the trainer sees your screen and fixes it in a minute. For the first course, learn in person; later courses can mix both.",
      },
      { type: "h2", text: "What comes after the basic course?" },
      {
        type: "ul",
        items: [
          `Most students continue to ${c("DCA")} (${d("DCA")}) — the diploma that offices ask for. Read [DCA course details](/guides/dca-course-details).`,
          `Students and professionals who mainly want to work faster often add ${c("A.I. Prompt Engineering", "AI Prompt Engineering")} (${d("A.I. Prompt Engineering")}), which needs no coding.`,
          "Shop owners move to the ecommerce or digital-marketing courses — see [courses for shop owners who want to sell online](/guides/computer-courses-for-shop-owners-sell-online).",
        ],
      },
      { type: "h2", text: "Practical details" },
      { type: "ul", items: COURSE_FACTS },
      {
        type: "faq",
        items: [
          { q: "Which computer course is best for a complete beginner?", a: "CCA (Certificate in Computer Application): computer basics, typing, MS Word, Excel, PowerPoint, email, internet and digital safety in three months, taught at a computer. DCA is the next step." },
          { q: "How long does it take to learn basic computers?", a: "The CCA course at CODE takes three months with regular classes. Most students are operating a computer independently within the first month and finish with Word, Excel, PowerPoint and email skills." },
          { q: "Is there a computer course for housewives or home-makers in Bagdogra?", a: "Yes. CCA is designed for anyone starting from zero, including home-makers; batches run through the day, Monday to Saturday, 11 AM to 9 PM, and classes are explained in Bengali, Hindi or English." },
          { q: "Can a senior citizen join a basic computer class?", a: "Yes. The course assumes nothing, the batch is small and the pace follows the students. Tell us your goal — email, banking, video calls — and the trainer will focus on it." },
          { q: "Is there an age limit or minimum qualification for CCA?", a: "No formal requirement. School students from about Class 8, college students, adults and senior citizens all join." },
        ],
      },
    ],
  },

  {
    slug: "computer-courses-for-office-and-data-entry-jobs",
    title: "Computer courses for office, data-entry and computer-operator jobs in Siliguri and Bagdogra",
    seoTitle: "Computer Course for Data Entry, Office & Computer Operator Jobs",
    description:
      "Which computer skills office, data-entry and computer-operator jobs around Siliguri actually test — typing speed, MS Word, Excel, email, accounting basics — and which course at CODE Bagdogra teaches each one. Includes a practical skills checklist.",
    tldr: ({ d }) =>
      `Office, data-entry and computer-operator jobs test five things: typing speed and accuracy, MS Word, MS Excel, email and internet, and often computerised accounting basics. CCA (${d("CCA")}) covers typing, Word, Excel, PowerPoint and email at a working level. DCA (${d("DCA")}) is the diploma most job listings name, adding advanced Office, accounting fundamentals and programming logic. ADCA (${d("ADCA")}) adds SQL, programming and hardware for technical-support and data roles. All three are taught in person at CODE in Bagdogra with a monthly fee plan. No placement is promised; the skills are.`,
    published: "2026-10-14",
    updated: "2026-10-14",
    courses: ["DCA", "CCA", "ADCA"],
    body: ({ d, c }) => [
      { type: "h2", text: "What computer skills do office jobs actually ask for?" },
      {
        type: "p",
        text: "Read ten job advertisements for office assistant, data-entry operator or computer operator posts in Siliguri and the same requirements repeat. Here they are, with the course at CODE that teaches each.",
      },
      {
        type: "table",
        caption: "Skills employers list → where you learn them at CODE",
        head: ["Skill asked for", "What it means in practice", "Course"],
        rows: [
          ["Typing speed (often 30–40 words per minute)", "Typing from paper and dictation without watching the keyboard", `${c("CCA")} (practised throughout)`],
          ["MS Word", "Letters, notices, reports, mail merge, tables, PDF export", `${c("CCA")} basics → ${c("DCA")} advanced`],
          ["MS Excel / data entry", "Entering data fast and accurately, formulas, sorting and filtering, charts, lookups", `${c("CCA")} basics → ${c("DCA")} advanced`],
          ["Email and internet", "Professional email, attachments, online forms, government and bank portals", c("CCA")],
          ["Computerised accounting", "Vouchers, ledgers, invoices and reports in accounting software", c("DCA")],
          ["Basic troubleshooting", "Printer, network and PC problems; installing software", c("ADCA")],
          ["Databases / SQL", "Querying and maintaining records in a database", c("ADCA")],
        ],
      },
      { type: "h2", text: "Which course should you take?" },
      {
        type: "ul",
        items: [
          `**Never used a computer properly:** start with ${c("CCA")} (${d("CCA")}). You cannot pass a typing test or an Excel task on theory.`,
          `**Want the qualification listings ask for:** ${c("DCA")} (${d("DCA")}). It is the computer diploma most commonly named for office, clerical and data-entry posts. Full details in [DCA course details](/guides/dca-course-details).`,
          `**Want technical-support or data roles, or a base for web work:** ${c("ADCA")} (${d("ADCA")}). See [ADCA course details](/guides/adca-course-details).`,
        ],
      },
      { type: "h2", text: "A practical checklist before you apply" },
      {
        type: "ol",
        items: [
          "Type a full page from paper in under ten minutes with few errors.",
          "Format a two-page letter in Word with a header, numbered points and a signature block, and export it as PDF.",
          "Enter 100 rows of data in Excel, total and average a column, sort and filter, and make one chart.",
          "Send an email with two attachments and a clear subject line; fill an online form end to end.",
          "Create one invoice and one ledger entry in accounting software (DCA).",
          "Explain, in one sentence each, what a file, a folder, a browser and a spreadsheet are — interviewers ask.",
        ],
      },
      { type: "callout", text: "Every item on that list is a class exercise at CODE. By the end of DCA you will have done each one several times on a computer, not watched it on a screen." },
      { type: "h2", text: "Government computer tests" },
      {
        type: "p",
        text: "Many state and central recruitment processes include a computer-proficiency or typing test, and some notifications name a specific certificate such as NIELIT CCC. CODE's certificates are institute certificates, not government ones — read the notice. What the course gives you is the ability to pass the practical test: typing speed, MS Office tasks and internet use are exactly the DCA syllabus.",
      },
      { type: "h2", text: "Practical details" },
      { type: "ul", items: COURSE_FACTS },
      {
        type: "faq",
        items: [
          { q: "Which computer course is best for a data-entry job?", a: "DCA (Diploma in Computer Application). It covers typing, advanced Word and Excel, email and accounting basics — the skills data-entry roles test. Complete beginners should do CCA first." },
          { q: "Which course is needed for a computer operator post?", a: "DCA covers what most computer-operator posts ask for: Windows, MS Office, email, printing and records. ADCA adds troubleshooting, networking and hardware basics for posts that include maintenance." },
          { q: "Is a typing course included?", a: "Yes. Typing is practised throughout CCA and continues in DCA; there is no separate typing fee." },
          { q: "Do you guarantee a job after the course?", a: "No. CODE does not promise placements. The course guarantees that you have practised every skill those jobs test, on a computer, with a trainer checking your work." },
          { q: "Is DCA valid for government jobs in West Bengal?", a: "DCA from CODE is an institute certificate. If a government notice names a specific certificate such as NIELIT CCC, you need that one too; DCA gives you the typing, MS Office and internet skills those tests examine." },
        ],
      },
    ],
  },

  {
    slug: "best-computer-courses-for-the-future",
    title: "Best computer courses to learn in 2026 for a job or your own business, from Siliguri or Bagdogra",
    seoTitle: "Best Computer Courses to Learn in 2026 (Job or Business) — Siliguri",
    description:
      "An honest ranking of computer skills worth learning now — AI tools, web design, ecommerce, digital marketing, data and office skills — matched to the courses at CODE Bagdogra, with who each one suits and how long it takes. No salary promises.",
    tldr: ({ d }) =>
      `The computer skills most worth learning now are the ones every business near you is adopting: using AI assistants properly (AI Prompt Engineering, ${d("A.I. Prompt Engineering")}), selling online (Ecommerce Expert, ${d("Ecommerce Expert (Industry Level)")} or ${d("Ecommerce Expert (Job Ready)")}), promoting a business on Instagram, Facebook, Google and WhatsApp (Digital Marketing, ${d("Digital Marketing Basics")}), building websites (Web Design, ${d("Web Design Basic")} then ${d("Web Design Advanced")}) and working with data (ADCA's Excel, SQL and Python modules, ${d("ADCA")}). Office skills (CCA, DCA) are not out of date — they are the base every one of these stands on. Pick by your goal and your starting point, not by hype.`,
    published: "2026-10-14",
    updated: "2026-10-14",
    courses: ["A.I. Prompt Engineering", "Web Design Basic", "Ecommerce Expert (Job Ready)", "Digital Marketing Basics", "ADCA"],
    body: ({ d, c }) => [
      { type: "h2", text: "How we ranked these" },
      {
        type: "p",
        text: "Not by salary tables from other cities. We looked at what shops, offices, schools and agencies in Siliguri and Bagdogra are actually doing this year — moving sales online, running ads on their phone, using ChatGPT for paperwork, needing a website — and which skills let a student or a business owner here take part. Each skill below is matched to a course that teaches it at a computer, in person.",
      },
      {
        type: "table",
        caption: "Skills worth learning now, and the course that teaches each",
        head: ["Skill", "Why now", "Course", "Duration", "Needs coding?"],
        rows: [
          ["Using AI assistants well", "ChatGPT and Gemini are in every office and classroom; knowing how to prompt, verify and automate is the new typing", c("A.I. Prompt Engineering", "AI Prompt Engineering"), d("A.I. Prompt Engineering"), "No"],
          ["Selling online", "Local shops are listing on Amazon, Flipkart and Meesho and opening Shopify stores; someone has to run them", c("Ecommerce Expert (Industry Level)", "Ecommerce Expert"), `${d("Ecommerce Expert (Industry Level)")} / ${d("Ecommerce Expert (Job Ready)")}`, "No"],
          ["Digital marketing", "Every business needs a Google Business Profile, Instagram presence and ads that work", c("Digital Marketing Basics", "Digital Marketing — Basics"), d("Digital Marketing Basics"), "No"],
          ["Web design", "Websites for local businesses, freelance work and a path to junior developer roles", `${c("Web Design Basic", "Web Design — Basic")} → ${c("Web Design Advanced", "Advanced")}`, `${d("Web Design Basic")} + ${d("Web Design Advanced")}`, "Yes, taught from zero"],
          ["Data skills", "Excel, SQL and Python basics are asked for in office, support and junior data roles", c("ADCA"), d("ADCA"), "Yes, fundamentals"],
          ["Office fluency", "Still the entry requirement for most jobs and the base for everything above", `${c("CCA")} → ${c("DCA")}`, `${d("CCA")} / ${d("DCA")}`, "No"],
        ],
      },
      { type: "h2", text: "1. Using AI tools properly" },
      {
        type: "p",
        text: `The skill is not "knowing ChatGPT exists". It is writing a prompt that gets a reliable answer, checking it, and building small workflows that save hours a week — for a teacher's worksheets, a shop's product descriptions, a student's notes. ${c("A.I. Prompt Engineering", "AI Prompt Engineering")} takes ${d("A.I. Prompt Engineering")} and needs no coding.`,
      },
      { type: "h2", text: "2. Ecommerce — selling online" },
      {
        type: "p",
        text: `Marketplaces bring the customers; the work is listings, orders, inventory and customer handling, then ads and SEO to grow. ${c("Ecommerce Expert (Industry Level)", "Ecommerce Expert — Industry Level")} (${d("Ecommerce Expert (Industry Level)")}) covers store setup and operations; ${c("Ecommerce Expert (Job Ready)", "Job Ready")} (${d("Ecommerce Expert (Job Ready)")}) adds growth, live projects and interview preparation. Shop owners: read [courses for shop owners who want to sell online](/guides/computer-courses-for-shop-owners-sell-online).`,
      },
      { type: "h2", text: "3. Digital marketing" },
      {
        type: "p",
        text: `Two months is enough to learn the channels a local business actually uses — Google Business Profile, Instagram and Facebook, Meta Ads, Canva and WhatsApp — and to run your first campaigns. ${c("Digital Marketing Basics", "Digital Marketing — Basics")} takes ${d("Digital Marketing Basics")}.`,
      },
      { type: "h2", text: "4. Web design" },
      {
        type: "p",
        text: `Still one of the clearest freelance and junior-developer paths. ${c("Web Design Basic", "Web Design — Basic")} (${d("Web Design Basic")}) gets you from zero to a published responsive site; ${c("Web Design Advanced", "Web Design — Advanced")} (${d("Web Design Advanced")}) adds modern JavaScript, a framework, WordPress and a real client project.`,
      },
      { type: "h2", text: "5. Data skills" },
      {
        type: "p",
        text: `You do not need a data-science degree to be useful with data. Advanced Excel, SQL and Python basics — all modules of ${c("ADCA")} (${d("ADCA")}) — are what offices, support teams and junior data roles ask for. See [ADCA course details](/guides/adca-course-details).`,
      },
      { type: "h2", text: "Do not skip the base" },
      {
        type: "p",
        text: `Every course above assumes you can type, manage files and use Word, Excel and email without thinking. If that is not yet true, ${c("CCA")} (${d("CCA")}) first is the fastest route, not a detour. If you want the qualification offices list, ${c("DCA")} (${d("DCA")}) is still the right answer — read [DCA course details](/guides/dca-course-details).`,
      },
      { type: "h2", text: "What we deliberately do not claim" },
      {
        type: "ul",
        items: [
          "No salary figures. They depend on the city, the employer and you, and most published numbers are not for North Bengal.",
          "No placement guarantee. We teach the skill at a computer until you can do it; the job search is yours and we will help with a portfolio and interview practice where the course includes it.",
          "No 'one course does everything'. Pick one skill, finish it, use it, then add the next.",
        ],
      },
      { type: "h2", text: "Practical details" },
      { type: "ul", items: COURSE_FACTS },
      {
        type: "faq",
        items: [
          { q: "Which computer course is best for the future?", a: "The skills businesses near you are adopting now: using AI assistants, selling online, digital marketing, web design and data basics. At CODE these are AI Prompt Engineering, Ecommerce Expert, Digital Marketing — Basics, Web Design and ADCA. Office fluency (CCA, DCA) remains the base." },
          { q: "Which computer course has the most job scope?", a: "For entry-level office roles, DCA is still the most-asked-for qualification. For growth areas, ecommerce operations, digital marketing and web design have the most openings with local businesses and agencies. No course guarantees a job." },
          { q: "Is an AI course worth it without coding knowledge?", a: "Yes. AI Prompt Engineering at CODE is built for students, teachers, office staff and business owners; it is about prompts, verification and workflows, not programming." },
          { q: "Which short computer course is best for a business owner?", a: "Digital Marketing — Basics (two months) if you need customers; Ecommerce Expert — Industry Level if you want to sell online; AI Prompt Engineering to handle writing and paperwork faster." },
          { q: "Can I do these courses from Siliguri?", a: "Yes. CODE is in Bagdogra, about 10 km from Siliguri Junction and 5 km from Matigara, with batches Monday to Saturday from 11 AM to 9 PM." },
        ],
      },
    ],
  },
];

export function guideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** Guides that mention a catalogue course, for the "Helpful guides" block on course pages. */
export function guidesForCourse(courseName: string): Guide[] {
  return GUIDES.filter((g) => g.courses.includes(courseName));
}

// ---------------------------------------------------------------------------
// Glossary — one-sentence definitions an answer engine can lift whole.

export type GlossaryTerm = {
  term: string;
  /** Alternative spellings or expansions. */
  aka?: string[];
  definition: string;
  /** Catalogue course name the term is taught in, if any. */
  course?: string;
  /** Slug of the guide that explains the term in depth, if any. */
  guide?: string;
};

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "CCA",
    aka: ["Certificate in Computer Application"],
    definition:
      "A beginner certificate course in computer fundamentals, typing, MS Word, Excel, PowerPoint, email and safe internet use; at CODE it takes three months and is the usual first course for someone starting from zero.",
    course: "CCA",
    guide: "basic-computer-course-for-beginners",
  },
  {
    term: "DCA",
    aka: ["Diploma in Computer Application"],
    definition:
      "A six-month diploma in office automation, computerised accounting basics, internet and cloud tools and an introduction to programming; the qualification most often asked for in office, clerical and data-entry roles.",
    course: "DCA",
    guide: "dca-course-details",
  },
  {
    term: "ADCA",
    aka: ["Advanced Diploma in Computer Application"],
    definition:
      "A twelve-month advanced diploma that includes everything in DCA plus programming fundamentals (C or Python), databases and SQL, HTML and CSS, graphics and multimedia, and operating-system, networking and hardware basics, ending in a project and viva.",
    course: "ADCA",
    guide: "adca-course-details",
  },
  {
    term: "MS Office",
    aka: ["Microsoft Office", "Word, Excel, PowerPoint"],
    definition:
      "Microsoft's set of office programs — Word for documents, Excel for spreadsheets and simple accounts, PowerPoint for presentations and Access for basic databases — taught in CCA at an everyday level and in DCA and ADCA at an advanced level.",
    course: "CCA",
  },
  {
    term: "Office automation",
    definition:
      "Using software such as Word, Excel, PowerPoint and email to do routine office work — letters, reports, data tables, presentations and records — faster and with fewer errors; a core module of DCA and ADCA.",
    course: "DCA",
  },
  {
    term: "Computerised accounting",
    definition:
      "Keeping ledgers, invoices and reports in accounting software instead of on paper; DCA and ADCA cover the fundamentals so a student can maintain basic accounts on a computer.",
    course: "DCA",
  },
  {
    term: "Programming logic",
    definition:
      "The way of thinking a program is built from — sequences, conditions, loops and variables — taught as an introduction in DCA and developed into C or Python fundamentals in ADCA.",
    course: "ADCA",
  },
  {
    term: "SQL",
    aka: ["Structured Query Language", "database basics"],
    definition:
      "The language used to store, search and update data in a database; ADCA covers database management and SQL basics so students can build and query small databases.",
    course: "ADCA",
  },
  {
    term: "HTML and CSS",
    aka: ["HTML", "CSS"],
    definition:
      "HTML is the language that gives a web page its structure and content; CSS controls its layout, colour and typography. Both are taught from the first tag in Web Design — Basic, and HTML/CSS basics also appear in ADCA.",
    course: "Web Design Basic",
  },
  {
    term: "JavaScript",
    definition:
      "The programming language that makes web pages interactive; introduced in Web Design — Basic and taken further, with the DOM and a front-end framework, in Web Design — Advanced.",
    course: "Web Design Advanced",
  },
  {
    term: "Responsive design",
    definition:
      "Building a web page so it rearranges itself to look right on a phone, a tablet and a desktop; a core skill in Web Design — Basic, where students publish a responsive multi-page site.",
    course: "Web Design Basic",
  },
  {
    term: "WordPress",
    aka: ["CMS"],
    definition:
      "A content-management system (CMS) used to build and edit websites without hand-coding every page, through themes, plugins and forms; covered in Web Design — Advanced.",
    course: "Web Design Advanced",
  },
  {
    term: "Shopify",
    definition:
      "A platform for running your own online store — products, payments, shipping and theme — without coding; the Ecommerce Expert courses set up a working Shopify store in class.",
    course: "Ecommerce Expert (Industry Level)",
  },
  {
    term: "Marketplace selling",
    aka: ["Amazon seller", "Flipkart seller", "Meesho"],
    definition:
      "Selling products through an existing marketplace such as Amazon, Flipkart or Meesho, which brings the customers while the seller manages listings, catalogue, orders and delivery; taught in Ecommerce Expert — Industry Level.",
    course: "Ecommerce Expert (Industry Level)",
  },
  {
    term: "Meta Ads",
    aka: ["Facebook ads", "Instagram ads"],
    definition:
      "Paid advertising on Facebook and Instagram run through Meta Ads Manager — campaigns, audiences and creatives; taught in Digital Marketing — Basics and, for online stores, in Ecommerce Expert — Job Ready.",
    course: "Digital Marketing Basics",
  },
  {
    term: "Google Business Profile",
    aka: ["GBP", "Google My Business"],
    definition:
      "The free Google listing that shows a business on Maps and in local search results with its category, hours, photos, phone and reviews; setting it up correctly is a module in Digital Marketing — Basics.",
    course: "Digital Marketing Basics",
  },
  {
    term: "Local SEO",
    definition:
      "Making a business appear when people nearby search for what it offers — through its Google Business Profile, reviews, consistent name, address and phone, and local content; covered at a basics level in Digital Marketing — Basics.",
    course: "Digital Marketing Basics",
  },
  {
    term: "Prompt engineering",
    aka: ["AI prompting"],
    definition:
      "Writing instructions for an AI assistant such as ChatGPT or Gemini — role, context, task and format — so the answer is reliable and useful; the subject of the AI Prompt Engineering course, which needs no coding.",
    course: "A.I. Prompt Engineering",
  },
  {
    term: "Monthly fee plan",
    aka: ["installments"],
    definition:
      "CODE's option to pay a course fee in one installment per month of the course instead of in full at enrolment, with a printed receipt for every payment; the full-payment fee is lower than the monthly total.",
    guide: "computer-course-fees-and-monthly-plans",
  },
  {
    term: "Certificate on completion",
    definition:
      "The certificate from CODE — Computer & Digital Excellence issued to a student who completes a course and its assessment or project, naming the programme completed.",
  },
  {
    term: "Tally",
    aka: ["Tally Prime", "accounting software"],
    definition:
      "Widely used Indian accounting software for vouchers, ledgers, GST invoices and reports; DCA and ADCA cover computerised accounting fundamentals that transfer to Tally and similar software — ask at the desk which package the current batch practises on.",
    course: "DCA",
    guide: "dca-course-details",
  },
  {
    term: "Data entry",
    aka: ["data entry operator"],
    definition:
      "Entering and checking records in spreadsheets, forms or software quickly and accurately — the core task of data-entry operator jobs, which test typing speed and MS Excel; taught across CCA and DCA.",
    course: "DCA",
    guide: "computer-courses-for-office-and-data-entry-jobs",
  },
  {
    term: "Computer operator",
    definition:
      "An office role responsible for everyday computer work — documents, spreadsheets, email, printing, records and basic troubleshooting; DCA covers the software side and ADCA adds hardware and networking basics.",
    course: "DCA",
    guide: "computer-courses-for-office-and-data-entry-jobs",
  },
  {
    term: "Typing speed",
    aka: ["WPM", "words per minute"],
    definition:
      "How many words you can type per minute with few errors; office and data-entry tests often ask for 30–40 WPM. Typing is practised from the first week of CCA and throughout DCA.",
    course: "CCA",
    guide: "basic-computer-course-for-beginners",
  },
  {
    term: "MS Excel",
    aka: ["Excel", "advanced Excel", "spreadsheet"],
    definition:
      "Microsoft's spreadsheet program for tables, formulas, sorting and filtering, charts and simple accounts; taught at a working level in CCA and at an advanced level (data tools, lookups, reports) in DCA and ADCA.",
    course: "DCA",
  },
  {
    term: "Python",
    definition:
      "A beginner-friendly, general-purpose programming language used for automation, data work and web back ends; ADCA teaches programming fundamentals in C or Python.",
    course: "ADCA",
    guide: "adca-course-details",
  },
  {
    term: "C programming",
    aka: ["C language"],
    definition:
      "A foundational programming language that teaches how programs really work — variables, memory, loops and functions; one of the two options for the programming-fundamentals module of ADCA.",
    course: "ADCA",
    guide: "adca-course-details",
  },
  {
    term: "Domain and hosting",
    aka: ["web hosting", "domain name"],
    definition:
      "A domain is a website's address (such as example.in); hosting is the server space where its files live. Web Design — Basic explains both and ends with students publishing their own site.",
    course: "Web Design Basic",
  },
  {
    term: "Front-end framework",
    aka: ["React", "component-based UI"],
    definition:
      "A JavaScript library or framework for building interactive web interfaces out of reusable components; covered in Web Design — Advanced after modern JavaScript and the DOM.",
    course: "Web Design Advanced",
  },
  {
    term: "UI/UX",
    aka: ["user interface", "user experience"],
    definition:
      "UI is how a screen looks and is laid out; UX is how easy and pleasant it is to use. Web Design — Advanced covers the basics and the design tools used for them.",
    course: "Web Design Advanced",
  },
  {
    term: "Canva",
    definition:
      "A browser-based design tool for social-media posts, posters, menus and simple videos without design training; used for content creation in Digital Marketing — Basics.",
    course: "Digital Marketing Basics",
  },
  {
    term: "ChatGPT and Gemini",
    aka: ["ChatGPT", "Gemini", "AI assistant"],
    definition:
      "Conversational AI assistants from OpenAI and Google that write, summarise, research and answer questions from a text prompt; the main tools used in the AI Prompt Engineering course, alongside AI image tools.",
    course: "A.I. Prompt Engineering",
    guide: "best-computer-courses-for-the-future",
  },
  {
    term: "CCC (NIELIT)",
    aka: ["Course on Computer Concepts", "NIELIT CCC"],
    definition:
      "A government certificate exam on computer basics run by NIELIT, sometimes named in government recruitment notices; CODE's CCA and DCA are institute courses that teach the same practical skills — typing, MS Office, internet — but are not the CCC certificate itself.",
    guide: "dca-course-details",
  },
  {
    term: "BCA",
    aka: ["Bachelor of Computer Applications"],
    definition:
      "A three-year university degree in computer applications; DCA and ADCA are shorter institute diplomas that many students take alongside a degree in another subject or before deciding on one.",
    guide: "adca-course-details",
  },
];

// Last significant edit to the glossary. Shown on the page and sent as lastmod.
export const GLOSSARY_UPDATED = "2026-10-14";

export function termId(term: string): string {
  return term.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/** "2026-10-14" → "14 October 2026". */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

// Durations as they stand in the catalogue today, used only if the database
// is unreachable at render time so a guide never prints an empty duration.
const DEFAULT_DURATIONS: Record<string, string> = {
  CCA: "3 months",
  DCA: "6 months",
  ADCA: "12 months",
  "Web Design Basic": "5 months",
  "Web Design Advanced": "5 months",
  "Ecommerce Expert (Industry Level)": "6 months",
  "Ecommerce Expert (Job Ready)": "8 months",
  "Digital Marketing Basics": "2 months",
  "A.I. Prompt Engineering": "2 months",
};

/** Build the context guides render with, from the live course list. */
export function guideContext(courses: ReadonlyArray<{ name: string; duration: string | null; content: { slug: string; displayName: string } }>): GuideContext {
  const byName = new Map(courses.map((c) => [c.name, c]));
  return {
    d: (name) => byName.get(name)?.duration ?? DEFAULT_DURATIONS[name] ?? "",
    c: (name, label) => {
      const course = byName.get(name);
      const slug = course?.content.slug ?? name.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      return `[${label ?? course?.content.displayName ?? name}](/courses/${slug})`;
    },
  };
}
