import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Modal from '../../src/components/layouts/Modal';

const Mutations: Record<string, any> = {
  rooms: gql`
    mutation changeRoomSettings($roomid: String!, $description: String!, $title: String!, $maxmembers: Int!) {
      editRoom(roomid: $roomid, description: $description, maxmembers: $maxmembers, title: $title) {
        roomid
      }
    }
  `,
};
const Queries: Record<string, any> = {
  rooms: gql`
    query {
      rooms {
        roomid
        title
        description
        maxmembers
      }
    }
  `,
};

const DashboardRoomPage: React.FC = () => {
  const [searchElements, setSearchElements] = useState([]);
  const { data, loading, called, fetchMore } = useQuery(Queries.rooms);
  const [openModal, setOpenModal] = useState<'open' | 'close'>('close');
  const [sendMutation] = useMutation(Mutations.rooms);
  const descriptionInputElement = React.createRef<HTMLTextAreaElement>();
  const titleInputElement = React.createRef<HTMLInputElement>();
  const maxMemberInputElement = React.createRef<HTMLInputElement>();

  const [roomID, setRoomID] = useState<string>('');
  const [roomMaxmember, setRoomMaxmember] = useState<number>(-1);
  const [roomDescription, setRoomDescription] = useState<string>('');
  const [roomTitle, setRoomTitle] = useState<string>('');

  useEffect(() => {
    if (called && !loading) {
      if (!data.errors) {
        setSearchElements(data.rooms);
      }
    }
  }, [data, loading, called]);
  return (
    <section className='text-gray-400 body-font bg-gray-100 dark:bg-gray-900 flex items-center justify-center'>
      {searchElements.length === 0 ? (
        <></>
      ) : (
        <table className='min-w-max w-5/6 table-auto font-sans overflow-hidden'>
          <thead>
            <tr className='bg-gray-600 uppercase text-sm leading-normal'>
              {Object.keys(searchElements[0])
                .filter((sEK) => sEK !== '__typename')
                .map((sE, index) => (
                  <th key={index} className='py-3 px-6 text-left'>
                    {sE}
                  </th>
                ))}
              <th className='py-3 px-6 text-right'>options</th>
            </tr>
          </thead>
          <tbody className='text-sm'>
            {searchElements.map((sE, index) => (
              <tr
                key={index}
                className={`border-b border-gray-800 ${
                  index % 2 == 1 ? 'bg-gray-800 hover:bg-gray-700' : 'hover:bg-gray-800'
                } `}
              >
                {Object.values(
                  Object.entries(sE)
                    .map(([key, value]) => {
                      if (key !== '__typename') return { [key]: value };
                    })
                    .filter((e) => e !== undefined)
                ).map((sE2: { [kez: string]: string }, index2) => {
                  return (
                    <td key={index2} className='py-3 max-w-xl overflow-hidden px-6 text-left whitespace-nowrap'>
                      <div className='flex items-center'>
                        <span className='font-medium'>
                          {Object.values(sE2)[0].length >= 80
                            ? Object.values(sE2)[0].slice(0, 77).concat('...')
                            : Object.values(sE2)[0]}
                        </span>
                      </div>
                    </td>
                  );
                })}
                <td className='py-3 px-6 text-right'>
                  <div className='flex item-end justify-end'>
                    <div
                      onClick={() => {
                        setRoomID(sE.roomid);
                        setRoomMaxmember(sE.maxmembers);
                        setRoomDescription(sE.description);
                        setRoomTitle(sE.title);
                        setOpenModal('open');
                      }}
                      className='w-4 mr-2 transform hover:text-purple-500 hover:scale-110 cursor-pointer'
                    >
                      <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
                        />
                      </svg>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Modal state={openModal} setState={setOpenModal} title='Room Settings'>
        <div className='flex flex-wrap'>
          <input
            type='text'
            ref={titleInputElement}
            className='flex w-full mb-4 bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
            defaultValue={roomTitle ?? ''}
          />
          <textarea
            className='flex w-full mb-4 bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
            ref={descriptionInputElement}
            defaultValue={roomDescription ?? ''}
          />
          <input
            className='flex w-full mb-4 bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
            type='number'
            ref={maxMemberInputElement}
            defaultValue={roomMaxmember.toString() ?? ''}
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
                  roomid: roomID,
                  description: descriptionInputElement.current.value,
                  maxmembers: parseInt(maxMemberInputElement.current.value),
                  title: titleInputElement.current.value,
                },
              });
              if (!data.errors) {
                await fetchMore({ variables: {} });
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
export default DashboardRoomPage;
