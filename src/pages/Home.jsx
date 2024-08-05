import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import Sidebar from '../components/Sidebar';
import Cookies from 'js-cookie';
import './Home.css';
import Header from '../components/Message/Header';
import Main from '../components/Message/Main';
import Bottom from '../components/Message/Bottom';
import audio from '../../public/Xiaomi Ringtone - Sound Effect.mp3';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Call from '../components/Call/Call';
import { host, getUserById } from '../utils/APIRoutes';
import axios from 'axios';

// Define peer connection configuration
const peerConnectionConfig = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302' // You can use other STUN/TURN servers here
    }
  ]
};

const socket = io({host}, {
  withCredentials: true,
});

export default function Home() {
  const [userID, setUserID] = useState("");
  const [username, setUsername] = useState("");
  const [userImage,setUserImage] = useState("");
  const [friendID, setFriendID] = useState("");
  const [friendUsername, setFriendUsername] = useState("");
  const [friendImage, setFriendImage] = useState("");
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [updateSidebar, setUpdateSidebar] = useState(0);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const peerConnection = useRef(null);
  const [callStarted, setCallStarted] = useState(false);
  const iceCandidates = useRef([]);
  const [media, setMedia] = useState({});
  const [time, setTime] = useState(0);
  const [sideOn, setSideOn] = useState(true);
  const [callUsername, setCallUsername] = useState("");
  const [callImage, setCallImage] = useState("");

  async function getUser() {
    try {
        const response = await axios.get(`${getUserById}/${userID}`);
        if (response.data.status == 200) {
          setUserImage(response.data.user.image)
        } else {
          console.error('Error posting piece data:',response);
        }
      } catch (error) {
        console.error('Error during post request:', error);
      }
  }
  useEffect(() => {
    let timeInt;
    if (callStarted) {
      timeInt = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timeInt);
    }
  
    return () => clearInterval(timeInt);
  }, [callStarted,time]);  

  const filteredChatList = messages.filter(item =>
    item.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setUsername(Cookies.get('username') || "");
    setUserID(Cookies.get('userID') || "");
    userID&&getUser();

    if (userID) {
      socket.emit('add-user', userID);
    }

    socket.on('msg-receive', (data) => {
      if (data.to === userID && data.from === friendID) {
        setMessages(prevMessages => [...prevMessages, { 
          fromSelf: false, 
          message: data.message, 
          data: new Date().toLocaleDateString(), 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }]);
        setUpdateSidebar(updateSidebar + 1);
      }
    });

    return () => {
      socket.off('msg-receive');
    };
  }, [userID, friendID]);

  useEffect(() => {
    peerConnection.current = new RTCPeerConnection(peerConnectionConfig);

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { candidate: event.candidate, to: friendID });
      }
    };

    peerConnection.current.ontrack = (event) => {
      console.log('Remote stream received', event.streams[0]);
      remoteStreamRef.current.srcObject = event.streams[0];
    };

    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
    };
  }, [friendID]);

  async function callUser() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    localStreamRef.current.srcObject = stream;

    stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(new RTCSessionDescription(offer));

    const newCall = {
      toUsername: friendUsername,
      toImage: friendImage,
      fromImage: userImage,
      fromUsername: username,
      media: { audio: true, video: false },
      offer: offer,
      from: userID,
      to: friendID,
      username: username
    };
    socket.emit('call-user', newCall);
  }

  async function VideoCallUser() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    localStreamRef.current.srcObject = stream;

    stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(new RTCSessionDescription(offer));

    const newCall = {
      toUsername: friendUsername,
      toImage: friendImage,
      fromImage: userImage,
      fromUsername: username,
      media: { audio: true, video: true },
      offer: offer,
      from: userID,
      to: friendID,
      username: username
    };
    socket.emit('call-user', newCall);
  }

  useEffect(() => {
    socket.on('call-receive', async (data) => {
      if (data.to === userID) {
        console.log(data.fromImage);
        setCallImage(data.fromImage);
        setCallUsername(data.fromUsername);
        toast(
          <div className="custom-toast">
            <audio id="ringtone" className='d-none' autoPlay src={audio} preload="auto"></audio>
            <p>{`${data.username} Calling ... `}</p>
            <div className='d-flex justify-content-evenly align-items-center'>
              <button className='btn btn-success' onClick={() => acceptCall(data)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                </svg>
              </button>
              <button className='btn btn-danger' onClick={() => rejectCall(data.from)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                </svg>
              </button>
            </div>
          </div>,
          {
            autoClose: false,
            closeOnClick: false,
            closeButton: false,
          }
        );
      }
    });

    socket.on('answer-made', async (data) => {
      if (data.to === userID) {
        setCallStarted(true);
        setMedia(data.media);
        setCallImage(data.toImage);
        setCallUsername(data.toUsername);
        setTimeout(() => {
          setTime(time + 1);
        }, 1000);
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        iceCandidates.current.forEach(candidate => {
          peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate))
            .catch(e => console.error('Error adding queued ice candidate', e));
        });
        iceCandidates.current = [];
      }
    });

    socket.on('ice-candidate', (data) => {
      if (peerConnection.current) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate))
          .catch(e => {
            console.error('Error adding received ice candidate', e);
            iceCandidates.current.push(data.candidate);
          });
      } else {
        iceCandidates.current.push(data.candidate);
      }
    });
    socket.on('call-rejected', async () => {
      setCallStarted(false);
      localStreamRef.current.srcObject.getTracks().forEach(track => track.stop());
      remoteStreamRef.current.srcObject.getTracks().forEach(track => track.stop());
      peerConnection.current = new RTCPeerConnection(peerConnectionConfig);

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', { candidate: event.candidate, to: friendID });
        }
      };
  
      peerConnection.current.ontrack = (event) => {
        console.log('Remote stream received', event.streams[0]);
        remoteStreamRef.current.srcObject = event.streams[0];
      };
  
      return () => {
        if (peerConnection.current) {
          peerConnection.current.close();
          peerConnection.current = null;
        }
      };
    })

    return () => {
      socket.off('call-receive');
      socket.off('answer-made');
      socket.off('ice-candidate');
      
    };
  }, [userID]);

  const acceptCall = async (data) => {
    setCallStarted(true);
    setMedia(data.media);
    setTimeout(() => {
      setTime(time + 1);
    }, 1000);
    peerConnection.current = new RTCPeerConnection(peerConnectionConfig);

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { candidate: event.candidate, to: data.from });
      }
    };

    peerConnection.current.ontrack = (event) => {
      console.log('Remote stream received', event.streams[0]);
      remoteStreamRef.current.srcObject = event.streams[0];
    };

    const stream = await navigator.mediaDevices.getUserMedia(data.media);
    localStreamRef.current.srcObject = stream;
    stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(new RTCSessionDescription(answer));

    socket.emit('make-answer', {
      toUsername: data.toUsername,
      toImage: data.toImage,
      fromImage: data.fromImage,
      fromUsername: data.fromUsername,
      media:data.media,
      answer: answer,
      to: data.from,
      from: userID 
      });
    toast.dismiss();
  };

  const rejectCall = (from) => {
    socket.emit('reject-call', { from: from });
    toast.dismiss(); // Dismiss the toast notification
  };

  return (
    <div className='home-container'>
      <Call media={media} callStarted={callStarted} >
        <video ref={localStreamRef} autoPlay playsInline className={media.video?'':'d-none'}></video>
        <video ref={remoteStreamRef} autoPlay playsInline className={media.video?'':'d-none'}></video>
        <img className={!media.video?'':'d-none'} src={callImage} alt="" />
        <h2 className={!media.video?'':'d-none'} >{callUsername}</h2>
        <p>{`${Math.floor(time / 60).toString().padStart(2, '0')} : ${(time % 60).toString().padStart(2, '0')}`}</p>
        <button className="call-button" onClick={()=>{
          setCallStarted(false);
          setCallImage("");
          setCallUsername("");
          localStreamRef.current.srcObject.getTracks().forEach(track => track.stop());
          remoteStreamRef.current.srcObject.getTracks().forEach(track => track.stop());
          rejectCall(friendID);
          rejectCall(userID);
        }} >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
          </svg>
        </button>
      </Call>
      <button className="toggle-button" onClick={()=>{
            document.querySelector('.sidebar-container').classList.toggle('left-out');
            setSideOn(!sideOn);
          }}>
        
        {sideOn?<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                </svg>:
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                </svg>}
      </button>
      <Sidebar 
        username={username}
        userImage={userImage}
        setSideOn={setSideOn}
        sideOn={sideOn}
        userID={userID} 
        setFriendID={setFriendID} 
        setFriendUsername={setFriendUsername} 
        setFriendImage={setFriendImage} 
        updateSidebar={updateSidebar}
      />
      <div className="content-container">
        {friendUsername && <Header image={friendImage} friendUsername={friendUsername} setSearchQuery={setSearchQuery} callUser={callUser} VideoCallUser={VideoCallUser} />}
        <Main userID={userID} friendID={friendID} messages={filteredChatList.length ? filteredChatList : messages} setMessages={setMessages} />
        {friendUsername && <Bottom userID={userID} friendID={friendID} socket={socket} setMessages={setMessages} updateSidebar={updateSidebar} setUpdateSidebar={setUpdateSidebar} />}
      </div>
    </div>
  );
}
