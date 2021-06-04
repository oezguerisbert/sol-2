import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react';
import Room from '../../src/components/models/Room';
export const query = gql`
  query Rooms {
    rooms {
      roomid
      title
      description
      maxmembers
      members {
        email
        userid
      }
    }
  }
`;

const Rooms = () => {
  const { data, loading, refetch } = useQuery(query);

  return (
    <section className='text-gray-600 body-font'>
      <div className='container mx-auto flex px-5 py-20 flex-col'>
        <h1 className='text-6xl dark:text-white'>Rooms</h1>
        <section className='py-12 text-gray-400 bg-gray-100 dark:bg-gray-900 body-font'>
          <div className='flex flex-wrap items-center'>
            {!loading && data.rooms.map((room, index) => <Room key={index} {...room} refetch={refetch} />)}
          </div>
        </section>
      </div>
    </section>
  );
};

export default Rooms;
