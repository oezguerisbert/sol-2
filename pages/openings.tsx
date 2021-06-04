import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../src/context/user';
import { formatDay } from '../src/utils/formatDay';
import { weekNumber } from '../src/utils/weekNumber';

const Queries: Record<string, any> = {
  times: gql`
    query getTimes($weeknumber: Int) {
      times(weeknumber: $weeknumber) {
        timesid
        start
        end
        week {
          weeknumber
          weekid
        }
      }
    }
  `,
};

const fDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const fMonths = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const DashboardWeekPage: React.FC = () => {
  const [missingDays, setMissingDays] = useState([]);
  const [timesList, setTimesList] = useState([]);

  const weeknumber = weekNumber();

  const { data, loading, called, fetchMore } = useQuery(Queries.times, {
    variables: { weeknumber },
  });

  const formatDayName = (number) => fDays[number];
  const formatMonthName = (number) => fMonths[number];

  const userCtx = useContext(UserContext);
  const [role, setRole] = useState<string>('user');
  useEffect(() => {
    if (called && !loading) {
      if (!data.errors) {
        setTimesList(data.times);
        setMissingDays(new Array(7 - data.times.length).fill(''));
      }
    }
  }, [data]);
  useEffect(() => {
    setRole(userCtx.user.role);
  }, [userCtx.user.userid]);
  return (
    <section className='text-gray-400 body-font'>
      <div className='container px-5 py-24 mx-auto '>
        <h1 className='text-4xl font-medium'>Week #{weeknumber}</h1>
        <div className='flex flex-row items-center justify-center'>
          {timesList.length === 0 ? (
            missingDays.map((_, index) => (
              <div key={index} className='py-4 px-2 xl:w-1/7 w-full dark:opacity-25 opacity-100 cursor-default'>
                <div className='flex bg-gray-100 dark:bg-gray-800 dark:text-gray-200 h-full p-6 rounded-lg items-center justify-center'>
                  nodata
                </div>
              </div>
            ))
          ) : (
            <div className='container px-5 py-12 mx-auto'>
              <div className='flex flex-1 flex-row -mx-4 -my-8'>
                {missingDays.map((_, index) => (
                  <div key={index} className='py-4 px-2 xl:w-1/7 w-full dark:opacity-25 opacity-100 cursor-default'>
                    <div className='flex bg-gray-100 dark:bg-gray-800 dark:text-gray-200 h-full p-6 rounded-lg items-center justify-center'>
                      nodata
                    </div>
                  </div>
                ))}
                {timesList.map((sE, index) => {
                  let dateStart = new Date(sE.start);
                  let dateEnd = new Date(sE.end);
                  return (
                    <div key={index} className='py-4 px-2 xl:w-1/7 w-full'>
                      <div className='flex flex-col items-center bg-gray-200 dark:bg-gray-700 dark:text-gray-100 h-full p-6 rounded-lg'>
                        <div className='w-12 flex-shrink-0 flex flex-col text-center leading-none'>
                          <span className=' pb-2 mb-2 border-b-2 border-gray-200'>
                            {formatMonthName(dateStart.getMonth()).slice(0, 3)}
                          </span>
                          <span className='font-medium text-lg title-font leading-none'>{dateStart.getDate()}</span>
                          <h2 className='mt-2 tracking-widest text-xs title-font font-medium text-blue-500 mb-1'>
                            {formatDayName(dateStart.getDay())}
                          </h2>
                        </div>
                        <div className='flex-grow py-2'>
                          <p className='leading-relaxed flex w-full text-center'>
                            Start: {formatDay(dateStart, ['hours', 'minutes'])}
                          </p>
                          <p className='leading-relaxed flex w-full text-center'>
                            End: {formatDay(dateEnd, ['hours', 'minutes'])}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
export default DashboardWeekPage;
