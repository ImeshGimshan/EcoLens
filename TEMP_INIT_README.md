# Temporary Admin Initialization Files

These files are for one-time use to add admin emails to Firestore. After running successfully, you can delete them.

## Admin Emails to be Added:
- iamcyklon@gmail.com
- dinijayo@gmail.com

---

## Option 1: Use HTML File (Easiest)

1. Start your dev server: `npm run dev`
2. Open `init-admins.html` in your browser
3. Click the "Initialize Admin Emails" button
4. Wait for success message
5. Delete `init-admins.html` after success

---

## Option 2: Use Node Script

```bash
# Install dotenv if not already installed
npm install dotenv

# Run the script
node init-admins-temp.mjs
```

After success, delete `init-admins-temp.mjs`

---

## Option 3: Use API Endpoint

```bash
# Start your dev server first
npm run dev

# In another terminal, run:
curl -X POST http://localhost:3000/api/admin/init
```

---

## Verify Success

Check Firebase Console:
1. Go to Firestore Database
2. Look for the `admins` collection
3. You should see two documents:
   - `iamcyklon_at_gmail_dot_com`
   - `dinijayo_at_gmail_dot_com`

---

## Clean Up

After successful initialization, delete these temporary files:
- `init-admins.html`
- `init-admins-temp.mjs`
- `TEMP_INIT_README.md` (this file)
