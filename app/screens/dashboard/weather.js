import axios from 'axios';
import { Text, View, TextInput, ScrollView, StatusBar, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import {LinearGradient} from 'expo-linear-gradient';
import tw from 'twrnc';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const API_KEY = '9e7f8ffc53a6f67f8c8e662ba2adbf3a';
//poppins,lato,montsaret,  font family
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
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data', error);
    throw error;
  }
};

const getForecast = async (city) => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching forecast data', error);
    throw error;
  }
};

const WeatherScreen = () => {
  const [city, setCity] = useState('Kathmandu');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    if (!city) return;
    try {
      const weather = await getWeather(city);
      const forecast = await getForecast(city);
      setWeatherData(weather);
      setForecastData(forecast);
      setError(null);
    } catch (err) {
      setError('Failed to fetch weather data');
      setWeatherData(null);
      setForecastData(null);
    }
  };

  return (
    <LinearGradient colors={['#cbb4d4','#CFDEF3']} style={tw`flex-1 p-5 `}> 
      <StatusBar backgroundColor="#cbb4d4" barStyle="dark-content" translucent={true} />
      <ScrollView>
        {weatherData && (
          <>
            <Text style={tw`mt-7 text-lg font-semibold text-3xl text-gray-700 text-center`}>{weatherData.name}</Text>
            <Text style={tw`text-gray-800 text-2xl text-center mt-3 text-sm`}>{new Date().toDateString()}</Text>
            
            <View style={tw`items-center mt-4`}>
              <Text style={tw`text-7xl font-bold text-blue-700`}>{Math.round(weatherData.main.temp)}°</Text>
              <Text style={tw`text-gray-700 text-lg capitalize`}>{weatherData.weather[0].description}</Text>
              <Icon name={getWeatherIcon(weatherData.weather[0].main)} size={100} color="white" />
            </View>
            
            <View style={tw`flex-row justify-around bg-white p-4 rounded-xl shadow-lg mt-4`}>
              <View style={tw`items-center`}>
                <Icon name="weather-rainy" size={30} color="#37b1f5" />
                <Text style={tw`text-black-600`}>Precipitation</Text>
                <Text style={tw`text-lg font-semibold text-gray-800`}>30%</Text>
              </View>
              <View style={tw`items-center`}>
                <Icon name="water" size={30} color="#37b1f5" />
                <Text style={tw`text-gray-600`}>Humidity</Text>
                <Text style={tw`text-lg font-semibold text-gray-800`}>{weatherData.main.humidity}%</Text>
              </View>
              <View style={tw`items-center`}>
                <Icon name="weather-windy" size={30} color="#37b1f5" />
                <Text style={tw`text-gray-600`}>Wind Speed</Text>
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