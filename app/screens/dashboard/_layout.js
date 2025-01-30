import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Entypo,FontAwesome5,MaterialCommunityIcons } from "@expo/vector-icons";
export default function Layout() {
  return (
    <Tabs initialRouteName="home" screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" color={color} size={size} />
          ),
          
        }}
      />
      <Tabs.Screen
        name="helpline"
        options={{
          title: "Helpline",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="hands-helping" color={color} size={size} />
          ),
        }}
      />

      
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="map" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: "Weather",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="weather-cloudy-clock" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen name="index" options={{ tabBarButton: () => null }} />
    </Tabs>
  );
}
