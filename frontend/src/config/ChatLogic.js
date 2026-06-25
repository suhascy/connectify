import axios from "axios";

export const accessChat = async (userId, token) => {
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/users/login`,
    { userId },
    config
  );

  return data;
};