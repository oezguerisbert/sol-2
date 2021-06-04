import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import ListBox from '../../src/components/layouts/Listbox';

const Queries: Record<string, any> = {
  stats: gql`
    query statistics($roomid: String) {
      statistics(roomid: $roomid) {
        historyid
        status
        timestamp
        user {
          userid
          email
        }
      }
    }
  `,
  rooms: gql`
    query {
      rooms {
        roomid
        title
      }
    }
  `,
};

const DashboardPage: React.FC = () => {
  const [searchElements, setSearchElements] = useState([]);
  const { data: roomData, loading: roomDataLoading, called: roomDataCalled } = useQuery(Queries.rooms);

  const [roomId, setRoomId] = useState('');
  const [roomIds, setRoomIds] = useState([{ name: '00000000-0000-0000-0000-000000000000' }]);
  const { data, loading, called, refetch } = useQuery(Queries.stats, {
    variables: { roomid: null },
  });
  useEffect(() => {
    if (roomDataCalled && !roomDataLoading) {
      if (!roomData.errors) {
        setRoomIds(roomData.rooms.map((room) => ({ name: room.roomid, title: room.title })));
      }
    }
  }, [roomData, roomDataLoading, roomDataCalled]);
  useEffect(() => {
    if (called && !loading) {
      if (!data.errors) {
        setSearchElements(data.statistics);
      }
    }
  }, [data, loading, called]);
  useEffect(() => {
    (async () => {
      await refetch({ roomid: roomId });
    })();
  }, [roomId]);
  return (
    <section className='text-gray-400 body-font bg-gray-100 dark:bg-gray-900 flex items-center justify-center'>
      <div className='flex flex-col'>
        <div className='container w-full'>
          <div className='w-full py-10'>
            <h1>Choose your Room please</h1>
            <ListBox values={roomIds} setSelectedValue={setRoomId}></ListBox>
          </div>
        </div>
        <div className='container w-full'>
          {searchElements.length === 0 ? (
            <div className='container'>There is no data collected for this room, choose another one.</div>
          ) : (
            <table className='min-w-max w-5/6 table-auto font-sans overflow-hidden'>
              <thead>
                <tr className='bg-gray-600 uppercase text-sm leading-normal'>
                  <th className='py-3 px-6 text-left'>user</th>
                  <th className='py-3 px-6 text-left'>timestamp</th>
                  <th className='py-3 px-6 text-left'>status</th>
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
                    <td className='py-3 max-w-xl overflow-hidden px-6 text-left whitespace-nowrap'>
                      <div className='flex items-center'>
                        <span className='font-medium'>{sE.user.email}</span>
                      </div>
                    </td>
                    <td className='py-3 max-w-xl overflow-hidden px-6 text-left whitespace-nowrap'>
                      <div className='flex items-center'>
                        <span className='font-medium'>{sE.timestamp}</span>
                      </div>
                    </td>
                    <td className='py-3 max-w-xl overflow-hidden px-6 text-left whitespace-nowrap'>
                      <div className='flex items-center'>
                        <span className='font-medium'>{sE.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
};
export default DashboardPage;
