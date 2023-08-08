drop policy "Enable insert for authenticated users only" on "public"."messages";

create table "public"."reactions" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone default now(),
    "user" uuid not null,
    "emoji" text not null default '👍'::text,
    "message" bigint not null
);


CREATE UNIQUE INDEX reactions_pkey ON public.reactions USING btree (id);

alter table "public"."reactions" add constraint "reactions_pkey" PRIMARY KEY using index "reactions_pkey";

alter table "public"."reactions" add constraint "reactions_message_fkey" FOREIGN KEY (message) REFERENCES messages(id) not valid;

alter table "public"."reactions" validate constraint "reactions_message_fkey";

alter table "public"."reactions" add constraint "reactions_user_fkey" FOREIGN KEY ("user") REFERENCES user_profiles(id) not valid;

alter table "public"."reactions" validate constraint "reactions_user_fkey";

create policy "Enable insert for all users"
on "public"."messages"
as permissive
for insert
to public
with check (true);



