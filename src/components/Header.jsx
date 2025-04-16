import React, { useState } from 'react';
import { Search, Bell, User } from 'lucide-react';
import mockNotifications from '../mockData/mockNotifications';
import mockAdminProfile from '../mockData/mockAdminProfile';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileManagement, setShowProfileManagement] = useState(false);

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center border-b">
      <div className="relative">
        {/* <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-sky-200 rounded-md p-2 w-64 focus:ring-2 focus:ring-sky-200 focus:outline-none"
        />
        <Search className="absolute right-3 top-3 text-sky-400" /> */}
      </div>

      <div className="flex items-center space-x-4">
        <Bell
          onClick={() => setShowNotifications(!showNotifications)}
          className="cursor-pointer text-sky-600 hover:text-sky-800"
        />
        {showNotifications && (
          <div className="absolute right-0 top-12 mt-2 w-80 bg-white border border-sky-100 rounded-md shadow-lg p-4">
            <h3 className="font-bold mb-2 text-sky-700">Notifications</h3>
            {mockNotifications.map((notification) => (
              <div key={notification.id} className="mb-2 pb-2 border-b border-sky-100">
                <p className="font-semibold text-sky-600">{notification.type}</p>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-500">{notification.timestamp}</p>
              </div>
            ))}
          </div>
        )}
        <User
          onClick={() => setShowProfileManagement(!showProfileManagement)}
          className="cursor-pointer text-sky-600 hover:text-sky-800"
        />
        {showProfileManagement && (
          <div className="absolute right-0 top-12 mt-2 w-80 bg-white border border-sky-100 rounded-md shadow-lg p-4">
            <h3 className="font-bold mb-2 text-sky-700">Admin Profile</h3>
            <div>
              <p>
                <strong className="text-sky-600">Name:</strong> {mockAdminProfile.name}
              </p>
              <p>
                <strong className="text-sky-600">Email:</strong> {mockAdminProfile.email}
              </p>
              <p>
                <strong className="text-sky-600">Last Login:</strong> {mockAdminProfile.lastLogin}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
