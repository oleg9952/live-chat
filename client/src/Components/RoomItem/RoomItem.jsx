import React from 'react'
import style from './RoomItem.module.scss'

const ChatItem = ({ room, selectRoom }) => {
    return (
        <div className={`${style.chatitem} z-depth-1`}
            onClick={selectRoom.bind(this, room)}
        >
            <i className="far fa-comments"></i>
            <p>{ room.roomName }</p>
            <i className="fas fa-wifi"></i>
        </div>
    )
}

export default ChatItem
