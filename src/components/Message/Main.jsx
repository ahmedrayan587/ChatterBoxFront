import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import './Main.css';
import { getAllMessagesRoute } from '../../utils/APIRoutes';
import Message from './Message';

export default function Main({ userID, friendID, messages, setMessages }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function getAllMessages() {
      try {
        const response = await axios.post(getAllMessagesRoute, {
          from: userID,
          to: friendID
        });
        if (response.data.status === 200) {
          setMessages(response.data.projectMessages);
        } else {
          console.error('Error fetching messages:', response);
        }
      } catch (error) {
        console.error('Error during post request:', error);
      }
    }

    if (userID && friendID) {
      getAllMessages();
    }
  }, [userID, friendID, setMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  let prevDate = null;
  return (
    <div className='main-container'>
      <div className="chat-text text-capitalize">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-chat-text-fill" viewBox="0 0 16 16">
        <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M4.5 5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1z"/>
      </svg>
        ChatterBox
      </div>
      {messages.map((item, index) => {
        const showDate = prevDate !== item.date;
        prevDate = item.date;
        return(
          <React.Fragment key={index}>
            {showDate && <div className="date-container"><p className="date-separator">{item.date}</p></div>}
            <Message message={item.message} date={item.date} time={item.time} fromSelf={item.fromSelf} />
          </React.Fragment>
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
