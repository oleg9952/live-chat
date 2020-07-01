import React, { useState, useRef, useEffect } from 'react'
// import { v4 as uuidv4 } from 'uuid'
import style from './ChatWindow.module.scss'

const ChatWindow = ({ closeChat, selectedRoom, nickName, socket, myId }) => {
    // ----- DATA -----
    const [ messages, setMessages ] = useState([])
    const sendMssg = e => {
        e.preventDefault()
        const form = e.currentTarget

        if (!form.message.value.trim()) return

        socket.emit('message', nickName, selectedRoom.roomId, form.message.value)

        form.reset()
    }

    const [ onlineUsers, setOnlineUsers ] = useState([
        {
            userId: myId,
            userName: nickName,
            me: true
        }
    ])

    // ----- UI -----
    const [ toggleActive, setToggleActive ] = useState(false)

    const chatWindowRef = useRef()
    const handleChatClose = e => {
        if (e.target !== chatWindowRef.current) return
        setToggleActive(false)

        // remove current user from the room
        socket.emit('leaveRoom')
        setTimeout(() => {
            closeChat()
        }, 500);
    }

    const mssgHistoryRef = useRef()
    const scrollDown = () => {
        setTimeout(() => {
            mssgHistoryRef.current.scroll({
                top: mssgHistoryRef.current.scrollHeight,
                behavior: 'smooth'
            })
        }, 0);
    }

    useEffect(() => {
        setToggleActive(true)        
        // GET USERS IN CURRENT ROOM
        socket.emit('usersInTheRoom', selectedRoom.roomId)
        socket.on('usersInTheRoom', (users) => {
            const filtered = users
                .filter(user => user.userId !== myId)
                .map(user => {
                    return {
                        ...user,
                        me: false
                    }
                })
            setOnlineUsers([...onlineUsers, ...filtered])
        })
        // get messages
        socket.on('message', (data) => {
            const formated = data.map(item => {
                if (item.userId === myId) {
                    return {
                        userName: item.userName,
                        mssg: item.mssg,
                        own: true
                    }
                } else {
                    return {
                        userName: item.userName,
                        mssg: item.mssg,
                        own: false
                    }
                }
            })

            setMessages([...formated])
            // scrollDown()
        })

        return () => {}
    }, [])

    useEffect(() => {
        scrollDown()
    }, [messages])

    return (
        <div className={`${style.chatwindow} ${toggleActive ? style.active : ''}`}
            ref={chatWindowRef}
            onClick={handleChatClose}
        >
            <div className={style.chatwindow__chat}>
                <div className={style.head}>
                    <i className="far fa-comments"></i>
                    <p>Chat room: { selectedRoom.roomName }</p>
                </div>
                <div className={style.body}>
                    <div className={style.users}>
                        <h1>Online</h1>
                        {
                            onlineUsers.length ?
                            onlineUsers.map(user => {
                                    return user.me ? (
                                        <div className={`${style.user} ${style.me}`}
                                        key={user.userId}
                                    >
                                        <i className="fas fa-user-astronaut"></i>
                                        <p>{ user.userName }</p>
                                    </div>
                                ) : (
                                    <div className={style.user}
                                        key={user.userId}
                                    >
                                        <i className="fas fa-user-astronaut"></i>
                                        <p>{ user.userName }</p>
                                    </div>
                                )
                            }) : ''
                        }
                    </div>
                    <div className={style.chat}>
                        <div className={style.chat__history}
                            ref={mssgHistoryRef}
                        >
                            {
                                messages.length ?
                                messages.map((mssg, index) => {
                                    return mssg.own ? (
                                        <div className={`${style.message} ${style.my__message}`}
                                            key={index}
                                        >
                                            <p className={style.message__sender}>{ mssg.userName }</p>
                                            <p className={style.message__text}>{ mssg.mssg }</p>
                                        </div>
                                    ) : (
                                        <div className={style.message}
                                            key={index}
                                        >
                                            <p className={style.message__sender}>{ mssg.userName }</p>
                                            <p className={style.message__text}>{ mssg.mssg }</p>
                                        </div>
                                    )
                                }) : ''
                            }
                        </div>
                        <form className={style.chatbox}
                            onSubmit={sendMssg}
                        >
                            <input 
                                type="text" 
                                name="message"
                                placeholder="Type in your message..."
                                autoComplete="off"
                            />
                            <button type="submit">
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatWindow
