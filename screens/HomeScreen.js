import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
} from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import axios from "axios";

const url = "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms";

// const Tab = createBottomTabNavigator();

const HomeScreen = () => {
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
                <Text>{item.title}</Text>
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
