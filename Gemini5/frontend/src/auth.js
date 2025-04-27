import Cookies from 'js-cookie';

const COOKIE_OPTIONS = {
  expires: 1, // 1 day
  path: '/',
  sameSite: 'Lax'
};

export const setToken = (token) => {
  Cookies.set('jwt', token, COOKIE_OPTIONS);
};

export const getToken = () => {
  return Cookies.get('jwt');
};

export const setUser = (user) => {
  Cookies.set('user', JSON.stringify(user), COOKIE_OPTIONS);
};

export const getUser = () => {
  try {
    const userCookie = Cookies.get('user');
    return userCookie ? JSON.parse(userCookie) : null;
  } catch (error) {
    console.error('Error parsing user cookie:', error);
    return null;
  }
};

export const isLoggedIn = () => {
  return !!getUser();
};

export const logout = () => {
  Cookies.remove('jwt', { path: '/' });
  Cookies.remove('user', { path: '/' });
};