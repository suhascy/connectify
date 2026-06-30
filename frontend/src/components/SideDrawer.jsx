import {
  Box,
  Button,
  Drawer,
  Input,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import axios from "axios";
import { useState } from "react";

import { ChatState } from "../context/ChatProvider";
import UserListItem from "./userAvatar/UserListItem";
import { accessChat } from "../config/ChatLogic";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, chats, setChats, setSelectedChat } = ChatState();

  const handleSearch = async () => {
    if (!search) {
      alert("Please enter something");
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users?search=${search}`,
        config
      );

      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const accessChatHandler = async (userId) => {
    try {
      setLoadingChat(true);

      const data = await accessChat(userId, user.token);

      if (!chats?.find((c) => c._id === data._id)) {
        setChats([data, ...(chats || [])]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      console.log("SEARCH ERROR:", error);
      console.log("RESPONSE:", error.response?.data);
      setLoadingChat(false);
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="rgba(0, 0, 0, 0.42)"
        backdropFilter="blur(14px)"
        w="100%"
        p="12px 18px"
        borderBottom="1px solid rgba(0, 153, 255, 0.35)"
        boxShadow="0 0 30px rgba(0, 153, 255, 0.16)"
        color="white"
      >
        <Button
          onClick={onOpen}
          bg="linear-gradient(135deg, #0077ff, #00c8ff)"
          color="white"
          borderRadius="14px"
          _hover={{
            bg: "linear-gradient(135deg, #0065dd, #00aee6)",
            boxShadow: "0 0 18px rgba(0, 153, 255, 0.45)",
          }}
        >
          Search User
        </Button>

        <Text
          fontSize="2xl"
          fontFamily="Work sans"
          fontWeight="bold"
          letterSpacing="1px"
          color="white"
          textShadow="0 0 14px rgba(0, 153, 255, 0.55)"
        >
          Connectify
        </Text>

        <Button
          bg="rgba(255, 255, 255, 0.08)"
          color="white"
          border="1px solid rgba(0, 153, 255, 0.25)"
          borderRadius="14px"
          _hover={{
            bg: "rgba(0, 153, 255, 0.18)",
          }}
        >
          {user?.name}
        </Button>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <Box
          bg="rgba(0, 0, 0, 0.78)"
          backdropFilter="blur(18px)"
          w="350px"
          h="100vh"
          p={5}
          position="fixed"
          left="0"
          top="0"
          zIndex="1400"
          boxShadow="0 0 45px rgba(0, 153, 255, 0.3)"
          borderRight="1px solid rgba(0, 153, 255, 0.35)"
          color="white"
        >
          <Text fontSize="2xl" pb={3} fontWeight="bold">
            Search Users
          </Text>

          <Box display="flex" pb={4}>
            <Input
              placeholder="Search by name or email"
              mr={2}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              bg="rgba(255, 255, 255, 0.1)"
              color="white"
              border="1px solid rgba(0, 153, 255, 0.25)"
              _placeholder={{ color: "gray.400" }}
              _focus={{
                borderColor: "#00c8ff",
                boxShadow: "0 0 15px rgba(0, 200, 255, 0.35)",
              }}
            />

            <Button
              onClick={handleSearch}
              bg="linear-gradient(135deg, #0077ff, #00c8ff)"
              color="white"
              _hover={{
                bg: "linear-gradient(135deg, #0065dd, #00aee6)",
              }}
            >
              Go
            </Button>
          </Box>

          {loading ? (
            <Spinner color="#00c8ff" />
          ) : (
            searchResult?.map((searchedUser) => (
              <UserListItem
                key={searchedUser._id}
                user={searchedUser}
                handleFunction={() => accessChatHandler(searchedUser._id)}
              />
            ))
          )}

          {loadingChat && <Spinner color="#00c8ff" ml="auto" display="flex" />}
        </Box>
      </Drawer>
    </>
  );
};

export default SideDrawer;