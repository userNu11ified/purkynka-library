import { STUDENT_DATABASE, type StudentDatabase } from '$client/student/student';
import { get, writable, type Writable } from 'svelte/store';

export const STUDENT_DATABASE_ENDPOINTS = ['borrows', 'books', 'book-names', 'authors', 'udc'];

export const STUDENT_TOTAL_STEPS = STUDENT_DATABASE_ENDPOINTS.length;
export const STUDENT_CURRENT_STEP: Writable<number> = writable(0);

export const get_endpoint_reload = (endpoint: string) => {
	return fetch(`${window.origin}/api/v1/${endpoint}`)
		.then((res) => res.json())
		.then((json) => {
			return json;
		});
};

export const get_endpoint = (endpoint: string) => {
	return fetch(`${window.origin}/api/v1/${endpoint}`)
		.then((res) => res.json())
		.then((json) => {
			STUDENT_CURRENT_STEP.update((v) => v + 1);
			return json;
		});
};

export const load_student = async (getter_function: (endpoint: string) => Promise<any> = get_endpoint) => {
	const requests = await Promise.all(STUDENT_DATABASE_ENDPOINTS.map((v) => getter_function(v)));
	STUDENT_DATABASE.set(
		Object.fromEntries(
			requests.map((v, i) => [STUDENT_DATABASE_ENDPOINTS[i].replaceAll('-', '_'), v])
		) as StudentDatabase
	);
	await new Promise((res) => setTimeout(res, 1000));
};
