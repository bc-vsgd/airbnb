// Packages
import { useState, useEffect } from "react";
import axios from "axios";
// Components
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ImageBackground,
  Image,
} from "react-native";
// Icons
import { FontAwesome5 } from "@expo/vector-icons";
// Constants
import Constants from "expo-constants";

const RoomScreen = ({ route, navigation }) => {
  const { id, url } = route.params;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  //   Description text number of lines
  const [nbLines, setNbLines] = useState(3);
  //   Number of rating stars
  const [goodRating, setGoodRating] = useState("");
  const [badRating, setBadRating] = useState("");
  let goodStars = [];
  let badStars = [];
  //   console.log("RoomScreen, id >>> ", id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${url}/${id}`);
        const { ratingValue } = data;
        for (let i = 0; i < ratingValue; i++) {
          goodStars.push(
            <FontAwesome5 name="star" size={24} color="yellow" key={i} />
          );
        }
        for (let i = 0; i < 5 - ratingValue; i++) {
          badStars.push(
            <FontAwesome5 name="star" size={24} color="grey" key={i} />
          );
        }
        setGoodRating(goodStars);
        setBadRating(badStars);
        setData(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };
    fetchData();
  }, []);

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: data.photos[0].url }}
        style={styles.roomImg}
      >
        <Text style={styles.price}>{data.price} €</Text>
      </ImageBackground>
      <View style={styles.flexRow}>
        <View>
          <Text>{data.title}</Text>
          <View style={styles.flexRow}>
            <Text>{goodRating}</Text>
            <Text>{badRating}</Text>
            <Text>{data.reviews} reviews</Text>
          </View>
        </View>
        <Image
          source={{ uri: data.user.account.photo.url }}
          style={styles.userImg}
        />
      </View>
      <View>
        <Text
          numberOfLines={nbLines}
          onPress={() => {
            nbLines === 3 ? setNbLines(0) : setNbLines(3);
          }}
        >
          {data.description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
  },
  flexRow: {
    flexDirection: "row",
  },
  roomImg: {
    width: 300,
    height: 200,
    resizeMode: "contain",
    justifyContent: "flex-end",
    paddingLeft: 10,
    paddingBottom: 10,
  },
  price: {
    width: 50,
    height: 30,
    backgroundColor: "black",
    color: "white",
  },
  userImg: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});
export default RoomScreen;
