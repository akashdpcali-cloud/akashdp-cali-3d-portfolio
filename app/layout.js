import "./globals.css";
import localFont from "next/font/local";

export const metadata = {
  title: "Akash DP — 3D Portfolio",
  description: "Akash DP's interactive 3D portfolio",
  icons: "/assets/portfolio-ai-logo.jpg",
};
const agencyFB = localFont({
  src: "../public/fonts/AgencyFB-Bold-700.ttf",
  variable: "--font-agency",
  weight: "700",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={agencyFB.variable}>{children}</body>
    </html>
  );
}
