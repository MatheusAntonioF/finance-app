import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const TransactionsPageSkeleton = () => {
    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <Skeleton className="text-xl line-clamp-1" />
                    <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
                        <Skeleton className="w-full lg:w-auto" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Skeleton className="flex items-center py-4" />
                </CardContent>
            </Card>
        </div>
    );
};
