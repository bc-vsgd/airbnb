import { StyleSheet, View, Text, Image } from "react-native";

const Header = () => {
  return (
    <View>
      {/* <Text>Header</Text> */}
      <Image
        source={require("../assets/airbnb_logo.png")}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 40,
    width: 40,
    resizeMode: "contain",
  },
});

export default Header;
