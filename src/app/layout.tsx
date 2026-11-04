import type { Metadata } from "next";
import "./globals.css";
import styles from "@/app/page.module.css";
import Menu from "@/components/Menu/Menu";
import { AuthProvider } from "@/context/AuthContext";

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
        <AuthProvider>
            <div className={styles.page}>
                <Menu/>
                {children}
            </div>
        </AuthProvider>
        </body>
        </html>
    );
}
