'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './globals.css';
// import './onboarding.css';
const OnboardingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
<header className="fixed top-0 w-full z-10 bg-white shadow">
  <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <div><Image src="/assets/logo.png" width={160} height={40} alt="logo" /></div>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/"><div className="text-gray-600 hover:text-gray-800">Home</div></Link>
            <a href="#features" className="text-gray-600 hover:text-gray-800 cursor-pointer">Features</a>
            <a href="#contact" className="text-gray-600 hover:text-gray-800 cursor-pointer">Contact Us</a>
            <Link href="/login"><div className="py-2 px-4 bg-white text-black border border-gray-400 rounded hover:bg-gray-200">Login</div></Link>
            <Link href="/signup"><div className="py-2 px-4 bg-pink-600 text-white rounded hover:bg-pink-700">Get Started</div></Link>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="text-white bg-gradient-to-br from-teal-500 to-blue-800 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Booking made easy with <br /><span className="text-6xl">Appointify</span></h1>
          <div className="mt-8 flex justify-center space-x-4">
            <Link href="/signup"><div className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded">Sign Up</div></Link>
            <Link href="/login"><div className="bg-white hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded">Login</div></Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold underline mb-12 text-center">Features</h1>
            <div className="flex flex-wrap justify-center gap-8">
              {/* Feature Cards */}
              {/* Feature Fast */}
              <div className="text-center p-6 shadow-md rounded-lg bg-white">
                <Image src="/assets/clock.png" width={100} height={100} alt="Fast" className="mx-auto" />
                <h2 className="text-xl font-semibold mb-4">Fast.</h2>
                <p>Appointify revolutionizes scheduling with lightning-speed efficiency.</p>
              </div>
              {/* Additional feature cards */}
            </div>
          </div>
        </section>

        {/* How-To Section */}
        {/* Additional sections like How-To and Contact can be implemented similarly */}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 Appointify, Inc</p>
          {/* Social media links */}
        </div>
      </footer>
    </div>
  );
};

export default OnboardingPage;
