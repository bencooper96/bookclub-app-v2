drop policy "Can only view own profile data." on "public"."user_profiles";

alter table "public"."rsvps" disable row level security;

create policy "Enable all for authenticated users only"
on "public"."rsvps"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Enable insert for authenticated users only"
on "public"."rsvps"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."rsvps"
as permissive
for select
to public
using (true);


create policy "anyone can view any profile data."
on "public"."user_profiles"
as permissive
for select
to public
using (true);



