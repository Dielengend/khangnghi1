import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, normalizeLocale, resolveLocaleFromCountryCode } from "@/lib/i18n";
import { detectCountryCodeFromHeaders } from "@/lib/geoip";
import "./globals.css";

function normalizeCountryCode(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const countryCode = value.toUpperCase();
  return /^[A-Z]{2}$/.test(countryCode) ? countryCode : null;
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meta for Business - Page Appeals",
  description: "Recreation of the Meta Privacy Center landing page from the provided design.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const detectedCountryCode = normalizeCountryCode(headerStore.get("x-detected-country")) ?? (await detectCountryCodeFromHeaders(headerStore));
  const locale =
    normalizeLocale(headerStore.get("x-detected-locale")) ??
    normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value) ??
    (detectedCountryCode ? resolveLocaleFromCountryCode(detectedCountryCode) : null) ??
    normalizeLocale(headerStore.get("accept-language")) ??
    DEFAULT_LOCALE;

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
