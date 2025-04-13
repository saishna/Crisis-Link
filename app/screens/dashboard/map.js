import { useState, useEffect } from 'react';
import { Text, View, StatusBar } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import tw from 'twrnc';

// API URL to fetch flood zones data
const API_URL = "http://192.168.1.6:5000/api/flood-zones"; // Replace with your API endpoint

const MapScreen = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [floodZones, setFloodZones] = useState([]);  // State for flood zones
    const [notificationInterval, setNotificationInterval] = useState(null); // Interval state for continuous notifications

    // Request permissions and track location
    useEffect(() => {
        const checkPermissions = async () => {
            const { status } = await Notifications.getPermissionsAsync();
            if (status !== 'granted') {
                console.log('Notification permission not granted');
                await Notifications.requestPermissionsAsync();
            } else {
                console.log('Notification permission granted');
            }
        };

        checkPermissions();  // Check notification permissions

        const getLocationPermission = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation.coords);

            Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 10000, // Check every 10 seconds
                    distanceInterval: 10, // Check every 10 meters
                },
                (newLocation) => {
                    setLocation(newLocation.coords);
                    checkFloodZone(newLocation.coords); // Check if user is in flood zone
                }
            );
        };

        getLocationPermission();  // Request location permission and get user's location

        // Show notifications even when app is open
        const subscription = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification received in foreground:', notification);
            Notifications.presentNotificationAsync(notification.request.content);  // Force display
        });

        return () => subscription.remove();
    }, []);

    // Fetch flood zones data from the API
    const fetchFloodZones = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setFloodZones(data);  // Set the fetched flood zones data to state
        } catch (error) {
            console.error('Error fetching flood zones:', error);
            setErrorMsg('Failed to load flood zones.');
        }
    };

    // Send local notification
    const sendLocalNotification = async () => {
        console.log("Sending local notification...");

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "🚨 Flood Alert! 🚨",
                body: "⚠️ You are in a flood-prone area. Stay alert!",
                sound: "default",
                vibrate: [500, 500], // Vibration pattern
                priority: Notifications.AndroidNotificationPriority.MAX,
            },
            trigger: null, // Send immediately
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
        console.log("Checking if user is in flood zone...");

        if (!floodZones.length) return;

        const isInFloodZone = floodZones.some((zone) => {
            const coordinates = zone.location.coordinates;
            const [zoneLat, zoneLng] = coordinates;
            const distance = getDistance(userCoords.latitude, userCoords.longitude, zoneLat, zoneLng);
            console.log(`Distance to ${zone.name}: ${distance} meters`);
            return distance < 10; // Alert if within 1000 meters (1 km)
        });

        if (isInFloodZone && !notificationInterval) {
            console.log("User is in a flood zone! Triggering continuous notifications.");
            // Start sending notifications every 1 second
            const interval = setInterval(() => {
                sendLocalNotification();
            }, 10000); // 1 second interval
            setNotificationInterval(interval); // Store the interval ID
        } else if (!isInFloodZone && notificationInterval) {
            console.log("User is no longer in a flood zone. Stopping notifications.");
            clearInterval(notificationInterval); // Stop sending notifications
            setNotificationInterval(null); // Clear interval ID
        }
    };

    // Fetch flood zones when the component is mounted
    useEffect(() => {
        fetchFloodZones();  // Fetch flood zones from API
    }, []);

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
                {floodZones.map((zone, index) => {
                    const [zoneLat, zoneLng] = zone.location.coordinates;
                    const pinColor = zone.riskLevel === "High" ? "red" : "orange"; // Customize based on risk level

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