import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Screens
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
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
            <Stack.Screen name="signup" component={SignUpScreen} />
          </>
        ) : (
          <Stack.Screen name="home" component={HomeScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
