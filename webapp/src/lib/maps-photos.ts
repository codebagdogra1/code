// Photos taken from the centre's public Google Maps listing (posted by the
// centre and its students). They are copied into /public/maps so the site
// never hotlinks Google and keeps working if the listing changes. Only photos
// of the centre and its students belong here — no posters or stock images.
//
// To add one: drop a JPG into /public/maps (≈1400px wide), then add an entry.

export type MapsPhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  tag: string;
};

export const MAPS_PHOTOS: MapsPhoto[] = [
  {
    src: "/maps/batch-group.jpg",
    width: 1400,
    height: 1050,
    alt: "A batch of students standing together with their trainer inside the CODE computer lab in Bagdogra",
    caption: "One batch, one photo — students with their trainer in the lab",
    tag: "Our batch",
  },
  {
    src: "/maps/cake-cutting.jpg",
    width: 1400,
    height: 1050,
    alt: "Students handing a wrapped gift to their smiling trainer beside a cake on the desk at CODE",
    caption: "A surprise cake and a gift, planned by the students",
    tag: "Celebration",
  },
  {
    src: "/maps/students-celebration.jpg",
    width: 1400,
    height: 1050,
    alt: "Students and the trainer gathered around a table with snacks and drinks inside the CODE classroom",
    caption: "Snack break after class — the whole batch together",
    tag: "Lab life",
  },
  {
    src: "/maps/alumni-award.jpg",
    width: 1400,
    height: 787,
    alt: "CODE's trainer receiving an Alumni Meet 2024 plaque on stage",
    caption: "Our trainer honoured at the Alumni Meet 2024",
    tag: "Recognition",
  },
];
