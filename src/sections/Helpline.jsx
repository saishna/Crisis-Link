import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Edit, Trash2, Plus, X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

const api = {
  async getHospitals() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/helplines`);
      if (!response.ok) throw new Error('Failed to fetch hospitals');
      return response.json();
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      throw error;
    }
  },

  async addHospital(hospitalData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/helplines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hospitalData),
      });
      if (!response.ok) throw new Error('Failed to add hospital');
      return response.json();
    } catch (error) {
      console.error('Error adding hospital:', error);
      throw error;
    }
  },

  async updateHospital(id, hospitalData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/helplines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hospitalData),
      });
      if (!response.ok) throw new Error('Failed to update hospital');
      return response.json();
    } catch (error) {
      console.error('Error updating hospital:', error);
      throw error;
    }
  },

  async deleteHospital(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/helplines/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete hospital');
      return id;
    } catch (error) {
      console.error('Error deleting hospital:', error);
      throw error;
    }
  },
};

const MapComponent = ({ address }) => {
  const openMap = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  return (
    <button onClick={openMap} className="text-blue-600 hover:text-blue-800 flex items-center">
      <MapPin className="mr-2" size={16} /> View on Map
    </button>
  );
};

const AddHospitalModal = ({ onClose, onSubmit }) => {
  const [hospitalData, setHospitalData] = useState({
    name: '',
    location: '',
    phones: [''],
    email: '',
    type: 'Hospital Contacts'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hospitalData.name || !hospitalData.location || !hospitalData.email || hospitalData.phones.length === 0) {
      alert("Please fill all fields");
      return;
    }
    const hospitalRequestdata = {
      name: hospitalData.name,
      latitude: 27.7133,
      longitude: 85.3233,
      number: hospitalData.phones.join(", "),
      email: hospitalData.email,
      type: hospitalData.type,
      address: hospitalData.location 
    };
    onSubmit(hospitalRequestdata);
  };

  const addPhoneField = () => {
    setHospitalData({
      ...hospitalData,
      phones: [...hospitalData.phones, '']
    });
  };

  const removePhoneField = (index) => {
    const newPhones = hospitalData.phones.filter((_, i) => i !== index);
    setHospitalData({ ...hospitalData, phones: newPhones });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Contacts</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={hospitalData.type}
            onChange={(e) => setHospitalData({ ...hospitalData, type: e.target.value })}
            className="w-full p-2 border rounded"
            required
          >
            <option value="Hospital Contacts">Hospital Contacts</option>
            <option value="Emergency Contacts">Emergency Contacts</option>
          </select>
          
          <input
            type="text"
            placeholder="Name"
            value={hospitalData.name}
            onChange={(e) => setHospitalData({ ...hospitalData, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={hospitalData.location}
            onChange={(e) => setHospitalData({ ...hospitalData, location: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          {hospitalData.phones.map((phone, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => {
                  const newPhones = [...hospitalData.phones];
                  newPhones[index] = e.target.value;
                  setHospitalData({ ...hospitalData, phones: newPhones });
                }}
                className="w-full p-2 border rounded"
                required
              />
              {index > 0 && (
                <button 
                  type="button"
                  onClick={() => removePhoneField(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 />
                </button>
              )}
            </div>
          ))}
          <button 
            type="button"
            onClick={addPhoneField}
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            <Plus className="mr-2" /> Add Phone Number
          </button>
          <input
            type="email"
            placeholder="Email"
            value={hospitalData.email}
            onChange={(e) => setHospitalData({ ...hospitalData, email: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <div className="flex justify-end space-x-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditHospitalModal = ({ hospital, onClose, onSubmit }) => {

  const [hospitalData, setHospitalData] = useState({
    ...hospital,
    phones: hospital.number.split(",").map(phone => phone.trim()),
    location: hospital.address
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hospitalData.name || !hospitalData.location || !hospitalData.email || hospitalData.phones.length === 0) {
      alert("Please fill all fields");
      return;
    }
    const updatedData = {
      name: hospitalData.name,
      email: hospitalData.email,
      number: hospitalData.phones[0],
      address: hospitalData.location,
      type: hospitalData.type,
      latitude: hospital.latitude || 27.7133,
      longitude: hospital.longitude || 85.3233
    };
    onSubmit(updatedData);
  };

  const addPhoneField = () => {
    setHospitalData({
      ...hospitalData,
      phones: [...hospitalData.phones, '']
    });
  };

  const removePhoneField = (index) => {
    const newPhones = hospitalData.phones.filter((_, i) => i !== index);
    setHospitalData({ ...hospitalData, phones: newPhones });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Contacts</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={hospitalData.type}
            onChange={(e) => setHospitalData({ ...hospitalData, type: e.target.value })}
            className="w-full p-2 border rounded"
            required
          >
            <option value="Hospital Contacts">Hospital Contacts</option>
            <option value="Emergency Contacts">Emergency Contacts</option>
          </select>
          <input
            type="text"
            placeholder="Name"
            value={hospitalData.name}
            onChange={(e) => setHospitalData({ ...hospitalData, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={hospitalData.location}
            onChange={(e) => setHospitalData({ ...hospitalData, location: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          {hospitalData.phones.map((phone, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => {
                  const newPhones = [...hospitalData.phones];
                  newPhones[index] = e.target.value;
                  setHospitalData({ ...hospitalData, phones: newPhones });
                }}
                className="w-full p-2 border rounded"
                required
              />
              {index > 0 && (
                <button 
                  type="button"
                  onClick={() => removePhoneField(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 />
                </button>
              )}
            </div>
          ))}
          <button 
            type="button"
            onClick={addPhoneField}
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            <Plus className="mr-2" /> Add Phone Number
          </button>
          <input
            type="email"
            placeholder="Email"
            value={hospitalData.email}
            onChange={(e) => setHospitalData({ ...hospitalData, email: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <div className="flex justify-end space-x-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Helpline = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  console.log(filteredHospitals)

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await api.getHospitals();
        setHospitals(data);
        setFilteredHospitals(data);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      }
    };
    fetchHospitals();
  }, []);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredHospitals(hospitals);
    } else if (activeFilter === 'hospital') {
      setFilteredHospitals(hospitals.filter(h => h.type === 'Hospital Contacts'));
    } else if (activeFilter === 'emergency') {
      setFilteredHospitals(hospitals.filter(h => h.type === 'Emergency Contacts'));
    }
  }, [activeFilter, hospitals]);

  const handleAddHospital = async (hospitalData) => {
    try {
      const newHospital = await api.addHospital(hospitalData);
      setHospitals([...hospitals, newHospital]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding hospital:', error);
    }
  };

  const handleUpdateHospital = async (updatedData) => {
    
    try {
      const updated = await api.updateHospital(selectedHospital._id, updatedData);
      setHospitals(hospitals.map(h => h._id === selectedHospital._id ? updated : h));
      setSelectedHospital(null);
    } catch (error) {
      console.error('Error updating hospital:', error);
    }
  };

  const handleDeleteHospital = async (id) => {

    try {
      await api.deleteHospital(id);
      setHospitals(hospitals.filter(h => h._id !== id));
    } catch (error) {
      console.error('Error deleting hospital:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex justify-between items-center p-4 md:p-6 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">Active Helpline Contacts</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded flex items-center ${
              activeFilter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Contacts
          </button>
          <button 
            onClick={() => setActiveFilter('hospital')}
            className={`px-4 py-2 rounded flex items-center ${
              activeFilter === 'hospital' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Hospital Contacts
          </button>
          <button 
            onClick={() => setActiveFilter('emergency')}
            className={`px-4 py-2 rounded flex items-center ${
              activeFilter === 'emergency' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Emergency Contacts
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600"
          >
            <Plus className="mr-2" /> Add Contacts
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredHospitals.map(hospital => (
            <div key={hospital.id} className="bg-white shadow-md rounded-lg p-4 md:p-6 relative">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-4">
                {hospital.name}
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                Type: {hospital.type}
              </p>
              <div className="space-y-2 text-sm md:text-base text-gray-600">
                <p className="flex items-center">
                  <MapPin className="mr-2 text-blue-500" size={16} /> 
                  {hospital.address}
                </p>
                <p className="flex items-center">
                  <Phone className="mr-2 text-green-500" size={16} /> 
                  {hospital.number}
                </p>
                <p className="flex items-center">
                  <Mail className="mr-2 text-red-500" size={16} /> 
                  {hospital.email}
                </p>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <button 
                  onClick={() => setSelectedHospital(hospital)}
                  className="text-yellow-500 hover:text-yellow-700"
                >
                  <Edit />
                </button>
                <button 
                  onClick={() => handleDeleteHospital(hospital._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isAddModalOpen && (
        <AddHospitalModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddHospital}
        />
      )}

      {selectedHospital && (
        <EditHospitalModal
          hospital={selectedHospital}
          onClose={() => setSelectedHospital(null)}
          onSubmit={handleUpdateHospital}
        />
      )}
    </div>
  );
};

export default Helpline;












































































// import React, { useState, useEffect } from 'react';
// import { 
//   MapPin, 
//   Phone, 
//   Mail, 
//   Edit, 
//   Trash2, 
//   Plus, 
//   X 
// } from 'lucide-react';

// // Replace this with your actual API base URL
// const API_BASE_URL = 'http://localhost:5000';

// const api = {
//   async getHospitals() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/helplines`);
//       if (!response.ok) throw new Error('Failed to fetch hospitals');
//       return response.json();
//     } catch (error) {
//       console.error('Error fetching hospitals:', error);
//       throw error;
//     }
//   },

//   async addHospital(hospitalData) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/helplines`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(hospitalData),
//       });
//       if (!response.ok) throw new Error('Failed to add hospital');
//       return response.json();
//     } catch (error) {
//       console.error('Error adding hospital:', error);
//       throw error;
//     }
//   },

//   async updateHospital(id, hospitalData) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/helpline/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(hospitalData),
//       });
//       if (!response.ok) throw new Error('Failed to update hospital');
//       return response.json();
//     } catch (error) {
//       console.error('Error updating hospital:', error);
//       throw error;
//     }
//   },

//   async deleteHospital(id) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/helpline/${id}`, {
//         method: 'DELETE',
//       });
//       if (!response.ok) throw new Error('Failed to delete hospital');
//       return id;
//     } catch (error) {
//       console.error('Error deleting hospital:', error);
//       throw error;
//     }
//   },
// };

// const MapComponent = ({ address }) => {
//   const openMap = () => {
//     window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
//   };

//   return (
//     <button 
//       onClick={openMap} 
//       className="text-blue-600 hover:text-blue-800 flex items-center"
//     >
//       <MapPin className="mr-2" size={16} /> View on Map
//     </button>
//   );
// };

// const AddHospitalModal = ({ onClose, onSubmit }) => {
//   const [hospitalData, setHospitalData] = useState({
//     name: '',
//     location: '',
//     phones: [''],
//     email: '',
//     type: 'Hospital Contacts'
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!hospitalData.name || !hospitalData.location || !hospitalData.email || hospitalData.phones.length === 0) {
//       alert("Please fill all fields");
//       return;
//     }
//     const hospitalRequestdata = {
//       name: hospitalData.name,
//       latitude: 27.7133,
//       longitude: 85.3233,
//       number: hospitalData.phones[0],
//       email: hospitalData.email,
//       address: hospitalData.location 
//     }

//     onSubmit(hospitalRequestdata);
//   };

//   const addPhoneField = () => {
//     setHospitalData({
//       ...hospitalData,
//       phones: [...hospitalData.phones, '']
//     });
//   };

//   const removePhoneField = (index) => {
//     const newPhones = hospitalData.phones.filter((_, i) => i !== index);
//     setHospitalData({ ...hospitalData, phones: newPhones });
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Add Contacts</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X />
//           </button>
//         </div>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <select
//             value={hospitalData.type}
//             onChange={(e) => setHospitalData({ ...hospitalData, type: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           >
//             <option value="Hospital Contacts">Hospital Contacts</option>
//             <option value="Emergency Contacts">Emergency Contacts</option>
//           </select>
//           <input
//             type="text"
//             placeholder="Name"
//             value={hospitalData.name}
//             onChange={(e) => setHospitalData({ ...hospitalData, name: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           />
//           <input
//             type="text"
//             placeholder="Location"
//             value={hospitalData.location}
//             onChange={(e) => setHospitalData({ ...hospitalData, location: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           />
//           {hospitalData.phones.map((phone, index) => (
//             <div key={index} className="flex items-center space-x-2">
//               <input
//                 type="tel"
//                 placeholder="Phone Number"
//                 value={phone}
//                 onChange={(e) => {
//                   const newPhones = [...hospitalData.phones];
//                   newPhones[index] = e.target.value;
//                   setHospitalData({ ...hospitalData, phones: newPhones });
//                 }}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//               {index > 0 && (
//                 <button 
//                   type="button"
//                   onClick={() => removePhoneField(index)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <Trash2 />
//                 </button>
//               )}
//             </div>
//           ))}
//           <button 
//             type="button"
//             onClick={addPhoneField}
//             className="text-blue-500 hover:text-blue-700 flex items-center"
//           >
//             <Plus className="mr-2" /> Add Phone Number
//           </button>
//           <input
//             type="email"
//             placeholder="Email"
//             value={hospitalData.email}
//             onChange={(e) => setHospitalData({ ...hospitalData, email: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           />
//           <div className="flex justify-end space-x-4">
//             <button 
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button 
//               type="submit"
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// const EditHospitalModal = ({ hospital, onClose, onSubmit }) => {
//   const [hospitalData, setHospitalData] = useState(hospital);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!hospitalData.name || !hospitalData.location || !hospitalData.email || hospitalData.phones.length === 0) {
//       alert("Please fill all fields");
//       return;
//     }
//     onSubmit(hospitalData);
//   };

//   const addPhoneField = () => {
//     setHospitalData({
//       ...hospitalData,
//       phones: [...hospitalData.phones, '']
//     });
//   };

//   const removePhoneField = (index) => {
//     const newPhones = hospitalData.phones.filter((_, i) => i !== index);
//     setHospitalData({ ...hospitalData, phones: newPhones });
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Edit Contacts</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X />
//           </button>
//         </div>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <select
//             value={hospitalData.type}
//             onChange={(e) => setHospitalData({ ...hospitalData, type: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           >
//             <option value="Hospital Contacts">Hospital Contacts</option>
//             <option value="Emergency Contacts">Emergency Contacts</option>
//           </select>
//           <input
//             type="text"
//             placeholder="Name"
//             value={hospitalData.name}
//             onChange={(e) => setHospitalData({ ...hospitalData, name: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           />
//           <input
//             type="text"
//             placeholder="Location"
//             value={hospitalData.location}
//             onChange={(e) => setHospitalData({ ...hospitalData, location: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           />
//           {hospitalData.phones.map((phone, index) => (
//             <div key={index} className="flex items-center space-x-2">
//               <input
//                 type="tel"
//                 placeholder="Phone Number"
//                 value={phone}
//                 onChange={(e) => {
//                   const newPhones = [...hospitalData.phones];
//                   newPhones[index] = e.target.value;
//                   setHospitalData({ ...hospitalData, phones: newPhones });
//                 }}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//               {index > 0 && (
//                 <button 
//                   type="button"
//                   onClick={() => removePhoneField(index)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <Trash2 />
//                 </button>
//               )}
//             </div>
//           ))}
//           <button 
//             type="button"
//             onClick={addPhoneField}
//             className="text-blue-500 hover:text-blue-700 flex items-center"
//           >
//             <Plus className="mr-2" /> Add Phone Number
//           </button>
//           <input
//             type="email"
//             placeholder="Email"
//             value={hospitalData.email}
//             onChange={(e) => setHospitalData({ ...hospitalData, email: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           />
//           <div className="flex justify-end space-x-4">
//             <button 
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button 
//               type="submit"
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Update
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// const Helpline = () => {
//   const [hospitals, setHospitals] = useState([]);
//   const [filteredHospitals, setFilteredHospitals] = useState([]);
//   const [selectedHospital, setSelectedHospital] = useState(null);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'hospital', 'emergency'

//   useEffect(() => {
//     const fetchHospitals = async () => {
//       try {
//         const data = await api.getHospitals();
//         setHospitals(data);
//         setFilteredHospitals(data);
//       } catch (error) {
//         console.error('Error fetching hospitals:', error);
//       }
//     };
//     fetchHospitals();
//   }, []);

//   useEffect(() => {
//     if (activeFilter === 'all') {
//       setFilteredHospitals(hospitals);
//     } else if (activeFilter === 'hospital') {
//       setFilteredHospitals(hospitals.filter(h => h.type === 'Hospital Contacts'));
//     } else if (activeFilter === 'emergency') {
//       setFilteredHospitals(hospitals.filter(h => h.type === 'Emergency Contacts'));
//     }
//   }, [activeFilter, hospitals]);

//   const handleAddHospital = async (hospitalData) => {
//     try {
//       const newHospital = await api.addHospital(hospitalData);
//       setHospitals([...hospitals, newHospital]);
//       setIsAddModalOpen(false);
//     } catch (error) {
//       console.error('Error adding hospital:', error);
//     }
//   };

//   const handleUpdateHospital = async (updatedHospital) => {
//     try {
//       const updated = await api.updateHospital(updatedHospital.id, updatedHospital);
//       setHospitals(hospitals.map(h => h.id === updated.id ? updated : h));
//       setSelectedHospital(null);
//     } catch (error) {
//       console.error('Error updating hospital:', error);
//     }
//   };

//   const handleDeleteHospital = async (id) => {
//     try {
//       await api.deleteHospital(id);
//       setHospitals(hospitals.filter(h => h.id !== id));
//     } catch (error) {
//       console.error('Error deleting hospital:', error);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       <div className="flex justify-between items-center p-4 md:p-6 bg-white shadow-md">
//         <h1 className="text-2xl font-bold text-gray-800">Active Helpline Contacts</h1>
//         <div className="flex space-x-2">
//           <button 
//             onClick={() => setActiveFilter('all')}
//             className={`px-4 py-2 rounded flex items-center ${
//               activeFilter === 'all' 
//                 ? 'bg-blue-500 text-white' 
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//             }`}
//           >
//             All Contacts
//           </button>
//           <button 
//             onClick={() => setActiveFilter('hospital')}
//             className={`px-4 py-2 rounded flex items-center ${
//               activeFilter === 'hospital' 
//                 ? 'bg-blue-500 text-white' 
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//             }`}
//           >
//             Hospital Contacts
//           </button>
//           <button 
//             onClick={() => setActiveFilter('emergency')}
//             className={`px-4 py-2 rounded flex items-center ${
//               activeFilter === 'emergency' 
//                 ? 'bg-blue-500 text-white' 
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//             }`}
//           >
//             Emergency Contacts
//           </button>
//           <button 
//             onClick={() => setIsAddModalOpen(true)}
//             className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600"
//           >
//             <Plus className="mr-2" /> Add Contacts
//           </button>
//         </div>
//       </div>

//       <div className="flex-1 p-4 md:p-6 overflow-y-auto">
//         <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//           {filteredHospitals.map(hospital => (
//             <div 
//               key={hospital.id} 
//               className="bg-white shadow-md rounded-lg p-4 md:p-6 relative"
//             >
//               <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-4">
//                 {hospital.name}
//               </h2>
//               <p className="text-sm text-gray-600 mb-2">
//                 Type: {hospital.type}
//               </p>
//               <div className="space-y-2 text-sm md:text-base text-gray-600">
//                 <p className="flex items-center">
//                   <MapPin className="mr-2 text-blue-500" size={16} /> 
//                   {hospital.address}
//                 </p>
//                 <p className="flex items-center">
//                   <Phone className="mr-2 text-green-500" size={16} /> 
//                   {hospital.number}
//                 </p>
//                 <p className="flex items-center">
//                   <Mail className="mr-2 text-red-500" size={16} /> 
//                   {hospital.email}
//                 </p>
//               </div>
//               <div className="absolute top-4 right-4 flex space-x-2">
//                 <button 
//                   onClick={() => setSelectedHospital(hospital)}
//                   className="text-yellow-500 hover:text-yellow-700"
//                 >
//                   <Edit />
//                 </button>
//                 <button 
//                   onClick={() => handleDeleteHospital(hospital.id)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <Trash2 />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {isAddModalOpen && (
//         <AddHospitalModal
//           onClose={() => setIsAddModalOpen(false)}
//           onSubmit={handleAddHospital}
//         />
//       )}

//       {selectedHospital && (
//         <EditHospitalModal
//           hospital={selectedHospital}
//           onClose={() => setSelectedHospital(null)}
//           onSubmit={handleUpdateHospital}
//         />
//       )}
//     </div>
//   );
// };

// export default Helpline;















































































































// import React, { useState, useEffect } from 'react';
// import { 
//   MapPin, 
//   Phone, 
//   Mail, 
//   Edit, 
//   Trash2, 
//   Plus, 
//   X 
// } from 'lucide-react';

// // Replace this with your actual API base URL
// const API_BASE_URL = 'http://localhost:5000';

// const api = {
//   async getHospitals() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/helplines`);
//       if (!response.ok) throw new Error('Failed to fetch hospitals');
//       return response.json();
//     } catch (error) {
//       console.error('Error fetching hospitals:', error);
//       throw error;
//     }
//   },

//   async addHospital(hospitalData) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/helplines`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(hospitalData),
//       });
//       if (!response.ok) throw new Error('Failed to add hospital');
//       return response.json();
//     } catch (error) {
//       console.error('Error adding hospital:', error);
//       throw error;
//     }
//   },

//   async updateHospital(id, hospitalData) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/helpline/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(hospitalData),
//       });
//       if (!response.ok) throw new Error('Failed to update hospital');
//       return response.json();
//     } catch (error) {
//       console.error('Error updating hospital:', error);
//       throw error;
//     }
//   },

//   async deleteHospital(id) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/helpline/${id}`, {
//         method: 'DELETE',
//       });
//       if (!response.ok) throw new Error('Failed to delete hospital');
//       return id;
//     } catch (error) {
//       console.error('Error deleting hospital:', error);
//       throw error;
//     }
//   },
// };

// const MapComponent = ({ address }) => {
//   const openMap = () => {
//     window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
//   };

//   return (
//     <button 
//       onClick={openMap} 
//       className="text-blue-600 hover:text-blue-800 flex items-center"
//     >
//       <MapPin className="mr-2" size={16} /> View on Map
//     </button>
//   );
// };

// const AddHospitalModal = ({ onClose, onSubmit }) => {
//   const [hospitalData, setHospitalData] = useState({
//     name: '',
//     location: '',
//     phones: [''],
//     email: '',
//     type: 'Hospital Contacts'
//   });

//   const handleSubmit = (e) => {
 
//     e.preventDefault();
//     if (!hospitalData.name || !hospitalData.location || !hospitalData.email || hospitalData.phones.length === 0) {
//       alert("Please fill all fields");
//       return;
//     }
//     const hospitalRequestdata ={
//       name: hospitalData.name,
//       latitude: 27.7133,
//       longitude: 85.3233,
//       number: hospitalData.phones[0],
//       email: hospitalData.email,
//       address: hospitalData.location 
//     }

//     onSubmit(hospitalRequestdata);
//   };

//   const addPhoneField = () => {
//     setHospitalData({
//       ...hospitalData,
//       phones: [...hospitalData.phones, '']
//     });
//   };

//   const removePhoneField = (index) => {
//     const newPhones = hospitalData.phones.filter((_, i) => i !== index);
//     setHospitalData({ ...hospitalData, phones: newPhones });
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Add Contacts</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X />
//           </button>
//         </div>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <select
//             value={hospitalData.type}
//             onChange={(e) => setHospitalData({ ...hospitalData, type: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           >
//             <option value="Hospital Contacts">Hospital Contacts</option>
//             <option value="Emergency Contacts">Emergency Contacts</option>
//           </select>
//           <input
//             type="text"
//             placeholder="Name"
//             value={hospitalData.name}
//             onChange={(e) => setHospitalData({ ...hospitalData, name: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           />
//           <input
//             type="text"
//             placeholder="Location"
//             value={hospitalData.location}
//             onChange={(e) => setHospitalData({ ...hospitalData, location: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           />
//           {hospitalData.phones.map((phone, index) => (
//             <div key={index} className="flex items-center space-x-2">
//               <input
//                 type="tel"
//                 placeholder="Phone Number"
//                 value={phone}
//                 onChange={(e) => {
//                   const newPhones = [...hospitalData.phones];
//                   newPhones[index] = e.target.value;
//                   setHospitalData({ ...hospitalData, phones: newPhones });
//                 }}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//               {index > 0 && (
//                 <button 
//                   type="button"
//                   onClick={() => removePhoneField(index)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <Trash2 />
//                 </button>
//               )}
//             </div>
//           ))}
//           <button 
//             type="button"
//             onClick={addPhoneField}
//             className="text-blue-500 hover:text-blue-700 flex items-center"
//           >
//             <Plus className="mr-2" /> Add Phone Number
//           </button>
//           <input
//             type="email"
//             placeholder="Email"
//             value={hospitalData.email}
//             onChange={(e) => setHospitalData({ ...hospitalData, email: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           />
//           <div className="flex justify-end space-x-4">
//             <button 
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button 
//               type="submit"
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Submit button
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// const EditHospitalModal = ({ hospital, onClose, onSubmit }) => {
//   const [hospitalData, setHospitalData] = useState(hospital);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!hospitalData.name || !hospitalData.location || !hospitalData.email || hospitalData.phones.length === 0) {
//       alert("Please fill all fields");
//       return;
//     }
//     onSubmit(hospitalData);
//   };

//   const addPhoneField = () => {
//     setHospitalData({
//       ...hospitalData,
//       phones: [...hospitalData.phones, '']
//     });
//   };

//   const removePhoneField = (index) => {
//     const newPhones = hospitalData.phones.filter((_, i) => i !== index);
//     setHospitalData({ ...hospitalData, phones: newPhones });
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Edit Contacts</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X />
//           </button>
//         </div>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <select
//             value={hospitalData.type}
//             onChange={(e) => setHospitalData({ ...hospitalData, type: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           >
//             <option value="Hospital Contacts">Hospital Contacts</option>
//             <option value="Emergency Contacts">Emergency Contacts</option>
//           </select>
//           <input
//             type="text"
//             placeholder="Name"
//             value={hospitalData.name}
//             onChange={(e) => setHospitalData({ ...hospitalData, name: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           />
//           <input
//             type="text"
//             placeholder="Location"
//             value={hospitalData.location}
//             onChange={(e) => setHospitalData({ ...hospitalData, location: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           />
//           {/* {hospitalData.phones.map((phone, index) => (
//             <div key={index} className="flex items-center space-x-2">
//               <input
//                 type="tel"
//                 placeholder="Phone Number"
//                 value={phone}
//                 onChange={(e) => {
//                   const newPhones = [...hospitalData.phones];
//                   newPhones[index] = e.target.value;
//                   setHospitalData({ ...hospitalData, phones: newPhones });
//                 }}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//               {index > 0 && (
//                 <button 
//                   type="button"
//                   onClick={() => removePhoneField(index)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <Trash2 />
//                 </button>
//               )}
//             </div>
//           ))} */}
//           <button 
//             type="button"
//             onClick={addPhoneField}
//             className="text-blue-500 hover:text-blue-700 flex items-center"
//           >
//             <Plus className="mr-2" /> Add Phone Number
//           </button>
//           <input
//             type="email"
//             placeholder="Email"
//             value={hospitalData.email}
//             onChange={(e) => setHospitalData({ ...hospitalData, email: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           />
//           <div className="flex justify-end space-x-4">
//             <button 
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button 
//               type="submit"
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Update
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// const Helpline = () => {
//   const [hospitals, setHospitals] = useState([]);
//   const [selectedHospital, setSelectedHospital] = useState(null);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);

//   useEffect(() => {
//     const fetchHospitals = async () => {
//       try {
//         const data = await api.getHospitals(); // Fetch helpline hospitals
//         setHospitals(data);
//       } catch (error) {
//         console.error('Error fetching hospitals:', error);
//       }
//     };
//     fetchHospitals();
//   }, []);

//   const handleAddHospital = async (hospitalData) => {
//     console.log(hospitalData)
//     try {
//       const newHospital = await api.addHospital(hospitalData); // Add helpline hospital
//       setHospitals([...hospitals, newHospital]);
//       setIsAddModalOpen(false); // Close modal after successful submission
//     } catch (error) {
//       console.error('Error adding hospital:', error);
//     }
//   };

//   const handleUpdateHospital = async (updatedHospital) => {
//     try {
//       const updated = await api.updateHospital(updatedHospital.id, updatedHospital); // Update helpline hospital
//       setHospitals(hospitals.map(h => h.id === updated.id ? updated : h));
//       setSelectedHospital(null); // Close the modal after successful update
//     } catch (error) {
//       console.error('Error updating hospital:', error);
//     }
//   };

//   const handleDeleteHospital = async (id) => {
//     try {
//       await api.deleteHospital(id); // Delete helpline hospital
//       setHospitals(hospitals.filter(h => h.id !== id));
//     } catch (error) {
//       console.error('Error deleting hospital:', error);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       <div className="flex justify-between items-center p-4 md:p-6 bg-white shadow-md">
//         <h1 className="text-2xl font-bold text-gray-800">Active Helpline Contacts</h1>
//         <button 
//           onClick={() => setIsAddModalOpen(true)}
//           className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600"
//         >
//           <Plus className="mr-2" /> Add Contacts
//         </button>
//       </div>

//       <div className="flex-1 p-4 md:p-6 overflow-y-auto">
//         <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//           {hospitals.map(hospital => (
//             <div 
//               key={hospital.id} 
//               className="bg-white shadow-md rounded-lg p-4 md:p-6 relative"
//             >
//               <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-4">
//                 {hospital.name}
//               </h2>
//               <p className="text-sm text-gray-600 mb-2">
//                 Type: {hospital.type}
//               </p>
//               <div className="space-y-2 text-sm md:text-base text-gray-600">
//                 <p className="flex items-center">
//                   <MapPin className="mr-2 text-blue-500" size={16} /> 
//                   {hospital.address}
//                 </p>
//                 <p  className="flex items-center">
//                     <Phone className="mr-2 text-green-500" size={16} /> 
//                     {hospital.number}
//                   </p>
//                 {/* {hospital.phones.map((phone, index) => (
//                   <p key={index} className="flex items-center">
//                     <Phone className="mr-2 text-green-500" size={16} /> 
//                     {phone}
//                   </p>
//                 ))} */}
//                 <p className="flex items-center">
//                   <Mail className="mr-2 text-red-500" size={16} /> 
//                   {hospital.email}
//                 </p>
//               </div>
//               <div className="absolute top-4 right-4 flex space-x-2">
//                 <button 
//                   onClick={() => setSelectedHospital(hospital)}
//                   className="text-yellow-500 hover:text-yellow-700"
//                 >
//                   <Edit />
//                 </button>
//                 <button 
//                   onClick={() => handleDeleteHospital(hospital.id)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <Trash2 />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {isAddModalOpen && (
//         <AddHospitalModal
//           onClose={() => setIsAddModalOpen(false)}
//           onSubmit={handleAddHospital}
//         />
//       )}

//       {selectedHospital && (
//         <EditHospitalModal
//           hospital={selectedHospital}
//           onClose={() => setSelectedHospital(null)}
//           onSubmit={handleUpdateHospital}
//         />
//       )}
//     </div>
//   );
// };

// export default Helpline;





































































































































































// import React, { useState, useEffect } from 'react';
// import { 
//   MapPin, 
//   Phone, 
//   Mail, 
//   Edit, 
//   Trash2, 
//   Plus, 
//   X 
// } from 'lucide-react';

// // Replace this with your actual API base URL
// const API_BASE_URL = 'http://localhost:5000';

// const api = {
//   async getHospitals() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/helplines`);
//       if (!response.ok) throw new Error('Failed to fetch hospitals');
//       return response.json();
//     } catch (error) {
//       console.error('Error fetching hospitals:', error);
//       throw error;
//     }
//   },

//   async addHospital(hospitalData) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/helplines`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(hospitalData),
//       });
//       if (!response.ok) throw new Error('Failed to add hospital');
//       return response.json();
//     } catch (error) {
//       console.error('Error adding hospital:', error);
//       throw error;
//     }
//   },

//   async updateHospital(id, hospitalData) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/helpline/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(hospitalData),
//       });
//       if (!response.ok) throw new Error('Failed to update hospital');
//       return response.json();
//     } catch (error) {
//       console.error('Error updating hospital:', error);
//       throw error;
//     }
//   },

//   async deleteHospital(id) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/helpline/${id}`, {
//         method: 'DELETE',
//       });
//       if (!response.ok) throw new Error('Failed to delete hospital');
//       return id;
//     } catch (error) {
//       console.error('Error deleting hospital:', error);
//       throw error;
//     }
//   },
// };

// const MapComponent = ({ address }) => {
//   const openMap = () => {
//     window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
//   };

//   return (
//     <button 
//       onClick={openMap} 
//       className="text-blue-600 hover:text-blue-800 flex items-center"
//     >
//       <MapPin className="mr-2" size={16} /> View on Map
//     </button>
//   );
// };

// const AddHospitalModal = ({ onClose, onSubmit }) => {
//   const [hospitalData, setHospitalData] = useState({
//     name: '',
//     location: '',
//     phones: [''],
//     email: '',
//     type: 'Hospital Contacts'
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!hospitalData.name || !hospitalData.location || !hospitalData.email || hospitalData.phones.length === 0) {
//       alert("Please fill all fields");
//       return;
//     }
//     const hospitalRequestdata = {
//       name: hospitalData.name,
//       latitude: 27.7133,
//       longitude: 85.3233,
//       number: hospitalData.phones[0],
//       email: hospitalData.email,
//       address: hospitalData.location,
//       type: hospitalData.type
//     }

//     onSubmit(hospitalRequestdata);
//   };

//   const addPhoneField = () => {
//     setHospitalData({
//       ...hospitalData,
//       phones: [...hospitalData.phones, '']
//     });
//   };

//   const removePhoneField = (index) => {
//     const newPhones = hospitalData.phones.filter((_, i) => i !== index);
//     setHospitalData({ ...hospitalData, phones: newPhones });
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Add Contacts</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X />
//           </button>
//         </div>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <select
//             value={hospitalData.type}
//             onChange={(e) => setHospitalData({ ...hospitalData, type: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           >
//             <option value="Hospital Contacts">Hospital Contacts</option>
//             <option value="Emergency Contacts">Emergency Contacts</option>
//           </select>
//           <input
//             type="text"
//             placeholder="Name"
//             value={hospitalData.name}
//             onChange={(e) => setHospitalData({ ...hospitalData, name: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           />
//           <input
//             type="text"
//             placeholder="Location"
//             value={hospitalData.location}
//             onChange={(e) => setHospitalData({ ...hospitalData, location: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           />
//           {hospitalData.phones.map((phone, index) => (
//             <div key={index} className="flex items-center space-x-2">
//               <input
//                 type="tel"
//                 placeholder="Phone Number"
//                 value={phone}
//                 onChange={(e) => {
//                   const newPhones = [...hospitalData.phones];
//                   newPhones[index] = e.target.value;
//                   setHospitalData({ ...hospitalData, phones: newPhones });
//                 }}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//               {index > 0 && (
//                 <button 
//                   type="button"
//                   onClick={() => removePhoneField(index)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <Trash2 />
//                 </button>
//               )}
//             </div>
//           ))}
//           <button 
//             type="button"
//             onClick={addPhoneField}
//             className="text-blue-500 hover:text-blue-700 flex items-center"
//           >
//             <Plus className="mr-2" /> Add Phone Number
//           </button>
//           <input
//             type="email"
//             placeholder="Email"
//             value={hospitalData.email}
//             onChange={(e) => setHospitalData({ ...hospitalData, email: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           />
//           <div className="flex justify-end space-x-4">
//             <button 
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button 
//               type="submit"
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// const EditHospitalModal = ({ hospital, onClose, onSubmit }) => {
//   const [hospitalData, setHospitalData] = useState(hospital);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!hospitalData.name || !hospitalData.location || !hospitalData.email || hospitalData.phones.length === 0) {
//       alert("Please fill all fields");
//       return;
//     }
//     onSubmit(hospitalData);
//   };

//   const addPhoneField = () => {
//     setHospitalData({
//       ...hospitalData,
//       phones: [...hospitalData.phones, '']
//     });
//   };

//   const removePhoneField = (index) => {
//     const newPhones = hospitalData.phones.filter((_, i) => i !== index);
//     setHospitalData({ ...hospitalData, phones: newPhones });
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Edit Contacts</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X />
//           </button>
//         </div>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <select
//             value={hospitalData.type}
//             onChange={(e) => setHospitalData({ ...hospitalData, type: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           >
//             <option value="Hospital Contacts">Hospital Contacts</option>
//             <option value="Emergency Contacts">Emergency Contacts</option>
//           </select>
//           <input
//             type="text"
//             placeholder="Name"
//             value={hospitalData.name}
//             onChange={(e) => setHospitalData({ ...hospitalData, name: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           />
//           <input
//             type="text"
//             placeholder="Location"
//             value={hospitalData.location}
//             onChange={(e) => setHospitalData({ ...hospitalData, location: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           />
//           <button 
//             type="button"
//             onClick={addPhoneField}
//             className="text-blue-500 hover:text-blue-700 flex items-center"
//           >
//             <Plus className="mr-2" /> Add Phone Number
//           </button>
//           <input
//             type="email"
//             placeholder="Email"
//             value={hospitalData.email}
//             onChange={(e) => setHospitalData({ ...hospitalData, email: e.target.value })}
//             className="w-full p-2 border rounded"
//             required
//           />
//           <div className="flex justify-end space-x-4">
//             <button 
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button 
//               type="submit"
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Update
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// const Helpline = () => {
//   const [hospitals, setHospitals] = useState([]);
//   const [selectedHospital, setSelectedHospital] = useState(null);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'Hospital', 'Emergency'

//   useEffect(() => {
//     const fetchHospitals = async () => {
//       try {
//         const data = await api.getHospitals();
//         setHospitals(data);
//       } catch (error) {
//         console.error('Error fetching hospitals:', error);
//       }
//     };
//     fetchHospitals();
//   }, []);

//   const handleAddHospital = async (hospitalData) => {
//     try {
//       const newHospital = await api.addHospital(hospitalData);
//       setHospitals([...hospitals, newHospital]);
//       setIsAddModalOpen(false);
//     } catch (error) {
//       console.error('Error adding hospital:', error);
//     }
//   };

//   const handleUpdateHospital = async (updatedHospital) => {
//     try {
//       const updated = await api.updateHospital(updatedHospital.id, updatedHospital);
//       setHospitals(hospitals.map(h => h.id === updated.id ? updated : h));
//       setSelectedHospital(null);
//     } catch (error) {
//       console.error('Error updating hospital:', error);
//     }
//   };

//   const handleDeleteHospital = async (id) => {
//     try {
//       await api.deleteHospital(id);
//       setHospitals(hospitals.filter(h => h.id !== id));
//     } catch (error) {
//       console.error('Error deleting hospital:', error);
//     }
//   };

//   // Filter hospitals based on active filter
//   const filteredHospitals = hospitals.filter(hospital => {
//     if (activeFilter === 'All') return true;
//     return hospital.type === `${activeFilter} Contacts`;
//   });

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       <div className="flex flex-col p-4 md:p-6 bg-white shadow-md">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-2xl font-bold text-gray-800">Active Helpline Contacts</h1>
//           <button 
//             onClick={() => setIsAddModalOpen(true)}
//             className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600"
//           >
//             <Plus className="mr-2" /> Add Contacts
//           </button>
//         </div>
        
//         <div className="flex space-x-4">
//           <button
//             onClick={() => setActiveFilter('All')}
//             className={`px-4 py-2 rounded ${
//               activeFilter === 'All' 
//                 ? 'bg-blue-500 text-white' 
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//             }`}
//           >
//             All Contacts
//           </button>
//           <button
//             onClick={() => setActiveFilter('Hospital')}
//             className={`px-4 py-2 rounded ${
//               activeFilter === 'Hospital' 
//                 ? 'bg-blue-500 text-white' 
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//             }`}
//           >
//             Hospital Contacts
//           </button>
//           <button
//             onClick={() => setActiveFilter('Emergency')}
//             className={`px-4 py-2 rounded ${
//               activeFilter === 'Emergency' 
//                 ? 'bg-blue-500 text-white' 
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//             }`}
//           >
//             Emergency Contacts
//           </button>
//         </div>
//       </div>

//       <div className="flex-1 p-4 md:p-6 overflow-y-auto">
//         <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//           {filteredHospitals.map(hospital => (
//             <div 
//               key={hospital.id} 
//               className="bg-white shadow-md rounded-lg p-4 md:p-6 relative"
//             >
//               <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-4">
//                 {hospital.name}
//               </h2>
//               <p className="text-sm text-gray-600 mb-2">
//                 Type: {hospital.type}
//               </p>
//               <div className="space-y-2 text-sm md:text-base text-gray-600">
//                 <p className="flex items-center">
//                   <MapPin className="mr-2 text-blue-500" size={16} /> 
//                   {hospital.address}
//                 </p>
//                 <p className="flex items-center">
//                   <Phone className="mr-2 text-green-500" size={16} /> 
//                   {hospital.number}
//                 </p>
//                 <p className="flex items-center">
//                   <Mail className="mr-2 text-red-500" size={16} /> 
//                   {hospital.email}
//                 </p>
//               </div>
//               <div className="absolute top-4 right-4 flex space-x-2">
//                 <button 
//                   onClick={() => setSelectedHospital(hospital)}
//                   className="text-yellow-500 hover:text-yellow-700"
//                 >
//                   <Edit />
//                 </button>
//                 <button 
//                   onClick={() => handleDeleteHospital(hospital.id)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <Trash2 />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {isAddModalOpen && (
//         <AddHospitalModal
//           onClose={() => setIsAddModalOpen(false)}
//           onSubmit={handleAddHospital}
//         />
//       )}

//       {selectedHospital && (
//         <EditHospitalModal
//           hospital={selectedHospital}
//           onClose={() => setSelectedHospital(null)}
//           onSubmit={handleUpdateHospital}
//         />
//       )}
//     </div>
//   );
// };

// export default Helpline;
















































































