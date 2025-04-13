import React, { useState, useEffect, useRef } from 'react';
import { Text, View, ScrollView, StatusBar, Platform } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Constants from 'expo-constants';
import tw from 'twrnc';

const API_KEY = '9e7f8ffc53a6f67f8c8e662ba2adbf3a';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const getWeatherIcon = (weather) => {
    switch (weather) {
        case 'Clear': return 'weather-sunny';
        case 'Clouds': return 'weather-cloudy';
        case 'Rain': return 'weather-rainy';
        case 'Drizzle': return 'weather-partly-rainy';
        case 'Thunderstorm': return 'weather-lightning';
        case 'Snow': return 'weather-snowy';
        default: return 'weather-cloudy';
    }
};

const getWeather = async (city) => {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
            q: city,
            appid: API_KEY,
            units: 'metric',
        },
    });
    return response.data;
};

const getForecast = async (city) => {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
        params: {
            q: city,
            appid: API_KEY,
            units: 'metric',
        },
    });
    return response.data;
};

const sendNotification = async (title, body) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: body,
        },
        trigger: null,
    });
};

const WeatherScreen = () => {
    const [city, setCity] = useState('Kathmandu');
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [error, setError] = useState(null);
    const [expoPushToken, setExpoPushToken] = useState('');
    const notificationListener = useRef();
    const responseListener = useRef();

    // Request permissions on app load
    useEffect(() => {
        const requestPermissions = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log("Permission not granted for push notifications");
            }
        };

        requestPermissions();
    }, []);

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => { });
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => { });
        fetchWeather();

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const fetchWeather = async () => {
        if (!city) return;
        try {
            const data = await getWeather(city);
            const forecast = await getForecast(city);
            setWeatherData(data);
            setForecastData(forecast);
            setError(null);

            // === SIMULATE rainfall (Change this value to test) ===
            const rainAmount = 10; // Try 1, 5, 10 manually to test light/moderate/heavy

            if (rainAmount > 7.6) {
                sendNotification('🚨 Heavy Rain Alert', 'Stay indoors and be safe!');
            } else if (rainAmount > 2.5) {
                sendNotification('🌧️ Moderate Rain', 'Carry an umbrella!');
            } else if (rainAmount > 0) {
                sendNotification('🌦️ Light Rain', 'Light showers expected.');
            }

        } catch (err) {
            setError('Failed to fetch weather data');
            setWeatherData(null);
            setForecastData(null);
        }
    };

    return (
        <LinearGradient colors={['#cbb4d4', '#CFDEF3']} style={tw`flex-1 p-5`}>
            <StatusBar backgroundColor="#cbb4d4" barStyle="dark-content" translucent={true} />
            <ScrollView>
                <View style={tw`mt-8`}>
                    <TextInput
                        placeholder="Enter City"
                        value={city}
                        onChangeText={setCity}
                        style={tw`bg-white p-3 rounded-xl mb-4`}
                    />
                    <TouchableOpacity
                        onPress={fetchWeather}
                        style={tw`bg-blue-500 p-3 rounded-xl mb-6`}>
                        <Text style={tw`text-white text-center text-lg`}>Get Weather</Text>
                    </TouchableOpacity>
                </View>

                {weatherData && (
                    <>
                        <Text style={tw`text-3xl font-semibold text-gray-700 text-center`}>{weatherData.name}</Text>
                        <Text style={tw`text-gray-800 text-xl text-center mt-2`}>{new Date().toDateString()}</Text>

                        <View style={tw`items-center mt-4`}>
                            <Text style={tw`text-6xl font-bold text-blue-700`}>{Math.round(weatherData.main.temp)}°</Text>
                            <Text style={tw`text-gray-700 text-lg capitalize`}>{weatherData.weather[0].description}</Text>
                            <Icon name={getWeatherIcon(weatherData.weather[0].main)} size={100} color="white" />
                        </View>

                        <View style={tw`flex-row justify-around bg-white p-4 rounded-xl shadow-lg mt-4`}>
                            <View style={tw`items-center`}>
                                <Icon name="weather-rainy" size={30} color="#37b1f5" />
                                <Text style={tw`text-gray-600`}>Humidity</Text>
                                <Text style={tw`text-lg font-semibold text-gray-800`}>{weatherData.main.humidity}%</Text>
                            </View>
                            <View style={tw`items-center`}>
                                <Icon name="weather-windy" size={30} color="#37b1f5" />
                                <Text style={tw`text-gray-600`}>Wind</Text>
                                <Text style={tw`text-lg font-semibold text-gray-800`}>{weatherData.wind.speed} km/h</Text>
                            </View>
                        </View>
                    </>
                )}

                {forecastData && (
                    <View style={tw`mt-6`}>
                        <Text style={tw`text-lg font-bold text-gray-900 mb-2`}>7-Day Forecast</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {forecastData.list.filter((item, index) => index % 8 === 0).map((day, index) => (
                                <View key={index} style={tw`mt-2 bg-white p-4 rounded-lg shadow-md mx-2 items-center`}>
                                    <Text style={tw`text-black`}>{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</Text>
                                    <Icon name={getWeatherIcon(day.weather[0].main)} size={50} color="#FFCC33" />
                                    <Text style={tw`text-lg font-bold text-gray-800`}>{Math.round(day.main.temp)}°</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {error && <Text style={tw`text-red-500 text-center mt-4`}>{error}</Text>}
            </ScrollView>
        </LinearGradient>
    );
};

export default WeatherScreen;

async function registerForPushNotificationsAsync() {
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        return (await Notifications.getExpoPushTokenAsync()).data;
    } else {
        alert('Must use physical device for Push Notifications');
    }
}
