// TEMPORARY: visual check of the slider with many reviews. Delete after use.
import { ReviewsSlider } from "@/components/site/ReviewsSlider";
import type { GoogleReview } from "@/lib/google-reviews";

const names = ["Aarav Sharma", "Priya Das", "Rohan Roy", "Sneha Ghosh", "Imran Ali", "Tanvi Paul", "Kunal Sen", "Riya Biswas", "Arjun Nath", "Pooja Rai", "Dev Mitra", "Nisha Lama", "Sameer Khan", "Ankita Bose", "Vikram Thapa", "Megha Dutta", "Rahul Mandal", "Sunita Chettri"];
const reviews: GoogleReview[] = names.map((author, i) => ({
  id: `t-${i}`,
  author,
  rating: 5,
  when: `${i + 1} months ago`,
  text: i % 3 === 0
    ? "Excellent institute for computer courses in Bagdogra. The trainers explain everything step by step and the lab is well equipped. I joined for the diploma course and have already learnt a lot more than I expected, highly recommended for students and working people alike."
    : "Very good teaching and a friendly environment. Classes are on time and doubts are cleared properly.",
  url: "https://maps.google.com",
  source: "google",
}));

export default function Page() {
  return (
    <main className="py-16">
      <ReviewsSlider reviews={reviews} />
    </main>
  );
}
