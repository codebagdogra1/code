import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { HeadResource, ScriptDesc } from "./_types";

// The EduSmart homepage is composed from snippets that live in the repo under
// public/home/snippets/ (generated from page.shell.html by scripts/split-home.py).
// The home route is statically rendered (see page.tsx), so these reads run at
// build time — the snippet files are always present in the source tree then.
const DIR = join(process.cwd(), "public", "home", "snippets");
const read = (p: string): string => readFileSync(join(DIR, p), "utf8");

// The visual system is an imported EduSmart design, but its original text was
// demo copy. Keep every class, container and interaction intact while replacing
// only the visitor-facing language, links and NAP details with CODE's real offer.
// This happens at build time, so the final HTML remains fully crawlable.
const CONTENT_REPLACEMENTS: ReadonlyArray<readonly [string, string]> = [
  ["Where Learning Knows No <span>Boundaries</span>", "Computer &amp; Digital Skills <span>for Your Future</span>"],
  ["Discover a world of knowledge and learning opportunities through our diverse range of distance education courses.", "Build practical computer and digital skills at CODE in Bagdogra. Explore courses for beginners, students and career-focused learners."],
  ["Explore Course", "Explore Courses"],
  ["Join our online Class", "Practical learning in Bagdogra"],
  ["2K Students", "Learn at CODE"],
  ["We collaborate with 300+ leading universities and companies", "Practical computer and digital-skills learning in Bagdogra"],
  ["Invest In Your Career With EduThim Plus", "Build Skills for Study, Work and What’s Next"],
  ["Get access to videos in over 90% of courses, Specializations, and Professional Certificates <br />taught by top instructors from leading universities and companies.", "Choose a course that fits your current level and practise the skills as you learn. Ask CODE about batches, fees and the right starting point for you."],
  ["Learn Anything", "Learn Practical Skills"],
  ["Explore any interest or trending topic, take prerequisites, and advance your skills.", "Start with computer fundamentals or progress into web, ecommerce, AI and digital marketing."],
  ["Save Money", "Clear Course Guidance"],
  ["Save on your learning expenses if you plan to take multiple courses this year.", "Get clear information on course duration, current fees and class schedules before you enrol."],
  ["Flexible Learning", "Choose Your Path"],
  ["Learn at your own pace, switch courses, or explore new ones as needed.", "From CCA and DCA to ADCA and specialist digital skills, choose a course that matches your goal."],
  ["Unlimited Certificates", "Local Support"],
  ["Explore Our Courses And <br> Build Skills", "Explore CODE Courses and <br> Build Real Skills"],
  ["Welcome to our diverse and dynamic course catalog. We&#8217;re dedicated to providing you with access to high-quality education", "Discover practical computer, web, ecommerce, AI and digital-marketing courses from CODE in Bagdogra."],
  ["What Our Customers Say", "5-Star Google Reviews"],
  ["We take immense pride in the positive impact our courses and community have on learners' lives.", "CODE is rated 5.0 stars from 43 Google reviews. Here is what learners say about their experience."],
  ["9/10", "5.0 ★"],
  ["9/10 Users reported better learning out comes", "Google rating from 43 reviews"],
  ["85%", "43"],
  ["85% of students see their courses through to completion", "Google reviews for CODE"],
  ["Devon Lane", "Deepak Bagoriya"],
  ["Adam Smith", "Kashish Choudhary"],
  ["Layen Phys", "Debjit Ghosh"],
  ["Scrum Master", "Google review"],
  ["\"I can't thank enough for the incredible courses they offer. I completed the 'Web Development Fundamentals' course, and it not only gave me the skills.”", "\"I would highly recommend to anyone looking to build or advance a career in technology… this is a great place to start your journey.\""],
  ["Very interesting course. I loved the calmness over it all. I learned a lot about the use of colors. Green is never just green and white is never just white. Thank you!", "\"I am currently pursuing a Diploma in Computer, and my experience so far has been very good and knowledgeable.\""],
  ["Commonly Asked Questions", "Computer Course Questions, Answered"],
  ["Montes nascetur ridiculus mus mauris. Diam sollicitudin tempor id sit amet purus eu nisl nunc mi ipsum.", "Straight answers for students and parents choosing a computer course in Bagdogra."],
  ["What Is Involved In User Interface Design?", "Which computer course is best for beginners?"],
  ["User Interface (UI) Design is the practice of designing the visual layout and interactive elements of a digital product, such as buttons, icons, spacing, typography, colors, and responsive design", "CCA is a good starting point for learners who want computer fundamentals, MS Office and everyday digital skills. Contact CODE to discuss the course that suits your goal."],
  ["Etiam dignissim diam quis enim lobortis scelerisque fermentum dui. Blandit cursus risus at ultrices mi tempus imperdiet nulla. Pharetra et ultrices neque ornare aenean euismod.", "DCA provides a more structured computer-application path, while ADCA is for learners ready to build broader, more advanced digital skills. Ask us about the current batch and course fee."],
  ["Become an instructor today", "Start Your Digital Learning Journey"],
  ["Instructors from around the world teach millions of students on EduSmart", "Talk to CODE in Bagdogra about courses, fees and the right learning path for you."],
  ["Let’s Find The Right Course For You!", "Let’s Find the Right Course for You!"],
  ["Build your Skills Certificate From the Edusmart Online course", "Build Practical Digital Skills with CODE"],
  ["Stories From Real People", "Learn More About Digital Skills"],
  ["Read inspiring stories from the Codecademy community.", "Explore practical guidance for choosing the right computer and digital-skills course."],
  ["Introduction to LearnPress: Building your Learning Management System", "CCA — Certificate in Computer Application"],
  ["How to Invest in The Stock Market", "DCA — Diploma in Computer Application"],
  ["Create an LMS Website with LearnPress", "ADCA — Advanced Diploma in Computer Application"],
  ["Introduction LearnPress – LMS plugin", "Web Design Basic"],
  ["50 Tips on Making a Great Online Course", "Web Design Advanced"],
  ["Build Your Online School for Profit", "Ecommerce Expert — Industry Level"],
  ["Instructional Design for Learning and Development", "Ecommerce Expert — Job Ready"],
  ["How To Teach Online Courses Effectively", "A.I. Prompt Engineering"],
  ["We are providing the best online course", "Practical computer and digital-skills learning in Bagdogra"],
  ["Find The Best Features Of Edusmart", "Why Learn With CODE"],
  ["Most Popular Instructors", "Learn With CODE"],
  ["245k+", "Practical"],
  ["Positive Reviews", "learning for Bagdogra learners"],
  ["by <span class=\"instructor-display-name\">Zealous Benz</span>", "by <span class=\"instructor-display-name\">CODE</span>"],
  ["About Edusmart", "About CODE"],
  ["Awards & Recognition", "Our Courses"],
  ["Pricing Plan", "Contact CODE"],
  ["UI UX Design", "CCA &amp; DCA"],
  ["Management", "ADCA"],
  ["Programming Tech", "Web Design"],
  ["Computer Science", "Digital Marketing"],
  ["Hatteras Lane, Hollywood, FL 33019, USA", "Lokenath Nagar Rd, near K1 Fitness Gym, Bagdogra, Siliguri, West Bengal 734014"],
  ["(303) 555-0105", "+91 96358 09537"],
  ["Copyright © 2026 <span class=\"focused-text\">Computer &amp; Digital Excellence</span>. All Rights", "Copyright © 2026 <span class=\"focused-text\">CODE — Computer &amp; Digital Excellence</span>. All Rights"],
];

function codeContent(html: string): string {
  const updated = CONTENT_REPLACEMENTS.reduce((result, [from, to]) => result.replaceAll(from, to), html);
  const withRealFaqs = updated.split("Which computer course is best for beginners?");
  const faqContent = withRealFaqs.length === 4
    ? withRealFaqs[0] + "Which computer course is best for beginners?" + withRealFaqs[1] + "What is the difference between DCA and ADCA?" + withRealFaqs[2] + "How can I confirm course fees and timings?" + withRealFaqs[3]
    : updated;
  return faqContent
    // The first imported course title contains a source line break, so it needs
    // a whitespace-tolerant replacement rather than the literal map above.
    .replace(/Introduction to LearnPress: Building your Learning\s+Management System/g, "CCA — Certificate in Computer Application")
    // The imported course card data included foreign locations, prices and
    // enrolment counts. Do not expose invented facts to visitors, search
    // engines, or answer engines; current fees and batches are confirmed by
    // CODE directly.
    .replace(/<div class="course-instructor">[\s\S]*?<\/div>/g, '<div class="course-instructor">by <span class="instructor-display-name">CODE</span></div>')
    .replace(/<div class="deliver-and-address">[\s\S]*?<\/div>/g, '<div class="deliver-and-address"><span class="course-deliver-type">In-person learning</span> <span class="course-address">Bagdogra, West Bengal</span></div>')
    .replace(/(<div class="course-count-student">)[\s\S]*?(<\/div>)/g, "$1Contact CODE for batch details$2")
    .replace(/<span class="origin-price">[\s\S]*?<\/span>/g, "")
    .replace(/<span class="price">[\s\S]*?<\/span>/g, "")
    .replace(/<span class="free">Free<\/span>/g, "")
    .replaceAll('href="/home/demo-main/courses/"', 'href="/courses"')
    .replace(/href="\/home\/demo-main\/courses\/[^\"]+\//g, 'href="/courses"')
    .replaceAll('href="tel:%20(303)%20555-0105"', 'href="tel:+919635809537"')
    .replaceAll('href="tel:%20+123548645850"', 'href="tel:+919635809537"')
    .replace(/href="\/cdn-cgi\/l\/email-protection#[^"]+"/g, 'href="mailto:code.bagdogra@gmail.com"')
    .replace(/https:\/\/edusmart\.physcode\.com\/cdn-cgi\/l\/email-protection[^"\s]*/g, "mailto:code.bagdogra@gmail.com")
    .replace(/<span class="__cf_email__"[^>]*>\[email[^<]*<\/span>/g, "code.bagdogra@gmail.com")
    .replaceAll("We&#8217;re Here To Provide 24X7Support", "Ask CODE About Courses, Fees and Batches")
    .replaceAll("Hilton Conference Centre", "Lokenath Nagar Rd, near K1 Fitness Gym, Bagdogra, Siliguri, West Bengal 734014")
    .replaceAll("+123 548 6458 50", "+91 96358 09537")
    .replaceAll("Highland%20Park%20Bowl", "Computer%20and%20Digital%20Excellence%20CODE%20Bagdogra")
    .replaceAll('title="Highland Park Bowl"', 'title="Computer and Digital Excellence - CODE, Bagdogra"')
    .replaceAll('href="https://www.facebook.com/physcode/"', 'href="/contact"')
    .replaceAll('href="https://www.instagram.com/physcode/?hl=en"', 'href="/contact"')
    .replaceAll('href="https://www.youtube.com/"', 'href="/contact"')
    .replace(
      /(<p class="thim-ekits-testimonial__name">Debjit Ghosh<\/p>[\s\S]*?<p><img[^>]*\/><\/p><p>)"I am currently pursuing a Diploma in Computer, and my experience so far has been very good and knowledgeable\."<\/p>/,
      '$1"The class is very clean. Trainer is supportive; all the things are explained properly."</p>',
    )
    .replaceAll("We are a passionate education company dedicated to empowering\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tlearners of all ages and accessible learning solutions.", "CODE helps learners in Bagdogra build practical computer and digital skills.")
    .replaceAll("https://edusmart.physcode.com/demo-main", "/");
}

export const getHead = (): HeadResource[] => JSON.parse(read("head.json"));
export const getScripts = (): ScriptDesc[] => JSON.parse(read("scripts.json"));
export const getBodyClass = (): string => read("body-class.txt").trim();
export const getHeader = (): string => codeContent(read("header.html"));
export const getFooter = (): string => codeContent(read("footer.html"));

// Demo sub-pages (contact, about, courses, blog, …) extracted by
// scripts/split-pages.py. Each page's unique main content lives at
// public/home/pages/<slug>/content.html; the shared header/footer/head/scripts
// above are reused verbatim. Read at build time (routes are force-static).
const PAGES_DIR = join(process.cwd(), "public", "home", "pages");
export const getPageContent = (slug: string): string =>
  codeContent(readFileSync(join(PAGES_DIR, slug, "content.html"), "utf8"));

// The page's own inline <style> delta (mainly `.elementor-kit-9` globals and any
// per-page Elementor styles the shared homepage head doesn't already carry).
export const getPageHead = (slug: string): HeadResource[] =>
  JSON.parse(readFileSync(join(PAGES_DIR, slug, "head.json"), "utf8"));

// Each demo page's original <body> class list. Inner pages are NOT `home`, so
// applying their own class (instead of the homepage's) keeps the theme's
// transparent-overlay header from expecting a hero and overlapping the content.
type PageManifest = Record<string, { bodyClass: string }>;
let _manifest: PageManifest | undefined;
const manifest = (): PageManifest =>
  (_manifest ??= JSON.parse(readFileSync(join(PAGES_DIR, "manifest.json"), "utf8")));
export const getPageBodyClass = (slug: string): string =>
  manifest()[slug]?.bodyClass ?? "";

// The 12 content sections, concatenated in order. They are injected as the direct
// children of the `.elementor-10` wrapper so Elementor's :nth-of-type / direct-child
// CSS and its JS selectors keep matching exactly as in the original page.
export const getSections = (): string =>
  codeContent(Array.from({ length: 12 }, (_, i) =>
    read(`sections/${String(i + 1).padStart(2, "0")}.html`).trim(),
  ).join("\n"));
