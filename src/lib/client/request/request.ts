import { PASSWORD } from '$client/password/password';
import { get } from 'svelte/store';

export const get_request = async (endpoint: string) => {
	return fetch(endpoint);
};

export const post_request = async (endpoint: string, data: any, stringify: boolean = true) => {
	const headers = new Headers();
	headers.append('Authorization', get(PASSWORD) ?? '');

	return fetch(endpoint, {
		headers,
		method: 'POST',
		body: stringify ? JSON.stringify(data) : data
	});
};

export const put_request = async (endpoint: string, data: any) => {
	const headers = new Headers();
	headers.append('Authorization', get(PASSWORD) ?? '');

	return fetch(endpoint, {
		headers,
		method: 'PUT',
		body: JSON.stringify(data)
	});
};

export const delete_request = async (endpoint: string) => {
	const headers = new Headers();
	headers.append('Authorization', get(PASSWORD) ?? '');

	return fetch(endpoint, {
		headers,
		method: 'DELETE'
	});
};
