import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Christian's Portfolio",
  description:
    "Showcasing fullstack projects, creative frontend builds, and a passion for clean code.",
  openGraph: {
    title: "Christian's Portfolio",
    description:
      "Explore Christian's developer portfolio — React, Next.js, MongoDB, and more.",
    url: "https://christians-portfolio.vercel.app/",
    siteName: "Christian Fryksten",
    images: [
      {
        url: "/link-picture.png",
        width: 1200,
        height: 630,
        alt: "Christian's Portfolio Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Christian's Portfolio",
    description:
      "Explore Christian's fullstack development work, projects, and design experiments.",
    images: ["/link-picture.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/main-logo.png" type="image/png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
