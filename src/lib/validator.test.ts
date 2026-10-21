import { describe, expect, it } from 'vitest';
import { postFormSchema } from './validator';

const post = (postCategory: string, yearOfEdition: string) => ({
  frenchTitle: 'Titre',
  frenchText: 'Texte',
  location: 'Lieu',
  postCategory,
  yearOfEdition,
});

describe('postFormSchema category per edition', () => {
  it('accepts a category of the edition', () => {
    expect(postFormSchema.safeParse(post('autres', '2024')).success).toBe(true);
    expect(postFormSchema.safeParse(post('musique', '2022')).success).toBe(true);
    expect(postFormSchema.safeParse(post('exposition', '2026')).success).toBe(true);
  });

  it('rejects a known category the edition does not use', () => {
    const r = postFormSchema.safeParse(post('exposition', '2024'));
    expect(r.success).toBe(false);
    expect(postFormSchema.safeParse(post('autres', '2026')).success).toBe(false);
  });

  it('rejects an unknown category', () => {
    expect(postFormSchema.safeParse(post('nope', '2026')).success).toBe(false);
  });
});
