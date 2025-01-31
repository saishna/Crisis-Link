import { useState, useEffect } from "react";
import { Text, View, StatusBar, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import tw from "twrnc";

// API endpoint to fetch flood zones
const FLOOD_ZONE_API = "http://192.168.1.5:5000/api/flood-zones"; // Change to your API

// Configure notifications handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const MapScreen = () => {
    const [location, setLocation] = useState(null);
    const [floodZones, setFloodZones] = useState([]);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const setupApp = async () => {
            await requestNotificationPermission();
            await getLocationPermission();
            await fetchFloodZones();
        };

        setupApp();
    }, []);

    // 🚀 Request Push Notification Permissions
    const requestNotificationPermission = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Notifications Disabled", "Enable notifications in settings.");
            console.log("❌ Notifications permission denied.");
            return;
        }
        console.log("✅ Notifications permission granted.");
    };

    // 🌍 Request Location Permission & Track User
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
                timeInterval: 5000, // Every 5 seconds
                distanceInterval: 10, // Every 10 meters
            },
            (newLocation) => {
                setLocation(newLocation.coords);
                checkFloodZone(newLocation.coords);
            }
        );
    };

    // 🌊 Fetch Flood Zones from API
    const fetchFloodZones = async () => {
        try {
            const res = await fetch(FLOOD_ZONE_API);
            const data = await res.json();
            console.log("✅ Flood zones fetched:", data);
            setFloodZones(data?.flood || []);
        } catch (error) {
            console.error("❌ Error fetching flood zones:", error);
            setFloodZones([]);
        }
    };
    const sendTestNotification = async () => {
        console.log("🚀 Sending test notification...");

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "🚀 Test Notification",
                body: "This is a test alert!",
                sound: "default",
            },
            trigger: null, // Send instantly
        });

        console.log("✅ Test notification should be sent.");
    };

    useEffect(() => {
        sendTestNotification();
    }, []);



    // 📢 Send Push Notification
    const sendLocalNotification = async () => {
        console.log("🚨 Sending flood alert notification...");
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "🚨 Flood Alert!",
                body: "⚠️ You are in a flood-prone area. Stay alert!",
                sound: "default",
                vibrate: [500, 500],
            },
            trigger: null, // Send immediately
        });
        console.log("✅ Notification sent.");
    };

    // 📏 Calculate Distance Between Two Coordinates
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

    // 🚧 Check if user is inside a flood zone
    const checkFloodZone = (userCoords) => {
        if (!floodZones.length) {
            console.log("❌ No flood zones available.");
            return;
        }

        let isInFloodZone = false;

        floodZones.forEach((zone) => {
            const [zoneLat, zoneLng] = zone.location.coordinates;
            const distance = getDistance(userCoords.latitude, userCoords.longitude, zoneLat, zoneLng);

            console.log(`🌍 Checking flood zone: ${zone.name} → Distance: ${distance}m`);

            if (distance < 100) {
                console.log("🚨 USER IS IN A FLOOD ZONE! SENDING NOTIFICATION...");
                isInFloodZone = true;
                sendLocalNotification();
            }
        });

        if (!isInFloodZone) {
            console.log("✅ User is outside flood zones.");
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
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                showsUserLocation={true}
                followsUserLocation={true}
            >
                {/* Render Flood Zones from API */}
                {floodZones?.map((zone, index) => {
                    const [zoneLat, zoneLng] = zone.location.coordinates;
                    const pinColor = zone.riskLevel === "High" ? "red" : "orange";

                    return (
                        <Marker
                            key={index}
                            coordinate={{ latitude: zoneLat, longitude: zoneLng }}
                            title={zone.name}
                            description={`Address: ${zone.location.address}\nRisk Level: ${zone.riskLevel}`}
                            pinColor={pinColor}
                        />
                    );
                })}

                {/* User's Location Marker */}
                {location && (
                    <Marker
                        coordinate={{ latitude: location.latitude, longitude: location.longitude }}
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
