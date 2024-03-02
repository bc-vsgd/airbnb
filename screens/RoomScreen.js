// Packages
import { useState, useEffect } from "react";
import axios from "axios";
import MapView, { Marker } from "react-native-maps";
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
  console.log("room screen: id >> ", id);
  // States
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  //   Description text number of lines
  const [nbLines, setNbLines] = useState(3);
  //   Number of rating stars
  const [ratingStars, setRatingStars] = useState([]);

  // Get yellow / grey rating stars
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
    setRatingStars(starsArray);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${url}/${id}`);
        // console.log("rommscreen, id >>> ", id);
        const { ratingValue } = data;
        getRatingArray(ratingValue);
        setData(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
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
            <Text>{ratingStars}</Text>
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
      <View>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 48.856614,
            longitude: 2.3522219,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          <Marker
            coordinate={{
              latitude: data.location[1],
              longitude: data.location[0],
            }}
          />
        </MapView>
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
  map: {
    width: 300,
    height: 300,
  },
});
export default RoomScreen;
