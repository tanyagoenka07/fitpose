"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, LayoutDashboard } from "lucide-react";
import { navItems } from "@/constants";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-white/20 backdrop-blur-md border-b border-cyan-500/30 shadow-lg p-1">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex-1 md:flex-initial">
            <Link href="/" className="block md:inline-block bg-transparent">
              <Image src="/exercise2.png" alt="Logo" width={90} height={90} className="bg-transparent/0" />
            </Link>
          </div>

          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="relative text-blue-400 px-4 py-2 text-sm cursor-pointer font-medium transition-all duration-300 hover:text-purple-600 hover:scale-110 hover:shadow-cyan-500/50"
              >
                <span className="relative">{item.label}</span>
                <span className="absolute inset-0 w-0 h-full bg-cyan-400/20 rounded-full transition-all duration-500 ease-out group-hover:w-full"></span>
              </Link>
            ))}

            
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 hover:scale-110 hover:shadow-cyan-500/50"
            >
              <span>{user ? "Dashboard" : "Get Started"}</span>
              {user ? <LayoutDashboard className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </Link>
          </div>

          
          <div className="flex md:hidden items-center space-x-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-full text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-all duration-300"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Toggle menu</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide-out */}
      <div
        className={`fixed top-0 right-0 w-72 h-full bg-black/80 border-l border-cyan-400 shadow-xl transform transition-all duration-500 ease-in-out z-50 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-cyan-400 hover:text-white p-2 rounded-full transition-all duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu Items */}
        <div className="flex flex-col px-6 pt-2 pb-3 space-y-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className="flex items-center space-x-3 px-4 py-3 text-cyan-300 hover:text-white bg-black/40 rounded-lg transition-all duration-300 hover:bg-cyan-500/20"
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-all duration-500"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;