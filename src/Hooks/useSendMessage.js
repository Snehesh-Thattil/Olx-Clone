import { useState } from 'react'
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebase-config';
import toast from 'react-hot-toast';

function useSendMessage() {
    const [loading, setLoading] = useState(false)

    const send = async (conversationId, senderId, text) => {
        setLoading(true)
        try {
            const msgRef = collection(db, 'conversations', conversationId, 'messages')
            await addDoc(msgRef, {
                senderId,
                text,
                type: 'text',
                createdAt: serverTimestamp(),
            })

            // Update chat metadata
            await updateDoc(doc(db, 'conversations', conversationId), {
                lastMessage: text,
                updatedAt: serverTimestamp(),
            })
        }
        catch (err) {
            toast.error(`Error sending message ${err?.message}`)
        }
        finally {
            setLoading(false)
        }
    }

    return { send, loading }
}

export default useSendMessage

