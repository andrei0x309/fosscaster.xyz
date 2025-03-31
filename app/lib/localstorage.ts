import type { T_USER_DATA } from '~/types/stores/store'

export const persistUserData = (data: T_USER_DATA) => {
    localStorage.setItem('mainUserData', JSON.stringify(data))
}

export const persistAllUsersData = (data: T_USER_DATA[]) => {
    localStorage.setItem('allUsersData', JSON.stringify(data))
}

export const persistDarkMode = (isDarkMode: boolean) => {
    localStorage.setItem('isDarkMode', isDarkMode.toString())
}

export const clearUserData = () => {
    localStorage.removeItem('mainUserData')
}

export const clearAllUsersData = (fid?: number) => {
    if (fid) {
        const data = localStorage.getItem('allUsersData')
        if(!data) return
        const allUsersData = JSON.parse(data)
        const updatedAllUsersData = allUsersData.filter((user: any) => user.fid !== fid)
        persistAllUsersData(updatedAllUsersData)
    } else {
        localStorage.removeItem('allUsersData')
    }
    localStorage.removeItem('allUsersData')
}