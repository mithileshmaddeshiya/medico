/**
 * Patient reviews shown on the home page and every city page (LabReviews).
 *
 * ── ONLY REAL REVIEWS, WORD FOR WORD ─────────────────────────────────────
 * Each entry is a review a customer actually left, copied as they wrote it
 * (Hinglish kept; only a doubled display name like "Vishal Kushwaha Vishal
 * Kushwaha" is tidied). Nothing here may be written, polished or "improved" by
 * us — an invented or edited testimonial is misleading advertising under the
 * Consumer Protection Act 2019 and the CCPA's 2022 guidelines on endorsements.
 *
 * Selection rule (the owner's): only reviews with MORE than ten words of
 * comment. Star-only reviews and one-word ones ("Good", "Amazing") are left
 * out — they are genuine, they just give a reader nothing to read.
 *
 * There is deliberately NO AggregateRating / Review schema for these. Google
 * does not show review stars for reviews a business publishes about itself,
 * and marking them up anyway is a structured-data policy violation.
 *
 * `date` is YYYY-MM-DD, the day the review was left, or null when the review
 * came without one (nothing is shown then — a date is never guessed).
 */
export const REVIEWS = [
  {
    name: "Fahan Siddique",
    rating: 5,
    date: "2026-09-18",
    text: "Pehle government lab se dengue/typhoid test karwaya tha par report clear nahi thi. MedicoBharat par online booking asan rahi aur report ka har ek point acche se samjhaya gaya.",
  },
  {
    name: "Sachidanand Kushwaha",
    rating: 5,
    date: "2026-09-15",
    text: "MedicoBharat Lab Test Deoria se tests karwaye aur fully satisfied hoon. On time report mili aur sab kuch clearly explain kiya gaya. Genuine pricing aur polite staff hai.",
  },
  {
    name: "Sunita Devi",
    rating: 5,
    date: "2026-08-27",
    text: "Excellent experience. Full body blood checkup karwaya tha. Process smooth aur quick tha, reports accurate aur time par mili. 5 Star.. 🙂",
  },
  {
    // Display name was "abhiyanshkumar 9569" — the trailing number dropped.
    name: "Abhiyanshkumar",
    rating: 5,
    date: "2026-06-02", // first posted; edited by the reviewer on 18 Sep 2026
    text: "Deoria mein liver function test karwaya tha. Order tracking aur delivery experience smooth raha, billing sahi thi aur report jaldi mil gayi.",
  },
  {
    name: "Aman Maddheshiya",
    rating: 5,
    date: "2026-09-14",
    text: "Excellent diagnostic service in Deoria! Home sample collection smooth aur convenient tha, reports jaldi mil gayi aur online booking asan thi.",
  },
  {
    name: "Ashif Ali",
    rating: 5,
    date: "2026-09-24",
    text: "Full body checkup karwaya tha, WhatsApp par 24 ghante ke andar report aa gayi. Deoria mein full body checkup ke liye acchi jagah hai, cleanliness aur hygiene ka pura dhyan rakha jata hai.",
  },
  {
    name: "Hina Kumari",
    rating: 5,
    date: null, // no date came with this review — none is shown
    text: "Father ka HbA1c aur lipid profile test karwaya tha, staff ghar par sample lene aaye the. Deoria ka sabse reliable diagnostic center hai.",
  },
  {
    name: "Ankit Kumar",
    rating: 5,
    date: "2026-09-24",
    text: "Home sample collection ki service bohot acchi thi. Hemoglobin report accurate aur detailed thi. Deoria mein full body checkup ya vitamins test ke liye best experience raha.",
  },
  {
    name: "Vishal Kushwaha",
    rating: 5,
    date: "2026-09-24",
    text: "Bachon ke liye dengue aur typhoid test karwayaye the. Sample collection bilkul painless tha, nurses bohot careing thi aur reports time par mil gayi.",
  },
  {
    name: "Avinash Maddheshiya",
    rating: 5,
    date: "2026-09-24",
    text: "Thyroid aur sugar test karwaya tha, report WhatsApp par jaldi mil gayi. Rate aur quality dono mein Salempur ka yeh diagnostic centre sabse aage hai.",
  },
  {
    name: "Hariom Kushwaha",
    rating: 5,
    date: "2026-09-24",
    text: "ECG aur full health package bohot hi kam cost mein mil gaya. Pension ke paise bachane ke liye sabse best aur affordable lab lagi.",
  },
];
