import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";

import axios from "axios";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const submitHandler = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");

      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/users",
        {
          name,
          email,
          password,
        },
        config
      );

      localStorage.setItem(
        "userInfo",
        JSON.stringify(data)
      );

      navigate("/chats");
    } catch (error) {
      console.log(error);
      alert("Signup failed");
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>

        <Input
          placeholder="Enter Your Name"
          onChange={(e) =>
            setName(e.target.value)
          }
        />
      </FormControl>

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
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;