import axios from "axios";

export const accessChat = async (userId, token) => {
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.post(
    "http://localhost:5000/api/chat",
    { userId },
    config
  );

  return data;
};