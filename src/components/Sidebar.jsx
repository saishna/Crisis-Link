import React from 'react';
import { LayoutDashboard, Waves, AlertTriangle, ShieldAlert, BarChart3, MapPin, Settings } from 'lucide-react';
import SidebarItem from './SidebarItem';

const Sidebar = ({ setActiveSection, activeSection }) => {
  return (
    <div className="w-64 bg-white shadow-md border-r">
      <div className="p-5 text-center text-xl font-bold border-b bg-sky-50 text-sky-700">
        <img src="/images/logo.png" alt="Logo" className='h-20'/>
      </div>
      <nav className="p-4">
        <SidebarItem
          icon={<LayoutDashboard className="text-sky-600" />}
          label="Dashboard"
          onClick={() => setActiveSection('dashboard')}
          active={activeSection === 'dashboard'}
        />
        <SidebarItem
          icon={<Waves className="text-blue-500" />}
          label="Flood Zone"
          onClick={() => setActiveSection('flood-zones')}
          active={activeSection === 'flood-zones'}
        />
        {/* <SidebarItem 
            icon={<AlertTriangle className="text-amber-500" />} 
            label="Alert" 
            onClick={() => setActiveSection('alerts')} 
            active={activeSection === 'alerts'}
          /> */}
          <SidebarItem 
            icon={<ShieldAlert className="text-green-500" />} 
            label="Rescue Request" 
            onClick={() => setActiveSection('rescue-requests')} 
            active={activeSection === 'rescue-requests'}
          />
          <SidebarItem 
            icon={<BarChart3 className="text-purple-500" />} 
            label="Analytics & Reports" 
            onClick={() => setActiveSection('analytics')} 
            active={activeSection === 'analytics'}
          />
          <SidebarItem 
            icon={<MapPin className="text-teal-500" />} 
            label="Helpline" 
            onClick={() => setActiveSection('helpline')} 
            active={activeSection === 'helpline'}
          />
          <SidebarItem 
            icon={<Settings className="text-gray-500" />} 
            label="Settings" 
            onClick={() => setActiveSection('settings')} 
            active={activeSection === 'settings'}
          />
      </nav>
    </div>



  );
};

export default Sidebar;
