import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import io from "socket.io-client";
import { CiCircleMinus, CiTrash } from "react-icons/ci";

import {
  Conversation,
  ConversationHeader,
  Sidebar,
  ConversationList,
  ChatContainer,
  MainContainer,
  MessageList,
  Message,
  Search,
  MessageInput,
  Avatar,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import TopBar from "../../components/TopBar/TopBar";
import { UserContext } from "../../App";

const ENDPOINT = "http://localhost:5555";
var socket, selectedChatCompare;


const Chat = () => {
  const {currentUser} = useContext(UserContext)
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [showLeaveScreen, setLeaveScreen] = useState(false);


  const {token} = useContext(UserContext)
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch(`http://localhost:5555/users`, 
        {
          headers: {
            Authorization: `${token}`,
          },
        });
        const data = await response.json();
        console.log("Retrieved all users: ", data)
        setAllUsers(data);
      } catch (error) {
        console.error("Error fetching all users:", error.message);
      }
    };
    fetchAllUsers();
  }, []);

  useEffect(() => {
    const fetchUserChats = async () => {
      try {
        const response = await fetch(
          `http://localhost:5555/chats/user/${currentUser._id}`
        ); // Fetch user's chats from backend
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error("Error fetching user chats:", error.message);
      }
    };
    fetchUserChats();
  }, [currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;

      try {//s
        setLoading(true);

        const { data } = await axios.get(
          `http://localhost:5555/chats/${selectedChat._id}`, 
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setMessages(data);
        setLoading(false);

        socket.emit("join chat", selectedChat._id);
      } catch (error) {
        console.error("Error fetching chat messages:", error.message);
        // Handle error
      }
    };

    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", currentUser);
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
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat
      ) {
        console.log("HERE");
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
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
          sender: currentUser._id,
        };

        console.log("Message data we are sending: ", messageData)
        const response = await fetch("http://localhost:5555/chats/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData)
        });

        if (response.ok) {
          // If the response is successful, clear the new message input field
          setNewMessage("");
          const data = await response.json();
          data.users = selectedChat.participants;
          socket.emit("new message", data);
          setMessages([...messages, data]);
          // Handle the response data as needed
        } else {
          // Handle errors if any
          throw new Error("Failed to send message");
        }
      } catch (error) {
        console.error("Error sending message:", error.message);
        // Handle error
      }
    }
  };

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery.trim() !== "") {
      const filtered = allUsers.filter((user) =>
        user.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [searchQuery]);

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

  const handleUserClick = async (clickedUser) => {
    try {
      // Create a new chat with the clicked user
      const response = await fetch(`http://localhost:5555/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participants: [currentUser._id, clickedUser._id],
          name: `Chat between ${currentUser.name} and ${clickedUser.name}`,
        }),
      });

      if (response.ok) {
        const newChat = await response.json();

        // Add the new chat to the list of chats
        setChats((prevChats) => [...prevChats, newChat]);

        // Select the newly created chat
        setSelectedChat(newChat);
      } else {
        throw new Error("Failed to create chat");
      }
    } catch (error) {
      console.error("Error creating chat:", error.message);
    }
  };

  const handleClick = () => {
    setLeaveScreen(true);
  };

  const handleCloseModal = async () => {
    try {
      console.log(currentUser._id);
      await axios.delete(`http://localhost:5555/chats/${selectedChat._id}`, { data: { _id: currentUser._id}});
      setLeaveScreen(false);
      
      // Remove the deleted chat from the chats state
      setChats(prevChats => prevChats.filter(chat => chat._id !== selectedChat._id));
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div>
      <TopBar />
      <MainContainer
        responsive
        style={{
          height: "100vh",
        }}
      >
        <Sidebar position="left">
          <Search
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e)}
          />
          {filteredUsers.length > 0 && (
            <ConversationList>
              {filteredUsers.map((user) => (
                <Conversation
                  key={user._id}
                  name={user.name}
                  active={true}
                  onClick={() => handleUserClick(user)}
                ></Conversation>
              ))}
            </ConversationList>
          )}
          <ConversationList>
            {chats.map((chat) => (
              <Conversation
                key={chat._id}
                name={chat.name}
                active={true}
                onClick={() => setSelectedChat(chat)}
              >
                <Avatar
                  name={currentUser.name}
                  src={
                    "https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                  }
                />
              </Conversation>
            ))}
          </ConversationList>
        </Sidebar>

        {/* Render messages for the selected chat */}
        {selectedChat && (
          <>
            <ChatContainer>
              <ConversationHeader>
                <ConversationHeader.Content userName={selectedChat.name} />
                <ConversationHeader.Actions>
                <CiCircleMinus size={40} onClick={handleClick} />
                  {showLeaveScreen && (
                    <div className="modal-overlay">
                      <div className="popup-box">
                        {/* Your pop-up screen content goes here */}
                        <div className="popup-content">
                          Are you sure you want to leave the groupchat?
                          <button onClick={handleCloseModal}>Leave</button>
                        </div>
                      </div>
                    </div>
                  )}
                </ConversationHeader.Actions>
              </ConversationHeader>
              <MessageList>
                {messages.map((message) => (
                  <React.Fragment key={message._id}>
                    {/*<MessageSeparator content={new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />*/}
                    <Message
                      model={{
                        direction:
                          currentUser._id === message.sender
                            ? "outgoing"
                            : "incoming",
                        message: message.content,
                        sender: message.sender,
                      }}
                    >
                      {currentUser._id !== message.sender && (
                        <Avatar
                          name={message.sender}
                          src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                        />
                      )}
                    </Message>
                  </React.Fragment>
                ))}
              </MessageList>
              <MessageInput
                placeholder="Type message here"
                onChange={(e) => setNewMessage(e)}
                onSend={sendMessage}
              />
            </ChatContainer>
            {/*<div>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button onClick={sendMessage}>Send</button>
                    </div>*/}
          </>
        )}
      </MainContainer>
    </div>
  );
};

export default Chat;