import { useCallback } from "react"

function useTimeFormat() {
    const timeAgo = useCallback((timestamp) => {
        if (!timestamp) return 'unknown'

        const diff = Date.now() - timestamp
        const s = Math.floor(diff / 1000)
        if (s < 60) return 'just now'
        const m = Math.floor(s / 60)
        if (m < 60) return `${m}m ago`
        const h = Math.floor(m / 60)
        if (h < 24) return `${h}h ago`
        const d = Math.floor(h / 24)
        return `${d}d ago`
    }, [])

    return { timeAgo }
}

export default useTimeFormat
