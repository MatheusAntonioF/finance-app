import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { SignUp, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';

export default function Page() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="h-full lg:flex flex-col items-center justify-center px-4">
                <div className="text-center space-y-4 pt-16">
                    <h1 className="font-fold text-3xl text-white/80">
                        Welcome Back!
                    </h1>
                    <p className="text-base text-[#7e8ca0]">
                        Log in or Create account to get back to your dashboard!
                    </p>
                </div>
                <div className="flex items-center justify-center mt-8">
                    <ClerkLoaded>
                        <SignUp path="/sign-up" />
                    </ClerkLoaded>
                    <ClerkLoading>
                        <Loader2 className="animate-spin text-muted-foreground"></Loader2>
                    </ClerkLoading>
                </div>
            </div>
            <div className="h-full from-emerald-600 to-emerald-700 hidden lg:flex items-center justify-center">
                <Image src="logo.svg" height={100} width={100} alt="Logo" />
            </div>
        </div>
    );
}
