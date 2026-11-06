import "./globals.css";
import localFont from "next/font/local";
import { Roboto } from "next/font/google";

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
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${agencyFB.variable} ${roboto.variable}`}>
        {children}
      </body>
    </html>
  );
}
