import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Keep — Voice Preservation",
  description: "Preserve family voices with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white">{children}</body>
    </html>
  );
}
