import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/user';
import IRoomProps from '../../interfaces/IRoomProps';
import { preloadQuery } from '../../utils/apollo';

const mutation = gql`
  mutation UserEnterRoomMutation($userid: String!, $roomid: String!) {
    userEnterRoom(roomid: $roomid, userid: $userid) {
      roomid
    }
  }
`;
const leaveMutation = gql`
  mutation UserLeaveRoomMutation($userid: String!, $roomid: String!) {
    userLeaveRoom(roomid: $roomid, userid: $userid) {
      roomid
    }
  }
`;
const Room: React.FC<IRoomProps> = ({ roomid, title, description, members, maxmembers, refetch }) => {
  const router = useRouter();
  const userCtx = useContext(UserContext);
  const [sendMutation] = useMutation(mutation);
  const [sendLeaveMutation] = useMutation(leaveMutation);
  const isInRoom = members.filter((m) => m.userid === userCtx.user.userid).length === 1;

  return (
    <div className='flex h-full w-full flex-col p-8 rounded-lg bg-gray-100 dark:bg-gray-800 bg-opacity-60 mb-4'>
      <div className='flex items-center mb-3'>
        <h2 className='flex flex-grow text-lg title-font font-medium'>
          <span className='text-black dark:text-white'>{title}</span>
          <span className='ml-auto'>
            <strong>
              {members.length}/{maxmembers} People
            </strong>
          </span>
        </h2>
      </div>
      <div className='flex-grow'>
        <p className='leading-relaxed text-base w-full'>
          <span>{description}</span>
        </p>
        <button
          type='button'
          onClick={async () => {
            try {
              if (!userCtx.user.userid) {
                router.push('/login');
              }
              const payload = { variables: { userid: userCtx.user.userid, roomid } };
              !isInRoom ? await sendMutation(payload) : await sendLeaveMutation(payload);
              await refetch();
            } catch (error) {
              console.error(error);
            }
          }}
          className={`mt-3 inline-flex text-white ${
            !isInRoom ? 'bg-blue-600' : 'bg-gray-600'
          } border-0 py-1 px-6 focus:outline-none hover:${
            !isInRoom ? 'bg-blue-700' : 'bg-gray-700'
          } rounded text-lg shadow`}
        >
          {!isInRoom ? 'Enter' : 'Leave'}
        </button>
      </div>
    </div>
  );
};

export default Room;
