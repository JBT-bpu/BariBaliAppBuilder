import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Heebo } from "next/font/google";
import "./globals.css";
import { PageTransition } from "@/components/ui/PageTransition";
import { TestCommandsInitializer } from "@/components/TestCommandsInitializer";
import { Canvas3DBackground } from "@/components/builder/Canvas3DBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Baribali Salad Builder",
  description: "Build your perfect custom salad with gamified UX",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#5AC568",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${heebo.variable} antialiased`}
        suppressHydrationWarning
      >
        <TestCommandsInitializer />
        <Canvas3DBackground>
          <PageTransition>
            {children}
          </PageTransition>
        </Canvas3DBackground>
      </body>
    </html>
  );
}
