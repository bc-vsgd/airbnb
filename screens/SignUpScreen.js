import axios from "axios";
import { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const SignUpScreen = ({ navigation }) => {
  const url =
    "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/sign_up";
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <KeyboardAwareScrollView style={styles.container}>
      {/* Logo View */}
      <View>
        <Image
          source={require("../assets/airbnb-logo.png")}
          style={styles.logo}
        />
        <Text>Sign up</Text>
      </View>

      {/* Form View */}
      <View style={styles.form}>
        <TextInput
          placeholder="email"
          value={email}
          style={styles.formInput}
          onChangeText={(text) => {
            setEmail(text.toLowerCase());
            setErrorMessage("");
          }}
        />
        <TextInput
          placeholder="username"
          value={username}
          style={styles.formInput}
          onChangeText={(text) => {
            setUsername(text.toLowerCase());
            setErrorMessage("");
          }}
        />
        <TextInput
          multiline={true}
          textAlignVertical="top"
          placeholder="Describe yourself in a few words..."
          value={description}
          style={styles.formMultiline}
          onChangeText={(text) => {
            setDescription(text);
            setErrorMessage("");
          }}
        />
        <TextInput
          placeholder="password"
          value={password}
          secureTextEntry={true}
          style={styles.formInput}
          onChangeText={(text) => {
            setPassword(text.toLowerCase());
            setErrorMessage("");
          }}
        />
        <TextInput
          placeholder="confirm password"
          value={password2}
          secureTextEntry={true}
          style={styles.formInput}
          onChangeText={(text) => {
            setPassword2(text.toLowerCase());
            setErrorMessage("");
          }}
        />

        {/* Error message + Sign up button + sign in link */}
        <View style={styles.mgnBtm}>
          {errorMessage && <Text>{errorMessage}</Text>}
          <TouchableOpacity
            style={styles.btn}
            onPress={async () => {
              if (email && username && description && password && password2) {
                if (password === password2) {
                  try {
                    const response = await axios.post(url, {
                      email,
                      username,
                      password,
                      description,
                    });
                    const { token } = response.data;
                    console.log(token);
                    alert("Sign up ok !!!");
                  } catch (error) {
                    console.log(error.message);
                    alert("These email or username already exist");
                  }
                } else {
                  setErrorMessage("Passwords must be the same");
                }
              } else {
                setErrorMessage("All fields must be filled");
              }
            }}
          >
            <Text>Sign up</Text>
          </TouchableOpacity>
          <Text
            onPress={() => {
              navigation.navigate("signin");
            }}
          >
            Already have an account ? Sign in
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
  formMultiline: {
    height: 100,
    width: "80%",
    borderWidth: 1,
  },
  mgnBtm: {
    marginBottom: 50,
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

export default SignUpScreen;