# Partners 2026, review

Source: `C:\Users\DELL\Desktop\Logo Partenaires` (20 files, one subfolder `Medias`). From `prep-logos.mjs --dry`; the database was not read.

## Counts
- 20 files: 16 convertible, 4 skipped (2 PDF, 2 duplicate JPG), 0 errors.
- 1 name is clean as written (`CDN`); the other 15 are held back by the seed script until the name is settled.

## Names derived (literal, from the file name)
Leading number: `1- AR2D`, `3- Asso des anciens élèves La Coupole`, `5- IF Casa SCAC`, `5- If_Maroc_Logo`, `6- logo conseil ville casa`, `7- Logo MJCC`, `8- Logo Ambassade Espagne`, `8- Logo Cervantes`.
Word "Logo": `Logo comment dire`, `MWN logo`, `LECONOMISTE Logo NOIR`, `LOGO ATLANTIC BLEU`.
Copy suffix: `Logo AMME (1)`. Colour word: `Jooj black`, `Jooj white`.

## Odd files
- `Logo CCME PDF (1).pdf` and `Medias/LECONOMISTE_Logo_NOIR.pdf`: PDF, not images, skipped.
- `LECONOMISTE_Logo_NOIR` exists as png, jpg, pdf and `LOGO ATLANTIC BLEU` as png, jpg: the png is kept (transparency first, then most pixels), the jpg and pdf are skipped.
- `Jooj black` / `Jooj white`: probably one partner in two colours, 2160x2160 each. One logo to pick.
- `5- If_Maroc_Logo` and `5- IF Casa SCAC` share the number 5, `8-` is used twice: the numbers look like an order or a grouping, not part of the names.
- `Logo AMME (1)`: a copy; the same name without `(1)` is not in the folder.

## Low resolution (long side under 200 px)
- `MWN logo` 187x168. Also small: `CDN` 320x152 and `5- IF Casa SCAC` 320x122 (above the threshold, shown at 144-192 px wide on the slider).

## Existing partners, and existing partners lacking 2026
To fill in after the seed dry run (it prints both lists). The script lists existing partners that match but lack 2026, and never changes them.

## Settling the names
Put the real names in `partner-logos/names.json` (source path -> name), run the prep again, then the seed dry run. Not applied, only a starting point:
```json
{ "1- AR2D.JPG": "AR2D", "7- Logo MJCC.png": "MJCC", "Medias/MWN logo.png": "MWN" }
```
For a name that already exists in the database, give it exactly that name so it is skipped instead of duplicated.
