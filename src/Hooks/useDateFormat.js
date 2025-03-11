import { useCallback } from 'react'

function useDateFormat() {
    const formatDate = useCallback((createdAt) => {
        const createdDate = new Date(createdAt.seconds * 1000).toLocaleDateString()
        const today = new Date().toLocaleDateString()
        const findYesterday = new Date()
        findYesterday.setDate(findYesterday.getDate() - 1)
        const yesterday = findYesterday.toLocaleDateString()

        if (createdDate === today) {
            return "Today"
        }
        else if (createdDate === yesterday) {
            return "Yesterday"
        }
        else {
            return createdDate
        }
    }, [])

    return { formatDate }
}

export default useDateFormat
