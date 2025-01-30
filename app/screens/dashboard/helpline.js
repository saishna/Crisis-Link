import React, { useState } from "react";
import { Text, View, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { Ionicons, Fontisto, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";

const Helpline = () => {
  const [showHospitals, setShowHospitals] = useState(true); // Manage the view for hospitals or emergency services

  const Hospitals = [
    { name: "Grande Hospital", number: "01-4xxxxx" },
    { name: "Medicity Hospital", number: "01-4xxxxx" },
    { name: "Bir Hospital", number: "01-4xxxxx" },
  ];

  const helplines = [
    { name: "Police Support", number: "100" },
    { name: "Fire Support", number: "101" },
    { name: "Ambulance", number: "102" },
    { name: "Traffic Support", number: "103" },
  ];

  // Render hospital list
  const renderHospitals = () => (
    <ScrollView>
      {Hospitals.map((hospital, index) => (
        <TouchableOpacity
          key={index}
          style={tw`bg-gray-200 p-5 rounded-lg shadow-md border border-gray-300 mb-2`}
        >
          <FontAwesome5 name="hospital" size={24} color="black" style={tw`mb--5 mr-3`} />
          <Text style={tw`text-base font-medium text-gray-900 ml-10 mt--3`}>{hospital.name}</Text>
          <Text style={tw`text-base text-gray-600 ml-10`}>{hospital.number}</Text>
          <View style={tw`flex-row ml-50`}>
            <TouchableOpacity>
              <Ionicons name="call" size={30} color="green" style={tw`ml-1 mt--10`} />
            </TouchableOpacity>
            <TouchableOpacity style={tw`ml-5 mt--10`}>
              <Fontisto name="email" size={30} color="blue" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // Render emergency services
  const renderEmergencyServices = () => (
    <ScrollView>
      {helplines.map((helpline, index) => (
        <TouchableOpacity
          key={index}
          style={tw`bg-gray-200 p-5 rounded-lg shadow-md border border-gray-300 mb-2`}
        >
          <MaterialIcons name="contact-emergency" size={24} color="black" style={tw`mb--5 mr-3`} />
          <Text style={tw`text-base font-medium text-gray-900 ml-10 mt--3`}>{helpline.name}</Text>
          <Text style={tw`text-base text-gray-600 ml-10`}>{helpline.number}</Text>
          <View style={tw`flex-row ml-50`}>
            <TouchableOpacity>
              <Ionicons name="call" size={30} color="green" style={tw`ml-1 mt--10`} />
            </TouchableOpacity>
            <TouchableOpacity style={tw`ml-5 mt--10`}>
              <Fontisto name="email" size={30} color="blue" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={tw`flex-1 bg-blue-100 p-4 `}>
      <Text style={tw`text-2xl font-bold mb-5 `}>HELPLINE</Text>
      <View style={tw`flex-row  mb-5 justify-center`}>
        <StatusBar backgroundColor="#DBEAFE" barStyle="dark-content" translucent />
        <TouchableOpacity
          style={tw`flex-1 py-4 items-center items-center bg-gray-100 rounded-full mr-2  `}
          onPress={() => setShowHospitals(true)} // Show hospital list
        >
          <Text style={tw`font-bold`}>HOSPITALS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-1 py-4 items-center bg-gray-100 bg-gray-100 rounded-full mr-2`}
          onPress={() => setShowHospitals(false)} // Show emergency services
        >
          <Text style={tw`font-bold`}>EMERGENCY</Text>
        </TouchableOpacity>
      </View>

      {/* Render the corresponding list based on the state */}
      {showHospitals ? renderHospitals() : renderEmergencyServices()}
    </View>
  );
};

export default Helpline;
