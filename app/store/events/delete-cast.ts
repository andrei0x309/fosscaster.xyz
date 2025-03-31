import { create } from 'zustand'

export const useDeleteCastEvent = create<
{
    event: { hash: string }
    sendDeleteCast: ({ hash }: { hash: string }) => void
}
>((set) => ({
    event: {} as { hash: string },
    sendDeleteCast: ({ hash }: { hash: string}) => set(() => ({ event: { hash } }))
}))