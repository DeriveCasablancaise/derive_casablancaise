import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { sanitizeHtml } from '@/lib/sanitize';
import {
  artistFormSchema,
  derive2026FormSchema,
  postFormSchema,
} from '@/lib/validator';

const load = (name: string) =>
  JSON.parse(readFileSync(join(__dirname, name), 'utf8'));

const landing = load('landing.json');
const artists: any[] = load('artists.json');
const posts: any[] = load('posts.json');

// same conversion as toFloatingUTC in PostForm: wall-clock time stored as UTC
const floating = (s: string) => new Date(`${s}:00Z`);

describe('seed 2026 landing', () => {
  it('keeps every text block unchanged through sanitizeHtml', () => {
    for (const n of [1, 2, 3]) {
      for (const lang of ['Fr', 'Ar']) {
        const html = landing[`text${n}${lang}`];
        expect(html).toBeTruthy();
        expect(sanitizeHtml(html)).toBe(html);
      }
    }
  });

  it('passes derive2026FormSchema', () => {
    const { flags, ...data } = landing;
    expect(derive2026FormSchema.safeParse(data).success).toBe(true);
  });
});

describe('seed 2026 posts', () => {
  it.each(posts.map((p) => [p.key, p]))(
    '%s keeps its texts unchanged through sanitizeHtml',
    (_key, post) => {
      expect(sanitizeHtml(post.frenchText)).toBe(post.frenchText);
      expect(sanitizeHtml(post.arabicText)).toBe(post.arabicText);
    },
  );

  it.each(posts.map((p) => [p.key, p]))(
    '%s passes postFormSchema',
    (_key, post) => {
      const result = postFormSchema.safeParse({
        frenchTitle: post.frenchTitle,
        arabicTitle: post.arabicTitle,
        frenchText: post.frenchText,
        arabicText: post.arabicText,
        images: post.images,
        thumbnailImage: post.thumbnail || undefined,
        postCategory: post.postCategory,
        subCategory: post.subCategory,
        yearOfEdition: post.yearOfEdition,
        startDateTime: floating(post.start),
        endDateTime: floating(post.end),
        location: post.location,
        locationAr: post.locationAr,
        url: post.url || undefined,
        artists: post.artists,
      });
      expect(result.error?.flatten().fieldErrors).toBeUndefined();
    },
  );
});

describe('seed 2026 artists', () => {
  // artist texts are plain text in the app, so only the schema applies
  it.each(artists.map((a) => [a.key, a]))(
    '%s passes artistFormSchema',
    (_key, artist) => {
      const result = artistFormSchema.safeParse({
        frenchName: artist.frenchName,
        arabicName: artist.arabicName,
        frenchText: artist.frenchText,
        arabicText: artist.arabicText,
        images: artist.images,
        editions: artist.editions,
        isInHomepage: false,
      });
      expect(result.error?.flatten().fieldErrors).toBeUndefined();
    },
  );
});
