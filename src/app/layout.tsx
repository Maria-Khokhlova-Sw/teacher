import type { Metadata } from "next";
import "./globals.css";
import styles from "@/app/page.module.css";
import Menu from "@/components/Menu/Menu";

export const metadata: Metadata = {
  title: "Teacher",
  description: "Teacher app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
      <div className={styles.page}>
          <Menu/>
          {children}
      </div>
      </body>
    </html>
  );
}
