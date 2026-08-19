import "./globals.css";

export const metadata = {
  title: "Akash DP — 3D Portfolio",
  description: "Akash DP's interactive 3D portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
