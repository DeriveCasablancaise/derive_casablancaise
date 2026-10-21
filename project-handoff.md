You are helping me hand this project over to another assistant, in a separate conversation, so it can help me build the next edition of this website (2026). That assistant has never seen this code. Your reply is the only thing it will know. Make it accurate, complete and compact, and write only facts you can verify in this repository. Prefer "not found" or "unverified" to a guess.

## Rules

1. **Read-only.** Do not modify, create or delete any file. Do not install, build, start a dev server, run tests, run migrations or connect to any database. Read-only git commands (`git log`, `git shortlog`, `git ls-files`) are fine.
2. **No secrets, no personal data.** Do not open `.env` or `.env.local`; `.env.example` is fine. Never print a key, token, connection string, password, real email address or phone number. If you find a secret committed in the repository, report the file path only, never the value. Describe people by role, never by name.
3. **Evidence.** After every non-trivial claim, put the file it comes from in brackets, for example `[src/models/Event.ts]`. Skip `node_modules`, build output and lockfiles except to read versions.
4. **One reply, in English, as markdown**, at most about 450 lines. Do not write a file.
5. Be efficient: read `package.json`, the README, the config files, the route tree, the models or schemas, the auth and middleware, the API layer, the back office folders and a few representative pages and components. You do not need to read every file.

## What to report

**1. Identity.** What this project is in one sentence, who uses the public site, who uses the back office, and its status (deployment config, README, CI, tests). Month and year of the first and last commit and the number of commit authors.

**2. Editions and history.** How the site represents the festival editions today (2022 and 2024): is there an "edition" concept in the data model, in the routes, or are years hardcoded? Where does the content of each edition live (database, files, code)? Is anything from the 2022 edition still reachable, archived or removed?

**3. Stack.** Names and exact versions from `package.json`, grouped: framework, UI and styling, data, auth, forms and validation, state, animation, media and upload, email, analytics, tooling. Note which dependencies are outdated or deprecated for the stack in use, and which look unused.

**4. Architecture.** Rendering model (App Router or Pages Router, server components, static or dynamic), folder structure and the pattern it follows, data layer (database, ORM or driver, collections and their fields and relations), the API layer (route handlers, server actions, REST), validation, state management, file and image storage, internationalisation (languages, how routes and texts are handled), SEO, caching and revalidation, error handling, third-party services with what each is used for, deployment target, environment variable **names only** with a one-line purpose each, tests and CI. Then a **text diagram** of 5 to 8 nodes with arrows, using only what exists.

**5. Data model.** Every collection or schema with its fields (name and type), relations, indexes and defaults, in a compact table or list. Say which fields are bilingual or localised, and which store media.

**6. Back office.** Every module (pages, events, artists, partners, gallery, news, tickets, settings, users, whatever exists), what an editor can do in each, the roles and permissions, where permissions are enforced (UI, middleware, API), how images and files are uploaded, how content is published or unpublished, and what is missing for an editor to run an edition alone.

**7. Public site.** The routes and pages, the sections of each page, the main components, the design system (fonts, colours, spacing, component library), animations and interactions, and how responsive behaviour is handled. Say which parts are generic and reusable and which are specific to one edition.

**8. Conventions.** Naming, file and folder patterns, how a new page or a new back-office module is added end to end (list the files you would touch), validation and error patterns, lint, format and test setup, and the scripts in `package.json`.

**9. What must change for a new edition.** A concrete list: every hardcoded year, date, edition name, lineup, partner, ticket link, asset, translation key and content block that belongs to a specific edition, with the file and line. Then propose the smallest clean way to support a new edition (for example an `edition` entity, or a year field, or a content reset) given the current code, and what it would cost in changes.

**10. Technical debt and risks.** performance problems (images, bundle, queries), accessibility problems, anything fragile. Rank them: must fix before a new edition, should fix, can wait.

**11. Run and operate.** The exact commands to install, run, build and lint locally (from `package.json`), the services needed (database, storage), how the first admin user is created, how the site is deployed, and what needs backups. Do not run anything.

**12. Representative code.** Five short excerpts (at most 25 lines each) that show the project's real patterns: a model or schema, an API route or server action, a back-office page or form, a public page, a shared component. Replace any sensitive value with `…`.

**13. Neutral summary.** Exactly five plain sentences, no praise: what it is, for whom, what the editors and visitors can do, how it is built, what is missing or fragile.

**14. Open questions for me.** Everything you could not determine from the code that the next assistant will need from me (hosting access, database provider, who owns the domain, content ownership, what the 2026 edition should change).
