// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0?dts';
import { PostgrestSingleResponse } from 'https://esm.sh/@supabase/postgrest-js@1.6.0';

import { getNextDayOfWeekAtTime } from '../utils/time.ts';

serve(async (req) => {
	try {
		const nextMeetingTimestamp = getNextDayOfWeekAtTime(7, 15, 30);
		const supabaseClient: SupabaseClient = createClient(
			Deno.env.get('SUPABASE_URL') ?? '',
			Deno.env.get('SUPABASE_ANON_KEY') ?? '',
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			{ global: { headers: { Authorization: req.headers.get('Authorization')! } } }
		);

		const {
			data: meeting,
			error: meetingCreationError
		}: PostgrestSingleResponse<{ id: number }[]> = await supabaseClient
			.from('meetings')
			.insert({
				meeting_date: nextMeetingTimestamp,
				is_draft: true
			})
			.select('id');

		if (meetingCreationError) {
			return new Response(meetingCreationError?.message, { status: 500 });
		}

		return new Response(JSON.stringify(meeting), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		return new Response(error.message, { status: 500 });
	}
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
