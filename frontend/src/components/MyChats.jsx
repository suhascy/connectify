import { Box, Text, Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";

function MyChats() {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

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

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="rgba(0, 0, 0, 0.38)"
      backdropFilter="blur(14px)"
      w={{ base: "100%", md: "31%" }}
      borderRadius="18px"
      border="1px solid rgba(0, 153, 255, 0.35)"
      boxShadow="0 0 35px rgba(0, 153, 255, 0.18)"
      color="white"
    >
      <Text fontSize="2xl" pb={3} fontWeight="bold">
        My Chats
      </Text>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="rgba(0, 0, 0, 0.42)"
        backdropFilter="blur(10px)"
        w="100%"
        h="100%"
        borderRadius="18px"
        overflowY="hidden"
        border="1px solid rgba(0, 153, 255, 0.25)"
      >
        {chats && chats.length > 0 ? (
          <Stack overflowY="scroll" spacing={3}>
            {chats.map((chat) => {
              const otherUser =
                chat.users?.find((u) => u._id !== user._id)?.name ||
                "Unknown User";

              return (
                <Box
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={
                    selectedChat?._id === chat._id
                      ? "linear-gradient(135deg, #0077ff, #00c8ff)"
                      : "rgba(255, 255, 255, 0.08)"
                  }
                  color="white"
                  px={4}
                  py={3}
                  borderRadius="16px"
                  border={
                    selectedChat?._id === chat._id
                      ? "1px solid rgba(0, 200, 255, 0.55)"
                      : "1px solid rgba(255, 255, 255, 0.08)"
                  }
                  boxShadow={
                    selectedChat?._id === chat._id
                      ? "0 0 18px rgba(0, 153, 255, 0.35)"
                      : "0 0 12px rgba(255, 255, 255, 0.04)"
                  }
                  _hover={{
                    bg:
                      selectedChat?._id === chat._id
                        ? "linear-gradient(135deg, #0077ff, #00c8ff)"
                        : "rgba(0, 153, 255, 0.18)",
                    transform: "translateY(-1px)",
                  }}
                  transition="all 0.2s ease"
                >
                  <Text fontWeight="bold">{otherUser}</Text>

                  {chat.latestMessage && (
                    <Text fontSize="sm" color="gray.300" noOfLines={1}>
                      {chat.latestMessage.content}
                    </Text>
                  )}
                </Box>
              );
            })}
          </Stack>
        ) : (
          <Text color="gray.300">No chats yet</Text>
        )}
      </Box>
    </Box>
  );
}

export default MyChats;