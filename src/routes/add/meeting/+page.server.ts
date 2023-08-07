import { fail } from '@sveltejs/kit';

export const load = async ({ url: { searchParams }, locals: { supabase } }) => {
	const selectedBookId = searchParams.get('book');
	const { data: meetings } = await supabase.from('meetings').select('*');
	const { data: books } = await supabase.from('books').select('*');
	const selectedBook = books?.find((book) => book.id == selectedBookId);
	return {
		meetings,
		books,
		selectedBook
	};
};

export const actions = {
	create: async ({ request, locals: { supabase, getSession } }) => {
		const formData = await request.formData();
		const session = await getSession();
		const book = (formData.get('bookId') as string) ?? null;
		const message = (formData.get('message') as string) ?? null;
		const timezoneOffset = parseInt(formData.get('timezoneOffset') as string) ?? 0;
		let meeting_date = formData.get('datetime') as string;
		console.log(timezoneOffset);
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
		console.log(formData.get('datetime') as string, input['meeting_date']);
		const { data, error } = await supabase.from('meetings').insert([input]).select('*');

		if (error) {
			return fail(400, { message: error.message });
		}
		return {
			...data[0]
		};
	}
};
