-- Lets the admin choose whether a withdrawal message is purely informational
-- (request still proceeds to the normal pending queue) or actually blocks the
-- request from reaching the approval queue. Defaults to true so any message
-- already set under the earlier always-blocking behavior keeps working.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS withdrawal_hold_blocking boolean NOT NULL DEFAULT true;
