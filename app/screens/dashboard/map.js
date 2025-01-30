import { useState, useEffect } from 'react';
import { Text,View,StatusBar,Button  } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import tw from 'twrnc';
const Map = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    useEffect(() => {
        // Request location permissions 
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
              timeInterval: 300000, // 5 minute update interval
              distanceInterval: 10, // 10 meter minimum distance
            },
            (newLocation) => {
              setLocation(newLocation.coords);
            }
          );
        }
        getLocationPermission();
        
    }, []);
    if (errorMsg) {
        return <Text>{errorMsg}</Text>;
    }
    // Only render the MapView once the location is available
    if (!location) {
        return <Text style={tw`text-center`}>Fetching your location...</Text>;
    }
    return ( 
        <View style={tw`flex-1 justify-start items-center bg-blue-100`}>
            <StatusBar 
                backgroundColor="#DBEAFE" // Set background to white
                barStyle="dark-content" // Dark icons for visibility
                translucent={true} // Let the background image show through the status bar
            />
            {/* <Text style={tw`text-xl font-bold mb-4 bg-blue-100`}>Live Location Tracking</Text> */}
            <MapView
                style={tw`w-full h-full absolute bg-blue-100`}
                region={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                }}
                showsUserLocation={true} // Show user's location on the map
                followsUserLocation={true} // Auto-center map on user's location
                >
                <Marker 
                coordinate={{ latitude: location.latitude, longitude: location.longitude }} 
                title="Your Location"
                description={`Lat: ${location.latitude}, Lng: ${location.longitude}`} />
            </MapView>
        </View>
     );
}
 
export default Map;