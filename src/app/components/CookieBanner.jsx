"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem("cookie-consent");
    if (!storedConsent) {
      setVisible(true);
    } else if (storedConsent === "true") {
      loadGtag();
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true");
    setAccepted(true);
    setVisible(false);
    loadGtag();
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "false");
    setVisible(false);
  };

  const loadGtag = () => {
    if (window.gtag) return;
    const script1 = document.createElement("script");
    script1.src = "https://www.googletagmanager.com/gtag/js?id=G-SFCC2X5GY0";
    script1.async = true;
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-SFCC2X5GY0');
    `;
    document.head.appendChild(script2);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto bg-white dark:bg-gray-900 text-black dark:text-white border dark:border-gray-700 shadow-xl p-4 rounded-xl z-50">
      <p className="mb-4 text-sm">
        Denna sida använder cookies för att förstå vad som fungerar på sidan och
        förbättra din upplevelse. Inget personligt sparas. Är det okej?
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={declineCookies}
          className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Nej tack
        </button>
        <button
          onClick={acceptCookies}
          className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          Acceptera
        </button>
      </div>
    </div>
  );
}
