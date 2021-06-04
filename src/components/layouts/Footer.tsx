import { IconBrandGithub } from '@tabler/icons';
import Link from 'next/link';
import React from 'react';
import { Art19 } from '../icons/companies';

const Footer = () => (
  <footer className='pt-4 text-gray-500 body-font'>
    <div className='container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col'>
      <Link href='/'>
        <a href='/' className='flex title-font font-medium items-center md:justify-start justify-center'>
          <Art19 />
          <span className='ml-3 text-xl'>Art-19</span>
        </a>
      </Link>
      <p className='text-sm sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-blue-700 sm:py-2 sm:mt-0 mt-4'>© 2021 Art-19</p>
      <span className='inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start'>
        <a
          href='https://github.com/oezguerisbert'
          className='ml-1 opacity-50 hover:opacity-100'
          target='_blank'
          rel='noopener noreferrer'
        >
          <div className='flex'>
            <IconBrandGithub />
            <span className='ml-2'>@oezguerisbert</span>
          </div>
        </a>
      </span>
    </div>
  </footer>
);

export default Footer;
