import React, { useRef } from 'react'
import style from './NickName.module.scss'

const NickName = ({ nickNameModal, toggleNickNameModal, setUserNickName }) => {
    const modalRef = useRef()
    const handleModalClose = e => {
        if (e.target !== modalRef.current) return
        toggleNickNameModal()
    }

    return (
        <div className={`${style.newroom} ${nickNameModal ? style.active : ''}`}
            ref={modalRef}
            onClick={handleModalClose}
        >
            <form className={`${style.modal}`}
                onSubmit={setUserNickName}
            >
                <input 
                    type="text" 
                    name="nickname"
                    placeholder="Enter your nickname and press enter"
                    className="z-depth-3"
                />
            </form>
        </div>
    )
}

export default NickName
