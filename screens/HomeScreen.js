import axios from "axios";
import { useState, useEffect } from "react";

import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";

// Icons
import { Octicons } from "@expo/vector-icons";

const HomeScreen = ({ navigation, url }) => {
  const [roomsData, setRoomsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // data: offers array
        const { data } = await axios.get(url);
        // console.log("home, data>> ", JSON.stringify(data, null, 2));
        setRoomsData(data);
      } catch (error) {
        console.log("home, error >>> ", error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const getRatingStars = (rate) => {
    console.log(rate);
    const ratingStars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rate) {
        ratingStars.push(<Octicons name="star" size={24} color="yellow" />);
      } else {
        ratingStars.push(<Octicons name="star" size={24} color="grey" />);
      }
    }
    console.log(ratingStars);
    return ratingStars;
  };

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <FlatList
      data={roomsData}
      keyExtractor={(item) => {
        return item._id;
      }}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity>
            <ImageBackground
              source={{ uri: item.photos[0].url }}
              style={styles.roomImg}
            >
              <Text style={styles.price}>{item.price} €</Text>
            </ImageBackground>
            <View style={styles.flexRow}>
              {/* title, stars, etc. */}
              <View>
                <Text>{item.title}</Text>
                <View style={styles.flexRow}>
                  <View>
                    <Text>{getRatingStars(item.ratingValue)}</Text>
                  </View>
                  <Text>{item.reviews} reviews</Text>
                </View>
              </View>
              {/* Avatar */}
              <Image
                source={{ uri: item.user.account.photo.url }}
                style={styles.avatar}
              />
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: "row",
  },
  roomImg: {
    width: 300,
    height: 200,
    resizeMode: "contain",
    justifyContent: "flex-end",
  },
  price: {
    width: 60,
    paddingVertical: 10,
    backgroundColor: "black",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  avatar: {
    height: 60,
    width: 60,
  },
});

export default HomeScreen;
