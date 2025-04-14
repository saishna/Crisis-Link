import { useState, useEffect } from 'react';
import { Text, View, StatusBar, Vibration } from "react-native";
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import tw from 'twrnc';

const API_URL = "http://192.168.1.6:5000/api/flood-zones";

const MapScreen = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [floodZones, setFloodZones] = useState([]);
    const [notificationInterval, setNotificationInterval] = useState(null);
    const [highRiskAlert, setHighRiskAlert] = useState(false);
    const [divertedRoute, setDivertedRoute] = useState([]); // New state to track diverted route
    const [overlayVisible, setOverlayVisible] = useState(false); // State for overlay visibility

    useEffect(() => {
        const setupPermissions = async () => {
            const notifPerm = await Notifications.getPermissionsAsync();
            if (notifPerm.status !== 'granted') {
                await Notifications.requestPermissionsAsync();
            }

            const locPerm = await Location.requestForegroundPermissionsAsync();
            if (locPerm.status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            const currentLoc = await Location.getCurrentPositionAsync({});
            setLocation(currentLoc.coords);

            Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 10000,
                    distanceInterval: 10,
                },
                (newLocation) => {
                    setLocation(newLocation.coords);
                }
            );
        };

        setupPermissions();

        const foregroundSub = Notifications.addNotificationReceivedListener(notification => {
            Notifications.presentNotificationAsync(notification.request.content);
        });

        return () => foregroundSub.remove();
    }, []);

    useEffect(() => {
        fetchFloodZones();
        const interval = setInterval(() => {
            fetchFloodZones();
        }, 30000); // fetch every 30 seconds

        return () => clearInterval(interval);
    }, []);

    // 🔁 Check zone if location or zones change
    useEffect(() => {
        if (location && floodZones.length) {
            checkFloodZone(location);
        }
    }, [location, floodZones]);

    const fetchFloodZones = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setFloodZones(data);
        } catch (error) {
            console.error('Error fetching flood zones:', error);
            setErrorMsg('Failed to load flood zones.');
        }
    };

    const getDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371e3;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const checkFloodZone = (userCoords) => {
        if (!floodZones.length) return;

        let closestZone = null;
        let minDistance = Infinity;

        floodZones.forEach((zone) => {
            if (!zone.resolved) {
                const [zoneLat, zoneLng] = zone.location.coordinates;
                const distance = getDistance(userCoords.latitude, userCoords.longitude, zoneLat, zoneLng);
                if (distance < 1000 && distance < minDistance) {
                    closestZone = zone;
                    minDistance = distance;
                }
            }
        });

        if (closestZone) {
            // Trigger route diversion when near a flood zone
            const newRoute = calculateDivertedRoute(userCoords, closestZone);
            setDivertedRoute(newRoute);

            if (!notificationInterval) {
                const interval = setInterval(() => {
                    sendRiskLevelNotification(closestZone.riskLevel);
                }, 10000); // every 10 sec
                setNotificationInterval(interval);
            }

            // Show the overlay for 5 seconds after entering the high-risk zone
            setOverlayVisible(true);
            setTimeout(() => {
                setOverlayVisible(false); // Hide the overlay after 5 seconds
            }, 5000);
        } else if (notificationInterval) {
            clearInterval(notificationInterval);
            setNotificationInterval(null);
            setHighRiskAlert(false);
            setDivertedRoute([]); // Clear diverted route when not in a flood zone
            Vibration.cancel();
        }
    };

    // Simulate diversion route
    const calculateDivertedRoute = (userCoords, floodZone) => {
        // For the sake of the simulation, generate a simple diverted route
        const diversionPath = [
            { latitude: userCoords.latitude, longitude: userCoords.longitude },
            { latitude: userCoords.latitude + 0.005, longitude: userCoords.longitude + 0.005 },
            { latitude: userCoords.latitude + 0.01, longitude: userCoords.longitude + 0.01 },
        ];
        return diversionPath;
    };

    const sendRiskLevelNotification = async (riskLevel) => {
        let title = "🌧️ Flood Alert";
        let body = "You are near a flood-prone area.";
        let vibratePattern = [500, 500];
        let sound = "default";

        if (riskLevel === "High") {
            title = "🚨 High Risk Flood Alert!";
            body = "⚠️ You are in a high-risk flood area. Take action immediately!";
            Vibration.vibrate([1000, 500, 1000], true); // continuous
            setHighRiskAlert(true);
        } else {
            Vibration.cancel();
            setHighRiskAlert(false);
            if (riskLevel === "Medium") {
                title = "⚠️ Medium Risk Flood Area";
                body = "Moderate flood risk nearby.";
            } else if (riskLevel === "Low") {
                title = "ℹ️ Low Risk Flood Zone";
                body = "Minimal flood risk in your area.";
            }
        }

        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                sound,
                vibrate: vibratePattern,
                priority: Notifications.AndroidNotificationPriority.MAX,
            },
            trigger: null,
        });
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
                {floodZones.map((zone, index) => {
                    const [lat, lng] = zone.location.coordinates;
                    const pinColor = zone.riskLevel === "High" ? "red" :
                        zone.riskLevel === "Medium" ? "orange" : "yellow";

                    return (
                        <Marker
                            key={index}
                            coordinate={{ latitude: lat, longitude: lng }}
                            title={zone.name}
                            description={`Address: ${zone.location.address}\nRisk Level: ${zone.riskLevel}`}
                            pinColor={pinColor}
                        />
                    );
                })}

                <Marker
                    coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                    title="Your Location"
                    description={`Lat: ${location.latitude}, Lng: ${location.longitude}`}
                    pinColor="blue"
                />

                {/* Display the diverted route */}
                {divertedRoute.length > 0 && (
                    <Polyline
                        coordinates={divertedRoute}
                        strokeColor="green"
                        strokeWidth={6}
                    />
                )}
            </MapView>

            {/* Show the high-risk alert overlay for 5 seconds */}
            {overlayVisible && (
                <View style={tw`absolute inset-0 bg-red-900 bg-opacity-90 z-50 justify-center items-center`}>
                    <Text style={tw`text-white text-2xl font-bold mb-2`}>🚨 HIGH RISK FLOOD ALERT 🚨</Text>
                    <Text style={tw`text-white text-center text-lg px-6`}>
                        You are in a high-risk flood zone. Please evacuate or take immediate safety measures.
                    </Text>
                </View>
            )}
        </View>
    );
};

export default MapScreen;
