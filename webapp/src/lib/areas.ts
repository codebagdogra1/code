// Area pages: one page per locality students actually travel from, written
// for the question "is there a computer course near <place>?". CODE has one
// centre, in Bagdogra. Every page says so plainly, then earns its place with
// what differs by area: distance, the road in, who usually joins from there
// and which batch time suits them. No page is a copy with the name swapped.
//
// Rules (same as guides.ts): no fees, no placement claims, no student counts,
// no competitor names, no invented bus numbers. Distances are straight-line
// from the centre (MAP_LAT/MAP_LNG), rounded, and marked as such on the page.
// Update `updated` whenever the words change — it is shown on the page, sent
// as WebPage.dateModified and used as the sitemap lastmod.

import type { Block, GuideContext } from "./guides";

export type Area = {
  slug: string;
  name: string;
  /** Other spellings people type, shown as "also written" and sent as keywords. */
  aka?: string[];
  /** Name in Bengali and Hindi, for the bilingual line. */
  nameBn: string;
  nameHi: string;
  /** Search title (≤ 60 chars where possible). */
  seoTitle: string;
  description: string;
  /** Straight-line distance from the centre, e.g. "about 5 km". */
  distance: string;
  /** Typical door-to-door travel, e.g. "15–20 minutes by bike or bus". */
  travel: string;
  /** The road most people take in, one sentence. */
  route: string;
  /** Catalogue course names most asked for from this area (3). */
  courses: string[];
  /** The one-paragraph answer shown first. */
  tldr: (ctx: GuideContext) => string;
  body: (ctx: GuideContext) => Block[];
  updated: string; // ISO date
};

const DIRECTIONS = "https://www.google.com/maps/dir/?api=1&destination=26.7005581,88.3334188";

/** Google Maps directions to the centre; origin left to the phone's location. */
export const DIRECTIONS_URL = DIRECTIONS;

const HOW_WE_TEACH = (ctx: GuideContext): Block[] => [
  { type: "h2", text: "What the classes are like" },
  {
    type: "ul",
    items: [
      "Every student works at their own computer for the whole class; a lesson is not finished until you have done it yourself.",
      "Batches are small, and classes are explained in Bengali, Hindi or English — whichever you are comfortable in.",
      "Classes run Monday to Saturday, 11 AM to 9 PM, so a batch can be fitted around school, college or a job.",
      `Every course has a full-payment fee and a monthly plan, a printed receipt for every payment, and a CODE certificate on completion — see ${ctx.c("DCA", "DCA")}, ${ctx.c("ADCA", "ADCA")} or ${ctx.c("CCA", "CCA")} for the syllabus.`,
    ],
  },
];

const VISIT: Block = {
  type: "callout",
  text: "The simplest way to decide is to visit. Drop in any day Monday to Saturday between 11 AM and 9 PM, see the lab, sit in a class for a few minutes and talk to the trainer — [directions and contact](/contact).",
};

export const AREAS: Area[] = [
  {
    slug: "upper-bagdogra",
    name: "Upper Bagdogra",
    aka: ["Uttar Bagdogra"],
    nameBn: "আপার বাগডোগরা",
    nameHi: "अपर बागडोगरा",
    seoTitle: "Computer Course in Upper Bagdogra — CCA, DCA, ADCA",
    description:
      "CODE is the computer training centre in Bagdogra town itself: CCA, DCA, ADCA, web design, ecommerce, digital marketing and AI classes a short walk or toto ride from anywhere in Upper Bagdogra. Monthly fee plans, Mon–Sat 11 AM–9 PM.",
    distance: "inside Bagdogra town",
    travel: "a short walk or 5 minutes by toto",
    route: "Lokenath Nagar Road, beside K1 Fitness Gym — ask anyone in Bagdogra for the gym.",
    courses: ["CCA", "DCA", "Web Design Basic"],
    tldr: ({ d }) =>
      `If you live in Upper Bagdogra you do not need to travel to Siliguri for a computer course. CODE — Computer & Digital Excellence is on Lokenath Nagar Road in Bagdogra, beside K1 Fitness Gym, and teaches CCA (${d("CCA")}), DCA (${d("DCA")}), ADCA (${d("ADCA")}), web design, ecommerce, digital marketing and AI prompt engineering in small batches, Monday to Saturday, 11 AM to 9 PM, with a monthly fee plan on every course.`,
    updated: "2026-10-14",
    body: (ctx) => [
      { type: "h2", text: "A computer centre you can walk to" },
      {
        type: "p",
        text: "Upper Bagdogra is where the centre is. Most students from the Upper Bagdogra side come on foot, by cycle or by toto, which matters more than it sounds: a course is six or twelve months of showing up, and a centre ten minutes away gets attended in a way a centre in Siliguri does not. Parents can also drop in unannounced, which we encourage.",
      },
      { type: "h2", text: "Who joins from Upper Bagdogra" },
      {
        type: "ul",
        items: [
          `School students after Class 10 or 12 who want a first, recognised qualification — usually ${ctx.c("CCA")} or ${ctx.c("DCA")}; the guide on [which course after Class 10 or 12](/guides/which-computer-course-after-class-10-or-12) explains the choice.`,
          `Home-makers and older learners starting from zero — ${ctx.c("CCA", "CCA")} begins with the keyboard, not with assumptions.`,
          `Shop and business owners in the Bagdogra bazar who want to sell on WhatsApp, Meesho or Amazon — ${ctx.c("Digital Marketing Basics", "digital marketing")} and ${ctx.c("Ecommerce Expert (Industry Level)", "ecommerce")}.`,
        ],
      },
      { type: "h2", text: "Which batch time suits Upper Bagdogra students" },
      {
        type: "p",
        text: "Because the commute is minutes, any slot between 11 AM and 9 PM works. School students usually take a late-afternoon batch after school; working adults take 7 PM. Tell us your free hours on WhatsApp and we will suggest a batch with a seat.",
      },
      ...HOW_WE_TEACH(ctx),
      VISIT,
      {
        type: "faq",
        items: [
          { q: "Is there a computer training centre in Upper Bagdogra?", a: "Yes. CODE — Computer & Digital Excellence is on Lokenath Nagar Road, Bagdogra, beside K1 Fitness Gym, and teaches CCA, DCA, ADCA, web design, ecommerce, digital marketing and AI courses in person." },
          { q: "Which computer course should a Class 10 or 12 student in Bagdogra start with?", a: "CCA if you are new to computers, DCA if you already use one and want an office-ready diploma. Both are taught at CODE in Bagdogra, and a trainer will help you choose at the desk." },
          { q: "Can I pay the fee monthly?", a: "Yes. Every course has a full-payment fee and a monthly plan with one installment per month of the course, and a printed receipt for every payment. The current fee is quoted at the desk or on WhatsApp." },
          { q: "Can I visit the centre before joining?", a: "Yes, any day Monday to Saturday between 11 AM and 9 PM. No appointment is needed." },
        ],
      },
    ],
  },
  {
    slug: "bihar-more",
    name: "Bihar More",
    aka: ["Bihar Mor", "Bihar Morh"],
    nameBn: "বিহার মোড়",
    nameHi: "बिहार मोड़",
    seoTitle: "Computer Course near Bihar More, Bagdogra — CCA, DCA, ADCA",
    description:
      "Looking for a computer class near Bihar More, Bagdogra? CODE is a few minutes away on Lokenath Nagar Road: CCA, DCA, ADCA, web design, ecommerce and digital marketing with monthly fee plans, Mon–Sat 11 AM–9 PM.",
    distance: "a few minutes away, inside Bagdogra",
    travel: "5 minutes by toto or bike",
    route: "From the Bihar More junction head into Bagdogra town towards Lokenath Nagar Road; the centre is beside K1 Fitness Gym.",
    courses: ["Digital Marketing Basics", "Ecommerce Expert (Industry Level)", "DCA"],
    tldr: ({ d }) =>
      `Bihar More is a few minutes from CODE — Computer & Digital Excellence, the computer training centre on Lokenath Nagar Road in Bagdogra. Students from the Bihar More side join CCA (${d("CCA")}), DCA (${d("DCA")}) and ADCA (${d("ADCA")}), and the shop and business owners around the junction come for the digital marketing and ecommerce courses. Classes run Monday to Saturday, 11 AM to 9 PM, with a monthly fee plan.`,
    updated: "2026-10-14",
    body: (ctx) => [
      { type: "h2", text: "How close is CODE to Bihar More?" },
      {
        type: "p",
        text: "Close enough that the commute is not a factor. Bihar More is the junction on the Bagdogra side of the road towards Naxalbari and Bihar, and the centre is inside Bagdogra town, beside K1 Fitness Gym on Lokenath Nagar Road. A toto or a bike gets you here in about five minutes; students also walk it.",
      },
      { type: "h2", text: "Courses that Bihar More students ask for" },
      {
        type: "ul",
        items: [
          `Shop and business owners around the junction: ${ctx.c("Digital Marketing Basics", "digital marketing")} for WhatsApp, Google Business Profile and Meta ads, and ${ctx.c("Ecommerce Expert (Industry Level)", "ecommerce")} to list on Amazon, Flipkart and Meesho — the [guide for shop owners](/guides/computer-courses-for-shop-owners-sell-online) explains which to take first.`,
          `Students and job seekers: ${ctx.c("DCA")} for office, data-entry and computer-operator posts, ${ctx.c("ADCA")} for a technical base.`,
          `Complete beginners: ${ctx.c("CCA")}, which starts from the keyboard and mouse.`,
        ],
      },
      { type: "h2", text: "Batch times for people who run a shop" },
      {
        type: "p",
        text: "Business owners usually cannot leave the counter at peak hours, so they take a late-morning batch after opening or a 7 PM batch. Because the centre is minutes away, a one-hour class fits between customers. Tell us your shop hours on WhatsApp and we will find a slot.",
      },
      ...HOW_WE_TEACH(ctx),
      VISIT,
      {
        type: "faq",
        items: [
          { q: "Is there a computer centre near Bihar More, Bagdogra?", a: "Yes. CODE — Computer & Digital Excellence is a few minutes from Bihar More, on Lokenath Nagar Road beside K1 Fitness Gym in Bagdogra." },
          { q: "Which course should a shop owner near Bihar More take?", a: "Start with Digital Marketing Basics if you want more customers for an existing shop; take the ecommerce course if you want to sell on Amazon, Flipkart or Meesho. Both are taught in person at CODE in Bagdogra." },
          { q: "Do I need my own laptop?", a: "No. Every student works at a computer in the lab during class. A laptop at home helps for practice but is not required." },
          { q: "What are the class timings?", a: "Monday to Saturday, 11 AM to 9 PM; Sunday closed. Batches are scheduled within those hours around your availability." },
        ],
      },
    ],
  },
  {
    slug: "bhujiapani",
    name: "Bhujiapani",
    aka: ["Bhujia Pani", "Bhujia Bani", "Airport More"],
    nameBn: "ভুজিয়াপানি",
    nameHi: "भुजियापानी",
    seoTitle: "Computer Course near Bhujiapani / Airport More, Bagdogra",
    description:
      "Computer classes near Bhujiapani and Airport More, Bagdogra: CODE is about 2 km away on Lokenath Nagar Road. CCA, DCA, ADCA, web design, ecommerce, digital marketing and AI, evening batches, monthly fee plans.",
    distance: "about 2 km",
    travel: "5–10 minutes by bike, toto or bus",
    route: "From Airport More take the road into Bagdogra town; the centre is on Lokenath Nagar Road beside K1 Fitness Gym, about 2 km from the airport gate.",
    courses: ["CCA", "DCA", "A.I. Prompt Engineering"],
    tldr: ({ d }) =>
      `Bhujiapani and Airport More are about 2 km from CODE — Computer & Digital Excellence, the computer training centre on Lokenath Nagar Road in Bagdogra. It is a five-to-ten-minute ride, and people working shifts around the airport take the evening batches. Courses include CCA (${d("CCA")}), DCA (${d("DCA")}), ADCA (${d("ADCA")}), web design, ecommerce, digital marketing and AI prompt engineering, Monday to Saturday, 11 AM to 9 PM, with a monthly fee plan.`,
    updated: "2026-10-14",
    body: (ctx) => [
      { type: "h2", text: "Getting to CODE from Bhujiapani" },
      {
        type: "p",
        text: "Bhujiapani sits by Airport More on the Upper Bagdogra side, and the centre is about 2 km away in Bagdogra town. Buses and shared autos on the airport road drop you in Bagdogra; from there Lokenath Nagar Road and K1 Fitness Gym are a short walk. By bike or toto it is under ten minutes door to door.",
      },
      { type: "h2", text: "Who joins from the airport side" },
      {
        type: "ul",
        items: [
          `People working around the airport — ground handling, hotels, taxis, cargo — who need Excel, email and basic office skills for the next role: ${ctx.c("CCA")} or ${ctx.c("DCA")}.`,
          `Students from the Bhujiapani side after Class 10 or 12 — usually ${ctx.c("DCA")}; see [which course after Class 10 or 12](/guides/which-computer-course-after-class-10-or-12).`,
          `Anyone curious about AI tools for work or study — ${ctx.c("A.I. Prompt Engineering", "AI prompt engineering")} is a short course and needs no coding.`,
        ],
      },
      { type: "h2", text: "Batches for shift workers" },
      {
        type: "p",
        text: "Shift timings change, so we do not insist on one fixed hour for the whole course. Tell us your roster and we will place you in a morning or evening batch and move you if the shift changes. Classes are explained in Bengali, Hindi or English.",
      },
      ...HOW_WE_TEACH(ctx),
      VISIT,
      {
        type: "faq",
        items: [
          { q: "Is there a computer course near Bhujiapani or Airport More?", a: "Yes. CODE — Computer & Digital Excellence is about 2 km from Airport More, on Lokenath Nagar Road beside K1 Fitness Gym in Bagdogra, and teaches CCA, DCA, ADCA, web design, ecommerce, digital marketing and AI courses." },
          { q: "How far is CODE from Bagdogra Airport?", a: "About 2 km in a straight line — a five-to-ten-minute ride by bike, toto or bus." },
          { q: "Can I change my batch if my shift changes?", a: "Yes. Tell the desk or WhatsApp us and we will move you to a batch that fits the new roster, subject to seats." },
          { q: "Can I pay the fee monthly?", a: "Yes. Every course has a full-payment fee and a monthly plan with one installment per month of the course, and a printed receipt for every payment." },
        ],
      },
    ],
  },
  {
    slug: "kestopur",
    name: "Kestopur",
    aka: ["Kestopur, Matigara"],
    nameBn: "কেষ্টপুর",
    nameHi: "केष्टपुर",
    seoTitle: "Computer Course near Kestopur (Bagdogra–Siliguri Road)",
    description:
      "Computer training near Kestopur on the Bagdogra–Siliguri road: CODE in Bagdogra is a short ride away with CCA, DCA, ADCA, web design, ecommerce, digital marketing and AI classes, monthly fee plans, Mon–Sat 11 AM–9 PM.",
    distance: "a short ride along the Siliguri road",
    travel: "10–15 minutes by bike or bus",
    route: "Take the Bagdogra–Siliguri road towards Bagdogra; in town turn to Lokenath Nagar Road — the centre is beside K1 Fitness Gym.",
    courses: ["DCA", "ADCA", "Web Design Basic"],
    tldr: ({ d }) =>
      `Kestopur, on the Bagdogra–Siliguri road on the Matigara side, is a ten-to-fifteen-minute ride from CODE — Computer & Digital Excellence in Bagdogra. Students from Kestopur who would otherwise travel into Siliguri find Bagdogra the shorter trip. CODE teaches CCA (${d("CCA")}), DCA (${d("DCA")}), ADCA (${d("ADCA")}), web design, ecommerce, digital marketing and AI prompt engineering in small batches, Monday to Saturday, 11 AM to 9 PM, with a monthly fee plan.`,
    updated: "2026-10-14",
    body: (ctx) => [
      { type: "h2", text: "Bagdogra or Siliguri — which is the shorter trip from Kestopur?" },
      {
        type: "p",
        text: "Kestopur is between Bagdogra and Matigara, so the centre in Bagdogra is usually the shorter and less congested ride than an institute in Siliguri town. Buses and shared autos run along the Bagdogra–Siliguri road all day; get down in Bagdogra and walk to Lokenath Nagar Road, or ride a bike straight to K1 Fitness Gym.",
      },
      { type: "h2", text: "Courses Kestopur students usually choose" },
      {
        type: "ul",
        items: [
          `${ctx.c("DCA")} — the diploma most often asked for in office, clerical and data-entry job notices; the [DCA course guide](/guides/dca-course-details) has the syllabus.`,
          `${ctx.c("ADCA")} — twelve months with programming, databases and web basics for a technical path; compare in [DCA vs ADCA](/guides/dca-vs-adca).`,
          `${ctx.c("Web Design Basic", "Web Design")} — for students who want to build real pages, not only use software.`,
        ],
      },
      { type: "h2", text: "Fitting a course around college" },
      {
        type: "p",
        text: "Many Kestopur students are in a college on the Siliguri side. A late-afternoon or 6 PM batch on the way home works well: the centre is on the road you already travel. Tell us your college hours and we will suggest a batch.",
      },
      ...HOW_WE_TEACH(ctx),
      VISIT,
      {
        type: "faq",
        items: [
          { q: "Is there a computer institute near Kestopur, Matigara?", a: "CODE — Computer & Digital Excellence in Bagdogra is a ten-to-fifteen-minute ride from Kestopur along the Bagdogra–Siliguri road, on Lokenath Nagar Road beside K1 Fitness Gym." },
          { q: "Does CODE have a branch in Kestopur or Matigara?", a: "No. CODE has one centre, in Bagdogra. This page exists because many students travel from Kestopur and the Matigara side, and it explains the route and batch times." },
          { q: "Which is better for a job, DCA or ADCA?", a: "DCA matches the requirement listed for most office and data-entry roles and takes six months. ADCA adds programming, databases and web basics over twelve months and suits a technical path. Both are taught at CODE." },
          { q: "What are the class timings?", a: "Monday to Saturday, 11 AM to 9 PM; Sunday closed." },
        ],
      },
    ],
  },
  {
    slug: "gossaipur",
    name: "Gossaipur",
    aka: ["Gossainpur", "Gosaipur"],
    nameBn: "গোঁসাইপুর",
    nameHi: "गोसाईपुर",
    seoTitle: "Computer Course near Gossaipur (Gossainpur), Bagdogra",
    description:
      "Computer classes near Gossaipur (also written Gossainpur), Bagdogra: CODE is about 3 km away on Lokenath Nagar Road. CCA, DCA, ADCA, web design, ecommerce, digital marketing and AI in small batches with monthly fee plans, Mon–Sat 11 AM–9 PM.",
    distance: "about 3 km",
    travel: "10 minutes by bike or toto",
    route: "Ride into Bagdogra town and ask for K1 Fitness Gym on Lokenath Nagar Road; the centre is beside it.",
    courses: ["CCA", "DCA", "Digital Marketing Basics"],
    tldr: ({ d }) =>
      `Gossaipur — also written Gossainpur — is about 3 km from CODE — Computer & Digital Excellence, the computer training centre on Lokenath Nagar Road in Bagdogra — roughly ten minutes by bike or toto. CODE teaches CCA (${d("CCA")}), DCA (${d("DCA")}), ADCA (${d("ADCA")}), web design, ecommerce, digital marketing and AI prompt engineering in small, hands-on batches, Monday to Saturday, 11 AM to 9 PM, with a monthly fee plan on every course.`,
    updated: "2026-10-14",
    body: (ctx) => [
      { type: "h2", text: "Getting to CODE from Gossaipur" },
      {
        type: "p",
        text: "Gossaipur (Gossainpur on some signboards and forms) is on the Bagdogra side, about 3 km from the centre, with Putimari and the villages of the Gossaipur gram panchayat just beyond it. Totos and bikes make the trip in around ten minutes; buses on the main road drop you in Bagdogra, from where Lokenath Nagar Road is a short walk. Look for K1 Fitness Gym — the centre is beside it.",
      },
      { type: "h2", text: "What Gossaipur students come for" },
      {
        type: "ul",
        items: [
          `A first course after school — ${ctx.c("CCA")} for beginners, ${ctx.c("DCA")} for an office-ready diploma; the [beginner's guide](/guides/basic-computer-course-for-beginners) explains what CCA covers.`,
          `Office and data-entry skills for job applications — ${ctx.c("DCA")}, and the [guide to computer courses for office jobs](/guides/computer-courses-for-office-and-data-entry-jobs).`,
          `Small-business owners who want customers from Bagdogra and Siliguri to find them on Google and WhatsApp — ${ctx.c("Digital Marketing Basics", "digital marketing")}.`,
        ],
      },
      { type: "h2", text: "Batch times" },
      {
        type: "p",
        text: "With a ten-minute commute, students from Gossaipur take whichever slot fits: late afternoon after school, or 7 PM for working adults. Batches are small and seats are limited, so ask on WhatsApp before you come.",
      },
      ...HOW_WE_TEACH(ctx),
      VISIT,
      {
        type: "faq",
        items: [
          { q: "Is there a computer course near Gossaipur, Bagdogra?", a: "Yes. CODE — Computer & Digital Excellence is about 3 km from Gossaipur, on Lokenath Nagar Road beside K1 Fitness Gym in Bagdogra." },
          { q: "What is the best first computer course for a beginner from Gossaipur?", a: "CCA — the Certificate in Computer Application. It starts from the keyboard and mouse and covers Windows, Word, Excel, PowerPoint, email and the internet." },
          { q: "Are classes in Bengali?", a: "Classes are explained in Bengali, Hindi or English, whichever the batch is comfortable in." },
          { q: "Can I pay monthly?", a: "Yes. Every course has a monthly plan with one installment per month of the course, and a printed receipt for every payment." },
        ],
      },
    ],
  },
  {
    slug: "shibmandir",
    name: "Shibmandir",
    aka: ["Shivmandir", "Shiv Mandir", "NBU", "North Bengal University area"],
    nameBn: "শিবমন্দির",
    nameHi: "शिवमंदिर",
    seoTitle: "Computer Course near Shibmandir & NBU — ADCA, Web, AI",
    description:
      "Computer and coding classes near Shibmandir and North Bengal University: CODE in Bagdogra is about 5 km away with ADCA, web design, AI prompt engineering, DCA and CCA in small batches, monthly fee plans, Mon–Sat 11 AM–9 PM.",
    distance: "about 5 km",
    travel: "15–20 minutes by bike or bus",
    route: "Take the Bagdogra–Siliguri road west into Bagdogra town; in town turn to Lokenath Nagar Road — the centre is beside K1 Fitness Gym.",
    courses: ["ADCA", "Web Design Basic", "A.I. Prompt Engineering"],
    tldr: ({ d }) =>
      `Shibmandir and the North Bengal University campus are about 5 km from CODE — Computer & Digital Excellence in Bagdogra, fifteen to twenty minutes by bike or bus along the Bagdogra–Siliguri road. University students from Shibmandir mostly join ADCA (${d("ADCA")}) for programming, databases and web basics, Web Design, or the AI prompt engineering course; DCA (${d("DCA")}) and CCA (${d("CCA")}) are there for office skills. Batches run Monday to Saturday, 11 AM to 9 PM, with a monthly fee plan.`,
    updated: "2026-10-14",
    body: (ctx) => [
      { type: "h2", text: "From Shibmandir and NBU to CODE" },
      {
        type: "p",
        text: "Shibmandir is on the Siliguri side of Bagdogra, with the North Bengal University campus beside it. The centre is about 5 km west, in Bagdogra town. Bikes and buses along the Bagdogra–Siliguri road take fifteen to twenty minutes; get down in Bagdogra and walk to Lokenath Nagar Road, beside K1 Fitness Gym.",
      },
      { type: "h2", text: "Courses university students take alongside a degree" },
      {
        type: "ul",
        items: [
          `${ctx.c("ADCA")} — programming in C or Python, databases and SQL, HTML and CSS, over ${ctx.d("ADCA")}; the technical diploma that sits well beside a BA, BSc or BCom. Syllabus in the [ADCA course guide](/guides/adca-course-details).`,
          `${ctx.c("Web Design Basic", "Web Design")} and ${ctx.c("Web Design Advanced", "Web Design Advanced")} — build real sites with HTML, CSS, JavaScript and WordPress; a portfolio by the time you graduate.`,
          `${ctx.c("A.I. Prompt Engineering", "AI prompt engineering")} — using ChatGPT and Gemini properly for study, research and work; short, no coding required.`,
          `${ctx.c("DCA")} — for students whose target is a government or office post that lists DCA as the computer qualification.`,
        ],
      },
      { type: "h2", text: "Fitting a batch between lectures" },
      {
        type: "p",
        text: "Most Shibmandir students take a batch in the gap between lectures or a 5–6 PM batch on the way home to Siliguri; hostel students sometimes prefer a late-morning slot. Tell us your timetable on WhatsApp and we will place you. Semester exams are not a problem — tell the trainer and the batch waits for you.",
      },
      ...HOW_WE_TEACH(ctx),
      VISIT,
      {
        type: "faq",
        items: [
          { q: "Is there a computer or coding class near Shibmandir or North Bengal University?", a: "CODE — Computer & Digital Excellence in Bagdogra is about 5 km from Shibmandir and NBU — fifteen to twenty minutes by bike or bus — and teaches ADCA, web design, AI prompt engineering, DCA and CCA in person." },
          { q: "Which course is best for a university student who wants to learn programming?", a: "ADCA covers C or Python, databases and SQL, and HTML and CSS over twelve months. If you want to build websites specifically, take Web Design Basic and then Web Design Advanced." },
          { q: "Can I pause during semester exams?", a: "Tell the trainer before the exams; the batch is small enough to accommodate it and you catch up the missed classes afterwards." },
          { q: "Does CODE have a branch near NBU?", a: "No. CODE has one centre, on Lokenath Nagar Road in Bagdogra. Students travel from Shibmandir and the university; this page explains the route and batch times." },
        ],
      },
    ],
  },
  {
    slug: "medical",
    name: "Medical (Sushrutanagar)",
    aka: ["Medical More", "North Bengal Medical College", "NBMC", "Sushrutanagar", "Kadamtala"],
    nameBn: "মেডিক্যাল (সুশ্রুতনগর)",
    nameHi: "मेडिकल (सुश्रुतनगर)",
    seoTitle: "Computer Course near Medical, Sushrutanagar — DCA, CCA, Excel",
    description:
      "Computer classes near North Bengal Medical College (Medical More, Sushrutanagar): CODE in Bagdogra is about 6 km away with DCA, CCA, ADCA, web, ecommerce, digital marketing and AI courses, evening batches, monthly fee plans.",
    distance: "about 6 km",
    travel: "20 minutes by bike or bus",
    route: "Take the Bagdogra–Siliguri road west through Matigara into Bagdogra town; in town turn to Lokenath Nagar Road — the centre is beside K1 Fitness Gym.",
    courses: ["DCA", "CCA", "Digital Marketing Basics"],
    tldr: ({ d }) =>
      `The Medical area — North Bengal Medical College at Sushrutanagar and the neighbourhoods around Medical More — is about 6 km from CODE — Computer & Digital Excellence in Bagdogra, around twenty minutes by bike or bus. Families, staff and students from the Medical side join for DCA (${d("DCA")}), CCA (${d("CCA")}) and ADCA (${d("ADCA")}), and clinics and pharmacies nearby come for digital marketing. Batches run Monday to Saturday, 11 AM to 9 PM, with a monthly fee plan.`,
    updated: "2026-10-14",
    body: (ctx) => [
      { type: "h2", text: "Getting here from the Medical side" },
      {
        type: "p",
        text: "Sushrutanagar and Medical More sit on the Siliguri side of Matigara. The centre is about 6 km west in Bagdogra town, on the same Bagdogra–Siliguri road. Buses and shared autos run all day; a bike takes about twenty minutes. In Bagdogra, ask for K1 Fitness Gym on Lokenath Nagar Road — the centre is beside it.",
      },
      { type: "h2", text: "Who joins from Medical" },
      {
        type: "ul",
        items: [
          `Staff and family members working in or around the hospital who need Excel, Word, email and typing for records, reports and the next job — ${ctx.c("CCA")} or ${ctx.c("DCA")}; see the [guide to computer courses for office jobs](/guides/computer-courses-for-office-and-data-entry-jobs).`,
          `Students after Class 12 and graduates preparing for clerical and data-entry posts — ${ctx.c("DCA")}, the diploma most job notices name.`,
          `Clinics, diagnostic centres and pharmacies that want patients to find them on Google Maps and WhatsApp — ${ctx.c("Digital Marketing Basics", "digital marketing")}, which covers Google Business Profile.`,
        ],
      },
      { type: "h2", text: "Batches around hospital duty hours" },
      {
        type: "p",
        text: "Duty rosters change, so students from the Medical side usually take a 7 PM batch or a late-morning one after a night shift, and we move you between batches when the roster changes. Classes are explained in Bengali, Hindi or English.",
      },
      ...HOW_WE_TEACH(ctx),
      VISIT,
      {
        type: "faq",
        items: [
          { q: "Is there a computer training centre near North Bengal Medical College?", a: "CODE — Computer & Digital Excellence in Bagdogra is about 6 km from Medical More and Sushrutanagar, around twenty minutes by bike or bus, on Lokenath Nagar Road beside K1 Fitness Gym." },
          { q: "Which course teaches Excel and typing for hospital or office records?", a: "CCA covers Windows, Word, Excel, PowerPoint, email and typing from the start; DCA goes further into advanced Excel, accounting basics and internet tools. Both are taught at CODE." },
          { q: "Can I attend around a duty roster?", a: "Yes. Tell the desk your roster and we will place you in a morning or evening batch and move you when it changes, subject to seats." },
          { q: "What are the class timings?", a: "Monday to Saturday, 11 AM to 9 PM; Sunday closed." },
        ],
      },
    ],
  },
  {
    slug: "matigara",
    name: "Matigara",
    aka: ["Matigara Hat", "Bairatisal"],
    nameBn: "মাটিগাড়া",
    nameHi: "माटीगाड़ा",
    seoTitle: "Computer Course near Matigara — CCA, DCA, ADCA, Ecommerce",
    description:
      "Computer institute near Matigara: CODE in Bagdogra is about 5 km away, with CCA, DCA, ADCA, web design, ecommerce, digital marketing and AI courses in small batches, monthly fee plans, Mon–Sat 11 AM–9 PM.",
    distance: "about 5 km",
    travel: "15 minutes by bike or bus",
    route: "Take the Bagdogra–Siliguri road west from Matigara into Bagdogra town; in town turn to Lokenath Nagar Road — the centre is beside K1 Fitness Gym.",
    courses: ["DCA", "Ecommerce Expert (Industry Level)", "CCA"],
    tldr: ({ d }) =>
      `Matigara is about 5 km from CODE — Computer & Digital Excellence in Bagdogra, roughly fifteen minutes by bike or bus along the Bagdogra–Siliguri road. For students in Matigara the centre is as close as Siliguri town and easier to reach. CODE teaches CCA (${d("CCA")}), DCA (${d("DCA")}), ADCA (${d("ADCA")}), web design, ecommerce, digital marketing and AI prompt engineering in small batches, Monday to Saturday, 11 AM to 9 PM, with a monthly fee plan.`,
    updated: "2026-10-14",
    body: (ctx) => [
      { type: "h2", text: "Why Matigara students come to Bagdogra" },
      {
        type: "p",
        text: "Matigara sits between Bagdogra and Siliguri, so either direction is a similar ride. Students choose CODE for the small batches and the monthly fee plan, and because Bagdogra traffic is lighter than Siliguri's in the evening. The centre is about 5 km west on the main road, on Lokenath Nagar Road beside K1 Fitness Gym.",
      },
      { type: "h2", text: "Courses Matigara students choose" },
      {
        type: "ul",
        items: [
          `${ctx.c("DCA")} and ${ctx.c("ADCA")} — the diplomas job notices ask for; compare them in [DCA vs ADCA](/guides/dca-vs-adca).`,
          `${ctx.c("Ecommerce Expert (Industry Level)", "Ecommerce")} — Matigara's traders and the sellers around the weekly hat who want to list on Amazon, Flipkart and Meesho; the [guide for shop owners](/guides/computer-courses-for-shop-owners-sell-online) explains where to start.`,
          `${ctx.c("CCA")} — beginners and home-makers starting from zero.`,
        ],
      },
      { type: "h2", text: "Batch times" },
      {
        type: "p",
        text: "A fifteen-minute commute makes any slot workable. Students in Siliguri colleges take a 5–6 PM batch on the way home; shop owners take late morning or 7 PM. Ask on WhatsApp for a batch with a seat.",
      },
      ...HOW_WE_TEACH(ctx),
      VISIT,
      {
        type: "faq",
        items: [
          { q: "Is there a computer institute near Matigara?", a: "CODE — Computer & Digital Excellence in Bagdogra is about 5 km from Matigara, around fifteen minutes by bike or bus, on Lokenath Nagar Road beside K1 Fitness Gym." },
          { q: "Does CODE have a Matigara branch?", a: "No. CODE has one centre, in Bagdogra. Many students travel from Matigara, which is why this page explains the route and batch times." },
          { q: "Which course should a trader in Matigara take to sell online?", a: "Start with the ecommerce course if you want to list products on Amazon, Flipkart or Meesho; take Digital Marketing Basics if you want more customers for a physical shop through Google and WhatsApp." },
          { q: "Can I pay the fee monthly?", a: "Yes. Every course has a full-payment fee and a monthly plan with one installment per month of the course, and a printed receipt for every payment." },
        ],
      },
    ],
  },
  {
    slug: "siliguri",
    name: "Siliguri",
    aka: ["Siliguri Junction", "Pradhan Nagar", "Sevoke Road", "Hakimpara"],
    nameBn: "শিলিগুড়ি",
    nameHi: "सिलीगुड़ी",
    seoTitle: "Computer Course near Siliguri — Small Batches in Bagdogra",
    description:
      "A computer training centre near Siliguri with small batches and monthly fee plans: CODE in Bagdogra is about 10 km from Siliguri Junction. CCA, DCA, ADCA, web design, ecommerce, digital marketing and AI, Mon–Sat 11 AM–9 PM.",
    distance: "about 10 km from Siliguri Junction",
    travel: "30–40 minutes by bus or bike",
    route: "Take the Bagdogra–Siliguri road west through Matigara into Bagdogra town; in town turn to Lokenath Nagar Road — the centre is beside K1 Fitness Gym.",
    courses: ["ADCA", "Web Design Advanced", "Ecommerce Expert (Job Ready)"],
    tldr: ({ d }) =>
      `CODE — Computer & Digital Excellence is in Bagdogra, about 10 km from Siliguri Junction and thirty to forty minutes by bus or bike along the Bagdogra–Siliguri road. Students from Siliguri's western side — Pradhan Nagar, Matigara, Shibmandir, Medical — come for the small batches, the monthly fee plan and courses Siliguri institutes rarely teach hands-on: ecommerce, digital marketing and AI prompt engineering, alongside CCA (${d("CCA")}), DCA (${d("DCA")}), ADCA (${d("ADCA")}) and web design. Batches run Monday to Saturday, 11 AM to 9 PM.`,
    updated: "2026-10-14",
    body: (ctx) => [
      { type: "h2", text: "Is Bagdogra too far from Siliguri for a course?" },
      {
        type: "p",
        text: "For most of west Siliguri, no. Siliguri Junction is about 10 km from the centre, and from Pradhan Nagar, Matigara, Shibmandir or Medical the ride is shorter still. Buses and shared autos run along the Bagdogra–Siliguri road through the day, and students who ride a bike do it in half an hour. If you live on Sevoke Road or the eastern side, be honest with yourself about a daily commute: visit once, time the trip, then decide.",
      },
      { type: "h2", text: "Why Siliguri students choose CODE" },
      {
        type: "ul",
        items: [
          "Small batches, each student at a computer for the whole class, and a trainer who knows your name — the [guide on choosing an institute](/guides/how-to-choose-a-computer-institute-in-bagdogra) lists what to check anywhere.",
          `Courses with a practical bent that are harder to find taught hands-on: ${ctx.c("Ecommerce Expert (Job Ready)", "Ecommerce (Job Ready)")}, ${ctx.c("Digital Marketing Basics", "digital marketing")} and ${ctx.c("A.I. Prompt Engineering", "AI prompt engineering")}.`,
          `The standard diplomas as well — ${ctx.c("DCA")} and ${ctx.c("ADCA")} — with a monthly fee plan and a printed receipt for every payment.`,
        ],
      },
      { type: "h2", text: "Batch times for commuters" },
      {
        type: "p",
        text: "Siliguri students usually take a batch that avoids two trips: college students come straight after classes for a 4–5 PM slot; working adults take 7 PM and ride home after. If you can only come three days a week, say so — the batch schedule can be set that way for most courses.",
      },
      ...HOW_WE_TEACH(ctx),
      VISIT,
      {
        type: "faq",
        items: [
          { q: "How far is CODE from Siliguri?", a: "About 10 km from Siliguri Junction in a straight line, thirty to forty minutes by bus or bike along the Bagdogra–Siliguri road. From Pradhan Nagar, Matigara, Shibmandir or Medical it is closer." },
          { q: "Does CODE have a branch in Siliguri?", a: "No. CODE has one centre, on Lokenath Nagar Road in Bagdogra. This page is for students who travel from Siliguri and explains the route and batch times." },
          { q: "Which courses are worth the trip from Siliguri?", a: "The practical courses taught hands-on in small batches: ecommerce, digital marketing, AI prompt engineering and web design; and DCA or ADCA if you want the diploma with a monthly fee plan." },
          { q: "Can I attend three days a week?", a: "For most courses, yes — tell the desk and the batch schedule is set accordingly. The course then takes correspondingly longer." },
        ],
      },
    ],
  },
  {
    slug: "naxalbari",
    name: "Naxalbari",
    aka: ["Naksalbari", "Naxalbari Bazar"],
    nameBn: "নকশালবাড়ি",
    nameHi: "नक्सलबाड़ी",
    seoTitle: "Computer Course near Naxalbari — DCA, CCA, ADCA in Bagdogra",
    description:
      "Computer institute near Naxalbari: CODE in Bagdogra is about 12 km away on the Asian Highway, with DCA, CCA, ADCA, web design, ecommerce, digital marketing and AI courses, morning batches for commuters, monthly fee plans.",
    distance: "about 12 km",
    travel: "25–30 minutes by bus or bike",
    route: "Take the Naxalbari–Bagdogra road (Asian Highway 2) east to Bihar More, then into Bagdogra town; the centre is on Lokenath Nagar Road beside K1 Fitness Gym.",
    courses: ["DCA", "CCA", "ADCA"],
    tldr: ({ d }) =>
      `Naxalbari is about 12 km from CODE — Computer & Digital Excellence in Bagdogra, twenty-five to thirty minutes by bus or bike along the Asian Highway. Students from Naxalbari, Hatighisa and the tea-garden side come mainly for DCA (${d("DCA")}) — the computer qualification most government and office job forms ask for — as well as CCA (${d("CCA")}) and ADCA (${d("ADCA")}). Batches run Monday to Saturday, 11 AM to 9 PM, with a monthly fee plan and a printed receipt for every payment.`,
    updated: "2026-10-14",
    body: (ctx) => [
      { type: "h2", text: "Getting to CODE from Naxalbari" },
      {
        type: "p",
        text: "The Naxalbari–Bagdogra road (Asian Highway 2) runs straight to Bihar More in Bagdogra; buses and shared vehicles ply it through the day. From Bihar More the centre is a few minutes into town, on Lokenath Nagar Road beside K1 Fitness Gym. By bike the whole trip is twenty-five to thirty minutes.",
      },
      { type: "h2", text: "Courses Naxalbari students ask for" },
      {
        type: "ul",
        items: [
          `${ctx.c("DCA")} — six months, the diploma named in most clerical, data-entry and computer-operator notices; the [DCA course guide](/guides/dca-course-details) answers the recognition and eligibility questions.`,
          `${ctx.c("CCA")} — for complete beginners, including home-makers and tea-garden families whose first computer is the one in the lab.`,
          `${ctx.c("ADCA")} — for students who want programming, databases and web basics in one twelve-month programme.`,
        ],
      },
      { type: "h2", text: "Making a 12 km commute worth it" },
      {
        type: "p",
        text: "Students from Naxalbari usually take a late-morning batch and travel in daylight, or combine the trip with college or work in Bagdogra. A three-day-a-week schedule is possible for most courses; tell the desk and the batch is set that way. Classes are explained in Bengali, Hindi or English.",
      },
      ...HOW_WE_TEACH(ctx),
      VISIT,
      {
        type: "faq",
        items: [
          { q: "Is there a computer institute near Naxalbari?", a: "CODE — Computer & Digital Excellence in Bagdogra is about 12 km from Naxalbari, twenty-five to thirty minutes by bus or bike along the Asian Highway, on Lokenath Nagar Road beside K1 Fitness Gym." },
          { q: "Does CODE have a branch in Naxalbari?", a: "No. CODE has one centre, in Bagdogra. Students travel from Naxalbari, which is why this page explains the route and batch times." },
          { q: "Is DCA enough for government job forms that ask for a computer course?", a: "Most forms ask for a certificate or diploma in computer applications of a stated duration; DCA from CODE is a six-month diploma with a certificate on completion. Check the exact wording of the notice you are applying under." },
          { q: "Can I come three days a week?", a: "For most courses, yes. Tell the desk and the batch schedule is set accordingly; the course then takes correspondingly longer." },
        ],
      },
    ],
  },
  {
    slug: "station-more",
    name: "Station More",
    aka: ["Bagdogra Station More", "Bagdogra railway station", "Station Para"],
    nameBn: "স্টেশন মোড়",
    nameHi: "स्टेशन मोड़",
    seoTitle: "Computer Course near Station More, Bagdogra — CCA, DCA",
    description:
      "Computer classes near Station More and Bagdogra railway station: CODE is about 1.5 km away on Lokenath Nagar Road. CCA, DCA, ADCA, web design, ecommerce, digital marketing and AI in small batches, monthly fee plans, Mon–Sat 11 AM–9 PM.",
    distance: "about 1.5 km",
    travel: "5 minutes by toto or bike, 15 on foot",
    route: "From Station More head into Bagdogra town; the centre is on Lokenath Nagar Road beside K1 Fitness Gym.",
    courses: ["CCA", "DCA", "Web Design Basic"],
    tldr: ({ d }) =>
      `Station More — the junction at Bagdogra railway station — is about 1.5 km from CODE — Computer & Digital Excellence on Lokenath Nagar Road, a five-minute toto ride or a fifteen-minute walk. It is the closest computer training centre to the station side of Bagdogra, teaching CCA (${d("CCA")}), DCA (${d("DCA")}), ADCA (${d("ADCA")}), web design, ecommerce, digital marketing and AI prompt engineering, Monday to Saturday, 11 AM to 9 PM, with a monthly fee plan.`,
    updated: "2026-10-14",
    body: (ctx) => [
      { type: "h2", text: "From Station More to CODE" },
      {
        type: "p",
        text: "Station More is the junction by Bagdogra railway station on the main road. The centre is about 1.5 km into town: five minutes by toto or bike, or a fifteen-minute walk. Students who come in by local train get down at Bagdogra and are at the centre before a bus from Siliguri would have cleared Matigara.",
      },
      { type: "h2", text: "Who joins from the station side" },
      {
        type: "ul",
        items: [
          `School students from the Station Para lanes after Class 10 or 12 — usually ${ctx.c("CCA")} first, then ${ctx.c("DCA")}; the guide on [which course after Class 10 or 12](/guides/which-computer-course-after-class-10-or-12) explains the order.`,
          `Students arriving by train from stations down the line who want a centre they can walk to from the platform.`,
          `Traders and transport operators around the station who want to be found on Google Maps and WhatsApp — ${ctx.c("Digital Marketing Basics", "digital marketing")}.`,
          `Anyone who wants to build a website rather than only use software — ${ctx.c("Web Design Basic", "Web Design")}.`,
        ],
      },
      { type: "h2", text: "Batch times" },
      {
        type: "p",
        text: "With the centre minutes away, students from Station More take whichever slot fits: a late-afternoon batch after school, or 7 PM after the shop shuts. Students timing a batch to a train should say so on WhatsApp; the start time can usually be matched.",
      },
      ...HOW_WE_TEACH(ctx),
      VISIT,
      {
        type: "faq",
        items: [
          { q: "Is there a computer centre near Bagdogra railway station?", a: "Yes. CODE — Computer & Digital Excellence is about 1.5 km from Station More, on Lokenath Nagar Road beside K1 Fitness Gym — a five-minute toto ride or a fifteen-minute walk from the station." },
          { q: "Can I walk to CODE from the station?", a: "Yes. It is about 1.5 km in a straight line, roughly fifteen minutes on foot through Bagdogra town. Ask for K1 Fitness Gym on Lokenath Nagar Road." },
          { q: "Which course should a beginner from Station More start with?", a: "CCA — the Certificate in Computer Application. It starts from the keyboard and mouse and covers Windows, Word, Excel, PowerPoint, email and the internet. DCA follows for an office-ready diploma." },
          { q: "Can I pay the fee monthly?", a: "Yes. Every course has a full-payment fee and a monthly plan with one installment per month of the course, and a printed receipt for every payment." },
        ],
      },
    ],
  },
  {
    slug: "putimari",
    name: "Putimari",
    aka: ["Putimari, Gossaipur", "Putimari Bagdogra"],
    nameBn: "পুটিমারি",
    nameHi: "पुटिमारी",
    seoTitle: "Computer Course near Putimari, Bagdogra — CCA, DCA, ADCA",
    description:
      "Computer classes near Putimari (Gossaipur gram panchayat, Bagdogra): CODE is about 3 km away on Lokenath Nagar Road. CCA, DCA, ADCA, web design, ecommerce, digital marketing and AI in small batches, Bengali and Hindi explanation, monthly fee plans.",
    distance: "about 3 km",
    travel: "10 minutes by bike or toto",
    route: "Ride towards Upper Bagdogra and into Bagdogra town; ask for K1 Fitness Gym on Lokenath Nagar Road — the centre is beside it.",
    courses: ["CCA", "DCA", "ADCA"],
    tldr: ({ d }) =>
      `Putimari, a village in the Gossaipur gram panchayat on the Bagdogra side, is about 3 km from CODE — Computer & Digital Excellence, the computer training centre on Lokenath Nagar Road in Bagdogra — roughly ten minutes by bike or toto. Students from Putimari join CCA (${d("CCA")}) as a first course, DCA (${d("DCA")}) for an office diploma and ADCA (${d("ADCA")}) for a technical one. Classes are explained in Bengali, Hindi or English, Monday to Saturday, 11 AM to 9 PM, with a monthly fee plan.`,
    updated: "2026-10-14",
    body: (ctx) => [
      { type: "h2", text: "Getting to CODE from Putimari" },
      {
        type: "p",
        text: "Putimari lies about 3 km from the centre, on the Gossaipur side of Upper Bagdogra. Bikes and totos cover it in around ten minutes; the road into Bagdogra town brings you to Lokenath Nagar Road, where the centre sits beside K1 Fitness Gym. There is no need to go to Siliguri for a computer course — Bagdogra is nearer and the batches are smaller.",
      },
      { type: "h2", text: "A first computer course for Putimari students" },
      {
        type: "ul",
        items: [
          `Most students from Putimari have not sat a formal computer class before, so ${ctx.c("CCA")} is the usual start: Windows, Word, Excel, PowerPoint, email and typing, from the first key press. The [beginner's guide](/guides/basic-computer-course-for-beginners) explains what it covers.`,
          `${ctx.c("DCA")} — the six-month diploma that clerical, data-entry and computer-operator job forms ask for; see the [DCA course guide](/guides/dca-course-details).`,
          `${ctx.c("ADCA")} — for students who want programming, databases and web basics in one programme after Class 12 or college.`,
        ],
      },
      { type: "h2", text: "Classes in Bengali and Hindi" },
      {
        type: "p",
        text: "Every class is explained in Bengali, Hindi or English, whichever the batch is comfortable in, and the trainer switches when a student asks. Parents are welcome to sit in on the first class. A late-afternoon batch suits school students from Putimari; working adults take 7 PM.",
      },
      ...HOW_WE_TEACH(ctx),
      VISIT,
      {
        type: "faq",
        items: [
          { q: "Is there a computer training centre near Putimari?", a: "CODE — Computer & Digital Excellence in Bagdogra is about 3 km from Putimari, around ten minutes by bike or toto, on Lokenath Nagar Road beside K1 Fitness Gym." },
          { q: "Are classes taught in Bengali?", a: "Yes. Classes are explained in Bengali, Hindi or English, whichever the batch is comfortable in." },
          { q: "Do I need to know anything about computers before joining CCA?", a: "No. CCA starts from the keyboard and mouse and assumes nothing. Every student works at their own computer in the lab during class." },
          { q: "Can I pay the fee monthly?", a: "Yes. Every course has a full-payment fee and a monthly plan with one installment per month of the course, and a printed receipt for every payment." },
        ],
      },
    ],
  },
  {
    slug: "buribalason",
    name: "Buribalason",
    aka: ["Buri Balason", "Buriballavson", "Buri Balason bridge"],
    nameBn: "বুড়ি বালাসন",
    nameHi: "बुड़ी बालासन",
    seoTitle: "Computer Course near Buribalason (Bagdogra–Siliguri Road)",
    description:
      "Computer training near Buribalason on the Bagdogra–Siliguri road: CODE in Bagdogra is about 3 km away with CCA, DCA, ADCA, web design, ecommerce, digital marketing and AI classes, monthly fee plans, Mon–Sat 11 AM–9 PM.",
    distance: "about 3 km",
    travel: "10 minutes by bike or bus",
    route: "Take the Bagdogra–Siliguri road west across the Buri Balason bridge into Bagdogra town; in town turn to Lokenath Nagar Road — the centre is beside K1 Fitness Gym.",
    courses: ["DCA", "CCA", "Ecommerce Expert (Industry Level)"],
    tldr: ({ d }) =>
      `Buribalason — the settlement by the Buri Balason river crossing on the Bagdogra–Siliguri road — is about 3 km from CODE — Computer & Digital Excellence in Bagdogra, around ten minutes by bike or bus. Students from the Buribalason side are nearer to Bagdogra than to Siliguri town and join CCA (${d("CCA")}), DCA (${d("DCA")}), ADCA (${d("ADCA")}), web design, ecommerce, digital marketing and AI prompt engineering. Batches run Monday to Saturday, 11 AM to 9 PM, with a monthly fee plan.`,
    updated: "2026-10-14",
    body: (ctx) => [
      { type: "h2", text: "Getting to CODE from Buribalason" },
      {
        type: "p",
        text: "Buribalason sits on the main Bagdogra–Siliguri road on the Bagdogra side of the river, so the trip is a straight ride west: across the bridge, into Bagdogra town and on to Lokenath Nagar Road, beside K1 Fitness Gym. Buses and shared autos on the road stop in Bagdogra; a bike does it in about ten minutes.",
      },
      { type: "h2", text: "Courses Buribalason students choose" },
      {
        type: "ul",
        items: [
          `${ctx.c("DCA")} — the six-month diploma that office, clerical and data-entry notices name; compare it with ADCA in [DCA vs ADCA](/guides/dca-vs-adca).`,
          `${ctx.c("CCA")} — for beginners and home-makers starting from zero.`,
          `${ctx.c("Ecommerce Expert (Industry Level)", "Ecommerce")} and ${ctx.c("Digital Marketing Basics", "digital marketing")} — for the shops and small businesses along the highway that want to sell on Amazon, Flipkart, Meesho or WhatsApp; the [guide for shop owners](/guides/computer-courses-for-shop-owners-sell-online) says which to take first.`,
        ],
      },
      { type: "h2", text: "Batch times" },
      {
        type: "p",
        text: "Students on the Siliguri side of Buribalason who attend a college in town take a 5–6 PM batch on the way home; shop owners along the road take a late-morning or 7 PM batch. Ask on WhatsApp for a batch with a seat.",
      },
      ...HOW_WE_TEACH(ctx),
      VISIT,
      {
        type: "faq",
        items: [
          { q: "Is there a computer institute near Buribalason?", a: "CODE — Computer & Digital Excellence in Bagdogra is about 3 km from Buribalason, around ten minutes by bike or bus along the Bagdogra–Siliguri road, on Lokenath Nagar Road beside K1 Fitness Gym." },
          { q: "Is Bagdogra or Siliguri closer for a course from Buribalason?", a: "Bagdogra. The centre is about 3 km west along the same road; Siliguri town is further east and busier in the evening." },
          { q: "Which course should a shop on the highway take to sell online?", a: "The ecommerce course if you want to list on Amazon, Flipkart or Meesho; Digital Marketing Basics if you want more customers for a physical shop through Google Maps and WhatsApp." },
          { q: "What are the class timings?", a: "Monday to Saturday, 11 AM to 9 PM; Sunday closed." },
        ],
      },
    ],
  },
];

export function areaBySlug(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug);
}

/** Latest `updated` across areas — the hub page's dateModified. */
export const AREAS_UPDATED = AREAS.map((a) => a.updated).sort().at(-1) ?? "2026-10-14";
