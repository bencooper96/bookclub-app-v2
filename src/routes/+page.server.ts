export const load = async ({ locals: { supabase } }) => {
	const { data: upcoming } = await supabase
		.from('meetings')
		.select(
			`*,
			book (id, title, author)`
		)
		.gte('meeting_date', new Date().toISOString())
		.order('meeting_date', { ascending: true });

	return {
		upcoming
	};
};
