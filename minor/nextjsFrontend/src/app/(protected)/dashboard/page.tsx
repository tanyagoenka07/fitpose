import React from 'react'
import Sidebar from './_Components/Sidebar'
import Link from 'next/link'

type Props = {}

const page = (props: Props) => {
    return (
        <div>
            <Sidebar />
            <div className="w-full bg-gray-50 py-16 md:py-24 min-h-[400px]">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            <span className="text-blue-500 text-5xl md:text-6xl lg:text-7xl">Forget the gym mirror</span>
                            <span className="block mt-2">— AI's got your back!</span>
                        </h2>

                        <p className="text-2xl md:text-3xl text-gray-700 leading-relaxed">
                            <span className="font-bold text-blue-600">Scan</span>,
                            <span className="font-bold text-blue-600"> correct</span>, and
                            <span className="font-bold text-blue-600 text-3xl md:text-4xl"> level up </span>
                            your fitness game
                            <span className="font-bold text-blue-500"> instantly</span>.
                        </p>
                    </div>
                </div>
            </div>
            <div className="w-full max-w-4xl mx-auto text-center py-10 ">
                {/* Tagline text with emoji */}
                <p className="text-xl md:text-xl font-bold text-gray-900 mb-12 mt-6">
                    Unleash your inner pro—let's perfect that form! 🚀💪
                </p>

                {/* Action buttons */}
                <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-10">
                    <Link
                        href="/upload-video"
                        className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-4 rounded-lg text-xl font-medium transition-colors flex items-center justify-center"
                    >
                        <span className="mr-2">📂</span> Upload a Video
                    </Link>

                    <Link
                        href="/live-camera"
                        className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-lg text-xl font-medium transition-colors flex items-center justify-center"
                    >
                        <span className="mr-2">📸</span> Use Live Camera
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default page