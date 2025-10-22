import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";
import CookieBanner from "./components/CookieBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Christian Fryksten | Fullstack Developer Portfolio",
  description:
    "Explore Christian's portfolio with projects built using React, Next.js, MongoDB, Node.js and more.",
  metadataBase: new URL("https://fryksten.dev"),
  keywords: [
    "Christian Fryksten",
    "fullstack developer",
    "React developer",
    "Next.js portfolio",
    "JavaScript developer",
    "web development",
    "MongoDB",
    "Node.js",
    "frontend",
    "backend",
  ],
  authors: [
    {
      name: "Christian Fryksten",
      url: "https://fryksten.dev",
    },
  ],
  creator: "Christian Fryksten",
  publisher: "Christian Fryksten",
  alternates: {
    canonical: "https://fryksten.dev/",
  },
  openGraph: {
    title: "Christian Fryksten | Fullstack Developer",
    description:
      "Showcasing fullstack development projects using modern web technologies like React, Next.js, and Node.js.",
    url: "https://fryksten.dev/",
    siteName: "Christian Fryksten",
    type: "website",
    images: [
      {
        url: "/images/link-picture.png",
        width: 1200,
        height: 630,
        alt: "Christian Fryksten Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Christian Fryksten | Portfolio",
    description:
      "See projects and skills in fullstack development, clean UI, and modern web technologies.",
    images: ["/images/link-picture.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon1.ico" type="image/ico" />
        <meta name="theme-color" content="#121212" />
        <meta name="robots" content="index, follow" />

        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function () {
              try {
                const theme = localStorage.getItem("theme");
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                if (theme === "dark" || (!theme && prefersDark)) {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              } catch (_) {}
            })();
          `}
        </Script>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SFCC2X5GY0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SFCC2X5GY0');
          `}
        </Script>
      </head>

      <body
        className={`${inter.className} bg-white text-black dark:bg-black dark:text-white transition-colors duration-300`}
      >
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
