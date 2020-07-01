import React, { useRef } from 'react'
import style from './NewChatRoom.module.scss'

const NewChatRoom = ({ newRoomModal, toggleModal, createRoom }) => {
    const modalRef = useRef()
    const handleModalClose = e => {
        if (e.target !== modalRef.current) return
        toggleModal()
    }

    return (
        <div className={`${style.newroom} ${newRoomModal ? style.active : ''}`}
            onClick={handleModalClose}
            ref={modalRef}
        >
            <form className={`${style.modal}`}
                onSubmit={createRoom}
            >
                <input 
                    type="text" 
                    name="roomname"
                    placeholder="Name your room and press Enter"
                    className="z-depth-3"
                />
            </form>
        </div>
    )
}

export default NewChatRoom
