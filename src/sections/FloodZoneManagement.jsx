import React, { useState, useEffect } from "react";
import { Waves, Plus, Edit, Trash2, MapPin, X } from "lucide-react";
import GoogleMapComponent from "../components/GoogleMap";

const FloodZoneManagement = () => {
  const [floodZones, setFloodZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  console.log(floodZones)

  // Add Flood Zone Form State
  const [newZone, setNewZone] = useState({
    name: "",
    location: {
      coordinates: ["", ""], // [longitude, latitude]
      address: "",
    },
    inReview: false,
    riskLevel: "Low",
    resolved: false,
  });

  // Fetch flood zones from the API
  useEffect(() => {
    const fetchFloodZones = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/flood-zones");
        if (!response.ok) {
          throw new Error("Failed to fetch flood zones");
        }
        const data = await response.json();
        setFloodZones(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFloodZones();
  }, []);

  // Risk Level Color Mapping
  const getRiskLevelColor = (level) => {
    switch (level) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Status Color Mapping
  const getStatusColor = (resolved) => {
    return resolved ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  // Add Flood Zone Handler
  const handleAddZone = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/flood-zones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newZone),
      });

      if (!response.ok) {
        throw new Error("Failed to add flood zone");
      }

      const addedZone = await response.json();
      setFloodZones([...floodZones, addedZone.floodZone]);
      setIsAddModalOpen(false);

      // Reset form
      setNewZone({
        name: "",
        location: {
          coordinates: ["", ""],
          address: "",
        },
        description:"",//changed
        
        riskLevel: "Low",
        resolved: false,
        inReview: false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Edit Flood Zone Handler
  const handleEditZone = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/flood-zones/${selectedZone._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedZone),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update flood zone");
      }

      const updatedZone = await response.json();
      const updatedFloodZones = floodZones.map((zone) =>
        zone._id === updatedZone.floodZone._id ? updatedZone.floodZone : zone
      );
      setFloodZones(updatedFloodZones);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Delete Flood Zone Handler
  const handleDeleteZone = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/flood-zones/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete flood zone");
      }

      setFloodZones(floodZones.filter((zone) => zone._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Open Add Modal Handler
  const openAddModal = (e) => {
    e.preventDefault();
    setIsAddModalOpen(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600 flex items-center">
            <Waves className="mr-3 text-blue-500" size={32} />
            Flood Zone Management
          </h1>
          <button
            type="button"
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={openAddModal}
          >
            <Plus className="mr-2" /> Add New Flood Zone
          </button>
        </div>

        {/* Flood Zones Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                {["Name", "Risk Level", "Status", "In Review", "Coordinates", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {floodZones.map((zone) => (
                <tr key={zone._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {zone.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getRiskLevelColor(
                        zone.riskLevel
                      )}`}
                    >
                      {zone.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        zone.resolved
                      )}`}
                    >
                      {zone.resolved ? "Resolved" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        zone.resolved
                      )}`}
                    >
                      {zone.inReview ? "In Review" : "Not in Review"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <a className="flex items-center" target="_blank" href={
                     `https://www.google.com/maps?q=${zone.location.coordinates[0]},${zone.location.coordinates[1]}`}><MapPin size={16} className="mr-2 text-gray-400" />
                      {`${zone.location.coordinates[0]}, ${zone.location.coordinates[1]}`}</a>
                      
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        onClick={() => {
                          setSelectedZone(zone);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 transition-colors"
                        onClick={() => handleDeleteZone(zone._id)}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Flood Zone Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-y-scroll h-[700px]">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold text-blue-600">
                  Add New Flood Zone
                </h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddZone} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newZone.name}
                    onChange={(e) =>
                      setNewZone({ ...newZone, name: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-full">
                  <GoogleMapComponent setNewZone={setNewZone} newZone={newZone}></GoogleMapComponent>
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="text"
                      value={newZone.location.coordinates[1]}
                      onChange={(e) =>
                        setNewZone({
                          ...newZone,
                          location: {
                            ...newZone.location,
                            coordinates: [
                              newZone.location.coordinates[0],
                              e.target.value,
                            ],
                          },
                        })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div> */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="text"
                      value={newZone.location.coordinates[0]}
                      onChange={(e) =>
                        setNewZone({
                          ...newZone,
                          location: {
                            ...newZone.location,
                            coordinates: [
                              e.target.value,
                              newZone.location.coordinates[1],
                            ],
                          },
                        })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div> */}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={newZone.location.address}
                    onChange={(e) =>
                      setNewZone({
                        ...newZone,
                        location: {
                          ...newZone.location,
                          address: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
//changed
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newZone.description}
                    onChange={(e) =>
                      setNewZone({ ...newZone, description: e.target.value })
                    }
                    
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
//,,,,,
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Risk Level
                  </label>
                  <select
                    value={newZone.riskLevel}
                    onChange={(e) =>
                      setNewZone({ ...newZone, riskLevel: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newZone.resolved}
                    onChange={(e) =>
                      setNewZone({
                        ...newZone,
                        resolved: e.target.value === "true",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={false}>Active</option>
                    <option value={true}>Resolved</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add Flood Zone
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Flood Zone Modal */}
        {isEditModalOpen && selectedZone && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold text-blue-600">
                  Edit Flood Zone
                </h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleEditZone} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={selectedZone.name}
                    onChange={(e) =>
                      setSelectedZone({ ...selectedZone, name: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="text"
                      value={selectedZone.location.coordinates[1]}
                      onChange={(e) =>
                        setSelectedZone({
                          ...selectedZone,
                          location: {
                            ...selectedZone.location,
                            coordinates: [
                              selectedZone.location.coordinates[0],
                              e.target.value,
                            ],
                          },
                        })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="text"
                      value={selectedZone.location.coordinates[0]}
                      onChange={(e) =>
                        setSelectedZone({
                          ...selectedZone,
                          location: {
                            ...selectedZone.location,
                            coordinates: [
                              e.target.value,
                              selectedZone.location.coordinates[1],
                            ],
                          },
                        })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={selectedZone.location.address}
                    onChange={(e) =>
                      setSelectedZone({
                        ...selectedZone,
                        location: {
                          ...selectedZone.location,
                          address: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Risk Level
                  </label>
                  <select
                    value={selectedZone.riskLevel}
                    onChange={(e) =>
                      setSelectedZone({ ...selectedZone, riskLevel: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedZone.resolved}
                    onChange={(e) =>
                      setSelectedZone({
                        ...selectedZone,
                        resolved: e.target.value === "true",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={false}>Active</option>
                    <option value={true}>Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedZone.resolved}
                    onChange={(e) =>
                      setSelectedZone({
                        ...selectedZone,
                        resolved: e.target.value === "true",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={false}>Active</option>
                    <option value={true}>Resolved</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloodZoneManagement;
