import React, { useEffect, useState } from 'react'
import { getAllMessagesRoute } from '../utils/APIRoutes';
import axios from 'axios';

export default function SidebarItem({userID, id,setFriendID, setFriendUsername, setFriendImage, image, name, setSideOn, sideOn}) {
  const [lastMessage, setLastMessage] = useState();
  useEffect(() => {
    async function getAllMessages() {
      try {
        const response = await axios.post(getAllMessagesRoute, {
          from: userID,
          to: id
        });
        if (response.data.status === 200) {
          setLastMessage(response.data.projectMessages[response.data.projectMessages.length-1]);
        } else {
          console.error('Error fetching messages:', response);
        }
      } catch (error) {
        console.error('Error during post request:', error);
      }
    }
      getAllMessages();
  }, [userID,id,lastMessage]);
  return (
    <div className="chat-item" onClick={()=>{
      document.querySelector('.sidebar-container').classList.add('left-out');
      setSideOn(!sideOn);
      setFriendID(id);
      setFriendImage(image);
      setFriendUsername(name);
      }}>
          <div className="profile-picture">
            <img src={image} alt="Profile Picture" />
          </div>
          <div className="chat-content">
            <div className="chat-name">{name}</div>
            <div className="chat-message">{lastMessage&&lastMessage.message}</div>
            <div className="chat-time">{lastMessage&&lastMessage.time}</div>
          </div>
        </div>
  )
}
