import { useEffect } from 'react'
import { auth } from '../Firebase/firebase-config'
import { onAuthStateChanged } from 'firebase/auth'
import { getDatabase, ref as rtdbRef, onValue, set, onDisconnect, serverTimestamp } from 'firebase/database';

function usePresence() {
    useEffect(() => {
        const db = getDatabase()

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) return

            const userStatusRef = rtdbRef(db, `status/${user?.uid}`)
            const connectedRef = rtdbRef(db, `.info/connected`)

            const onConnected = (snap) => {
                if (snap.val() === true) {
                    // Ensure removed any existing onDisconnect (create new one)
                    onDisconnect(userStatusRef).cancel().catch(() => { })

                    // Register onDisconnect to set offline and server timestamp
                    onDisconnect(userStatusRef)
                        .set({
                            state: 'offline',
                            lastSeen: serverTimestamp()
                        })
                        .catch((err) => console.error('onDisconnect registration failed', err))

                    // Immediately set the user as online
                    set(userStatusRef, {
                        state: 'online',
                        lastSeen: serverTimestamp()
                    }).catch((err) => console.error('set presence failed', err))
                }
            }

            // Subscribe to connection status
            onValue(connectedRef, onConnected)

        })

        return () => unsubscribeAuth()
    }, [])
}

export default usePresence
