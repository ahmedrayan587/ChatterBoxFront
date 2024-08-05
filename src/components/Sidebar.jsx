import React, { useEffect, useState } from 'react'
import SidebarItem from './SidebarItem'
import { getAllUsersRoute } from '../utils/APIRoutes';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ username, userImage, userID, setFriendID, setFriendUsername, setFriendImage, updateSidebar, setSideOn, sideOn }) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [chatList, setChatList] = useState([]);
    useEffect(() =>{
        userID&&getAllUsers();
    },[userID,updateSidebar])
    async function getAllUsers() {
        try {
            const response = await axios.get(`${getAllUsersRoute}/${userID}`);
            if (response.data.status == 200) {
              setChatList(response.data.users)
            } else {
              console.error('Error posting piece data:',response);
            }
          } catch (error) {
            console.error('Error during post request:', error);
          }
    }
  
    const filteredChatList = chatList.filter(item =>
      item.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  return (
    <div className='sidebar-container'>
      <div className="chat-item side-main">
        <div className="profile-picture">
          <img src={userImage} alt="Profile Picture" />
        </div>
        <div className="chat-content">
          <div className="chat-name">{username}</div>
        </div>
        <button className="update-button" onClick={()=>{navigate('/');}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"/>
            <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
          </svg>
        </button>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>
      <div className="chat-list">
      {filteredChatList.map((item, index) => (
          <SidebarItem 
            setSideOn={setSideOn}
            sideOn={sideOn}
            key={index}
            userID = {userID}
            image={item.image}
            name={item.username}
            id={item._id}
            setFriendID={setFriendID}
            setFriendUsername={setFriendUsername} 
            setFriendImage={setFriendImage} 
          />
        ))}
      </div>
    </div>
  )
}
