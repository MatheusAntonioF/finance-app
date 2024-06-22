'use client';

import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction';
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions';
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions';
import { useSelectAccount } from '@/features/accounts/hooks/use-select-account';
import { useBulkCreateTransactions } from '@/features/transactions/api/use-bulk-create-transaction';

import { transactions as transactionSchema } from '@/db/schema';

import { UploadButton } from './_components/upload-button';
import { transactionsColumns } from './_components/columns';
import { ImportCard } from './_components/import-card';
import { TransactionsPageSkeleton } from './_components/skeleton';

enum VARIANTS {
    LIST = 'LIST',
    IMPORT = 'IMPORT',
}

const INITIAL_IMPORT_RESULTS = {
    data: [],
    errors: [],
    meta: {},
};

const TransactionsPage = () => {
    const [AccountDialog, confirm] = useSelectAccount();
    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);
    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
        setImportResults(results);
        setVariant(VARIANTS.IMPORT);
    };

    const onCancelImport = () => {
        setImportResults(INITIAL_IMPORT_RESULTS);
        setVariant(VARIANTS.LIST);
    };

    const newTransaction = useNewTransaction();
    const createTransactions = useBulkCreateTransactions();

    const deleteTransactions = useBulkDeleteTransactions();
    const transactionsQuery = useGetTransactions();
    const transactions = transactionsQuery.data || [];

    const isDisabled =
        transactionsQuery.isLoading || deleteTransactions.isPending;

    const onSubmitImport = async (
        values: (typeof transactionSchema.$inferInsert)[]
    ) => {
        const accountId = await confirm();

        if (!accountId) {
            return toast.error('Please select an account to continue.');
        }

        const data = values.map(value => ({
            ...value,
            accountId: accountId as string,
        }));

        createTransactions.mutate(
            { json: data },
            {
                onSuccess: () => {
                    onCancelImport();
                },
            }
        );

        toast('Importing transactions');
    };

    if (transactionsQuery.isLoading || createTransactions.isPending) {
        return <TransactionsPageSkeleton />;
    }

    if (variant === VARIANTS.IMPORT) {
        return (
            <>
                <AccountDialog />
                <ImportCard
                    data={importResults.data}
                    onCancel={onCancelImport}
                    onSubmit={onSubmitImport}
                />
            </>
        );
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Transactions history
                    </CardTitle>
                    <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
                        <Button
                            size="sm"
                            onClick={newTransaction.onOpen}
                            className="w-full lg:w-auto"
                        >
                            <Plus className="size-4 mr-2" />
                            Add new
                        </Button>
                        <UploadButton onUpload={onUpload} />
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={transactionsColumns}
                        data={transactions}
                        filterKey="payee"
                        disabled={isDisabled}
                        onDelete={row => {
                            const ids = row.map(r => r.original.id);
                            deleteTransactions.mutate({ json: { ids } });
                        }}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default TransactionsPage;
