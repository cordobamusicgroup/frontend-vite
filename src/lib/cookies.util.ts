import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const setAccessTokenCookie = (token: string) => {
  try {
    const decoded: any = jwtDecode(token);
    if (decoded && decoded.exp) {
      const expires = new Date(decoded.exp * 1000);
      Cookies.set('access_token', token, {
        expires,
        secure: true,
        sameSite: 'strict',
        path: '/',
      });
    } else {
      Cookies.set('access_token', token, {
        expires: 1 / 96,
        secure: true,
        sameSite: 'strict',
        path: '/',
      });
    }
  } catch {
    Cookies.set('access_token', token, {
      expires: 1 / 96,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });
  }
};

export const getAccessTokenFromCookie = () => Cookies.get('access_token') || null;

export const removeAccessTokenCookie = () => {
  Cookies.remove('access_token', { path: '/' });
};
