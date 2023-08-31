import type { Meeting } from '$lib/stores/meetings.js';
import { fail } from '@sveltejs/kit';

export const load = async ({ params, locals: { supabase } }) => {
	const { data: meeting } = await supabase
		.from('meetings')
		.select('*, book (*) ')
		.eq('id', params.id);
	const { data: books } = await supabase.from('books').select('*');

	if (!meeting || meeting.length == 0) return fail(404, { message: 'Meeting not found' });

	return {
		meeting: meeting[0] as Meeting,
		books,
		id: params.id
	};
};

export const actions = {
	update: async ({ request, params, locals: { supabase, getSession } }) => {
		const formData = await request.formData();
		const session = await getSession();
		const book = (formData.get('bookId') as string) ?? null;
		const message = (formData.get('message') as string) ?? null;
		const timezoneOffset = parseInt(formData.get('timezoneOffset') as string) ?? 0;
		let meeting_date = formData.get('datetime') as string;
		// convert to UTC using the timezoneOffset
		meeting_date = new Date(
			new Date(meeting_date).getTime() + timezoneOffset * -1 * 60000
		).toISOString();

		// const dt_meeting_date = new Date(meeting_date);
		if (!meeting_date) return fail(400, { message: 'Missing meeting date' });
		if (!session) return fail(401, { message: 'Unauthorized' });
		const input: { meeting_date: string; book?: string; message?: string } = {
			meeting_date
		};
		if (book && parseInt(book)) {
			input['book'] = book;
		}
		if (message) {
			input['message'] = message;
		}

		const { data, error } = await supabase
			.from('meetings')
			.update({ ...input, is_draft: false })
			.eq('id', params.id)
			.select('*');

		if (error) {
			return fail(400, { message: error.message });
		}
		return {
			...data[0]
		};
	}
};
