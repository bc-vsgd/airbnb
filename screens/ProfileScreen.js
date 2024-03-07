import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
// Icons
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const ProfileScreen = ({ route, userToken, setUserToken, url }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState(null);

  // Choose an avatar from library
  const getLibraryPermission = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === "granted") {
        const result = await ImagePicker.launchImageLibraryAsync();
        if (result.canceled) {
          alert("Pas de photo sélectionnée");
        } else {
          setAvatar(result.assets[0].uri);
          console.log("library permission: avatar >> ", result.assets[0].uri);
        }
      } else {
        alert("Permission refusée");
      }
    } catch (error) {
      console.log("library permission, error >>> ", error);
    }
  };

  // Take a photo for avatar
  const getCameraPermission = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status === "granted") {
        const result = await ImagePicker.launchCameraAsync();
        if (result.canceled) {
          alert("Pas de photo sélectionnée");
        } else {
          setAvatar(result.assets[0].uri);
          console.log("camera permission: avatar >> ", result.assets[0].uri);
        }
      } else {
        alert("Permission refusée");
      }
    } catch (error) {
      console.log("camera permission, error >>> ", error);
    }
  };

  const sendPicture = async () => {
    if (avatar) {
      try {
        const tab = avatar.split(".");
        const extension = tab[tab.length - 1];
        // console.log("send picture, extension >> ", extension);
        const formData = new FormData();
        formData.append("photo", {
          uri: avatar,
          name: `my-avatar.${extension}`,
          type: `image/${extension}`,
        });

        const { data } = await axios.put(`${url}/upload_picture`, formData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("send picture, data >>> ", data);
      } catch (error) {
        console.log("send picture, error >>>> ", error);
      }
    }
  };
  // Update user informations
  const updateUserInfos = async () => {
    try {
      // console.log("update");
      const { data } = await axios.put(
        `${url}/update`,
        { email: email, username: userName, description: description },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      console.log("update, data >>> ", data);
      sendPicture();
    } catch (error) {
      console.log("update - error >>> ", error.response);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // console.log("profile, fetchuserdata", url);
        const id = await AsyncStorage.getItem("userId");
        console.log("profile, id >> ", id);

        const { data } = await axios.get(`${url}/${id}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        console.log("profile, userdata >>", data);
        setUserData(data);
        setEmail(data.email);
        setUserName(data.username);
        setDescription(data.description);
        setAvatar(data.photo?.url);
      } catch (error) {
        console.log("profile, error >>> ", error);
      }
      setIsLoading(false);
    };
    fetchUserData();
  }, []);

  // userData:
  //   {"description": "Hello !!!",
  //   "email": "ben@com.com",
  //   "id": "65da19a29110062205cf66a9",
  //   "photo": null,
  //   "username": "benben"}

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <View>
      {/* Avatar , pictures & camera icons*/}
      <View style={styles.flexRow}>
        {!avatar ? (
          <Ionicons
            name="person-circle-outline"
            size={100}
            color="black"
            style={styles.avatar}
          />
        ) : (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        )}
        <View>
          <FontAwesome
            name="picture-o"
            size={24}
            color="black"
            onPress={getLibraryPermission}
          />
          <FontAwesome
            name="camera"
            size={24}
            color="black"
            onPress={getCameraPermission}
          />
        </View>
      </View>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
        }}
      />
      <TextInput
        style={styles.input}
        value={userName}
        onChangeText={(text) => {
          setUserName(text);
        }}
      />
      <TextInput
        style={styles.input}
        multiline
        value={description}
        onChangeText={(text) => {
          setDescription(text);
        }}
      />
      <TouchableOpacity style={styles.btn} onPress={updateUserInfos}>
        <Text>Update</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={async () => {
          setUserToken(null);
          await AsyncStorage.removeItem("userToken");
          await AsyncStorage.removeItem("userId");
        }}
      >
        <Text>Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 100,
    height: 100,
  },
  flexRow: {
    flexDirection: "row",
  },
  input: {
    width: "80%",
    height: 50,
    borderBottomWidth: 1,
  },
  btn: {
    width: 100,
    height: 50,
    borderWidth: 2,
  },
});

export default ProfileScreen;
