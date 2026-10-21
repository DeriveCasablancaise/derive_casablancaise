ASSETS_DIR: <"C:\Users\DELL\Desktop\derive_2026">

You are helping me prepare the content of the 2026 edition of this website. The organisers sent me a folder with images of artists, text documents and a spreadsheet. Another assistant will use your report to plan how to integrate everything, so it must be accurate and compact. Write only what you can verify in the files and in this repository.

If `ASSETS_DIR` is still the placeholder or the folder does not exist, stop and say so.

## Rules

1. **Read-only on the repository.** Do not modify, create or delete any file inside the repo. Do not run the app, the build, the tests, migrations, or touch any database. Do not open `.env*`. Do not install anything in the repo.
2. **The assets folder is read-only too.** Do not rename, move, convert or delete anything in it.
3. To read `.docx`, `.xlsx`, `.csv`, `.pdf` and images, use tools already available on the machine, or short throwaway scripts kept **outside** the repo and the assets folder (the system temp folder). If a file type cannot be read, say so and list it; do not guess its content.
4. Never print real phone numbers, emails or addresses of people; describe them ("2 phone numbers present"). Describe people by role. Artist names and artwork titles are content and may be listed.
5. One reply, in English, as markdown, at most about 500 lines. Do not write a file.

## What to report

**1. Inventory.** A table of every file: path (relative to `ASSETS_DIR`), type, size, and for images the pixel dimensions and format; for documents the page or row count and the language(s) found. Note duplicates (same content or near-identical names), unreadable files, and anything that is not content (drafts, temp files).

**2. Texts.** For each text document or sheet: what it contains (artist biographies, programme, descriptions, press text, partners, practical information), in which languages (French, Arabic, English, mixed), and the structure (one row per artist, free text, headings). Give the exact column names of any spreadsheet. List what is missing compared with what the site needs, using the data model in this repository: for an artist `frenchName`, `arabicName`, `frenchText`, `arabicText`, images, optional `videoSource`, optional `url`, and the category `2026`; for a post (event) title and text in both languages, category and subcategory, start and end date and time, location, images, linked artists; for a partner name, link and logo. Say how many artists, events and partners the files contain.

**3. Images.** Group them by what they show (artist portraits, event photos, logos, posters, other). Identify which artist each image belongs to **only if the file name or an accompanying document says so**; otherwise list it as unassigned. Report: images over 4 MB (the upload limit of the back office is 4 MB per image, 10 per artist), images smaller than 1000 px on the long side, odd aspect ratios, formats that need conversion (HEIC, TIFF, RAW, very large PNG), and file names with spaces, accents or inconsistent patterns. Say whether the images look suitable for a full-width hero or only for small cards.

**4. Quality issues in the texts.** Typos, mixed languages in one field, Arabic text that appears to be a machine translation or has broken direction or encoding, texts that are far longer or shorter than the rest, placeholder text, missing diacritics, inconsistent spelling of artist names between documents and file names. List the examples with their location.

**5. Mapping to the data model.** For each kind of content, a short table: source (file, column or section) to target (model, field), what transformation it needs (split names, convert dates, resize images, translate, clean HTML), and what cannot be mapped. Use the model files in `src/lib/database/models/` and the form schemas in `src/lib/validator.ts`. State the dates and times found in the documents and whether they fit the existing `startDateTime` / `endDateTime` fields; if the programme uses categories or subcategories that do not exist in the code, list them.

**6. Integration options.** Compare, briefly and with evidence from this repo, the realistic ways to load the content: entering it through the back office forms, or a one-off import script that creates the documents and uploads the images. Say what each costs in effort and risk for roughly the volume found. Do not write any code.

**7. Gaps and questions for the organisers.** Everything missing or ambiguous that I must ask them before building: dates, names, translations, image rights and credits, the lineup status (confirmed or not), the order of artists, anything that looks like a draft.

**8. Banner and home page.** From the documents, what the organisers say about the new edition that could appear in an announcement banner on the home page: the edition name, dates, city, a one-line message, a link or call to action if one is mentioned. Quote nothing longer than a short phrase; do not invent anything.

**9. Summary.** Five plain sentences: what the folder contains, how complete it is for 2026, the biggest problems, the recommended integration route, and what is needed from the organisers.
