alter table "public"."rsvps" alter column "user" set default auth.uid();

alter table "public"."rsvps" alter column "user" set not null;


