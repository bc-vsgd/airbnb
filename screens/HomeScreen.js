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
} from "react-native";
// Constants
import Constants from "expo-constants";

const HomeScreen = ({ navigation, url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(url);
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
                <Text
                  onPress={() => {
                    navigation.navigate("room", { id: item._id, url: url });
                  }}
                >
                  {item.title}
                </Text>
                <View style={styles.flexRow}>
                  <Text>{item.ratingValue}</Text>
                  <Text>{item.reviews} reviews</Text>
                </View>
              </View>
              <Image
                source={{ uri: item.user.account.photo.url }}
                style={styles.userImg}
              />
            </View>
          </View>
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
