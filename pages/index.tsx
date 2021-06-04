import { ArrowRightIcon } from '@heroicons/react/outline';
import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';
import WelcomeImage from '../src/components/WelcomeImage';

const Home = () => (
  <section className='text-gray-600 body-font'>
    <motion.div
      transition={{ duration: 2, ease: 'easeInOut' }}
      animate={{
        opacity: [0, 1],
      }}
      className='container mx-auto flex px-5 py-20 items-center justify-center flex-col'
    >
      <WelcomeImage />
      <div className='mt-8 text-center lg:w-2/3 w-full'>
        <h1 className='title-font sm:text-4xl text-3xl mb-4 font-medium'>Museum Art-19</h1>
        <p className='mb-8 leading-relaxed'>Best Art-Gallery in Basel</p>
        <div className='flex justify-center'>
          <Link href='/rooms'>
            <a
              href='/rooms'
              className='inline-flex text-white bg-blue-600 border-0 py-2 px-6 focus:outline-none hover:bg-blue-700 rounded text-lg shadow'
            >
              Check the Rooms
              <ArrowRightIcon className='w-4 h-4 ml-2 my-auto' />
            </a>
          </Link>
        </div>
      </div>
    </motion.div>
  </section>
);

export default Home;
