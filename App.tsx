import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createTheme, ThemeProvider } from "@rneui/themed";
import React from "react";
import { useColorScheme } from "react-native";
import Detail from "./Components/Detail";
import Home from "./Components/Home";

const App: React.FC = () => {
  const Stack = createNativeStackNavigator();
  const mode = useColorScheme();

  const theme = createTheme({
    mode: mode === "dark" ? "dark" : "light",
    spacing: {
      lg: 8,
      md: 8,
      sm: 12,
      xl: 4,
      xs: 16,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer theme={mode === "dark" ? DarkTheme : DefaultTheme}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Detail"
            component={Detail}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
