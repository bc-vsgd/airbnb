import axios from "axios";
import { useState, useEffect } from "react";

import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Image,
  ImageBackground,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
const RoomScreen = ({ navigation, route, url }) => {
  // States
  const [roomData, setRoomData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  //   Room description: nb of lines
  const [nbLines, setNbLines] = useState(3);

  const id = route.params.id;
  //   console.log("room, id >>> ", id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${url}/${id}`);
        // console.log(JSON.stringify(data, null, 2));
        setRoomData(data);
      } catch (error) {
        console.log(("roomscreen - error >>>", error));
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);
  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <View>
      <Text>{roomData._id}</Text>
      <ImageBackground
        source={{ uri: roomData.photos[0].url }}
        style={styles.roomImg}
      >
        <Text style={styles.price}>{roomData.price} €</Text>
      </ImageBackground>
      {/* Title, rating, avatar */}
      <View style={styles.flexRow}>
        {/* Title, rating */}
        <View>
          <Text>{roomData.title}</Text>
          <View style={styles.flexRow}>
            <Text>Stars</Text>
            <Text>{roomData.reviews} reviews</Text>
          </View>
        </View>
        {/* Avatar */}
        <Image
          source={{ uri: roomData.user.account.photo.url }}
          style={styles.avatar}
        />
      </View>
      {/* Description */}
      <View>
        <Text
          numberOfLines={nbLines}
          onPress={() => {
            nbLines === 3 ? setNbLines(0) : setNbLines(3);
          }}
        >
          {roomData.description}
        </Text>
      </View>
      {/* Map */}
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
            latitude: roomData.location[1],
            longitude: roomData.location[0],
          }}
        />
      </MapView>
    </View>
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
    backgroundColor: "black",
    color: "white",
    textAlign: "center",
    paddingVertical: 10,
    marginBottom: 10,
  },
  avatar: {
    height: 60,
    width: 60,
    resizeMode: "contain",
  },
  map: {
    width: 300,
    height: 250,
  },
});

export default RoomScreen;
