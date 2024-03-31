import React from "react";
import io from "socket.io-client";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  MessageSeparator,
  Avatar,
  ExpansionPanel,
  Conversation,
  VoiceCallButton,
  TypingIndicator,
  VideoCallButton,
  Sidebar,
  Search,
  InfoButton,
  ConversationList
} from "@chatscope/chat-ui-kit-react";
//change
function Chat() {
  const user = JSON.parse(localStorage.getItem("user"));
  const socket = io.connect("http://localhost:5555"); // Connect to Socket.io server
  const userId = user.userId;

  const Messages = [
    React.createElement(MessageSeparator, {
      key: "separator1",
      content: "Saturday, 30 November 2019",
    }),
    React.createElement(Message, {
      key: "msg1",
      model: { message: "Hi", sender: "Akane", sentTime: "10:00" },
    }),
  ];
  // Function to join a chat room
  const joinChatRoom = (room) => {
    socket.emit("join chat", { room, userId }); // Emit an object with room and userId
  };
  return (
    <div>
      {/* Chat UI components go here */}
      {/* <button onClick={() => joinChatRoom("roomName")}>Join Chat Room</button>*/}
      <MainContainer
        responsive
        style={{
          height: "100vh",
        }}
      >
        <Sidebar position="left">
          <Search placeholder="Search..." />
          <ConversationList>
           
            <Conversation
              info="Yes i can do it for you"
              lastSenderName="Emily"
              name="Ilias"
              unreadCnt={3}
            >
               <Avatar
                name="Amazon SWE Interns"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              />
            </Conversation>
            <Conversation
              info="Yes i can do it for you"
              lastSenderName="Kai"
              name="Sebriya"
              unreadDot
            >
               <Avatar
                name="Amazon SWE Interns"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              />
            </Conversation>
            <Conversation
              info="Yes i can do it for you"
              lastSenderName="Akane"
              name="Naod"
            >
               <Avatar
                name="Amazon SWE Interns"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              />
            </Conversation>
            <Conversation
              info="Yes i can do it for you"
              lastSenderName="Eliot"
              name="Amazon SWE Intern"
            >
              <Avatar
                name="Amazon SWE Interns"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              />
            </Conversation>
            <Conversation
              active
              info="Yes i can do it for you"
              lastSenderName="Zoe"
              name="Oracle"
            >
              <Avatar
                name="Zoe"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                status="dnd"
              />
            </Conversation>
            <Conversation
              info="Yes i can do it for you"
              lastSenderName="Patrik"
              name="Patrik"
            >
              <Avatar
                name="Google SWE II"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              />
            </Conversation>
          </ConversationList>
        </Sidebar>
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back />
            <Avatar
              name="Zoe"
              src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
            />
            <ConversationHeader.Content
              info="Active 10 mins ago"
              userName="Zoe"
            />
            <ConversationHeader.Actions>
              <InfoButton />
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList
            typingIndicator={<TypingIndicator content="Zoe is typing" />}
          >
            <MessageSeparator content="Saturday, 30 November 2019" />
            <Message
              model={{
                direction: "incoming",
                message: "What did you review?",
                position: "single",
                sender: "Zoe",
                sentTime: "15 mins ago",
              }}
            >
              <Avatar
                name="Zoe"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              />
            </Message>
            <Message
              avatarSpacer
              model={{
                direction: "outgoing",
                message: "BST, HashMaps, Dijkstra's Algorithm",
                position: "single",
                sender: "Patrik",
                sentTime: "15 mins ago",
              }}
            />
            <Message
              avatarSpacer
              model={{
                direction: "incoming",
                message: "How long was your interview",
                position: "first",
                sender: "Zoe",
                sentTime: "15 mins ago",
              }}
            />
            
            
            <Message
              model={{
                direction: "incoming",
                message: "Hello my friend",
                position: "last",
                sender: "Zoe",
                sentTime: "15 mins ago",
              }}
            >
              <Avatar
                name="Zoe"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              />
            </Message>
            <Message
              model={{
                direction: "outgoing",
                message: "About 15 minutes",
                position: "first",
                sender: "Patrik",
                sentTime: "15 mins ago",
              }}
            />
            <Message
              model={{
                direction: "outgoing",
                message: "The name of my interviewer was Amy",
                position: "normal",
                sender: "Patrik",
                sentTime: "15 mins ago",
              }}
            />
            <Message
              model={{
                direction: "outgoing",
                message: "Hello my friend",
                position: "normal",
                sender: "Patrik",
                sentTime: "15 mins ago",
              }}
            />
            <Message
              model={{
                direction: "outgoing",
                message: "Hello my friend",
                position: "last",
                sender: "Patrik",
                sentTime: "15 mins ago",
              }}
            />
            <Message
              avatarSpacer
              model={{
                direction: "incoming",
                message: "Hello my friend",
                position: "first",
                sender: "Zoe",
                sentTime: "15 mins ago",
              }}
            />
            <Message
              model={{
                direction: "incoming",
                message: "Hello my friend",
                position: "last",
                sender: "Zoe",
                sentTime: "15 mins ago",
              }}
            >
              <Avatar
                name="Zoe"
                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              />
            </Message>
          </MessageList>
          <MessageInput placeholder="Type message here" />
        </ChatContainer>
        
      </MainContainer>
    </div>
  );
}

export default Chat;
