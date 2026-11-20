# Redesign backend: floors, spam limit, sales alerts

Built 2026-11-19 on `feat/redesign-v1`. **Nothing here has been applied to the live database yet.** Project `erdbnkemhezvjdhfqjtq`.

## What's in the repo

| File | What it does |
|---|---|
| `supabase/migrations/20261119120001_tasmee_floors.sql` | Table `tasmee_floors`: levels 1–8 with status `open` / `held` / `sold` / `unknown` (all start as `unknown`). Anyone can read; only admins can update. |
| `supabase/migrations/20261119120002_inquiries_rate_limit.sql` | Rejects a 4th enquiry from the same phone number within an hour. The site shows "You've already sent a few requests…". Admins are not limited. |
| `supabase/migrations/20261119120003_notify_sales_triggers.sql` | After every new enquiry or booking, `pg_net` calls `notify-sales`. It never blocks or fails the insert, and it does nothing until the Vault secret exists. |
| `supabase/functions/notify-sales/index.ts` | Emails sales (via Resend): name, tap-to-call phone, WhatsApp link, project, what they want, visit time, link to admin. |
| `supabase/rollback/*.down.sql` | One rollback per migration. Run them by hand only; never move them into `migrations/`. |
| `src/pages/admin/Floors.tsx` + `src/hooks/useTasmeeFloors.ts` | Admin → **Floors** tab. |

## Go-live, in this order

1. **Back up first:** Supabase Dashboard → Database → Backups. Confirm a backup exists from today.
2. **Apply the migrations** in this order: `20261119120001`, then `…002`, then `…003`. Use the SQL editor, or `supabase db push` if migration history is in sync. Check for drift first; the MCP tools have written migrations before without leaving files.
3. **Create the shared secret:** generate a long random string, then in the SQL editor run:
   ```sql
   select vault.create_secret('<random-string>', 'notify_secret');
   ```
4. **Verify the sending domain in Resend:** add the DNS records for `xendevltd.com`. Until it's verified, the default sender `onboarding@resend.dev` can only email the Resend account owner.
5. **Set the function secrets:**
   ```bash
   supabase secrets set NOTIFY_SECRET=<same random string> RESEND_API_KEY=<key> SALES_EMAIL=<sales@…,second@…> NOTIFY_FROM="Xen Website <leads@xendevltd.com>"
   ```
6. **Deploy the function:**
   ```bash
   supabase functions deploy notify-sales --no-verify-jwt
   ```
7. **Test:**
   - Submit one enquiry named "TEST – delete me" on a preview deploy. Check that the email arrives, then delete the row in admin.
   - Submit 4 enquiries from one test number within an hour. The 4th should show the limit message.
   - Set Level 8 to "Open" in admin → Floors and check the website picker. Set it back.
8. Check the function logs: Dashboard → Edge Functions → notify-sales → Logs.

## Rollback

Run the matching file in `supabase/rollback/` in the SQL editor, newest first. To stop emails without touching the database, remove the Vault secret:
```sql
delete from vault.secrets where name = 'notify_secret';
```

## Known limits

- The booking alert fires on the booking row. The contact (name, phone) is read with the service role, inside the function.
- Booking confirmation and cancellation messages to the lead still go through the existing `notification_outbox`. Nothing in this repo sends them; the sender was never committed here.
