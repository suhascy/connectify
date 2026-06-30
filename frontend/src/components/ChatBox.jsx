import { Box, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import io from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import { ChatState } from "../context/ChatProvider";

const ENDPOINT = import.meta.env.VITE_API_URL;

let socket;

const ChatBox = () => {
  const { selectedChat, user, setChats, setNotification } = ChatState();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const selectedChatRef = useRef(null);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  const getSender = () => {
    if (!selectedChat?.users || !user) return "";
    const sender = selectedChat.users.find((u) => u._id !== user._id);
    return sender?.name || "Chat";
  };

  const updateSidebarLatestMessage = (message) => {
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) =>
        chat._id === message.chat._id ? { ...chat, latestMessage: message } : chat
      );

      const updatedChat = updatedChats.find(
        (chat) => chat._id === message.chat._id
      );

      const remainingChats = updatedChats.filter(
        (chat) => chat._id !== message.chat._id
      );

      return updatedChat ? [updatedChat, ...remainingChats] : updatedChats;
    });
  };

  useEffect(() => {
    if (!user) return;

    socket = io(ENDPOINT);
    socket.emit("setup", user);

    socket.on("connected", () => {
      console.log("Socket Connected");
      setSocketConnected(true);
    });

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
      socket.disconnect();
    };
  }, [user]);

  const fetchMessages = async () => {
    if (!selectedChat || !user) return;

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);

      if (socket) {
        socket.emit("join chat", selectedChat._id);
      }

      setLoading(false);
    } catch (error) {
      console.log("Fetch Messages Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    setIsTyping(false);
  }, [selectedChat]);

  useEffect(() => {
    if (!socket) return;

    socket.on("message received", (newMessageReceived) => {
      updateSidebarLatestMessage(newMessageReceived);

      const currentChat = selectedChatRef.current;

      if (currentChat && newMessageReceived.chat._id === currentChat._id) {
        setMessages((prev) => [...prev, newMessageReceived]);
      } else {
        setNotification((prev) => {
          const alreadyExists = prev.find((n) => n._id === newMessageReceived._id);
          if (alreadyExists) return prev;
          return [newMessageReceived, ...prev];
        });
      }
    });

    return () => {
      socket.off("message received");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected || !selectedChat) return;

    socket.emit("typing", selectedChat._id);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);
    }, 3000);
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage.trim() && selectedChat) {
      try {
        socket.emit("stop typing", selectedChat._id);

        const messageContent = newMessage;
        setNewMessage("");

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/message`,
          {
            content: messageContent,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);
        setMessages((prev) => [...prev, data]);
        updateSidebarLatestMessage(data);
      } catch (error) {
        console.log("Send Message Error:", error);
      }
    }
  };

  return (
    <Box
      display="flex"
      flexDir="column"
      p={3}
      bg="rgba(0, 0, 0, 0.38)"
      backdropFilter="blur(14px)"
      w={{ base: "100%", md: "68%" }}
      borderRadius="18px"
      border="1px solid rgba(0, 153, 255, 0.35)"
      boxShadow="0 0 35px rgba(0, 153, 255, 0.18)"
      color="white"
    >
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={1}
            px={2}
            fontFamily="Work sans"
            borderBottom="1px solid rgba(0, 153, 255, 0.25)"
            color="white"
          >
            {getSender()}
          </Text>

          <Text
            fontSize="sm"
            color={socketConnected ? "#4ade80" : "#f87171"}
            px={2}
            mb={2}
          >
            {socketConnected ? "🟢 Connected" : "🔴 Disconnected"}
          </Text>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="space-between"
            bg="rgba(0, 0, 0, 0.42)"
            backdropFilter="blur(10px)"
            w="100%"
            h="80vh"
            borderRadius="18px"
            p={3}
            border="1px solid rgba(0, 153, 255, 0.25)"
            boxShadow="inset 0 0 40px rgba(0, 153, 255, 0.08)"
          >
            <Box overflowY="auto" flex="1" mb={3} pr={2}>
              {loading ? (
                <Text color="gray.300">Loading...</Text>
              ) : (
                messages.map((m) => (
                  <Box
                    key={m._id}
                    display="flex"
                    justifyContent={
                      m.sender._id === user._id ? "flex-end" : "flex-start"
                    }
                    mb={3}
                  >
                    <Box
                      bg={
                        m.sender._id === user._id
                          ? "linear-gradient(135deg, #0077ff, #00c8ff)"
                          : "rgba(255, 255, 255, 0.11)"
                      }
                      color="white"
                      px={4}
                      py={2}
                      borderRadius={
                        m.sender._id === user._id
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px"
                      }
                      maxW="75%"
                      boxShadow={
                        m.sender._id === user._id
                          ? "0 0 18px rgba(0, 153, 255, 0.35)"
                          : "0 0 14px rgba(255, 255, 255, 0.05)"
                      }
                      border={
                        m.sender._id === user._id
                          ? "1px solid rgba(0, 200, 255, 0.45)"
                          : "1px solid rgba(255, 255, 255, 0.08)"
                      }
                    >
                      {m.content}
                    </Box>
                  </Box>
                ))
              )}

              {isTyping && (
                <Text fontSize="sm" color="blue.200" fontStyle="italic" ml={2} mb={2}>
                  {getSender()} is typing...
                </Text>
              )}

              <div ref={messagesEndRef} />
            </Box>

            <Input
              variant="filled"
              bg="rgba(255, 255, 255, 0.1)"
              color="white"
              border="1px solid rgba(0, 153, 255, 0.25)"
              _hover={{ bg: "rgba(255, 255, 255, 0.14)" }}
              _focus={{
                bg: "rgba(255, 255, 255, 0.14)",
                borderColor: "#00c8ff",
                boxShadow: "0 0 15px rgba(0, 200, 255, 0.35)",
              }}
              _placeholder={{ color: "gray.400" }}
              placeholder="Type a message..."
              value={newMessage}
              onChange={typingHandler}
              onKeyDown={sendMessage}
            />
          </Box>
        </>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" h="100%">
          <Text fontSize="3xl" fontFamily="Work sans" color="white">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default ChatBox;