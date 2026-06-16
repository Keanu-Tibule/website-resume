import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://keanudane.vercel.app"),
  title: {
    default: "Keanu Dane Tibule | Frontend Developer",
    template: "%s | Keanu Dane Tibule",
  },
  description:
    "Frontend developer portfolio for Keanu Dane Tibule, focused on polished UI, modern web apps, and thoughtful product experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
