"use client"
import React, { useState } from 'react';
import {
  LayoutDashboard,
  ChevronLeft,
  Menu,
  Video,
  Camera,
  Activity,
} from 'lucide-react';
import ClerkAuthState from '@/components/ui/mainComponents/ClerkAuthState';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard'
    },
    {
      label: 'Upload Video',
      icon: Video,
      path: '/upload-video'
    },
    {
      label: 'Live Analysis',
      icon: Camera,
      path: '/live-camera'
    },
    {
      label: 'My Progress',
      icon: Activity,
      path: '/my-progress'
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-24 left-4 z-30 md:hidden bg-gradient-to-r from-blue-500 to-blue-700 p-2 rounded-lg text-white shadow-lg hover:shadow-blue-500/50 transition-all duration-300 cursor-pointer"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Main Sidebar */}
      <div
        className={`
          fixed top-20 left-0 h-[calc(100vh-5rem)] z-20
          ${isExpanded ? 'w-64' : 'w-20'}
          md:block
          ${isMobileOpen ? 'block' : 'hidden'}
          bg-gradient-to-b from-blue-800 to-blue-900
          transition-all duration-300 ease-in-out
          flex flex-col
          shadow-xl
        `}
      >
        {/* Navigation Items */}
        <div className="flex flex-col gap-1 p-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.path}
                href={item.path}
                className={`
                  flex items-center gap-4 p-3 rounded-lg
                  text-gray-300 hover:text-white
                  transition-all duration-300
                  hover:bg-blue-700
                  group
                  no-underline
                  relative
                `}
                onClick={() => setIsMobileOpen(false)}
              >
                <div className="flex items-center justify-center min-w-[2rem]">
                  <Icon className="h-6 w-6" />
                </div>
                <span className={`whitespace-nowrap ${!isExpanded && 'md:hidden'}`}>
                  {item.label}
                </span>
              </a>
            );
          })}
          <div className='gap-4 ml-4 mt-4'>
            <ClerkAuthState/>
          </div>
        </div>
       
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="hidden md:flex absolute -right-3 top-6 bg-blue-600 text-white p-1 rounded-full shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
        >
          <ChevronLeft className={`h-4 w-4 transition-all duration-300 ${!isExpanded ? 'rotate-180' : ''}`} />
        </button>
       
        <div className="p-4 border-t border-blue-700">
          <div className={`text-gray-400 text-sm ${!isExpanded && 'md:hidden'}`}>
            AI Precision v1.0.0
          </div>
        </div>
      </div>
     
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;