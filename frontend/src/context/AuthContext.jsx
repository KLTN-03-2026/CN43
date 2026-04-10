import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { apiGet, apiPost } from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'hotcv_token';
const USER_KEY = 'hotcv_user';
const STORAGE_KIND_KEY = 'hotcv_storage_kind';

const getWindowStorage = (kind) => (kind === 'session' ? window.sessionStorage : window.localStorage);

const safeParse = (value) => {
	if (!value) {
		return null;
	}

	try {
		return JSON.parse(value);
	} catch {
		return null;
	}
};

const readStoredAuth = () => {
	if (typeof window === 'undefined') {
		return { token: null, user: null, storageKind: null };
	}

	const storageKind = window.localStorage.getItem(STORAGE_KIND_KEY) || window.sessionStorage.getItem(STORAGE_KIND_KEY) || 'local';
	const primaryStorage = getWindowStorage(storageKind);
	const token =
		primaryStorage.getItem(TOKEN_KEY) ||
		window.localStorage.getItem(TOKEN_KEY) ||
		window.sessionStorage.getItem(TOKEN_KEY) ||
		null;
	const user = safeParse(
		primaryStorage.getItem(USER_KEY) ||
		window.localStorage.getItem(USER_KEY) ||
		window.sessionStorage.getItem(USER_KEY)
	);

	return { token, user, storageKind };
};

const persistAuth = ({ token, user, rememberMe }) => {
	const storageKind = rememberMe ? 'local' : 'session';
	const activeStorage = getWindowStorage(storageKind);
	const storageList = [window.localStorage, window.sessionStorage];

	storageList.forEach((storage) => {
		storage.removeItem(TOKEN_KEY);
		storage.removeItem(USER_KEY);
		storage.removeItem(STORAGE_KIND_KEY);
	});

	activeStorage.setItem(TOKEN_KEY, token);
	activeStorage.setItem(USER_KEY, JSON.stringify(user));
	activeStorage.setItem(STORAGE_KIND_KEY, storageKind);
};

const clearAuth = () => {
	[window.localStorage, window.sessionStorage].forEach((storage) => {
		storage.removeItem(TOKEN_KEY);
		storage.removeItem(USER_KEY);
		storage.removeItem(STORAGE_KIND_KEY);
	});
};

export const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(null);
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const hydrateFromStorage = useCallback(async () => {
		if (typeof window === 'undefined') {
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		const stored = readStoredAuth();

		if (!stored.token) {
			setToken(null);
			setUser(null);
			setIsLoading(false);
			return;
		}

		try {
			setToken(stored.token);
			if (stored.user) {
				setUser(stored.user);
			}

			const me = await apiGet('/auth/me', { token: stored.token });
			setUser(me);
			persistAuth({ token: stored.token, user: me, rememberMe: stored.storageKind !== 'session' });
		} catch {
			clearAuth();
			setToken(null);
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		hydrateFromStorage();
	}, [hydrateFromStorage]);

	const login = useCallback(async (email, password, options = {}) => {
		const response = await apiPost('/auth/login', {
			body: new URLSearchParams({ username: email, password }),
			contentType: 'application/x-www-form-urlencoded',
		});

		const nextToken = response?.access_token || response?.token || null;
		if (!nextToken) {
			throw new Error('Không nhận được token đăng nhập');
		}

		const me = await apiGet('/auth/me', { token: nextToken });
		persistAuth({ token: nextToken, user: me, rememberMe: Boolean(options.rememberMe) });
		setToken(nextToken);
		setUser(me);

		return { token: nextToken, user: me };
	}, []);

	const logout = useCallback(() => {
		clearAuth();
		setToken(null);
		setUser(null);
	}, []);

	const register = useCallback(async (payload) => {
		return apiPost('/auth/register', { body: payload });
	}, []);

	const verify = useCallback(async (email, otp) => {
		return apiPost('/auth/verify-otp', { body: { email, otp } });
	}, []);

	const value = useMemo(
		() => ({
			user,
			token,
			isAuthenticated: Boolean(token),
			isLoading,
			login,
			logout,
			register,
			verify,
			hydrateFromStorage,
		}),
		[hydrateFromStorage, isLoading, login, logout, register, token, user, verify]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
