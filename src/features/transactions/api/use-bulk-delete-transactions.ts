import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
    (typeof client.api.transactions)['bulk-delete']['$post']
>;
type RequestType = InferRequestType<
    (typeof client.api.transactions)['bulk-delete']['$post']
>;

export const useBulkDeleteTransactions = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async json => {
            const response = await client.api.transactions['bulk-delete'][
                '$post'
            ]({
                json: {
                    ids: json.json.ids,
                },
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success('Transactions deleted');
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
        onError: () => {
            toast.error('Failed to delete transactions');
        },
    });

    return mutation;
};
