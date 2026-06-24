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

import { ChatState } from "../Context/ChatProvider";
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
  console.log("USER:", user);
  console.log("TOKEN:", user?.token);

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

console.log("SEARCH RESULT:", data);

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
    console.log("Selected Chat:", data);

    setLoadingChat(false);
    onClose();
  } catch (error) {
  console.log("SEARCH ERROR:", error);
  console.log("RESPONSE:", error.response?.data);
  setLoading(false);
}
};

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="10px 15px"
        borderWidth="5px"
      >
        <Button onClick={onOpen}>Search User</Button>

        <Text fontSize="2xl" fontFamily="Work sans">
          Connectify
        </Text>

        <Button>{user?.name}</Button>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <Box
          bg="white"
          w="350px"
          h="100vh"
          p={5}
          position="fixed"
          left="0"
          top="0"
          zIndex="1400"
          boxShadow="lg"
        >
          <Text fontSize="2xl" pb={3}>
            Search Users
          </Text>

          <Box display="flex" pb={2}>
            <Input
              placeholder="Search by name or email"
              mr={2}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button onClick={handleSearch}>Go</Button>
          </Box>

          {loading ? (
            <Spinner />
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => accessChatHandler(user._id)}
              />
            ))
          )}

          {loadingChat && <Spinner ml="auto" display="flex" />}
        </Box>
      </Drawer>
    </>
  );
};

export default SideDrawer;