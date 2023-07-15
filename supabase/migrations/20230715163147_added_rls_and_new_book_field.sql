alter table "public"."books" add column "created_by" uuid not null default auth.uid();

alter table "public"."books" add constraint "books_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."books" validate constraint "books_created_by_fkey";

create policy "Enable delete for authenticated users"
on "public"."books"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."books"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."books"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."books"
as permissive
for update
to authenticated
using (true)
with check (true);



