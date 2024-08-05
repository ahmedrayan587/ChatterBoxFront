import React, { useState, useRef, useEffect } from 'react';
import './Header.css'
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  withCredentials: true,
});

export default function Header({image, friendUsername, setSearchQuery, callUser, VideoCallUser}) {



    
    return (
        <div className="profile">
          <div className="profile-image">
            <img src={image} alt="Profile Picture" />
          </div>
          <div className="profile-info">
            <span className="profile-name">{friendUsername}</span>
          </div>
          <div className="profile-actions">
            <button className="call-button" onClick={VideoCallUser}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-camera-video" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z"/>
              </svg>
            </button>
            <button className="call-button" onClick={callUser}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
              </svg>
            </button>
            <div className="search-header">
              <input type="text" placeholder="Search" onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </div>
      )
}
