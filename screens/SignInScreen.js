// Packages
import axios from "axios";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Components
import {
  Text,
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// Constants
import Constants from "expo-constants";

const SignInScreen = ({ navigation, setUserToken, url }) => {
  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <KeyboardAwareScrollView style={styles.container}>
      {/* Logo View */}
      <View>
        <Image
          source={require("../assets/airbnb_logo.png")}
          style={styles.logo}
        />
        <Text>Sign in</Text>
      </View>

      {/* Sign in form */}
      <View style={styles.form}>
        <TextInput
          placeholder="email"
          value={email}
          onChangeText={(text) => {
            setErrorMessage("");
            setEmail(text.toLowerCase());
          }}
          style={styles.formInput}
        />
        <TextInput
          placeholder="password"
          value={password}
          secureTextEntry={true}
          onChangeText={(text) => {
            setErrorMessage("");
            setPassword(text.toLowerCase());
          }}
          style={styles.formInput}
        />

        {/* Error message + Sign in button + sign up link */}
        <View>
          {errorMessage && <Text>{errorMessage}</Text>}
          <TouchableOpacity
            onPress={async () => {
              try {
                if (email && password) {
                  const response = await axios.post(`${url}/user/log_in`, {
                    email,
                    password,
                  });
                  const { id, token } = response.data;
                  // console.log("id, token >> ", id, token);
                  await AsyncStorage.setItem("userToken", token);
                  setUserToken(token);
                } else {
                  setErrorMessage("All fields must be filled");
                }
              } catch (error) {
                console.log(error.response);
                alert("Email or username doesn't exist");
              }
            }}
            style={styles.btn}
          >
            <Text>Sign in</Text>
          </TouchableOpacity>
          <Text
            onPress={() => {
              navigation.navigate("signup");
            }}
          >
            No account ? Register
          </Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginBottom: 50,
    paddingTop: Constants.statusBarHeight,
  },
  logo: {
    height: 200,
    width: 200,
  },
  form: {
    alignItems: "center",
  },
  formInput: {
    height: 60,
    width: "80%",
    borderBottomWidth: 1,
  },
  btn: {
    borderWidth: 2,
    borderColor: "#F9575C",
    height: 60,
    width: 210,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SignInScreen;
