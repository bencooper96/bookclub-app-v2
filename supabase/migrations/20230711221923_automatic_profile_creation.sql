set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
  BEGIN
    INSERT INTO public.user_profiles (id, display_name)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'display_name'
    );
    RETURN NEW;
  END;
  $function$
;

CREATE TRIGGER create_profile_on_signup AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION create_profile_for_new_user();

create policy "Can only update own profile data."
on "public"."user_profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Can only view own profile data."
on "public"."user_profiles"
as permissive
for select
to public
using ((auth.uid() = id));



