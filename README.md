# Hours

A simple time clock for iPhone. Clock in/out, breaks, a Saturday–Friday weekly
report emailed automatically when you clock out on Friday, and a share link for
your boss.

Your hours are stored only on your phone (in the app's local storage). Nothing
is uploaded except the weekly email you choose to send.

## Install on iPhone

1. Open the app URL in **Safari**.
2. Tap the **Share** button, then **Add to Home Screen**, then **Add**.
3. Always open it from the Home Screen icon. That copy keeps its own data, separate from Safari's.

## Set up the weekly email (one time, ~5 minutes)

The app sends email with [EmailJS](https://www.emailjs.com) (free: 200 emails/month).

1. Sign up at emailjs.com.
2. **Email Services → Add New Service → Gmail.** Connect the Gmail account the
   reports should come *from*. That can be your own, or a separate one you
   create such as "Tripp's Assistant". Copy the **Service ID**.
3. **Email Templates → Create New Template.** Set:
   - **To Email:** `{{to_email}}`
   - **Subject:** `{{subject}}`
   - **From Name:** `{{name}}`
   - **Content:** switch the editor to code/HTML mode and enter `{{{message_html}}}`
     (three braces, so the table renders)

   Save, then copy the **Template ID**.
4. **Account → General** → copy your **Public Key**.
5. In the app tap the gear, enter your name, the email to send to, and open
   **Email service** to paste the three IDs. Tap **Send this week now** to test.

If a send fails (e.g. no signal), the app retries the next time you open it.
If you don't work a Friday, last week's report goes out the next time you open
the app.

## Hidden extras

- Tap the date at the top 7 times.
- On the boss link, tap the name 5 times.
