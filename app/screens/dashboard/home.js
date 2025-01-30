import { Text,View,StatusBar,ScrollView  } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc'
import axios from 'axios';
import React, { useState, useEffect } from 'react';
const API_KEY = '9e7f8ffc53a6f67f8c8e662ba2adbf3a';

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
    return {
      location: response.data.name,
      temperature: response.data.main.temp,
      condition: response.data.weather[0].description,
      windSpeed: response.data.wind.speed,
      humidity: response.data.main.humidity,
      icon: getWeatherIcon(response.data.weather[0].main),
    };
  } catch (error) {
    console.error('Error fetching weather data', error);
    throw error;
  }
};


const WeatherComponent = ({ city }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const data = await getWeather(city);
      setWeather(data);
    };

    fetchWeather();
  }, [city]);

  if (!weather) {
    return <Text style={tw`text-center text-lg text-red-500`}>Loading...</Text>;
  }

  return (
    <View style={tw`bg-gray-100 rounded-lg shadow-lg p-6 mb-6`}>
      <Text style={tw`text-2xl font-bold mb-4 text-center text-blue-800`}>Weather</Text>
      <View style={tw`flex-row items-center`}>
        <MaterialCommunityIcons name={weather.icon} size={50} color="orange" />
        <View style={tw`ml-4`}>
          <Text style={tw`text-lg`}>
            <Text style={tw`font-semibold`}>Location:</Text> {weather.location}
          </Text>
          <Text style={tw`text-lg`}>
            <Text style={tw`font-semibold`}>Temperature:</Text> {weather.temperature}°C
          </Text>
          <Text style={tw`text-lg capitalize`}>
            <Text style={tw`font-semibold `}>Condition:</Text> {weather.condition}
          </Text>
          <Text style={tw`text-lg`}>
            <Text style={tw`font-semibold`}>Wind Speed:</Text> {weather.windSpeed} km/h
          </Text>
          <Text style={tw`text-lg`}>
            <Text style={tw`font-semibold`}>Humidity:</Text> {weather.humidity}%
          </Text>
        </View>
      </View>
    </View>
  );
};
const HomeScreen = () => {
    const floods = [
        {
          id: 1,
          title: 'Flood Alert in Teku',
          details: 'Heavy rainfall expected in the next 24 hours. Residents are advised to stay alert.',
          severity: 'High',
        },
        {
          id: 2,
          title: 'Flood Warning in kalimati',
          details: 'Water levels rising near Narayani River. Evacuate if necessary.',
          severity: 'Moderate',
        },
        {
          id: 3,
          title: 'Flood Advisory in thapathali',
          details: 'Moderate rain and potential waterlogging in low-lying areas.',
          severity: 'Low',
        },
        {
            id: 4,
            title: 'Flood Advisory in gaushala',
            details: 'Moderate rain and potential waterlogging in low-lying areas.',
            severity: 'Moderate',
          },
      ];
     





      // Severity color mapping
      const getSeverityColor = (severity) => {
        switch (severity) {
          case 'High':
            return 'bg-red-500';
          case 'Moderate':
            return 'bg-yellow-400';
          case 'Low':
            return 'bg-green-400';
          default:
            return 'bg-gray-500';
        }
      };
    
    return ( 
             
        <ScrollView style={tw`flex-1 bg-blue-100`}>
            <StatusBar 
        backgroundColor="#DBEAFE" // Set background to white
        barStyle="dark-content" // Dark icons for visibility
        translucent={true} // Let the background image show through the status bar
      />
      <View style={tw`p-4`}>
        {/*weather Section*/}
        
        <WeatherComponent city="Kathmandu" />
          {/* ) : (
            <Text style={tw`text-red-500 text-center`}>Failed to load weather data.</Text>
          )} */}
        </View>
        {/* Flood Section */}
        <View style={tw`bg-white rounded-lg shadow-lg p-6`}>
          <Text style={tw`text-2xl font-bold mb-4 text-center text-teal-600`}>Flood Alerts</Text>
          {floods.length > 0 ? (
            floods.map((flood) => (
              <View
                key={flood.id}
                style={tw`mb-6 border-l-4 ${getSeverityColor(flood.severity)} pl-4 py-3`}
              >
                <Text style={tw`text-lg font-semibold text-blue-800`}>{flood.title}</Text>
                <Text style={tw`text-sm text-black-600`}>{flood.details}</Text>
                <View
                  style={tw`mt-2 py-1 px-3 rounded-full ${getSeverityColor(
                    flood.severity
                  )} w-auto self-start`}
                >
                  <Text style={tw`text-white text-xs font-bold uppercase`}>
                    Severity: {flood.severity}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={tw`text-green-500 text-center text-lg`}>
              No flood alerts at the moment.
            </Text>
          )}
        </View>

        {/* Footer */}
        <View style={tw`mt-6`}>
          <Text style={tw`text-center text-black-500 text-sm`}>
            Stay safe and follow local advisories during adverse weather conditions.
          </Text>
        </View>
     
    </ScrollView>
       
     );
}
 
export default HomeScreen;