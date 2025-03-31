import { create } from 'zustand'
import type { NotifBadgeStore } from '~/types/stores/notif-badge-store'

export const useNotifBadgeStore = create<NotifBadgeStore>((set) => ({
    newNotificationsCount: 0,
    newDmsCount: 0,
    setNewNotificationsCount: (a) => set(() => ({ newNotificationsCount: a })),
    setNewDmsCount: (a) => set(() => ({ newDmsCount: a })),
}))

