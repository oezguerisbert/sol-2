import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import UserContext from '../src/context/user';

const Login = () => {
  const userCtx = useContext(UserContext);
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      userCtx.setUser({ userid: null, role: null });
      router.push('/');
    }, 1000);
  }, []);
  return <></>;
};

export default Login;
