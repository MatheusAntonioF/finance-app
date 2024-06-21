import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';

import { QueryProvider } from '@/providers/query-provider';
import { SheetProvider } from '@/providers/sheet-provider';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ClerkProvider>
                    <QueryProvider>
                        <SheetProvider />
                        <Toaster />
                        {children}
                    </QueryProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}
