import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
import storageService, { getUserName, setUserName } from './Utils/localStorageService'
import './App.scss';
import RoomItem from './Components/RoomItem/RoomItem';
import NewChatRoom from './Components/NewChatRoom/NewChatRoom';
import ChatWindow from './Components/ChatWindow/ChatWindow';
import NickName from './Components/NickName/NickName';
import { config } from './Config/config';

const socket = io.connect(config.PROD)

function App() {
	// ----- DATA -----
	const [ myId, setMyId ] = useState(null)
	const [ nickName, setNickName ] = useState(null)
	const setUserNickName = e => {
		e.preventDefault()
		const form = e.currentTarget

		storageService(setUserName, form.nickname.value)
		setNickName(form.nickname.value)

		form.reset()
		toggleNickNameModal()
	}

	const [ rooms, setRooms ] = useState([])
	const createRoom = e => {
		e.preventDefault()
		const form = e.currentTarget

		// CREATE ROOM SOCKET
		socket.emit('createRoom', form.roomname.value)

		toggleModal()
		form.reset()
	}

	const [ selectedRoom, setSelectedRoom] = useState(null)
	const selectRoom = room => {
		if (!nickName) {
			setNickNameModal(true)
		} else {
			socket.emit('joinRoom', nickName, room.roomId)
			setSelectedRoom(room)
		}
	}

	// ----- UI -----
	const [ newRoomModal, setNewRoomModal ] = useState(false)
	const toggleModal = () => setNewRoomModal(!newRoomModal)

	const [ nickNameModal, setNickNameModal ] = useState(false)
	const toggleNickNameModal = () => setNickNameModal(!nickNameModal)

	const closeChat = () => setSelectedRoom(null)

	useEffect(() => {
		// ***** SOCKET.IO EVENTS *****
		// GET MY ID
		socket.on('getMyId', (id) => {
			setMyId(id)
		})

		// GET ROOMS
		socket.emit('getRooms')
		socket.on('getRooms', data => {
			setRooms(data)
		})

		const name = storageService(getUserName)
		if (!name) return
		setNickName(name)
	}, [])

	return (
		<div className="App">
			<div className="App__head z-depth-1">
				<h1 className="App__head-title">Chats</h1>
				<a className="btn-floating btn-large waves-effect waves-light red"
					onClick={toggleModal}
				>
					<i className="fas fa-plus"></i>
				</a>
			</div>
			
			<div className="App__chats">
				{
					rooms.length ? 
					rooms.map(room => (
						<RoomItem 
							key={room.roomId}
							room={room}
							selectRoom={selectRoom}
						/>
					)) : ''
				}
			</div>
			<NewChatRoom 
				newRoomModal={newRoomModal}
				toggleModal={toggleModal}
				createRoom={createRoom}
			/>
			{
				selectedRoom ?
				<ChatWindow 
					closeChat={closeChat}
					selectedRoom={selectedRoom}
					socket={socket}
					nickName={nickName}
					myId={myId}
				/> : ''
			}	
			<NickName 
				nickNameModal={nickNameModal}
				toggleNickNameModal={toggleNickNameModal}
				setUserNickName={setUserNickName}
			/>
		</div>
	);
}

export default App;
