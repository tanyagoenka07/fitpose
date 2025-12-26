"use client";
import React from 'react';
import { Activity, Target, Shield } from 'lucide-react';

const FeatureShowcase = () => {
  return (
    <div className="w-full bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-stretch gap-8">
          <div className="w-full md:w-1/2 rounded-xl shadow-xl overflow-hidden flex items-center justify-center">
            <iframe
              className="w-full aspect-video"
              src="https://www.youtube.com/embed/YVG6h2AwQR4?autoplay=1&mute=1&loop=1&playlist=YVG6h2AwQR4"
              title="Advanced Posture Analysis"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-6">Advanced Posture Analysis</h2>
           
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <p className="text-gray-800 leading-relaxed">
                  Our system <span className="font-bold text-blue-600">detects, analyzes, and optimizes posture in real-time</span>,
                  ensuring every movement aligns with biomechanical accuracy. By tracking key joint positions and calculating precise angles,
                  we identify even the slightest deviations, providing <span className="font-bold text-blue-600">instant, data-driven feedback</span> for improved performance.
                </p>
              </div>
             
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 flex">
                <div className="mr-4 text-blue-500 flex-shrink-0">
                  <Target size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-blue-800 mb-2">🔍 Why does this matter?</h3>
                  <p className="text-gray-800 leading-relaxed">
                    For athletes, professionals, and rehabilitation experts, posture correction is critical in preventing injuries and enhancing efficiency.
                    Our technology <span className="font-bold text-blue-600">automatically detects errors, highlights inconsistencies, and delivers real-time insights</span>—paving
                    the way for smarter training and recovery strategies.
                  </p>
                </div>
              </div>
             
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 rounded-lg shadow-md text-white">
                <h3 className="font-bold text-xl mb-2 flex items-center">
                  <Activity className="mr-2" size={24} />
                  🎯 The Future of Movement Intelligence
                </h3>
                <p className="leading-relaxed font-medium">
                  High-precision tracking, AI-driven analysis, and actionable insights—this is the future of movement intelligence.
                </p>
              </div>
            </div>
           
            <div className="mt-8">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center">
                <Shield className="mr-2" size={20} />
                Experience the Difference
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureShowcase;