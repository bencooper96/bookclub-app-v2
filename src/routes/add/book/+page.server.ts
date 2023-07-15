import { fail } from '@sveltejs/kit';

export const actions = {
	create: async ({ request, locals: { supabase, getSession } }) => {
		const formData = await request.formData();
		const session = await getSession();
		const title = formData.get('title');
		const author = formData.get('author');

		if (!session) return fail(401, { message: 'Unauthorized' });
		if (!title) return fail(400, { title, missing: true });
		if (!author) return fail(400, { author, missing: true });

		const { data, error } = await supabase.from('books').insert([{ title, author }]).select('*');

		if (error) {
			return fail(error.status, error.message);
		}
		return {
			...data[0]
		};
	}
};
