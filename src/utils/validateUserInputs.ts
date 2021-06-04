import * as yup from 'yup';

const emailNotLongEnough = 'Email must be at least 3 characters';
const emailRequired = 'Please enter an email address';
const invalidEmail = 'Email must be a valid email';
const passwordNotLongEnough = 'Password must be at least 8 characters';
const fieldRequired = 'This field is required';

export const validateUserLogin = yup.object().shape({
  email: yup.string().min(3, emailNotLongEnough).max(100).email(invalidEmail).required(emailRequired),
  password: yup.string().min(4, passwordNotLongEnough).max(100).required(fieldRequired),
});

export const validateUserSignUp = yup.object().shape({
  email: yup.string().min(3, emailNotLongEnough).max(100).email(invalidEmail).required(emailRequired),
  password: yup.string().min(8, passwordNotLongEnough).max(100).required(fieldRequired),
  password2: yup.string().min(8, passwordNotLongEnough).max(100).required(fieldRequired),
});
