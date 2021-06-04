import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../src/context/user';

interface DashboardProps {
  pages: Record<string, IPages>;
}

interface IPages {
  link?: string;
  title: string;
  description: string;
}

export const getServerSideProps = (ctx) => {
  const pages: Record<string, IPages> = {
    rooms: { title: 'Rooms', description: 'Here is a list of Rooms' },
    users: { title: 'Users', description: 'Here you can find all users.' },
    weeks: { title: 'Openings', description: 'Here is a list of Opening-Times.' },
    stats: { title: 'Statistics', description: 'Here is a detailed list of Statistics.' },
  };

  return { props: { pages } };
};

const Dashboard: React.FC<DashboardProps> = ({ pages }) => {
  const userCtx = useContext(UserContext);

  const [role, setRole] = useState<string>('user');
  useEffect(() => {
    setRole(userCtx.user.role);
  }, [userCtx.user.userid]);
  return role !== 'admin' ? (
    <></>
  ) : (
    <section className='text-gray-400 body-font bg-gray-100 dark:bg-gray-900'>
      <div className='container px-5 py-24 mx-auto'>
        <div className='flex flex-wrap w-full mb-20'>
          <div className='lg:w-1/2 w-full mb-6 lg:mb-0'>
            <h1 className='sm:text-3xl text-2xl font-medium title-font mb-2 dark:text-white'>Dashboard</h1>
            <div className='h-1 w-20 bg-blue-500 rounded'></div>
          </div>
          <p className='lg:w-1/2 w-full leading-relaxed text-gray-400 text-opacity-90'>
            You can change the settings of the entrance-system. You will find here all the neccesary tools, like:
            editing, adding, removing users, rooms, times or statistics.
          </p>
        </div>
        <div className={`flex flex-wrap -m-4`}>
          {Object.entries(pages).map(([pagename, pagesetup], index) => (
            <div key={index} className={`p-4 xl:w-1/${Object.entries(pages).length} w-full`}>
              <Link href={pagesetup.link ?? `/dashboard/${pagename}`}>
                <div className='bg-gray-200 dark:bg-gray-800 bg-opacity-40 p-6 rounded-lg cursor-pointer w-full'>
                  <h3 className='tracking-widest text-blue-400 text-xs font-medium title-font'>SETTING</h3>
                  <h2 className='text-lg dark:text-white font-medium title-font mb-4'>{pagesetup.title}</h2>
                  <p className='leading-relaxed text-base'>{pagesetup.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Dashboard;
