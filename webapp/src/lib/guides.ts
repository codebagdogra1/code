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
};

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "CCA",
    aka: ["Certificate in Computer Application"],
    definition:
      "A beginner certificate course in computer fundamentals, typing, MS Word, Excel, PowerPoint, email and safe internet use; at CODE it takes three months and is the usual first course for someone starting from zero.",
    course: "CCA",
  },
  {
    term: "DCA",
    aka: ["Diploma in Computer Application"],
    definition:
      "A six-month diploma in office automation, computerised accounting basics, internet and cloud tools and an introduction to programming; the qualification most often asked for in office, clerical and data-entry roles.",
    course: "DCA",
  },
  {
    term: "ADCA",
    aka: ["Advanced Diploma in Computer Application"],
    definition:
      "A twelve-month advanced diploma that includes everything in DCA plus programming fundamentals (C or Python), databases and SQL, HTML and CSS, graphics and multimedia, and operating-system, networking and hardware basics, ending in a project and viva.",
    course: "ADCA",
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
  },
  {
    term: "Certificate on completion",
    definition:
      "The certificate from CODE — Computer & Digital Excellence issued to a student who completes a course and its assessment or project, naming the programme completed.",
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
