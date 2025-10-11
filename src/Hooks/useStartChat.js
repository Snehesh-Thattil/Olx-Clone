import { useState } from 'react'
import { serverTimestamp, collection, doc, getDoc, setDoc, addDoc, updateDoc } from 'firebase/firestore'
import { db } from '../Firebase/firebase-config'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function useStartChat() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const start = async (userId, sellerId, adTitle) => {
        setLoading(true)

        try {
            // Generate consistent conversationId
            const conversationId = [userId, sellerId].sort().join('_')

            // References
            const conversationDocRef = doc(db, 'conversations', conversationId)
            const msgRef = collection(db, 'conversations', conversationId, 'messages')

            const existing = await getDoc(conversationDocRef)

            if (!existing.exists()) {
                // Create new conversation with custom ID
                await setDoc(conversationDocRef, {
                    conversationId,
                    participants: [userId, sellerId],
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    lastMessage: `Hey there, I'm interested in the product you posted with the ad title: ${adTitle}.`,
                })

                // Add the first message
                await addDoc(msgRef, {
                    senderId: userId,
                    text: `Hey there, I'm interested in the product you posted with the ad title: ${adTitle}.`,
                    type: 'text',
                    createdAt: serverTimestamp(),
                })
            }
            else {
                // Add message to existing conversation
                await addDoc(msgRef, {
                    senderId: userId,
                    text: `Hey there, I'm interested in the product you posted with the ad title: ${adTitle}.`,
                    type: 'text',
                    createdAt: serverTimestamp(),
                })

                // Update conversation metadata
                await updateDoc(conversationDocRef, {
                    lastMessage: `Hey there, I'm interested in the product you posted with the ad title: ${adTitle}.`,
                    updatedAt: serverTimestamp(),
                })

                toast('Conversation already exists in your chat list.')
            }

            navigate('/chats', { state: { id: conversationId } })
        }
        catch (err) {
            toast.error(`Something went wrong: ${err.message}`)
        }
        finally {
            setLoading(false)
        }
    }

    return { start, loading }
}

export default useStartChat