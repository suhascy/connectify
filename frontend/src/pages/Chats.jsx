import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/SideDrawer";

function Chats() {
  const navigate = useNavigate();

  const [user, setUser] = useState();

  useEffect(() => {
    const userInfo = JSON.parse(
      localStorage.getItem("userInfo")
    );

    setUser(userInfo);

    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}

      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats />}

        {user && <ChatBox />}
      </Box>
    </div>
  );
}

export default Chats;