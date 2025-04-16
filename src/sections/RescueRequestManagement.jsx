
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Check, X, MapPin, AlertTriangle, Search } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

const api = {
  async getRescueRequests() {
    const response = await fetch(`${API_BASE_URL}/api/rescues`);
    if (!response.ok) throw new Error('Failed to fetch rescue requests');
    return response.json();
  },

  async updateRescueRequest(id, requestData) {
    const response = await fetch(`${API_BASE_URL}/api/rescues/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });
    if (!response.ok) throw new Error('Failed to update rescue request');
    return response.json();
  },

  async deleteRescueRequest(id) {
    const response = await fetch(`${API_BASE_URL}/api/rescues/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete rescue request');
    return response.json();
  },

  async approveRequest(id) {
    const response = await fetch(`${API_BASE_URL}/api/requests/approve/${id}`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to approve request');
    return response.json();
  },

  async rejectRequest(id) {
    const response = await fetch(`${API_BASE_URL}/api/requests/reject/${id}`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to reject request');
    return response.json();
  },
};

const RequestDetailsModal = ({ request, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    status: request.status,
    action: request.action
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdate(request._id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Request Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X />
          </button>
        </div>
        
        <div className="space-y-4 mb-6">
          <div>
            <h3 className="font-medium">Requester</h3>
            <p>{request.name}</p>
          </div>
          
          <div>
            <h3 className="font-medium">Risk Level</h3>
            <p className={`inline-block px-2 py-1 rounded-full ${getRiskColor(request.risk)}`}>
              {request.risk}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Location</h3>
            <p className="flex items-center">
              <MapPin className="mr-1" size={16} />
              {request.location.address}
            </p>
          </div>
        </div>



        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          
          <div>
            <label className="block font-medium mb-1">Action</label>
            <select
              value={formData.action}
              onChange={(e) => setFormData({...formData, action: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="Unresolved">Unresolved</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          
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
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper functions
const getStatusColor = (status) => {
  switch (status) {
    case 'Active': return 'bg-red-100 text-red-800';
    case 'In Progress': return 'bg-yellow-100 text-yellow-800';
    case 'Closed': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getRiskColor = (risk) => {
  switch (risk) {
    case 'High': return 'bg-red-100 text-red-800';
    case 'Medium': return 'bg-yellow-100 text-yellow-800';
    case 'Low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const RescueRequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRescueRequests();
  }, []);

  const fetchRescueRequests = async () => {
    try {
      setLoading(true);
      const data = await api.getRescueRequests();
      setRequests(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async (id, updateData) => {
    try {
      const updatedRequest = await api.updateRescueRequest(id, updateData);
      setRequests(requests.map(req => req._id === id ? updatedRequest : req));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteRequest = async (id) => {
    try {
      await api.deleteRescueRequest(id);
      setRequests(requests.filter(req => req._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleApproveRequest = async (id) => {
    try {
      const approvedRequest = await api.approveRequest(id);
      setRequests(requests.map(req => req._id === id ? approvedRequest : req));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      const rejectedRequest = await api.rejectRequest(id);
      setRequests(requests.map(req => req._id === id ? rejectedRequest : req));
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredRequests = requests.filter(request =>
    request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Rescue Request Dashboard</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manage</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-6 w-6">
                          <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{request.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskColor(request.risk)}`}>
                        {request.risk}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="mr-1" size={14} />
                        {request.location.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                        >
                          <Edit size={18} />
                        </button>
                        {/* <button
                          onClick={() => handleApproveRequest(request._id)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Approve"
                        >
                          <Check size={18} />
                        </button> */}
                        {/* <button
                          onClick={() => handleRejectRequest(request._id)}
                          className="text-yellow-600 hover:text-yellow-900 p-1"
                          title="Reject"
                        >
                          <X size={18} />
                        </button> */}
                        <button
                          onClick={() => handleDeleteRequest(request._id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdate={handleUpdateRequest}
        />
      )}
    </div>
  );
};

export default RescueRequestManagement;























































// import React, { useState } from 'react';
// import { MapPin, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

// const RescueRequestManagement = () => {
//   // Hardcoded data for mockup
//   const [requests] = useState([
//     {
//       id: 1,
//       name: "Riki Gurung",
//       emergencyLevel: 1,  // High emergency
//       location: "Kathmandu, Nepal",
//       actionStatus: 1,  // Resolved
//       status: 2  // Closed
//     },
//     {
//       id: 2,
//       name: "Pragati Shrestha",
//       emergencyLevel: 2,  // Low emergency
//       location: "Pokhara, Nepal",
//       actionStatus: 2,  // Not resolved
//       status: 1  // Open
//     },
//     {
//       id: 3,
//       name: "Ari Shrestha",
//       emergencyLevel: 1,  // High emergency
//       location: "Chitwan, Nepal",
//       actionStatus: 2,  // Not resolved
//       status: 1  // Open
//     }
//   ]);

//   const getEmergencyLevel = (level) => (level === 1 ? 'High' : 'Low');
//   const getActionStatus = (status) => (status === 1 ? 'Resolved' : 'Not Resolved');
//   const getStatus = (status) => (status === 1 ? 'Open' : 'Closed');

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       {/* Header */}
//       <div className="p-4 md:p-6 bg-white shadow-md flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-800">Rescue Requests</h1>
//       </div>

//       {/* Content */}
//       <div className="flex-1 p-4 md:p-6 overflow-y-auto">
//         <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//           {requests.map((request) => (
//             <div key={request.id} className="bg-white shadow-md rounded-lg p-6 relative">
//               <h2 className="text-xl font-semibold text-gray-800 mb-2">{request.name}</h2>

//               <div className="space-y-2 text-sm md:text-base text-gray-600">
//                 {/* Emergency Level */}
//                 <p className="flex items-center">
//                   <AlertTriangle
//                     className={`mr-2 ${request.emergencyLevel === 1 ? 'text-red-500' : 'text-yellow-500'}`}
//                     size={16}
//                   />
//                   <span className="font-medium">Emergency:</span> {getEmergencyLevel(request.emergencyLevel)}
//                 </p>

//                 {/* Location */}
//                 <p className="flex items-center">
//                   <MapPin className="mr-2 text-blue-500" size={16} />
//                   <span className="font-medium">Location:</span> {request.location}
//                 </p>

//                 {/* Action */}
//                 <p className="flex items-center">
//                   {request.actionStatus === 1 ? (
//                     <CheckCircle className="mr-2 text-green-500" size={16} />
//                   ) : (
//                     <XCircle className="mr-2 text-red-500" size={16} />
//                   )}
//                   <span className="font-medium">Action:</span> {getActionStatus(request.actionStatus)}
//                 </p>

//                 {/* Status */}
//                 <p className="flex items-center">
//                   <span className="mr-2 font-medium">Status:</span>
//                   <span
//                     className={`px-2 py-1 rounded text-xs font-semibold ${
//                       request.status === 1
//                         ? 'bg-green-100 text-green-700'
//                         : 'bg-gray-300 text-gray-800'
//                     }`}
//                   >
//                     {getStatus(request.status)}
//                   </span>
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RescueRequestManagement;




























































// import React, { useState, useEffect } from 'react';
// import { MapPin, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

// const RescueRequestManagement = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch rescue request data from backend
//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/rescue-requests');
//         if (!response.ok) throw new Error('Failed to fetch rescue requests');
//         const data = await response.json();
//         setRequests(data);
//       } catch (error) {
//         console.error('Error fetching rescue requests:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequests();
//   }, []);

//   const getEmergencyLevel = (level) => (level === 1 ? 'High' : 'Low');
//   const getActionStatus = (status) => (status === 1 ? 'Resolved' : 'Not Resolved');
//   const getStatus = (status) => (status === 1 ? 'Closed' : 'Open');

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       <div className="p-4 md:p-6 bg-white shadow-md flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-800">Rescue Requests</h1>
//       </div>

//       <div className="flex-1 p-4 md:p-6 overflow-y-auto">
//         {loading ? (
//           <p className="text-center text-gray-600">Loading rescue requests...</p>
//         ) : (
//           <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//             {requests.map((request) => (
//               <div key={request.id} className="bg-white shadow-md rounded-lg p-6 relative">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-2">{request.name}</h2>

//                 <div className="space-y-2 text-sm md:text-base text-gray-600">
//                   <p className="flex items-center">
//                     <AlertTriangle
//                       className={`mr-2 ${
//                         request.emergencyLevel === 1 ? 'text-red-500' : 'text-yellow-500'
//                       }`}
//                       size={16}
//                     />
//                     <span className="font-medium">Emergency:</span> {getEmergencyLevel(request.emergencyLevel)}
//                   </p>
//                   <p className="flex items-center">
//                     <MapPin className="mr-2 text-blue-500" size={16} />
//                     <span className="font-medium">Location:</span> {request.location}
//                   </p>
//                   <p className="flex items-center">
//                     {request.actionStatus === 1 ? (
//                       <CheckCircle className="mr-2 text-green-500" size={16} />
//                     ) : (
//                       <XCircle className="mr-2 text-red-500" size={16} />
//                     )}
//                     <span className="font-medium">Action:</span> {getActionStatus(request.actionStatus)}
//                   </p>
//                   <p className="flex items-center">
//                     <span className="mr-2 font-medium">Status:</span>
//                     <span
//                       className={`px-2 py-1 rounded text-xs font-semibold ${
//                         request.status === 1
//                           ? 'bg-gray-300 text-gray-800'
//                           : 'bg-green-100 text-green-700'
//                       }`}
//                     >
//                       {getStatus(request.status)}
//                     </span>
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RescueRequestManagement;
















