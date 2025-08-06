import "./globals.css";
import { Inter } from "next/font/google";
import CookieBanner from "./components/CookieBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Christian's Portfolio",
  description:
    "Showcasing fullstack projects, creative frontend builds, and a passion for clean code.",
  metadataBase: new URL("https://christians-portfolio.vercel.app"),
  openGraph: {
    title: "Christian's Portfolio",
    description:
      "Explore Christian's developer portfolio — React, Next.js, MongoDB, and more.",
    url: "https://christians-portfolio.vercel.app/",
    siteName: "Christian Fryksten",
    images: [
      {
        url: "/images/link-picture.png",
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
    images: ["/images/link-picture.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/main-logo.png" type="image/png" />

        {/*  Dark mode script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
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
            `,
          }}
        />

        {/*  Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-SFCC2X5GY0"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SFCC2X5GY0');
            `,
          }}
        />
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
