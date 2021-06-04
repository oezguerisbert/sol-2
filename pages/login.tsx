import { useMutation } from '@apollo/react-hooks';
import { ArrowRightIcon } from '@heroicons/react/outline';
import { Field, Form, withFormik } from 'formik';
import gql from 'graphql-tag';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import UserContext from '../src/context/user';
import { validateUserLogin } from '../src/utils/validateUserInputs';

const fields = [
  { type: 'email', label: 'Email', name: 'email' },
  { type: 'password', label: 'Password', name: 'password' },
];

const mutation = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      userid
      role
    }
  }
`;

const LoginInnerForm = ({ values, errors, handleChange, handleBlur, handleSubmit, setErrors, setSubmitting }) => {
  const [sendMutation] = useMutation(mutation);
  const userCtx = useContext(UserContext);
  const router = useRouter();
  return (
    <section className='text-gray-800 dark:text-gray-400 body-font'>
      <div className='container px-5 py-24 mx-auto flex flex-wrap items-center'>
        <Form
          onSubmit={async (event) => {
            let ok = false;
            try {
              await handleSubmit(event);
              ok = true;
            } catch (error) {
              setErrors({ [error.path]: error.message });
              return;
            }
            if (ok) {
              const { data } = await sendMutation({ variables: values });
              if (!data.login) {
                setErrors({ login: 'Login failed, incorrect email/password. Please try again!' });
              } else {
                console.log({ role: data.login.role });
                userCtx.setUser({ userid: data.login.userid, role: data.login.role });
                router.push('/');
              }
            }
            setSubmitting(false);
          }}
          className='lg:w-2/6 md:w-1/2 bg-gray-300 dark:bg-gray-800 bg-opacity-50 rounded-lg p-8 flex flex-col mx-auto w-full mt-10 md:mt-0'
        >
          <span className='text-black dark:text-white text-3xl mb-4'>Login</span>
          {fields.map((field) => (
            <label
              key={field.name}
              htmlFor={field.name}
              className='leading-7 text-md text-gray-600 dark:text-gray-400 mb-4'
            >
              {field.label}
              <Field
                type={field.type}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values[field.name]}
                name={field.name}
                placeholder={field.type === 'email' ? 'Ex. johndoe@mail.com' : ''}
                spellCheck={false}
                className='w-full bg-gray-600 bg-opacity-20 focus:bg-transparent rounded border border-gray-500 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
              />
              <div className='text-red-600'>{errors[field.name]}</div>
            </label>
          ))}
          <div className='text-red-600'>{errors.login}</div>
          <div className='grid grid-cols-2 gap-4'>
            <Link href='/signup' prefetch>
              <button
                type='button'
                className='text-white bg-gray-700 border-0 py-2 px-8 focus:outline-none hover:bg-gray-800 rounded text-lg'
              >
                Sign Up
              </button>
            </Link>
            <button
              type='submit'
              className='text-white bg-blue-700 border-0 py-2 px-8 focus:outline-none hover:bg-blue-800 rounded text-lg flex flex-row items-center justify-center'
            >
              <span> Login</span>
              <ArrowRightIcon className='w-4 h-4 ml-2 my-auto' />
            </button>
          </div>
        </Form>
      </div>
    </section>
  );
};

const Login = withFormik({
  mapPropsToValues: () => ({ email: '', password: '' }),
  handleSubmit: async (values, { setSubmitting, setErrors }) => {
    await validateUserLogin.validate(values);
  },
})(LoginInnerForm);

export default Login;
