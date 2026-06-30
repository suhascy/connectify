import { Box, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect } from "react";
import { ChatState } from "../context/ChatProvider";

function MyChats() {
  const {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
  } = ChatState();

  const fetchChats = async () => {
    if (!user) return;

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
    fetchChats();
  }, [user]);

  // Automatically open the latest chat
  useEffect(() => {
    if (!selectedChat && chats && chats.length > 0) {
      setSelectedChat(chats[0]);
    }
  }, [chats]);

  return (
    <Box
      display="flex"
      flexDir="column"
      p={3}
      bg="rgba(0,0,0,0.35)"
      backdropFilter="blur(15px)"
      w={{ base: "100%", md: "31%" }}
      borderRadius="18px"
      border="1px solid rgba(0,153,255,0.25)"
      boxShadow="0 0 20px rgba(0,153,255,0.15)"
    >
      <Text
        fontSize="2xl"
        color="white"
        fontWeight="bold"
        mb={4}
      >
        My Chats
      </Text>

      <Stack spacing={3} overflowY="auto">
        {chats?.map((chat) => {
          const otherUser = chat.users.find(
            (u) => u._id !== user._id
          );

          return (
            <Box
              key={chat._id}
              cursor="pointer"
              px={4}
              py={3}
              borderRadius="14px"
              bg={
                selectedChat?._id === chat._id
                  ? "blue.500"
                  : "rgba(255,255,255,0.08)"
              }
              color="white"
              transition="0.25s"
              _hover={{
                bg: "rgba(0,153,255,0.35)",
              }}
              onClick={() => setSelectedChat(chat)}
            >
              <Text fontWeight="bold">
                {otherUser?.name}
              </Text>

              {chat.latestMessage && (
                <Text
                  fontSize="sm"
                  color="gray.300"
                  noOfLines={1}
                >
                  {chat.latestMessage.content}
                </Text>
              )}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}

export default MyChats;