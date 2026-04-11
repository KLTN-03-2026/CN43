const DEFAULT_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const buildUrl = (path) => {
	if (/^https?:\/\//i.test(path)) {
		return path;
	}

	if (!path.startsWith('/')) {
		return `${DEFAULT_API_URL}/${path}`;
	}

	return `${DEFAULT_API_URL}${path}`;
};

const normalizeBody = (body, contentType) => {
	if (body == null) {
		return undefined;
	}

	if (body instanceof FormData || body instanceof URLSearchParams || typeof body === 'string') {
		return body;
	}

	if (contentType === 'application/x-www-form-urlencoded') {
		return new URLSearchParams(body);
	}

	return JSON.stringify(body);
};

const parseResponse = async (response) => {
	const text = await response.text();
	if (!text) {
		return null;
	}

	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
};

const request = async (path, options = {}) => {
	const {
		method = 'GET',
		body,
		token,
		contentType = 'application/json',
		...rest
	} = options;

	const headers = new Headers(rest.headers || {});
	if (token) {
		headers.set('Authorization', `Bearer ${token}`);
	}

	const normalizedBody = normalizeBody(body, contentType);
	if (normalizedBody != null && !(normalizedBody instanceof FormData)) {
		headers.set('Content-Type', contentType);
	}

	const response = await fetch(buildUrl(path), {
		method,
		headers,
		body: normalizedBody,
		...rest,
	});

	const payload = await parseResponse(response);

	if (!response.ok) {
		const message =
			typeof payload === 'string'
				? payload
				: payload?.detail?.message || payload?.detail || payload?.message || 'Request failed';
		throw new Error(message);
	}

	return payload;
};

export const apiGet = (path, options = {}) => request(path, { ...options, method: 'GET' });
export const apiPost = (path, options = {}) => request(path, { ...options, method: 'POST' });
export const apiPatch = (path, options = {}) => request(path, { ...options, method: 'PATCH' });
export const apiDelete = (path, options = {}) => request(path, { ...options, method: 'DELETE' });

export const get = apiGet;
export const post = apiPost;
export const patch = apiPatch;
export const del = apiDelete;

export default {
	get: apiGet,
	post: apiPost,
	patch: apiPatch,
	delete: apiDelete,
};
