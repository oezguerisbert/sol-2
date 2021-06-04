import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Modal from '../../src/components/layouts/Modal';
import ListBox from '../../src/components/layouts/Listbox';

const Mutations: Record<string, any> = {
  users: gql`
    mutation editUser($oldemail: String!, $newemail: String!, $password: String!, $role: String!) {
      editUser(oldemail: $oldemail, newemail: $newemail, password: $password, role: $role) {
        userid
      }
    }
  `,
};
const Queries: Record<string, any> = {
  users: gql`
    query {
      users {
        userid
        email
        role
      }
    }
  `,
};

const DashboardPage: React.FC = () => {
  const [searchElements, setSearchElements] = useState([]);
  const { data, loading, called, refetch } = useQuery(Queries.users);
  const [openModal, setOpenModal] = useState<'open' | 'close'>('close');
  const [sendMutation] = useMutation(Mutations.users);
  const [userEmail, setUserEmail] = useState('');

  const userEmailInputElement = React.createRef<HTMLInputElement>();
  const userPasswordInputElement = React.createRef<HTMLInputElement>();

  const [userRole, setUserRole] = useState<string>('');
  const [roomMaxmember, setRoomMaxmember] = useState<number>(-1);
  const [roomDescription, setRoomDescription] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [error, setError] = useState<string>(undefined);

  useEffect(() => {
    if (called && !loading) {
      if (!data.errors) {
        setSearchElements(data.users);
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
                className={`border-b border-gray-200 dark:border-gray-800 ${
                  index % 2 == 1
                    ? 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
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
                        setUserEmail(sE.email);
                        setUserRole(sE.role);
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
                    {sE.role !== 'admin' && (
                      <div className='w-4 mr-2 transform hover:text-purple-500 hover:scale-110  cursor-pointer'>
                        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Modal state={openModal} setState={setOpenModal} title='Time Settings'>
        <div className='flex flex-wrap'>
          <input
            className='flex w-full mb-4 bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
            type='text'
            ref={userEmailInputElement}
            defaultValue={userEmail ?? ''}
          />
          <input
            className='flex w-full mb-4 bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
            type='password'
            ref={userPasswordInputElement}
          />
          <ListBox setSelectedValue={setSelectedRole} values={[{ name: 'admin' }, { name: 'user' }]} />
          {error && <div className='text-red-300'>{error}</div>}
        </div>
        <div className='mt-4'>
          <button
            type='button'
            className='inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
            onClick={async () => {
              try {
                const { data } = await sendMutation({
                  variables: {
                    oldemail: userEmail,
                    newemail: userEmailInputElement.current.value,
                    password: userPasswordInputElement.current.value,
                    role: selectedRole,
                  },
                });
                if (!data.errors) {
                  setOpenModal('close');
                  await refetch({ variables: {} });
                }
              } catch (error) {
                setError(error.message);
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
export default DashboardPage;
