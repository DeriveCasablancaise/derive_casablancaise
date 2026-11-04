import { describe, expect, it } from 'vitest';
import { findDuplicateArtist, normalizeArtistName } from '@/lib/artist-name';

describe('normalizeArtistName', () => {
  it('keeps the letter s (no bare-s regex)', () => {
    expect(normalizeArtistName('Sarah Souissi')).toBe('sarah souissi');
    expect(normalizeArtistName('Les Ss')).toBe('les ss');
  });

  it('removes accents and lowercases', () => {
    expect(normalizeArtistName('Élise Désirée')).toBe('elise desiree');
    expect(normalizeArtistName('François Lëa Ñoël')).toBe('francois lea noel');
  });

  it('collapses and trims spaces, tabs included', () => {
    expect(normalizeArtistName('  Sami   Benslimane \t ')).toBe('sami benslimane');
  });

  it('turns punctuation into spaces', () => {
    expect(normalizeArtistName("Jean-Pierre O'Sullivan.")).toBe('jean pierre o sullivan');
    expect(normalizeArtistName('Jean - Pierre')).toBe(normalizeArtistName('jean pierre'));
  });

  it('keeps Arabic letters and drops their diacritics', () => {
    expect(normalizeArtistName('  سَعيد  ')).toBe('سعيد');
  });
});

describe('findDuplicateArtist', () => {
  const artists = [
    { _id: 'a1', frenchName: 'Saïd Ssouissi' },
    { _id: 'a2', frenchName: 'Compagnie Ciel' },
  ];

  it('finds another artist with the same normalised name', () => {
    expect(findDuplicateArtist('  said   SSOUISSI ', artists)?._id).toBe('a1');
  });

  it('ignores the artist being renamed', () => {
    expect(findDuplicateArtist('Saïd Ssouissi', artists, 'a1')).toBeUndefined();
  });

  it('lets a new name through', () => {
    expect(findDuplicateArtist('Said Souissi', artists)).toBeUndefined();
  });
});
