import { useState } from "react";

import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";

import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const submitHandler = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        {
          email,
          password,
        },
        config
      );
      
      localStorage.setItem("userInfo", JSON.stringify(data));

      console.log(data);

      localStorage.setItem(
        "userInfo",
        JSON.stringify(data)
      );

      window.location.href = "/chats";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <VStack spacing="15px">
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>

        <Input
          placeholder="Enter Your Email"
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>

        <Input
          type="password"
          placeholder="Enter Your Password"
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />
      </FormControl>

      <Button
        colorScheme="purple"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        Login
      </Button>
    </VStack>
  );
}

export default Login; 