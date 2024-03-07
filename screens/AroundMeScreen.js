import { StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useState, useEffect } from "react";
import axios from "axios";

const AroundMeScreen = ({ navigation, url }) => {
  // States
  // User coords, default: Paris
  const [userCoords, setUserCoords] = useState({
    latitude: 48.856614,
    longitude: 2.3522219,
  });
  const [roomsData, setRoomsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const askPermission = async () => {
      try {
        // console.log("Around me");
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync();
          // console.log("location", location);
          setUserCoords({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          const { data } = await axios.get(
            `${url}/around?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`
          );
          console.log("around, data > > ", JSON.stringify(data, null, 2));
          setRoomsData(data);
        } else {
          // User location denied => display all rooms available
          const { data } = await axios.get(url);
          // console.log(
          //   "around - else, data >>> ",
          //   JSON.stringify(data, null, 2)
          // );
          setRoomsData(data);
        }
      } catch (error) {
        console.log("Around me, error >> ", error);
      }
      setIsLoading(false);
    };
    askPermission();
  }, []);

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <MapView
      initialRegion={{
        latitude: userCoords.latitude,
        longitude: userCoords.longitude,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      }}
      showsUserLocation
      style={styles.map}
    >
      {roomsData.map((room) => {
        return (
          <Marker
            key={room._id}
            coordinate={{
              latitude: room.location[1],
              longitude: room.location[0],
              title: room.title,
            }}
            onPress={() => {
              console.log("Marker press");
              navigation.navigate("roomAroundMe", { id: room._id });
            }}
          />
        );
      })}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default AroundMeScreen;
