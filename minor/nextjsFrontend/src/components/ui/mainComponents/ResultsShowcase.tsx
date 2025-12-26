"use client"
import React, { useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Check, AlertCircle, ArrowUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const ResultsShowcase = () => {
  const [activeCase, setActiveCase] = useState(0)
  
  const cases = [
    {
      id: 1,
      title: "Pushup Form Correction",
      beforeImage: "/images/pushup-before.jpg", // Replace with your actual image paths
      afterImage: "/images/pushup-after.jpg",
      feedback: [
        { icon: <AlertCircle className="h-5 w-5" />, issue: "Dropped head position", correction: "Maintain neutral neck alignment" },
        { icon: <AlertCircle className="h-5 w-5" />, issue: "Sagging lower back", correction: "Engage core to keep spine straight" },
        { icon: <Check className="h-5 w-5" />, issue: "Proper hand placement", correction: "Hands aligned with shoulders" }
      ],
      description: "Mike improved his pushup technique through AI-guided correction, eliminating wrist pain and developing better chest definition in just weeks.",
      timeline: "4 weeks"
    },
    {
      id: 2,
      title: "Situp Technique Improvement",
      beforeImage: "/images/situp-before.jpg",
      afterImage: "/images/situp-after.jpg",
      feedback: [
        { icon: <AlertCircle className="h-5 w-5" />, issue: "Pulling on neck", correction: "Keep hands at temples, not behind head" },
        { icon: <AlertCircle className="h-5 w-5" />, issue: "Feet lifting off ground", correction: "Anchor feet or have partner hold them" },
        { icon: <Check className="h-5 w-5" />, issue: "Good range of motion", correction: "Continue full movement pattern" }
      ],
      description: "Lisa corrected her situp form using AI Precision feedback, targeting proper abdominal engagement while protecting her spine from strain.",
      timeline: "3 weeks"
    }
  ]
  
  const nextCase = () => {
    setActiveCase((prev) => (prev === cases.length - 1 ? 0 : prev + 1))
  }
  
  const prevCase = () => {
    setActiveCase((prev) => (prev === 0 ? cases.length - 1 : prev - 1))
  }
  
  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium inline-block mb-3">Real-Time Feedback</span>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Perfect Your Form</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI Precision technology provides instant feedback to correct your exercise form,
            helping you get better results while preventing injuries.
          </p>
        </div>
        
        <div className="relative mt-16">
          {/* Navigation Buttons */}
          <button 
            onClick={prevCase} 
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-blue-50 transition-colors"
            aria-label="Previous case"
          >
            <ChevronLeft className="h-6 w-6 text-blue-600" />
          </button>
          
          <button 
            onClick={nextCase} 
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-blue-50 transition-colors"
            aria-label="Next case"
          >
            <ChevronRight className="h-6 w-6 text-blue-600" />
          </button>
          
          {/* Case Studies */}
          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Left side - Before/After */}
            <div className="md:col-span-7 space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 md:hidden">
                {cases[activeCase].title}
              </h3>
              
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="relative">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative rounded-lg overflow-hidden h-64 border border-gray-200">
                      <div className="absolute top-3 left-3 px-2 py-1 bg-gray-800/60 text-white text-xs rounded">BEFORE</div>
                      <div className="w-full h-full relative">
                        <Image 
                          src={cases[activeCase].beforeImage}
                          alt={`Before ${cases[activeCase].title}`}
                          fill
                          className="object-cover"
                          // If you don't have actual images yet, use a placeholder:
                          unoptimized
                          loader={({ src }) => src.startsWith('/') ? 'https://via.placeholder.com/600x800?text=Before' : src}
                        />
                      </div>
                    </div>
                    
                    <div className="relative rounded-lg overflow-hidden h-64 border border-gray-200">
                      <div className="absolute top-3 left-3 px-2 py-1 bg-blue-600/80 text-white text-xs rounded">AFTER</div>
                      <div className="w-full h-full relative">
                        <Image 
                          src={cases[activeCase].afterImage}
                          alt={`After ${cases[activeCase].title}`}
                          fill
                          className="object-cover"
                          // If you don't have actual images yet, use a placeholder:
                          unoptimized
                          loader={({ src }) => src.startsWith('/') ? 'https://via.placeholder.com/600x800?text=After' : src}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center text-sm text-gray-500 mt-3">
                    Timeline: <span className="font-medium text-gray-700">{cases[activeCase].timeline}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Description */}
            <div className="md:col-span-5">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 hidden md:block">
                  {cases[activeCase].title}
                </h3>
                
                <p className="text-gray-600">
                  {cases[activeCase].description}
                </p>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700">AI Feedback Provided:</h4>
                  
                  <div className="space-y-3">
                    {cases[activeCase].feedback.map((item, index) => (
                      <Card key={index} className="border-gray-200 overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-start">
                            <div className={`rounded-full p-2 inline-flex mr-3 ${item.icon.type === Check ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                              {item.icon}
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{item.issue}</div>
                              <div className="text-sm text-gray-600">{item.correction}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Analyze My Form <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {cases.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveCase(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === activeCase ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to case study ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            Join thousands who have perfected their form with real-time AI feedback.
          </p>
          <Link href="/exercises" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center">
            Explore More Exercises <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ResultsShowcase