import React, { useState } from "react";
import { Text, View, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { Ionicons, Fontisto, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import tw from "twrnc";

const Helpline = () => {
  const [showHospitals, setShowHospitals] = useState(true);

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

  const renderCard = (item, isHospital = true) => (
    <View
      key={item.name}
      style={tw`bg-white p-5 rounded-2xl shadow-lg mb-4 mx-2 flex-row items-start`}
    >
      {isHospital ? (
        <FontAwesome5 name="hospital" size={30} color="#4F46E5" style={tw`mt-1`} />
      ) : (
        <MaterialIcons name="contact-emergency" size={30} color="#DC2626" style={tw`mt-1`} />
      )}

      <View style={tw`ml-4 flex-1`}>
        <Text style={tw`text-lg font-bold text-gray-800`}>{item.name}</Text>
        <Text style={tw`text-base text-gray-500 mb-2`}>{item.number}</Text>
        <View style={tw`flex-row mt-2`}>
          <TouchableOpacity>
            <Ionicons name="call" size={28} color="green" style={tw`mr-5`} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Fontisto name="email" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#cbb4d4', '#CFDEF3']} style={tw`flex-1`}>
      <StatusBar backgroundColor="#cbb4d4" barStyle="dark-content" translucent />

      <ScrollView
        contentContainerStyle={tw`pt-16 pb-10 px-4`}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={tw`text-3xl font-bold text-gray-800 mb-6 text-center`}>Helpline Services</Text>

        <View style={tw`flex-row mb-6 justify-center`}>
          <TouchableOpacity
            style={tw`${showHospitals ? 'bg-white shadow-md' : 'bg-gray-200'} flex-1 py-3 mx-1 rounded-full`}
            onPress={() => setShowHospitals(true)}
          >
            <Text style={tw`text-center font-semibold text-lg text-gray-800`}>Hospitals</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`${!showHospitals ? 'bg-white shadow-md' : 'bg-gray-200'} flex-1 py-3 mx-1 rounded-full`}
            onPress={() => setShowHospitals(false)}
          >
            <Text style={tw`text-center font-semibold text-lg text-gray-800`}>Emergency</Text>
          </TouchableOpacity>
        </View>

        {(showHospitals ? Hospitals : helplines).map((item) =>
          renderCard(item, showHospitals)
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default Helpline;
