import { ArrowLeftIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';

// eslint-disable-next-line react/require-default-props
const BackHome = ({ motioned = false, delayed = 1 }: { motioned?: boolean; delayed?: number }) => (
  <div className='container px-0 py-10 mx-auto'>
    <Link href='/'>
      {motioned ? (
        <motion.a
          href='/'
          className=' inline-flex text-white items-center bg-blue-600 border-0 py-2 px-6 focus:outline-none hover:bg-blue-700 rounded text-lg'
          transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 * delayed }}
          animate={{
            opacity: [0, 1],
            y: ['0.1rem', '0rem'],
          }}
        >
          <span className='mr-1  '>
            <ArrowLeftIcon className='w-4 h-4 mr-auto' />
          </span>
          <span>Back Home</span>
        </motion.a>
      ) : (
        <a
          href='/'
          className=' inline-flex text-white items-center bg-blue-800 border-0 py-2 px-6 focus:outline-none hover:bg-blue-900 rounded text-lg'
        >
          <span className='mr-1  '>
            <ArrowLeftIcon className='w-4 h-4 mr-auto' />
          </span>
          <span>Back Home</span>
        </a>
      )}
    </Link>
  </div>
);

export default BackHome;
