# Admin Email Management

This directory contains utilities for managing admin emails in Firestore.

## Overview

Admin emails are now stored in Firestore under the `admins` collection instead of being hardcoded. This allows for dynamic management of admin users.

## Initial Setup

### Step 1: Initialize Default Admins

After deploying the application, run the initialization endpoint once:

```bash
curl -X POST http://localhost:3000/api/admin/init
```

Or visit `http://localhost:3000/api/admin/init` with a POST request.

This will create the following default admin emails in Firestore:
- admin@ecolens.com
- dinijayo@gmail.com

**Important:** For security, consider removing or protecting this endpoint after initial setup.

### Step 2: Verify Setup

The admin emails are now stored in Firestore under the `admins` collection. Each document has:
- **Document ID**: Email with special characters replaced (e.g., `admin_at_ecolens_dot_com`)
- **Fields**:
  - `email`: The admin email address
  - `addedAt`: Timestamp when the admin was added

## Managing Admins

### Add an Admin

To add a new admin email, make a POST request to `/api/admin/manage`:

```bash
curl -X POST http://localhost:3000/api/admin/manage \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "newadmin@example.com", "action": "add"}'
```

### Remove an Admin

```bash
curl -X POST http://localhost:3000/api/admin/manage \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "action": "remove"}'
```

### List All Admins

```bash
curl -X GET http://localhost:3000/api/admin/manage \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

## Firestore Collection Structure

```
admins/
  ├── admin_at_ecolens_dot_com/
  │   ├── email: "admin@ecolens.com"
  │   └── addedAt: "2026-02-08T12:00:00.000Z"
  └── dinijayo_at_gmail_dot_com/
      ├── email: "dinijayo@gmail.com"
      └── addedAt: "2026-02-08T12:00:00.000Z"
```

## Functions Available

### `getAdminEmails(): Promise<string[]>`
Fetches all admin emails from Firestore.

### `isAdminEmail(email: string): Promise<boolean>`
Checks if a given email is an admin.

### `addAdminEmail(email: string): Promise<boolean>`
Adds a new admin email to Firestore.

### `removeAdminEmail(email: string): Promise<boolean>`
Removes an admin email from Firestore.

### `initializeDefaultAdmins(): Promise<void>`
Seeds the database with default admin emails.

## Security Notes

1. **Protect the init endpoint**: After initial setup, consider removing or protecting the `/api/admin/init` endpoint
2. **Admin-only access**: Only existing admins can add/remove other admins
3. **Last admin protection**: The system prevents removing the last admin
4. **Authentication required**: All management endpoints require Firebase authentication

## Usage in Code

```typescript
import { getAdminEmails, isAdminEmail } from '@/lib/admin/config';

// Check if user is admin
const isAdmin = await isAdminEmail(userEmail);

// Get all admin emails
const admins = await getAdminEmails();
```

## Firestore Security Rules

Add these rules to your Firestore to secure the admins collection:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /admins/{adminId} {
      // Only allow admins to read the admin list
      allow read: if request.auth != null && 
                    exists(/databases/$(database)/documents/admins/$(request.auth.token.email.replace('@', '_at_').replace('.', '_dot_')));
      
      // Only allow admins to write
      allow write: if request.auth != null && 
                     exists(/databases/$(database)/documents/admins/$(request.auth.token.email.replace('@', '_at_').replace('.', '_dot_')));
    }
  }
}
```
