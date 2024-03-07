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
import AroundMeScreen from "./screens/AroundMeScreen";
import ProfileScreen from "./screens/ProfileScreen";
// Components
import Header from "./components/Header";
// Icons
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const url = "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb";

export default function App() {
  // States
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserToken = async () => {
      try {
        const foundToken = await AsyncStorage.getItem("userToken");
        console.log("App, foundToken >> ", foundToken);
        setUserToken(foundToken);
      } catch (error) {
        console.log(error.response);
      }
      setIsLoading(false);
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
                return (
                  <SignInScreen
                    {...props}
                    setUserToken={setUserToken}
                    url={url}
                  />
                );
              }}
            </Stack.Screen>
            <Stack.Screen name="signup">
              {(props) => {
                return (
                  <SignUpScreen
                    {...props}
                    setUserToken={setUserToken}
                    url={url}
                  />
                );
              }}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="tabScreen" options={{ headerShown: false }}>
            {() => {
              return (
                <Tab.Navigator screenOptions={{ headerShown: false }}>
                  <Tab.Screen
                    name="homeTab"
                    options={{
                      tabBarLabel: "Home",
                      tabBarIcon: () => {
                        return (
                          <AntDesign name="home" size={24} color="black" />
                        );
                      },
                    }}
                  >
                    {() => {
                      return (
                        <Stack.Navigator>
                          <Stack.Screen
                            name="home"
                            options={{
                              headerTitle: () => {
                                return <Header />;
                              },
                            }}
                          >
                            {(props) => {
                              return (
                                <HomeScreen {...props} url={`${url}/rooms`} />
                              );
                            }}
                          </Stack.Screen>
                          <Stack.Screen
                            name="room"
                            options={{
                              headerTitle: () => {
                                return <Header />;
                              },
                              headerBackTitleVisible: false,
                            }}
                          >
                            {(props) => {
                              return (
                                <RoomScreen {...props} url={`${url}/rooms`} />
                              );
                            }}
                          </Stack.Screen>
                        </Stack.Navigator>
                      );
                    }}
                  </Tab.Screen>
                  <Tab.Screen
                    name="aroundMeTab"
                    options={{
                      tabBarLabel: "Around me",
                      tabBarIcon: () => {
                        return (
                          <MaterialCommunityIcons
                            name="map-marker-outline"
                            size={24}
                            color="black"
                          />
                        );
                      },
                    }}
                  >
                    {() => {
                      return (
                        <Stack.Navigator>
                          <Stack.Screen
                            name="aroundMe"
                            options={{
                              headerTitle: () => {
                                return <Header />;
                              },
                            }}
                          >
                            {(props) => {
                              return (
                                <AroundMeScreen
                                  {...props}
                                  url={`${url}/rooms`}
                                />
                              );
                            }}
                          </Stack.Screen>
                          <Stack.Screen
                            name="roomAroundMe"
                            options={{
                              headerTitle: () => {
                                return <Header />;
                              },
                              headerBackTitleVisible: false,
                            }}
                          >
                            {(props) => {
                              return (
                                <RoomScreen {...props} url={`${url}/rooms`} />
                              );
                            }}
                          </Stack.Screen>
                        </Stack.Navigator>
                      );
                    }}
                  </Tab.Screen>
                  <Tab.Screen
                    name="profileTab"
                    options={{
                      tabBarLabel: "My profile",
                      tabBarIcon: () => {
                        return (
                          <Octicons name="person" size={24} color="black" />
                        );
                      },
                    }}
                  >
                    {() => {
                      return (
                        <Stack.Navigator>
                          <Stack.Screen
                            name="profile"
                            options={{
                              headerTitle: () => {
                                return <Header />;
                              },
                            }}
                          >
                            {(props) => {
                              return (
                                <ProfileScreen
                                  {...props}
                                  userToken={userToken}
                                  setUserToken={setUserToken}
                                  url={`${url}/user`}
                                />
                              );
                            }}
                          </Stack.Screen>
                        </Stack.Navigator>
                      );
                    }}
                  </Tab.Screen>
                </Tab.Navigator>
              );
            }}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
