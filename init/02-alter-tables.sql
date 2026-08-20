SET ROLE openspell;

-- Only truncate and alter tables if they already exist (e.g. when restoring a live database snapshot)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'online_users') THEN
    TRUNCATE TABLE online_users, worlds RESTART IDENTITY CASCADE;

    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'online_users' AND column_name = 'persistenceId'
    ) THEN
      ALTER TABLE public.online_users ADD COLUMN "persistenceId" smallint NOT NULL DEFAULT 1;
    END IF;

    IF NOT EXISTS (
      SELECT FROM pg_constraint WHERE conname = 'online_users_user_persistence_unique'
    ) THEN
      ALTER TABLE "public"."online_users" 
        ADD CONSTRAINT online_users_user_persistence_unique 
        UNIQUE ("userId", "persistenceId");
    END IF;
  END IF;
END $$;
