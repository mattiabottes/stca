import { writable } from 'svelte/store';

export const DeviceId = writable('');
export const Settings = writable({});
export const DB = writable(null);
export const ToastMessage = writable({
	message: '',
	type: 'success',
	show: false
});
