import { useState, useEffect } from 'react';
import { Text, View, StatusBar, Alert } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import tw from 'twrnc';

const FLOOD_ZONE_API = "http://192.168.0.7:5000/api/flood-zones"; // Update with your backend
const Map = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [floodZones, setFloodZones] = useState([]);

    useEffect(() => {
        const getLocationPermission = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation.coords);
            await fetchFloodZones(); // Fetch flood zones at startup

            Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 300000, // 5 minutes
                    distanceInterval: 10, // 10 meters
                },
                async (newLocation) => {
                    setLocation(newLocation.coords);
                    checkFloodZone(newLocation.coords);
                }
            );
        };

        getLocationPermission();
    }, []);

    const fetchFloodZones = async () => {
        try {
            console.log("FloodZone Connected");
            const response = await axios.get(FLOOD_ZONE_API);
            console.log("FloodZone Connected");
            setFloodZones(response.data);
        } catch (error) {
            console.error("Error fetching flood zones", error);
        }
    };

    const checkFloodZone = async (userCoords) => {
        const isInFloodZone = isUserInFloodZone(userCoords, floodZones);
        if (isInFloodZone) {
            sendPushNotification();
        }
    };

    const sendPushNotification = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Flood Warning!",
                body: "You have entered a flood zone. Stay safe!",
                sound: true,
            },
            trigger: null, // Instant notification
        });
    };

    if (errorMsg) return <Text>{errorMsg}</Text>;
    if (!location) return <Text style={tw`text-center`}>Fetching your location...</Text>;

    return (
        <View style={tw`flex-1 justify-start items-center bg-blue-100`}>
            <StatusBar backgroundColor="#DBEAFE" barStyle="dark-content" translucent={true} />
            <MapView
                style={tw`w-full h-full absolute bg-blue-100`}
                region={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
                followsUserLocation={true}
            >
                <Marker
                    coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                    title="Your Location"
                    description={`Lat: ${location.latitude}, Lng: ${location.longitude}`}
                />
            </MapView>
        </View>
    );
};

const isUserInFloodZone = (userLocation, floodZones) => {
    return floodZones.some(zone => {
        const [zoneLat, zoneLng] = zone.location.coordinates;
        const distance = getDistance(userLocation.latitude, userLocation.longitude, zoneLat, zoneLng);
        return distance < 100; // Alert if within 100 meters
    });
};

const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371e3; // Earth's radius in meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export default Map;
