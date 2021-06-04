import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { isServer } from '../utils/isServer';
interface IUser {
  userid: string | null;
  role: string;
}
const UserContext = React.createContext<{ user: IUser; setUser: (user: IUser) => void }>({
  user: { userid: null, role: 'user' },
  setUser: (user: IUser) => {},
});
export default UserContext;

export const UserContextProvider = (props) => {
  const setUser = (user: IUser) => {
    setState({ ...state, user });
    if (!isServer()) {
      Cookies.set('user', JSON.stringify(user));
    }
  };

  let initState = {
    user: { userid: null, role: 'user' },
    setUser: setUser,
  };

  const [state, setState] = useState(initState);
  useEffect(() => {
    if (!isServer()) {
      const user = JSON.parse(Cookies.get('user') ?? '{}');
      setUser(user);
    }
  }, []);

  return <UserContext.Provider value={state}>{props.children}</UserContext.Provider>;
};
