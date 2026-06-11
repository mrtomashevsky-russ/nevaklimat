import type { Metadata } from "next";
import Script from "next/script";
import { Onest, Unbounded } from "next/font/google";
import { BRAND } from "@/config/site";
import "./globals.css";

const onest = Onest({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-onest",
  display: "swap"
});

const unbounded = Unbounded({
  subsets: ["cyrillic", "latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-unbounded",
  display: "swap"
});

const title = "НеваКлимат — кондиционеры под ключ в Санкт-Петербурге";
const description = "Продажа и установка кондиционеров в квартирах Санкт-Петербурга. Подбор, монтаж за 1 день, гарантия 3 года, цена под ключ от 29 900 ₽.";

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: BRAND.siteUrl,
    siteName: BRAND.name,
    locale: "ru_RU",
    type: "website"
  },
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const ymId = process.env.NEXT_PUBLIC_YM_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BRAND.name,
    description,
    telephone: BRAND.phone,
    url: BRAND.siteUrl,
    areaServed: {
      "@type": "City",
      name: BRAND.city
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: BRAND.city,
      addressCountry: "RU"
    },
    priceRange: "от 29 900 ₽"
  };

  return (
    <html lang="ru">
      <body className={`${onest.variable} ${unbounded.variable}`}>
        {children}
        <Script id="schema-local-business" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
        {ymId && (
          <Script id="ym" strategy="afterInteractive">
            {`
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
              ym(${Number(ymId)}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:false });
            `}
          </Script>
        )}
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
