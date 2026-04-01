import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JassuCafe - Digital Services & Online Appointment Booking",
  description:
    "Professional cafe offering PAN Card, Aadhar Update, Passport Apply, Government Forms, Online Exam Forms, Resume Creation, Lamination, Printing, Photocopy, Job Applications, and Scholarship Forms. Book your appointment online!",
  keywords: [
    "jassu cafe",
    "online appointment",
    "PAN card",
    "Aadhar update",
    "passport apply",
    "government forms",
    "resume creation",
    "digital services",
    "job applications",
  ],
  authors: [{ name: "JassuCafe" }],
  openGraph: {
    title: "JassuCafe - Digital Services & Appointment Booking",
    description:
      "Your trusted digital service center in Lucknow for all digital government services. Book appointments online!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
