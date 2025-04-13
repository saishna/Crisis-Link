import { useState, useEffect } from "react";
import { Text, View, StatusBar } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import tw from "twrnc";

// API endpoint to fetch flood zones
const FLOOD_ZONE_API = "http://192.168.1.69:5000/api/flood-zones"; // Update this with your actual API endpoint

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [floodZones, setFloodZones] = useState([]); // Empty array initially
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    // Fetch flood zones data on component mount
    const fetchFloodZones = async () => {
      try {
        const res = await fetch(FLOOD_ZONE_API);
        const data = await res.json();
        console.log("Flood zones fetched:", data);

        // Set the fetched flood zones to state
        setFloodZones(data?.flood || []); // Ensure the API structure matches with data?.flood
      } catch (error) {
        console.error("Error fetching flood zones:", error);
        setFloodZones([]); // Set to empty array in case of error
      }
    };

    // Request location permission and fetch user location
    const getLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      // Track user movement
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Check every 10 seconds
          distanceInterval: 10, // Check every 10 meters
        },
        (newLocation) => {
          setLocation(newLocation.coords);
        }
      );
    };

    fetchFloodZones(); // Fetch flood zones data
    getLocationPermission(); // Request location permission and get user's location
  }, []);

  // Send push notification when in a flood zone
  const sendLocalNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🚨 Flood Alert! 🚨",
        body: "⚠️ You are in a flood-prone area. Stay alert!",
        sound: "default",
        vibrate: [500, 500], // Vibration pattern
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: null, // Send instantly
    });
  };

  // Calculate distance between two coordinates
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371e3; // Earth's radius in meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Check if user is in a flood zone
  const checkFloodZone = (userCoords) => {
    if (!floodZones.length) return;

    const isInFloodZone = floodZones.some((zone) => {
      const coordinates = zone.location.coordinates;
      const [zoneLat, zoneLng] = coordinates;
      const distance = getDistance(userCoords.latitude, userCoords.longitude, zoneLat, zoneLng);
      return distance < 100; // Alert if within 100 meters
    });

    if (isInFloodZone) {
      sendLocalNotification();
    }
  };

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if (!location) {
    return <Text style={tw`text-center`}>Fetching your location...</Text>;
  }

  return (
    <View style={tw`flex-1 justify-start items-center bg-blue-100`}>
      <StatusBar backgroundColor="#DBEAFE" barStyle="dark-content" translucent={true} />
      <MapView
        style={tw`w-full h-full absolute`}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01, // Zoomed-in level
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true} // Show user's location
        followsUserLocation={true} // Auto-center map
      >
        {/* Render flood zones from API */}
        {floodZones?.map((zone, index) => {
          const [zoneLat, zoneLng] = zone.location.coordinates;
          const pinColor = zone.riskLevel === "High" ? "red" : "orange"; // Customize based on risk level
          
          return (
            <Marker
              key={index}
              coordinate={{ latitude: zoneLat, longitude: zoneLng }}
              title={zone.name} // Use the name of the flood zone
              description={`Address: ${zone.location.address}\nRisk Level: ${zone.riskLevel}`}
              pinColor={pinColor} // Set marker color based on risk
            />
          );
        })}

        {/* Marker for the user's current location */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your Location"
            description={`Lat: ${location.latitude}, Lng: ${location.longitude}`}
            pinColor="blue"
          />
        )}
      </MapView>
    </View>
  );
};

export default MapScreen;
