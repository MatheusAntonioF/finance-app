'use client';

import { useUser } from '@clerk/nextjs';

export function WelcomeMsg() {
    const { user, isLoaded } = useUser();
    return (
        <div className="space-y-2 mb-4">
            <h2 className="text-2xl lg:text-4xl text-white font-medium">
                Welcome Back{isLoaded ? ', ' : ' '}
                {user?.firstName}
            </h2>
        </div>
    );
}
