import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InfoCardsContainer } from '../../components/InfoCard'
import { assets } from '../../assets/assets_frontend/assets'
import Faq1 from '../../components/Faq1'


const Home = () => {
  const navigate = useNavigate()
  
  return (
    <div>
      <div className='mt-10'>
        <h1 className="text-3xl font-manrope font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-typing mx-auto my-4 text-center">
        Your AI-Powered Assistant for EMR Notes
        </h1>

        <h4 className='font-manrope text-new_color font-semibold  mx-75 text-center'>
          
          {/* Mediscribe automates your clinical documentation, turning patient conversations into EMR-ready notes    —    accurate, fast, and hassle-free. */}
          {/* Let Mediscribe handle the notes, so you can stay focused on delivering quality patient care. */}
          With Mediscribe, transform patient interactions into EMR-ready notes.
          
          </h4>
          <h6  className='font-manrope font-semibold text-new_color mx-75 text-center '>
          Accurate, Efficient, and Simple.
          </h6>
          <div className='flex items-center justify-center mt-6'>

                <button onClick={() => navigate('/doctors')} className="relative inline-block text-lg group">
                      <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                      <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                      <span className="absolute left-0 right-0 w-50 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                      <span className="relative">Book Appointment</span>
                      </span>
                      <span className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0" data-rounded="rounded-lg"></span>
                </button>


              {/* <button onClick={()=>navigate('/doctors')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>
                  Book Appointment -{'>'}
              </button> */}
          </div>
      </div>


            <div className='my-10'>
                <h2 className='text-4xl font-manrope font-bold text-center'>
                  <span className='text-new_color'>Why Choose Mediscribe?</span>
                </h2>
            </div>

      <div className='mt-5'>
          <InfoCardsContainer />
      </div>
      <div>
      <Faq1 />
      </div>
      
      <footer
  className="border-t border-gray-200 mt-10"
  
>
    <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
              <a href="#" className="flex items-center">
                  <img src={assets.logo1} class="h-8 me-3" alt="Mediscribe Logo" className='w-40'/>
                  
              </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                  <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
                  <ul className="text-gray-500 dark:text-gray-400 font-small">
                      <li class="mb-4">
                          <a href="#" class="hover:underline">Blog</a>
                      </li>
                      <li>
                          <a href="#" class="hover:underline">Help Center</a>
                      </li>
                  </ul>
              </div>
              <div>
                  <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Company</h2>
                  <ul class="text-gray-500 dark:text-gray-400 font-sm">
                      <li class="mb-4">
                          <button onClick={()=>{navigate('/about')}} href="" class="hover:underline ">About Us</button>
                      </li>
                      <li>
                      <button onClick={()=>{navigate('/contact')}} href="" class="hover:underline ">Contact</button>
                      </li>
                  </ul>
              </div>
              <div>
                  <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                  <ul class="text-gray-500 dark:text-gray-400 font-sm">
                      <li class="mb-4">
                          <a href="#" class="hover:underline ">Privacy Policy</a>
                      </li>
                      <li>
                          <a href="#" class="hover:underline ">Terms &amp; Conditions</a>
                      </li>
                  </ul>
              </div>
          </div>
      </div>
      <hr class="my-2 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-3" />
      <div class="sm:flex sm:items-center sm:justify-between">
          <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="#" class="hover:underline">MediScibe™</a>. All Rights Reserved.
          </span>
          <div class="flex mt-4 sm:justify-center sm:mt-0">
              <a href="#" class="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                  <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                        <path fillRule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clipRule="evenodd"/>
                    </svg>
                  <span class="sr-only">Facebook page</span>
              </a>
              
              <a href="#" class="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                  <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                    <path fillRule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clipRule="evenodd"/>
                </svg>
                  <span class="sr-only">Twitter page</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                <img src={assets.linkedin} alt="LinkedIn" className="w-4 h-4" />
                <span className="sr-only">LinkedIn Page</span>
              </a>
              


              
          </div>
      </div>
    </div>
</footer>

    </div>
    
  )
}

export default Home
