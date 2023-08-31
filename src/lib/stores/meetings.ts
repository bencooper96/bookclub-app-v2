import { writable, derived } from 'svelte/store';
import type { RSVP } from './rsvps';

export type Meeting = {
	id: number;
	meeting_date: string;
	book: Book | null;
	created_at: Date;
	message: string;
	rsvps?: RSVP[];
	is_draft?: boolean;
};

export type Book = {
	id: number;
	title: string;
	author: string;
};

function createStore() {
	const { subscribe, set, update } = writable<Meeting[]>([]);

	return {
		subscribe,
		set,
		update,
		add: (meeting: Meeting) => update((meetings) => [...meetings, meeting]),
		remove: (id: number) => update((meetings) => meetings.filter((meeting) => meeting.id !== id)),
		reset: () => set([])
	};
}

export const meetings = createStore();
export const currentMeetingId = writable<number | null>(null);
export const currentMeeting = derived(
	[currentMeetingId, meetings],
	([$currentMeetingId, $meetings]) => {
		if (!$currentMeetingId) {
			return null;
		}
		return $meetings.find((meeting) => meeting.id === $currentMeetingId);
	}
);
