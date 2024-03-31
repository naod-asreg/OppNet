import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const ENDPOINT = "http://localhost:5555";
var socket, selectedChatCompare;
const user = JSON.parse(localStorage.getItem("user"));


const Chat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);  

  useEffect(() => {
    const fetchUserChats = async () => {
        try {
            const response = await fetch(`http://localhost:5555/chats/user/${user.userId}`); // Fetch user's chats from backend
            const data = await response.json();
            setChats(data); 
        } catch (error) {
            console.error('Error fetching user chats:', error.message);
        }
    };
    fetchUserChats();
}, [user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;

      try {

        setLoading(true);

        const { data } = await axios.get(`http://localhost:5555/chats/${selectedChat._id}`);
        setMessages(data);
        setLoading(false);

        socket.emit("join chat", selectedChat._id);
      } catch (error) {
        console.error('Error fetching chat messages:', error.message);
        // Handle error
      }
    };

    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // Clean up function to close the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat) {
        console.log("HERE");
      } else {
        setMessages(prevMessages => [...prevMessages, newMessageReceived]);
    }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = async (event) => {
    console.log(newMessage);
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const messageData = {
          content: newMessage,
          chat: selectedChat._id,
          sender: user.userId
        };
      
        const response = await fetch('http://localhost:5555/chats/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        });
      
        if (response.ok) {
          // If the response is successful, clear the new message input field
          setNewMessage('');
          const data = await response.json();
          data.users = selectedChat.participants;
          socket.emit("new message", data);
          setMessages([...messages, data]);
          // Handle the response data as needed
        } else {
          // Handle errors if any
          throw new Error('Failed to send message');
        }
      

      } catch (error) {
        console.error('Error sending message:', error.message);
        // Handle error
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
return (
  <div>
      {/* Render list of chats */}
      <ul>
          {chats.map(chat => (
              <li key={chat._id} onClick={() => setSelectedChat(chat)}>
                  <span>{chat.name}</span>
              </li>
          ))}
      </ul>

      {/* Render messages for the selected chat */}
      {selectedChat && (
          <div>
              <h3>Messages:</h3>
              <ul>
                  {messages.map(message => (
                      <li key={message._id}>
                          <span>{message.sender}</span>: {message.content}
                      </li>
                  ))}
              </ul>
              {/* Input field to send new message */}
              <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
              />
              <button onClick={sendMessage}>Send</button>
          </div>
      )}
  </div>
);
};

export default Chat;
