import { fail } from '@sveltejs/kit';

export const load = async ({ url: { searchParams }, locals: { supabase } }) => {
	const selectedBookId = searchParams.get('book');
	const { data: meetings } = await supabase.from('meetings').select('*');
	const { data: books } = await supabase.from('books').select('*');
	const selectedBook = books.find((book) => book.id == selectedBookId);
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
		const book = formData.get('bookId') ?? null;
		const meeting_date = formData.get('datetime');

		if (!session) return fail(401, { message: 'Unauthorized' });
		const input = { meeting_date };
		if (parseInt(book)) {
			input['book'] = book;
		}
		const { data, error } = await supabase.from('meetings').insert([input]).select('*');

		if (error) {
			return fail(error.status, error.message);
		}
		return {
			...data[0]
		};
	}
};
