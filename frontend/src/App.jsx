import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import './ChatApp.css';  // Link to the CSS file

const socket = io("http://localhost:3000");

const ChatApp = () => {
  const [status, setStatus] = useState("Connecting...");
  const [partner, setPartner] = useState(null);
  const [chat, setChat] = useState("");  
  const [messages, setMessages] = useState([]); 
  const chatEndRef = useRef(null);

  // Scroll chat to bottom whenever a new message is added
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
      setStatus("Connected to the server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setStatus("Disconnected from the server");
    });

    socket.on("paired", (partnerId) => {
      console.log("Paired with user:", partnerId);
      setStatus(`You are paired with user: ${partnerId}`);
      setPartner(partnerId);
    });

    socket.on("waiting", (message) => {
      console.log("Waiting for another user...");
      setStatus(message);
    });

    socket.on("message", ({ message, from }) => {
      console.log("Message received from", from, ":", message);
      setMessages((prevMessages) => [...prevMessages, { message, from }]);
      scrollToBottom();
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("paired");
      socket.off("waiting");
      socket.off("message");
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (chat.trim()) {
      console.log(`Sending message: ${chat} to ${partner}`);
      setMessages((prevMessages) => [...prevMessages, { message: chat, from: "You" }]);  // Add message to self
      socket.emit("message", { message: chat, partnerId: partner });  // Emit the message with partnerId
      setChat("");  // Clear the input after sending
      scrollToBottom();
    }
  };

  return (
    <div className="chat-container">
      <div className="status-bar">
        <h3>{status}</h3>
        {partner && <p>Chatting with: {partner}</p>}
      </div>

      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`chat-message ${msg.from === "You" ? "sent" : "received"}`}>
            <strong>{msg.from === 'You' ? 'You' : 'UnKnown'}:   </strong> {msg.message}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {partner ? (
        <div className="chat-input-container">
          <form onSubmit={handleSubmit}>
            <textarea
              className="chat-input"
              placeholder="Type your message..."
              value={chat}
              onChange={(e) => setChat(e.target.value)}
              rows={2}
            />
            <button type="submit" className="send-button">Send</button>
          </form>
        </div>
      ) : (
        <div className="waiting-message">Waiting to pair with a partner...</div>
      )}
    </div>
  );
};

export default ChatApp;
