// Packages
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Screens
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import RoomScreen from "./screens/RoomScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const url = "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms";

export default function App() {
  // States
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserToken = async () => {
      try {
        const foundToken = await AsyncStorage.getItem("userToken");
        // console.log("App, foundToken >> ", foundToken);
        setUserToken(foundToken);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };
    getUserToken();
  }, []);

  if (isLoading === true) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken === null ? (
          <>
            <Stack.Screen name="signin">
              {(props) => {
                return <SignInScreen {...props} setUserToken={setUserToken} />;
              }}
            </Stack.Screen>
            <Stack.Screen name="signup">
              {(props) => {
                return <SignUpScreen {...props} setUserToken={setUserToken} />;
              }}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="tab" options={{ headerShown: false }}>
            {() => {
              return (
                <Tab.Navigator>
                  <Tab.Screen
                    name="homeTab"
                    options={{ headerShown: false, title: "Home" }}
                  >
                    {() => {
                      return (
                        <Stack.Navigator>
                          <Stack.Screen
                            name="home"
                            options={{ headerShown: false }}
                          >
                            {(props) => {
                              return <HomeScreen {...props} url={url} />;
                            }}
                          </Stack.Screen>
                          <Stack.Screen
                            name="room"
                            options={{ headerShown: false }}
                            component={RoomScreen}
                          />
                        </Stack.Navigator>
                      );
                    }}
                  </Tab.Screen>
                  {/* NEXT SCREENS TO DO */}
                  {/* <Tab.Screen name="Around me" />
                  <Tab.Screen name="My profile" /> */}
                </Tab.Navigator>
              );
            }}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
