import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Header } from "@/components/header";
import { getUnreadCount, getViewer } from "@/lib/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BlueHen CarPool",
    template: "%s · BlueHen CarPool",
  },
  description:
    "University of Delaware students in Newark can offer rides and find seats going the same way.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const viewer = await getViewer();
  const unreadCount = await getUnreadCount();

  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <Header viewer={viewer} unreadCount={unreadCount} />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line bg-white px-4 py-6 text-center text-sm text-muted">
          Rides are arranged between UD students. BlueHen CarPool does not verify
          licenses, insurance, or payments.
        </footer>
      </body>
    </html>
  );
}
