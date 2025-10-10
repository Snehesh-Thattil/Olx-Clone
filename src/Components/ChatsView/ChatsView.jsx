import React, { useState } from 'react'
import { BsSend } from 'react-icons/bs'
import './ChatsView.css'

function ChatsView() {
    const [chatSelected, setChatSelected] = useState(true)

    function handleSendMessage(e) {
        e.preventDefault()
        console.log('Working')
    }

    return (
        <div className='ChatsView'>
            <div className="chats-list">
                <p className="title">Chats</p>

                <div className="cards">
                    <div className="card">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                        <p>Snehesh Thattil</p>
                    </div>

                    <div className="card">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                        <p>Snehesh Thattil</p>
                    </div>

                    <div className="card">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                        <p>Snehesh Thattil</p>
                    </div>

                    <div className="card">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                        <p>Snehesh Thattil</p>
                    </div>

                    <div className="card">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                        <p>Snehesh Thattil</p>
                    </div>
                </div>
            </div>

            <div className="chat-box">
                {chatSelected ?
                    <div className='chats'>
                        <p className="title">Snehesh Thattil <span>Online</span> </p>

                        <div className="chats-container">
                            <p className='self'>Hi</p>
                            <p>Hello</p>
                        </div>

                        <form onSubmit={handleSendMessage} className="input-section">
                            <input type="text" placeholder='Type your message ...' minLength={1} maxLength={50000} />

                            <button type='submit' className="icon">
                                <BsSend />
                            </button>
                        </form>
                    </div>
                    :
                    <div className="no-selection">
                        <h2> Hi, Snehesh Thattil </h2>
                        <h4> select a chat to start conversation </h4>
                    </div>
                }
            </div>
        </div>
    )
}

export default ChatsView
