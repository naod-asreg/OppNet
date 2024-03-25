import React from 'react';
import io from 'socket.io-client';

function Chat() {
    const user = JSON.parse(localStorage.getItem("user"));
    const socket = io.connect("http://localhost:5555"); // Connect to Socket.io server
    const userId = user.userId;
    
    // Function to join a chat room
    const joinChatRoom = (room) => {
        socket.emit("join chat", { room, userId }); // Emit an object with room and userId
    };
    return (
        <div>
            {/* Chat UI components go here */}
            <button onClick={() => joinChatRoom("roomName")}>Join Chat Room</button>
        </div>
    );
}

export default Chat;
