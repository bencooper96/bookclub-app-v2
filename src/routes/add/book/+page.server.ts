import { fail } from '@sveltejs/kit';

export const actions = {
	create: async ({ request, locals: { supabase, getSession } }) => {
		const formData = await request.formData();
		const session = await getSession();
		const title = formData.get('title');
		const author = formData.get('author');

		const type = formData.get('type');
		const gender = formData.get('gender');
		const publication_year = formData.get('publication_year');
		const original_language = formData.get('original_language');
		const race_ethnicity = formData.get('race_ethnicity');

		if (!session) return fail(401, { message: 'Unauthorized' });
		if (!title) return fail(400, { title, missing: true });
		if (!author) return fail(400, { author, missing: true });

		const { data, error } = await supabase
			.from('books')
			.insert([
				{ title, author, type, gender, publication_year, original_language, race_ethnicity }
			])
			.select('*');

		if (error) {
			return fail(400, { message: error.message });
		}
		return {
			...data[0]
		};
	}
};
