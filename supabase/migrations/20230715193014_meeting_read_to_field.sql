drop policy "Enable delete for authenticated users" on "public"."books";

drop policy "Enable insert for authenticated users only" on "public"."books";

drop policy "Enable update for authenticated users only" on "public"."books";

alter table "public"."meetings" add column "message" text;

create policy "Enable all access for authenticated users only"
on "public"."books"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Enable all for authenticated users only"
on "public"."meetings"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Enable read access for all users"
on "public"."meetings"
as permissive
for select
to public
using (true);



