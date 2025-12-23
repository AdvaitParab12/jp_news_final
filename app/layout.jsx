import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "JANTA PRAKASH NEWS - JANTA KI AWAAZ, SACH KA PRAKASH",
  description:
    "JANTA PRAKASH NEWS - JANTA KI AWAAZ, SACH KA PRAKASH THANE, KALYAN, ULHASNAGAR",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/img/favicon.png" />

        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css?family=Roboto+Condensed%7CRoboto+Slab:300,400,700%7CRoboto:300,400,500,700"
          rel="stylesheet"
        />

        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"
        />

        {/* CSS */}
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/main.css" />
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/colors.css" />
        <link rel="stylesheet" href="/css/responsive.css" />
        <link rel="stylesheet" href="/css/jquery-ui.min.css" />
        <link rel="stylesheet" href="/css/weather-icons.min.css" />
      </head>

      <body>
        {children}

        {/* JS – ORDER IS CRITICAL */}
        <Script src="/js/jquery-3.1.1.min.js" strategy="beforeInteractive" />
        <Script src="/js/bootstrap.min.js" strategy="afterInteractive" />
        <Script src="/js/jquery-ui.min.js" strategy="afterInteractive" />
        <Script src="/js/plugins.js" strategy="afterInteractive" />
        <Script src="/js/functions.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
