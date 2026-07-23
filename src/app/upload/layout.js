// The seeding screen must never reach an index. robots.txt already disallows
// the path; this is the second lock, for a crawler that reaches the URL from a
// link rather than from robots.txt.
export const metadata = {
  title: "Upload",
  robots: { index: false, follow: false, nocache: true },
};

export default function UploadLayout({ children }) {
  return children;
}
