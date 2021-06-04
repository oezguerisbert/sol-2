import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { Art19 } from '../icons/companies';
import PageLoader from '../layouts/PageLoader';
import UserContext from '../../context/user';
import IHeaderProps from '../../interfaces/IHeaderProps';

const Header = ({ navigations }: IHeaderProps) => {
  const userCtx = useContext(UserContext);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    setIsAdmin(userCtx.user.role === 'admin');
  }, [userCtx.user.userid]);
  return (
    <header className='mx-auto w-full text-gray-600 body-font'>
      <PageLoader />
      <div className='container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center'>
        <Link href='/'>
          <a href='/' className='flex title-font font-medium items-center mb-4 md:mb-0'>
            <Art19 />
            <span className='ml-3 text-xl'>Art-19</span>
          </a>
        </Link>
        <nav className='md:ml-auto flex flex-wrap items-center text-base justify-center'>
          {navigations.map((nav, index) => (
            <Link key={index} href={nav.link}>
              <a href={nav.link} className='mr-5 hover:text-blue-600'>
                {nav.text}
              </a>
            </Link>
          ))}
          {isAdmin && (
            <Link href='/dashboard'>
              <a href='/dashboard' className='mr-5 hover:text-blue-600'>
                Dashboard
              </a>
            </Link>
          )}
        </nav>
        <UserContext.Consumer>
          {({ user }) =>
            user && user.userid ? (
              <Link href='/logout'>
                <a href='/logout' className='hover:text-blue-600'>
                  Logout
                </a>
              </Link>
            ) : (
              <Link href='/login'>
                <a href='/login' className='hover:text-blue-600'>
                  Login
                </a>
              </Link>
            )
          }
        </UserContext.Consumer>
      </div>
    </header>
  );
};

export default Header;
