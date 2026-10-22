# Images artistes 2026 : points à relire

Source : `derive_2026\assets` (lecture seule). Sorties : `derive_2026_prep\out` + `manifest.csv`. Posts : aucune image dans cette phase.
Bilan : 60 fichiers = 15 traités (9 artistes), 18 gardés de côté (held), 27 ignorés (documents, visuels de posts, non attribués).

## a) Associations (ordre = ordre dans `images`, le 1er sert de visuel principal)
- Chrystèle Khodr : portrait (©nasri_sayegh)
- Nadim Deaibes : portrait (N&B, converti en sRGB)
- Khulood Basel : Photo Khulood
- Wael Kadour : portrait (©Darek_Szuster(1))
- Laurie Bellanca : Photo 1 (799×1200), Photo 2 (1500×998)
- Soukaina Habiballah : Picture.1.png (nom générique, associé par le dossier « Soukaina »)
- Oraib Toukan : Oraib Toukan.jpg, artist talk, Copy of (ordre à confirmer)
- Taysir Batniji : 4 TIFF (02042379-©SJB, Bruit de fond, Me_2, Transit), ordre alphabétique, rien ne dit lequel est un portrait
- Dwarfs of East Agouza : Artists Pic
- Sans visuel : Jordi Galí, Johan Grimonprez, Camille Lorin, Bilal El Had, Mackenzy Bergile.

## b) Gardés de côté (held, ni traités ni envoyés)
- Oraib Toukan Offing 4 : vrai format PSD (extension .png), à exporter en JPG.
- « (Not sent by Chistelle) Silence… _060 » : droits à clarifier.
- « image dossier impulsions VIGNETTE TRAVERSEE » : sans doute un autre projet.
- Œuvres de Oraib non programmées (15) : A certain Distance ×2, Focus Puller 1-3, Palance of the Slave 2-5, Via Dolorosa 1-3, When Things Occur 2 et 8, Loosing Mountains Lecture Perf.

## c) Non attribués (flag `unassigned`)
- Dania : Portrait1, Portrait2 (© David Oppetit), « Préférée… » (© Randa Mirza) : organisatrice, pas dans le seed.
- Meryem Jazouli 1 et 2 : organisatrice, pas dans le seed.
- Affiches : DC_Affiche_1080×1350 (4500×5625, JPG) : fond de landing possible, non désigné.
- Documents ignorés : affiche PDF, dossier Silence (PDF), NB feuille de salle (docx), VDTexteAnnonce (docx).

## d) Suggestions d'images de posts (non traitées, non envoyées)
- Gestes Cinématographiques : Offing 1, 2, 3 ; Trying to Count Memories Still 1, 2, 3.
- Silence, ça tourne ! : Silence,CaTourne_005 et _006 (©JeanLouis-Fernandez).
- Chapitre 4 : CH4 - 1, 3, 4 (petites : 1050×706 à 1384×920).
- Rencontre performative : Visuel Khulood Bassel.jpg (4032×2268).
- Dwarfs of East Agouza (concert) : Dwarfs Concert Pic.jpg (5701×3811).
- Bibliothèques vivantes : DSCF6633, 6652, 6666, 6864 (1280 px).

## e) Crédits trouvés dans les noms (copiés tels quels, colonne `credit_from_name`)
- nasri_sayegh (Chrystèle) · Darek_Szuster(1) (Wael) · SJB (Taysir, fichier 02042379) · David Oppetit, Randa Mirza (Dania) · JeanLouis-Fernandez_005/_006 (Silence).
- Le modèle artiste n'a pas de champ crédit (`images` = liste d'URL) : les crédits restent dans le manifest, à mettre dans les bios ou une légende plus tard.

## f) Petit ou douteux
- Laurie Bellanca Photo 1 : 799×1200, flag `small-after-processing` (jamais agrandie).
- Oraib « Copy of » : même personne que le fichier sans « Copy of », recadrage différent (pas détecté comme doublon).
- Taysir : Bruit de fond, Transit, Me_2 et 02042379 ressemblent à des œuvres plus qu'à des portraits, à vérifier à l'œil. Me_2 est en CMYK (profil ADOBE embarqué), converti en sRGB.
- Aucune sortie ne dépasse 0,52 Mo (qualité 82 partout, pas de réduction forcée).
- Le fichier Khulood « Bassel » (visuel) et l'artiste « Basel » (seed) : orthographes unifiées sur le seed.
