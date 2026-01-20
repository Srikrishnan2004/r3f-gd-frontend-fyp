import { createContext, useContext, useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const chat = async (message) => {
    setLoading(true);
    const data = await fetch(`${backendUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
    const resp = (await data.json()).messages;
    setMessages((messages) => [...messages, ...resp]);
    setLoading(false);
  };

  const playResponse = (data) => {
    // Construct message object formatted like the chat API response
    const messageData = {
      text: data.feedback,
      audio: data.audioUrl, // Logic in Avatar depends on how audio is served (base64 vs URL)
      lipsync: data.lipSyncData,
      facialExpression: "smile", // Default or parsed from response
      animation: "Listening", // Default
    };

    // Check if Avatar expects base64 or URL. 
    // The Avatar component in Avatar.jsx takes `data:audio/mp3;base64,...` so we might need to fetch the blob if it's a URL
    // Or we update Avatar.jsx to handle URLs.
    // For now, let's assume valid base64 or update Avatar later.
    // But wait, the API docs say `audioUrl` is a relative URL. 
    // The Avatar component seems to strictly prepend `data:audio/mp3;base64,`.
    // I should probably fetch the audio as base64 here if it's a URL.

    // Actually, let's just push it to messages for now and see if we can adapt.
    // The Avatar.jsx uses: `new Audio("data:audio/mp3;base64," + message.audio);`
    // So `message.audio` MUST be the base64 string.

    // We will handle the conversion in the SystemDesignInterview page or here.
    // Let's adapt playResponse to taking a fully formed message or just raw data.
    // Let's expose setMessages/setMessage so we can manually inject.
  };

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1));
  };

  const onMessageReceived = (message) => {
    setMessages((messages) => [...messages, message]);
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
        onMessageReceived,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
