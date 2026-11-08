import "./globals.css";
import localFont from "next/font/local";
import { Roboto } from "next/font/google";

export const metadata = {
  title: {
    default: "Akash D P | 3D Full-Stack Developer",
    template: "%s | Akash D P",
  },

  metadataBase: new URL("https://akashdp-cali-3d-portfolio.vercel.app"),

  alternates: {
    canonical: "/",
  },

  description:
    "Akash D P is a 3D Full-Stack Developer and Creative Developer specializing in interactive 3D websites, creative frontend experiences, landing pages and full-stack web applications.",

  applicationName: "Akash D P Portfolio",

  authors: [
    {
      name: "Akash D P",
    },
  ],

  creator: "Akash D P",

  publisher: "Akash D P",

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    title: "Akash D P | 3D Full-Stack Developer",
    description:
      "Explore the work of Akash D P, a 3D Full-Stack Developer building interactive websites, creative digital experiences and modern web applications.",
    siteName: "Akash D P Portfolio",
    type: "website",
    locale: "en_IN",
    url: "/",
  },

  twitter: {
    card: "summary_large_image",
    title: "Akash D P | 3D Full-Stack Developer",
    description:
      "Interactive 3D websites, creative frontend experiences and full-stack web development by Akash D P.",
  },
};
const agencyFB = localFont({
  src: "../public/fonts/AgencyFB-Bold-700.ttf",
  variable: "--font-agency",
  weight: "700",
  display: "swap",
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",

  url: "https://akashdp.dev/",
  "@id": "https://akashdp.dev/#person",

  name: "Akash D P",

  jobTitle: "3D Full-Stack Developer & Creative Developer",

  description:
    "3D Full-Stack Developer specializing in interactive 3D websites, creative frontend development, modern web applications and backend development.",

  knowsAbout: [
    "Web Development",
    "Full-Stack Development",
    "Frontend Development",
    "3D Web Development",
    "Creative Development",
    "HTML",
    "CSS",
    "JavaScript",
    "React.js",
    "Next.js",
    "Three.js",
    "Blender",
    "GSAP",
    "Node.js",
    "Express.js",
    "Prisma ORM",
    "PostgreSQL",
    "SQLite",
    "Socket.IO",
    "AI Integration",
  ],

  sameAs: [
    "https://www.linkedin.com/in/akashdpcali/",
    "https://github.com/akashdpcali-cloud",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",

  "@id": "https://akashdp.dev/#website",

  name: "Akash D P | 3D Full-Stack Developer",

  url: "https://akashdp.dev/",

  description:
    "Official portfolio of Akash D P, a 3D Full-Stack Developer and Creative Developer specializing in interactive 3D websites and modern web applications.",

  inLanguage: "en",

  publisher: {
    "@id": "https://akashdp.dev/#person",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${agencyFB.variable} ${roboto.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
