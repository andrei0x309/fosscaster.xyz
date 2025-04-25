import { create } from 'zustand'
import type { T_META_TAG, MetaStore, T_META_DATA } from '~/types/stores/store'


export const useMetaStore = create<MetaStore>((set) => ({
    title: '',
    description: '',
    metatags: [],
    setMeta: (data: T_META_DATA) => set(() => ({ title: data.title, description: data.description})),
    setMetatags: (data: T_META_TAG[]) => set(() => ({ metatags: data }))
}))