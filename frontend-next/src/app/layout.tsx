import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { PublicLayout } from "@/components/layout/PublicLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CakeHub NVC - NAKHON PATHOM VOCATIONAL COLLEGE",
  description: "Experience absolute luxury in ordering customized bakery and classroom cake bookings.",
  icons: {
    icon: "/nvc.png",
    shortcut: "/nvc.png",
    apple: "/nvc.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>
            <PublicLayout>
              {children}
            </PublicLayout>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

