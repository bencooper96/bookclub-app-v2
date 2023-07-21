import { currentMeetingId, meetings } from '$stores/meetings';
import { rsvps } from '$stores/rsvps';
import { supabase } from '$lib/supabaseClient';

export const load = async () => {
	const { data } = await supabase
		.from('meetings')
		.select(
			`*,
			book(id, title, author),
			rsvps(*, 
				user (id, display_name))
		`
		)
		.order('meeting_date', { ascending: false });
	if (!data) return;

	meetings.set(data);
	rsvps.set(data.map((meeting) => meeting.rsvps).flat());
	if (data.length) {
		currentMeetingId.set(data[0].id);
	}
	return {
		data
	};
};
