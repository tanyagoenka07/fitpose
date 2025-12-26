// pages/about.js
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us - FitPose AI</title>
        <meta name="description" content="Learn about FitPose AI, your AI-powered fitness trainer" />
      </Head>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-blue-500">FitPose AI</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering Your Fitness Journey with Advanced AI Technology
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Empowering Your <span className="text-blue-500">Fitness Journey</span> with AI
              </h2>
              <p className="mb-4">
                At <strong>FitPose AI</strong>, we believe that fitness should be{' '}
                <span className="text-blue-500 font-bold">accessible, safe, and effective</span> for everyone. Whether
                you're a beginner struggling to maintain proper form or an experienced athlete looking to perfect your
                technique, our AI-powered fitness trainer is here to help.
              </p>
              <p>
                Using <span className="text-blue-500 font-bold">advanced Computer Vision and AI</span> technologies, we
                provide real-time posture analysis and corrective feedback to ensure that every movement you make is
                precise and efficient. Our goal is to{' '}
                <span className="text-blue-500 font-bold">bridge the gap between technology and fitness</span>, bringing{' '}
                <span className="text-blue-500 font-bold">personalized coaching</span> to your screen—anytime, anywhere.
              </p>
            </div>
            <div className="rounded-lg shadow-lg overflow-hidden relative h-80">
              <Image
                src="/pushup.jpg"
                alt="AI Fitness Analysis"
                layout="fill"
                objectFit="cover"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=="
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Us on This <span className="text-blue-500">Revolution</span>
            </h2>
            <p className="mb-6">
              The future of fitness is <strong>smart, interactive, and AI-driven</strong>. At FitPose AI, we're
              redefining how people train and stay fit—<strong>one posture at a time</strong>.
            </p>
            <p className="text-2xl font-bold mb-8">🚀 Start Your AI-Powered Fitness Journey Today!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-8 rounded-full font-bold hover:transform hover:-translate-y-1 transition-transform duration-300">
                Sign Up
              </Link>
              <Link href="/learn-more" className="bg-white text-blue-500 border-2 border-blue-500 py-3 px-8 rounded-full font-bold hover:transform hover:-translate-y-1 transition-transform duration-300">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
