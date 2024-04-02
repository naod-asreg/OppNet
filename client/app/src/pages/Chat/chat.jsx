import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import {
  Conversation,
  ConversationHeader,
  Sidebar,
  ConversationList,
  ChatContainer,
  MainContainer,
  MessageList,
  MessageSeparator,
  Message,
  Search,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import TopBar from "../../components/TopBar/TopBar";

const ENDPOINT = "http://localhost:5555";
var socket, selectedChatCompare;
const user = JSON.parse(localStorage.getItem("user"));

const Chat = () => {
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

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch(`http://localhost:5555/users`);
        const data = await response.json();
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
          `http://localhost:5555/chats/user/${user.userId}`
        ); // Fetch user's chats from backend
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error("Error fetching user chats:", error.message);
      }
    };
    fetchUserChats();
  }, [user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;

      try {
        setLoading(true);

        const { data } = await axios.get(
          `http://localhost:5555/chats/${selectedChat._id}`
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
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // Clean up function to close the socket connection when the component unmounts
    return () => {
      socket.disconnect();
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
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
          sender: user.userId,
        };

        const response = await fetch("http://localhost:5555/chats/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData),
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
      setFilteredUsers(chats);
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
          participants: [user.userId, clickedUser.userId],
          name: `Chat between ${user.name} and ${clickedUser.name}`,
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
  
  return (
    <div>
      <TopBar/>
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
          <ConversationList>
            {filteredUsers.map((user) => (
              <Conversation
                key={user._id}
                name={user.name}
                active={true}
                onClick={
                  () => handleUserClick(user)
                }
              ></Conversation>
            ))}
          </ConversationList>
          <ConversationList>
            {chats.map((chat) => (
              <Conversation
                key={chat._id}
                name={chat.name}
                active={true}
                onClick={() => setSelectedChat(chat)}
              ></Conversation>
            ))}
          </ConversationList>
        </Sidebar>

        {/* Render messages for the selected chat */}
        {selectedChat && (
          <>
            <ChatContainer>
              <ConversationHeader>
              
            <ConversationHeader.Content
              userName={selectedChat.name}
            />
              </ConversationHeader>
              <MessageList>
                {messages.map((message) => (
                  <React.Fragment key={message._id}>
                    {<MessageSeparator content={message.timestamp} />}
                    <Message
                      model={{
                        direction:
                          message.sender === "Zoe" ? "incoming" : "outgoing",
                        message: message.content,
                        sender: message.sender,
                      }}
                    ></Message>
                  </React.Fragment>
                ))}
              </MessageList>
              <MessageInput placeholder="Type message here"  onChange={(e) => setNewMessage(e)} onSend={sendMessage}/>
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
