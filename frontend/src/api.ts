import axios, { RawAxiosRequestHeaders, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAuthenticationToken } from './storage';

export const client = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 5000,
});

export type AuthorizeCodeResponse = {
    token: string;
};

export type PasswordLoginResponse = {
    ticket: string;
    mfa: string[];
}

function makeAuthorizationHeader(): RawAxiosRequestHeaders {
    const token = getAuthenticationToken();

    if (!token)
        return {};

    return {
        Authorization: `Bearer ${token}`,
    };
}

function injectAuthorizationHeader(headers: RawAxiosRequestHeaders = {}): RawAxiosRequestHeaders {
    const authorizationHeader = makeAuthorizationHeader();

    return {
        ...headers,
        ...authorizationHeader,
    };
}

function authorizedPost<P = any>(url: string, data: any, config: AxiosRequestConfig = {}) {
    return client.post<P>(url, data, {
        ...config,
        headers: injectAuthorizationHeader(config.headers ?? {}),
    });
}

function authorizedGet<P = any>(url: string, config: AxiosRequestConfig = {}) {
    return client.get<P>(url, {
        ...config,
        headers: injectAuthorizationHeader(config.headers ?? {}),
    });
}

function wrapResponse<T>(resp: Promise<AxiosResponse<T>>): Promise<T> {
    return resp.then(e => e.data);
}

export const authorizeCode = (code: string) => client.post<AuthorizeCodeResponse>('/api/v1/auth/authorize_code', { provider: 'ft', code });
export const loginWithPassword = (email: string, password: string) => wrapResponse(client.post<PasswordLoginResponse>('/api/v1/auth/login', { email, password }));

export const fetchUserProfile = (profile: string) => authorizedGet(`/api/v1/users/${profile}`);
