import "./globals.css";
import { Roboto } from "next/font/google";

export const metadata = {
  title: "Akash DP — 3D Portfolio",
  description: "Akash DP's interactive 3D portfolio",
  icons: "/assets/portfolio-ai-logo.jpg",
};
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
