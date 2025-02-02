import type { Metadata } from "next";
import "./globals.css";
import SideBar from "./components/SideBar";
import { ClerkProvider } from "@clerk/nextjs";
export const metadata: Metadata = {
  title: "TaskMaster",
  description: "TaskMaster is a task management app that helps you stay organized and productive.",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {


  
  return (
    <html lang="en">
      <ClerkProvider>
        <body className="flex">{children}</body>
      </ClerkProvider>
    </html>
  );
}
