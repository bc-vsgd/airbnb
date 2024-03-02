import { useState, useEffect } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

const AroundMeScreen = ({ navigation, url }) => {
  // States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [coords, setCoords] = useState();
  const [roomsAround, setRoomsAround] = useState([]);

  useEffect(() => {
    const askPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync();

          setCoords({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          const { data } = await axios.get(`${url}/rooms/around`, {
            params: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          });
          setRoomsAround(data);
        } else {
          setError(true);
        }
      } catch (error) {
        console.log("Around me, error >>> ", error);
      }
      setIsLoading(false);
    };
    askPermission();
  }, []);

  if (isLoading) {
    return <ActivityIndicator />;
  }
  return error ? (
    alert("Permission refusée")
  ) : (
    <View>
      <Text>Around me</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        showsUserLocation={true}
      >
        {roomsAround.map((room) => {
          return (
            <Marker
              key={room._id}
              coordinate={{
                latitude: room.location[1],
                longitude: room.location[0],
              }}
              onPress={() => {
                console.log("around me, room_id >> ", room._id);
                navigation.push("room", {
                  id: room._id,
                  url: `${url}/rooms`,
                });
              }}
            />
          );
        })}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: 300,
    height: "100%",
  },
});

export default AroundMeScreen;
