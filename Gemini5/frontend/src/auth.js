import Cookies from 'js-cookie';

export const setToken = (token) => {
    Cookies.set('jwt', token, { expires: 1 });
}

export const getToken = (token) => {
    return Cookies.get('jwt');
}

export const isLoggedIn = () => {
    return !!getToken();
}

export const logout = () => {
    Cookies.remove('jwt');
}

