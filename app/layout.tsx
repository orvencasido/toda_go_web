import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TodaGo Admin Dashboard",
  description: "Administrative Control Panel for TodaGo Tricycle Ride-Hailing Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-sans bg-[#f3f8fc] text-[#091b6f]">
        {children}
      </body>
    </html>
  );
}

