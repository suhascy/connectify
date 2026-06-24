import { Box, Text, Badge } from "@chakra-ui/react";
import { useEffect } from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";

const MyChats = () => {
  const {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
  } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/chat`,
        config
      );

      setChats(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id
      ? users[1].name
      : users[0].name;
  };

  const getNotificationCount = (chatId) => {
    return notification.filter(
      (n) => n.chat._id === chatId
    ).length;
  };

  const openChat = (chat) => {
    setSelectedChat(chat);

    setNotification(
      notification.filter(
        (n) => n.chat._id !== chat._id
      )
    );
  };

  return (
    <Box
      display={{ base: "none", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Text pb={3} fontSize="2xl" fontFamily="Work sans">
        My Chats
      </Text>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats.map((chat) => {
          const count = getNotificationCount(chat._id);

          return (
            <Box
              key={chat._id}
              onClick={() => openChat(chat)}
              cursor="pointer"
              bg={
                selectedChat?._id === chat._id
                  ? "#38B2AC"
                  : "#E8E8E8"
              }
              color={
                selectedChat?._id === chat._id
                  ? "white"
                  : "black"
              }
              px={3}
              py={2}
              borderRadius="lg"
              mb={2}
            >
              <Box display="flex" justifyContent="space-between">
                <Text fontWeight="bold">
                  {getSender(user, chat.users)}
                </Text>

                {count > 0 && (
                  <Badge colorScheme="red" borderRadius="full">
                    {count}
                  </Badge>
                )}
              </Box>

              <Text fontSize="sm">
                {chat.latestMessage?.content || "No messages yet"}
              </Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default MyChats;