import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InfoCardsContainer } from '../../components/InfoCard'
import { assets } from '../../assets/assets_frontend/assets'
import Faq1 from '../../components/Faq1'


const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-manrope font-bold text-center mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
            Your AI-Powered Assistant for EMR Notes
          </span>
        </h1>

        <div className="max-w-2xl mx-auto text-center">
          <h4 className="text-lg md:text-xl font-manrope font-semibold text-new_color mb-2">
            With Mediscribe, transform patient interactions into EMR-ready notes.
          </h4>
          <h6 className="text-base md:text-lg font-manrope font-semibold text-new_color">
            Accurate, Efficient, and Simple.
          </h6>
        </div>

        <div className="flex justify-center mt-8">
          <button 
            onClick={() => navigate('/doctors')} 
            className="group relative inline-block"
          >
            <span className="relative z-10 block px-6 py-3 text-base md:text-lg font-medium text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white overflow-hidden">
              <span className="absolute inset-0 w-full h-full bg-gray-50 group-hover:bg-gray-900 transition-colors duration-300"></span>
              <span className="relative">Book Appointment</span>
            </span>
          </button>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-12">
        <h2 className="text-3xl md:text-4xl font-manrope font-bold text-center text-new_color mb-10">
          Why Choose Mediscribe?
        </h2>
        <InfoCardsContainer />
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <Faq1 />
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src={assets.logo1} alt="Mediscribe Logo" className="h-8 mb-4" />
          </div>
          
          {['Resources', 'Company', 'Legal'].map((category, index) => (
            <div key={index}>
              <h2 className="text-sm font-semibold text-gray-900 uppercase mb-4">{category}</h2>
              <ul className="space-y-2">
                {category === 'Resources' && (
                  <>
                    <li><a href="#" className="text-gray-500 hover:text-gray-700">Blog</a></li>
                    <li><a href="#" className="text-gray-500 hover:text-gray-700">Help Center</a></li>
                  </>
                )}
                {category === 'Company' && (
                  <>
                    <li><button onClick={() => navigate('/about')} className="text-gray-500 hover:text-gray-700">About Us</button></li>
                    <li><button onClick={() => navigate('/contact')} className="text-gray-500 hover:text-gray-700">Contact</button></li>
                  </>
                )}
                {category === 'Legal' && (
                  <>
                    <li><a href="#" className="text-gray-500 hover:text-gray-700">Privacy Policy</a></li>
                    <li><a href="#" className="text-gray-500 hover:text-gray-700">Terms & Conditions</a></li>
                  </>
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            © 2024 <a href="#" className="hover:underline">MediScribe™</a>. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            {/* Social media icons */}
            <a href="#" className="text-gray-500 hover:text-gray-900">
              <span className="sr-only">Facebook</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900">
              <span className="sr-only">LinkedIn</span>
              <img src={assets.linkedin} alt="LinkedIn" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;