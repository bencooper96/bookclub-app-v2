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
		.order('meeting_date', { ascending: true });

	if (!data) return;
	meetings.set(data);
	rsvps.set(data.map((meeting) => meeting.rsvps).flat());
	if (data.length) {
		const now = new Date();
		const currentMeeting = data.filter((meeting) => new Date(meeting.meeting_date) > now)[0];
		currentMeetingId.set(currentMeeting.id);
	}
	return {
		data
	};
};
