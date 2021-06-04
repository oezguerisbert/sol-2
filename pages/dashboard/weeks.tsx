import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useContext, useEffect, useState } from 'react';
import Modal from '../../src/components/layouts/Modal';
import UserContext from '../../src/context/user';
import { formatDay } from '../../src/utils/formatDay';
import { weekNumber } from '../../src/utils/weekNumber';

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

const Mutations: Record<string, any> = {
  times: gql`
    mutation editTime($timesid: String!, $starttime: String!, $endtime: String!) {
      edittime(timesid: $timesid, starttime: $starttime, endtime: $endtime) {
        timesid
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
  const [timesID, setTimesID] = useState<string>('');

  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();

  const [currentWeekNumber, setCurrentWeekNumber] = useState(weekNumber());
  const [openModal, setOpenModal] = useState<'open' | 'close'>('close');

  const { data, loading, called, fetchMore } = useQuery(Queries.times, {
    variables: { weeknumber: currentWeekNumber },
  });
  const [sendMutation] = useMutation(Mutations.times);

  const startTimeInputElement = React.createRef<HTMLInputElement>();
  const endTimeInputElement = React.createRef<HTMLInputElement>();

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
  return role !== 'admin' ? (
    <></>
  ) : (
    <section className='text-gray-400 body-font'>
      <div className='container px-5 py-24 mx-auto '>
        <h1 className='text-4xl font-medium'>Week #{currentWeekNumber}</h1>
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
                          <button
                            className='inline-flex items-center text-white bg-blue-600 border-0 mt-2 py-1 px-6 focus:outline-none hover:bg-blue-700 rounded text-md shadow'
                            onClick={() => {
                              setTimesID(sE.timesid);
                              setStartTime(dateStart);
                              setEndTime(dateEnd);
                              setOpenModal('open');
                            }}
                          >
                            <span className='title-font font-medium'>Edit</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className='flex flex-row w-full'>
          <div className='px-4'>
            <button
              type='button'
              className='inline-flex text-white bg-blue-600 border-0 py-2 px-6 focus:outline-none hover:bg-blue-700 rounded text-lg shadow'
              onClick={async () => {
                if (!loading && called) {
                  setCurrentWeekNumber(Math.max(currentWeekNumber - 1, 0));
                  await fetchMore({ variables: { weeknumber: currentWeekNumber } });
                }
              }}
            >
              Previous Week
            </button>
            <button
              type='button'
              className='ml-4 inline-flex text-white bg-blue-600 border-0 py-2 px-6 focus:outline-none hover:bg-blue-700 rounded text-lg shadow'
              onClick={async () => {
                if (!loading && called) {
                  setCurrentWeekNumber(Math.min(currentWeekNumber + 1, 52));
                  await fetchMore({ variables: { weeknumber: currentWeekNumber } });
                }
              }}
            >
              Next Week
            </button>
          </div>
        </div>
      </div>
      <Modal state={openModal} setState={setOpenModal} title='Time Settings'>
        <div className='flex flex-wrap'>
          <input
            className='flex w-full mb-4 bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
            type='time'
            ref={startTimeInputElement}
            defaultValue={startTime ? formatDay(startTime, ['hours', 'minutes']) : ''}
          />
          <input
            className='flex w-full mb-4 bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
            type='time'
            ref={endTimeInputElement}
            defaultValue={endTime ? formatDay(endTime, ['hours', 'minutes']) : ''}
          />
        </div>
        <div className='mt-4'>
          <button
            type='button'
            className='inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
            onClick={async () => {
              setOpenModal('close');
              const { data } = await sendMutation({
                variables: {
                  timesid: timesID,
                  starttime: startTimeInputElement.current.value,
                  endtime: endTimeInputElement.current.value,
                },
              });
              if (!data.errors) {
                await fetchMore({ variables: { weeknumber: currentWeekNumber } });
              }
            }}
          >
            Ok
          </button>
        </div>
      </Modal>
    </section>
  );
};
export default DashboardWeekPage;
