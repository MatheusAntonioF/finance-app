import { z } from 'zod';
import { insertAccountSchema } from '@/db/schema';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useNewAccount } from '../hooks/use-new-accounts';
import { AccountForm } from './account-form';
import { useCreateAccount } from '../api/use-create-accounts';

const formSchema = insertAccountSchema.pick({ name: true });

type FormValues = z.input<typeof formSchema>;

export const NewAccountSheet = () => {
    const { isOpen, onClose } = useNewAccount();

    const mutation = useCreateAccount();

    const onSubmit = (values: FormValues) => {
        mutation.mutate(
            { name: values.name },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>New Account</SheetTitle>
                    <SheetDescription>
                        Create a new account to track your transactions
                    </SheetDescription>
                </SheetHeader>
                <AccountForm
                    onSubmit={onSubmit}
                    disabled={mutation.isPending}
                    defaultValues={{ name: '' }}
                />
            </SheetContent>
        </Sheet>
    );
};
