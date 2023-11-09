
export const AUTH_TOKEN_KEY = 'token';

export const setAuthenticationToken = (token: string | null) => {
    if (null === token)
        localStorage.removeItem(AUTH_TOKEN_KEY);
    else
        localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export const getAuthenticationToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

