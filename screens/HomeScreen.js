// Packages
import { useState, useEffect } from "react";
import axios from "axios";
// Components
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
// Constants
import Constants from "expo-constants";
// Icons
import { FontAwesome5 } from "@expo/vector-icons";

const HomeScreen = ({ navigation, url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  const getRatingArray = (rating) => {
    const starsArray = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        starsArray.push(
          <FontAwesome5 name="star" size={24} color="yellow" key={i} />
        );
      } else {
        starsArray.push(
          <FontAwesome5 name="star" size={24} color="grey" key={i} />
        );
      }
    }
    return starsArray;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${url}/rooms`);
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
    <FlatList
      data={data}
      keyExtractor={(item) => {
        return item._id;
      }}
      style={styles.container}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("room", {
                id: item._id,
                url: `${url}/rooms`,
              });
            }}
            activeOpacity={0.7}
          >
            <View>
              <View>
                <ImageBackground
                  source={{ uri: item.photos[0].url }}
                  style={styles.offerImg}
                >
                  <Text style={styles.price}>{item.price} €</Text>
                </ImageBackground>
              </View>
              <View style={styles.flexRow}>
                <View>
                  <Text>{item.title}</Text>
                  <View style={styles.flexRow}>
                    <Text>{getRatingArray(item.ratingValue)}</Text>
                    <Text>{item.reviews} reviews</Text>
                  </View>
                </View>
                <Image
                  source={{ uri: item.user.account.photo.url }}
                  style={styles.userImg}
                />
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
  },
  flexRow: {
    flexDirection: "row",
  },
  offerImg: {
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

export default HomeScreen;
