import { Avatar, Box, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      display="flex"
      alignItems="center"
      w="100%"
      px={4}
      py={3}
      mb={3}
      borderRadius="16px"
      bg="rgba(255,255,255,0.08)"
      backdropFilter="blur(12px)"
      color="white"
      border="1px solid rgba(0,153,255,0.18)"
      transition="all .25s ease"
      _hover={{
        transform: "translateY(-2px)",
        bg: "rgba(0,153,255,0.20)",
        border: "1px solid rgba(0,200,255,0.45)",
        boxShadow: "0 0 18px rgba(0,153,255,0.35)",
      }}
    >
      <Avatar
        mr={4}
        size="md"
        name={user.name}
        bg="blue.500"
      />

      <Box flex="1">
        <Text
          fontWeight="bold"
          fontSize="md"
          color="white"
        >
          {user.name}
        </Text>

        <Text
          fontSize="sm"
          color="gray.300"
        >
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;