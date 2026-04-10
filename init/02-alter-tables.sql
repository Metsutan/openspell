SET ROLE openspell;

TRUNCATE TABLE online_users,worlds
    RESTART IDENTITY CASCADE;

ALTER TABLE public.online_users
    ADD "persistenceId" smallint NOT NULL;

ALTER TABLE "public"."online_users" 
    ADD CONSTRAINT online_users_user_persistence_unique 
    UNIQUE ("userId", "persistenceId");