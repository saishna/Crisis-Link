import React from 'react';

const SidebarItem = ({ icon, label, onClick, active }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center p-3 cursor-pointer rounded-md mb-2 ${
        active ? 'bg-sky-100 text-sky-700' : 'hover:bg-sky-50 text-gray-600'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </div>
  );
};

export default SidebarItem;

