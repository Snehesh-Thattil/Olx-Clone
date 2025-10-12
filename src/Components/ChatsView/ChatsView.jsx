import React, { useContext, useEffect, useRef, useState } from 'react'
import './ChatsView.css'
import toast from 'react-hot-toast'
import { BsCircleFill, BsSend } from 'react-icons/bs'
import { collection, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { getDatabase, onValue, ref as rtdbRef } from 'firebase/database'
import { db } from '../../Firebase/firebase-config'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../Store/AuthContext'
import useSendMessage from '../../Hooks/useSendMessage'
import useTimeFormat from '../../Hooks/useTimeFormat'

function ChatsView() {
    const location = useLocation()
    const [chatSelected, setChatSelected] = useState(location?.state?.id || null)
    const [userStatus, setUserStatus] = useState(null)
    const [conversations, setConversations] = useState([])
    const [messages, setMessages] = useState([])
    const { user } = useContext(AuthContext)
    const textRef = useRef()
    const messagesEndRef = useRef(null)

    const { send, loading } = useSendMessage()
    const { timeAgo } = useTimeFormat()
    const navigate = useNavigate()

    // Subscribe to chatSelected user's online status
    useEffect(() => {
        console.log(chatSelected)
        if (!chatSelected?.otherUser?.id) return

        const otherId = chatSelected.otherUser.id
        const db = getDatabase()
        const statusRef = rtdbRef(db, `status/${otherId}`)

        const unsubscribe = onValue(statusRef, (snapshot) => {
            const val = snapshot.val()
            setUserStatus(val || { state: 'offline', lastSeen: null })
        }, (err) => console.error('status onValue error :', err))

        return () => unsubscribe()
    }, [chatSelected])

    // Real-time listener for conversations
    useEffect(() => {
        if (!user?.uid) return

        const conversationsRef = collection(db, "conversations")
        const q = query(conversationsRef, where("participants", "array-contains", user?.uid))

        // Set up the listener
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            try {
                if (snapshot.empty) {
                    return setConversations([])
                }

                // Fetch other user details in parallel
                const conversationsData = await Promise.all(
                    snapshot.docs.map(async (docSnap) => {
                        const conversation = { id: docSnap.id, ...docSnap.data() }
                        const otherUserId = conversation.participants.find(id => id !== user.id)

                        const userRef = collection(db, "users")
                        const q = query(userRef, where('id', '==', otherUserId))
                        const userSnap = await getDocs(q)
                        const otherUser = !userSnap.empty ? userSnap.docs[0].data() : null

                        return {
                            ...conversation,
                            otherUser: otherUser ? { id: otherUserId, ...otherUser } : null,
                        }
                    })
                )
                setConversations(conversationsData)
            }
            catch (err) {
                toast.error(`Error fetching conversations: ${err.message}`)
            }
        })

        return () => unsubscribe()
    }, [user])

    // Real-time listener for messages
    useEffect(() => {
        if (!chatSelected) return

        const convRef = collection(db, "conversations", chatSelected.id, "messages")
        const q = query(convRef, orderBy('createdAt', 'asc'))

        // Set up the listener
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            try {
                if (!snapshot.empty) {
                    const msgDatas = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                    setMessages(msgDatas)
                }
                else {
                    setMessages([])
                }
            }
            catch (err) {
                toast.error(`Error fetching chats ${err.message}`)
            }
        })

        return () => unsubscribe()
    }, [chatSelected])

    // Handle message sending by the user
    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!textRef.current.value.trim()) return

        send(chatSelected.id, user.id, textRef.current.value)
        textRef.current.value = ''
    }

    // Scroll nearest to the last message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest'
        })
    }, [messages])


    // JSX
    return (
        <div className='ChatsView'>
            <div className="chats-list">
                <p className="title">Chats</p>

                {conversations.length > 0 ?
                    <div className="cards">
                        {conversations?.map((conv, index) => {
                            return (
                                <div className="card" key={index} onClick={() => setChatSelected(conv)}>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                                    <div className='details'>
                                        <h3>{conv?.otherUser?.username}</h3>
                                        <p>{conv?.lastMessage}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    :
                    <div className='empty-list'>
                        <h4> You don't have any conversation yet.</h4>
                        <button onClick={() => navigate('/')}>Explore Something</button>
                    </div>
                }
            </div>

            <div className="chat-box">
                {chatSelected ?
                    <div className='chats'>
                        <p className="title">{chatSelected.otherUser?.username}
                            <span className="status">
                                <BsCircleFill className={userStatus?.state} />
                                {userStatus?.state === 'online' ? 'Online' :
                                    userStatus?.lastSeen ? `Last seen ${timeAgo(userStatus.lastSeen)}` :
                                        'Offline'}
                            </span>
                        </p>

                        <div className="chats-container">
                            {messages?.map((msg, index) => {
                                return (
                                    <p className={msg.senderId === user.uid ? 'self' : null} key={index}>{msg.text}</p>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="input-section">
                            <input type="text" ref={textRef} placeholder='Type your message ...' minLength={1} maxLength={750} />

                            <button type='submit' className="icon">
                                {loading ? '...' : <BsSend />}
                            </button>
                        </form>
                    </div>
                    :
                    <div className="no-selection">
                        <h2> Hi, {user.displayName} </h2>
                        <h4> select a chat to start conversation </h4>
                    </div>
                }
            </div>
        </div>
    )
}

export default ChatsView
