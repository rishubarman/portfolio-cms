import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rishu Barman | Aspiring Java Developer",
  description:
      "Rishu Barman is an aspiring Java Developer focused on Java, Spring Boot, backend development, REST APIs, and software engineering.",
  keywords: [
    "Rishu Barman",
    "Java Developer",
    "Aspiring Java Developer",
    "Java",
    "Spring Boot",
    "Backend Developer",
    "Software Engineer",
    "REST API",
    "Portfolio",
  ],
  authors: [
    {
      name: "Rishu Barman",
    },
  ],
  creator: "Rishu Barman",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
                                     children,
                                   }: LayoutProps<"/">) {
  return (
      <html
          lang="en"
          className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
      <body className="min-h-full flex flex-col">
      {children}
      </body>
      </html>
  );
}