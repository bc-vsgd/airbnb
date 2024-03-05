import { View, Text, TouchableOpacity } from "react-native";

const ProfileScreen = ({ setUserToken }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setUserToken(null);
      }}
    >
      <Text>Log out</Text>
    </TouchableOpacity>
  );
};

export default ProfileScreen;
