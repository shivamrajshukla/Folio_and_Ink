# Folio & Ink – Bookstore Website

Four pages (Home, List of Books, Customer Registration, Feedback) with a Node.js + Express backend.
Registrations and feedback are stored in a SQLite database (`bookstore.db`, created automatically).

## Run it

1. Install Node.js (v18 or newer): https://nodejs.org
2. In this folder, open a terminal and run:

   ```
   npm install
   npm start
   ```

3. Open http://localhost:3000 in your browser.

**Important:** open the site through `http://localhost:3000`, not by double-clicking the HTML files,
otherwise the forms cannot reach the server.

## Viewing stored data

- In the browser: http://localhost:3000/admin.html
- Or open `bookstore.db` with a tool like "DB Browser for SQLite".

## Project structure

```
server.js        Express server, database setup, API endpoints
package.json     Dependencies
public/          index.html, listofbooks.html, registration.html, feedback.html, admin.html
bookstore.db     Created on first run
```

## API

| Method | Path            | Purpose                    |
|--------|-----------------|----------------------------|
| POST   | /api/register   | Save a customer            |
| POST   | /api/feedback   | Save feedback              |
| GET    | /api/customers  | List stored customers      |
| GET    | /api/feedback   | List stored feedback       |

Note: `admin.html` and the GET endpoints have no password. That is fine for a local assignment,
but add authentication before putting this on the internet.
