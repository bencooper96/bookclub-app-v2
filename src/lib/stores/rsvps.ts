import { writable, derived } from 'svelte/store';

export type RSVP = {
	id: number;
	user: User;
	meeting: number;
	is_attending: boolean;
	created_at: Date;
};

export type User = {
	id: string;
	display_name: string;
};

function createStore() {
	const { subscribe, set, update } = writable<RSVP[]>([]);

	return {
		subscribe,
		set,
		update,
		add: (rsvp: RSVP) => update((rsvps) => [...rsvps, rsvp]),
		remove: (id: number) => update((rsvps) => rsvps.filter((rsvp) => rsvp.id !== id)),
		reset: () => set([])
	};
}

export const rsvps = createStore();

export const rsvpsForMeeting = (meetingId: number) =>
	derived(rsvps, ($rsvps) => $rsvps.filter((rsvp) => rsvp.meeting === meetingId));
