import { describe, expect, it } from 'vitest';
import {
  findArtistDoc,
  parseCsv,
  parseManifest,
  planImages,
  publicUrl,
} from './seed-artist-images-2026-helpers.mjs';

const HEADER = 'source,output_name,artist_key,status,reason,flags';

describe('parseCsv', () => {
  it('reads quoted fields, escaped quotes and CRLF', () => {
    const rows = parseCsv('a,b\r\n"x, y","say ""hi"""\r\n');
    expect(rows).toEqual([
      ['a', 'b'],
      ['x, y', 'say "hi"'],
    ]);
  });

  it('keeps empty fields and ignores blank lines and a BOM', () => {
    expect(parseCsv('﻿a,b,c\n\n1,,3')).toEqual([
      ['a', 'b', 'c'],
      ['1', '', '3'],
    ]);
  });
});

describe('parseManifest', () => {
  it('groups ok rows by artist, in manifest order', () => {
    const text = [
      HEADER,
      'Oraib\\a.jpg,oraib-toukan-1.jpg,oraib-toukan,ok,,',
      'Taysir\\b.tif,taysir-batniji-1-sjb.jpg,taysir-batniji,ok,,',
      'Oraib\\c.jpg,oraib-toukan-2-artist-talk.jpg,oraib-toukan,ok,,small-after-processing',
    ].join('\n');
    const map = parseManifest(text);
    expect(Array.from(map.keys())).toEqual(['oraib-toukan', 'taysir-batniji']);
    expect(map.get('oraib-toukan')).toEqual(['oraib-toukan-1.jpg', 'oraib-toukan-2-artist-talk.jpg']);
  });

  it('ignores held, skipped and error rows', () => {
    const text = [
      HEADER,
      'x.psd,,,held,needs a JPG export,',
      'y.pdf,,,skipped,not an image,',
      'z.png,,oraib-toukan,error,boom,',
    ].join('\n');
    expect(parseManifest(text).size).toBe(0);
  });

  it('rejects unsafe or misplaced names', () => {
    const row = (name: string, key = 'oraib-toukan') => `${HEADER}\ns,${name},${key},ok,,`;
    expect(() => parseManifest(row('../oraib-toukan-1.jpg'))).toThrow(/unsafe/);
    expect(() => parseManifest(row('Oraib-Toukan-1.jpg'))).toThrow(/unsafe/);
    expect(() => parseManifest(row('oraib-toukan-1.png'))).toThrow(/unsafe/);
    expect(() => parseManifest(row('other-artist-1.jpg'))).toThrow(/prefixed/);
    expect(() => parseManifest(row('oraib-toukan-1.jpg', ''))).toThrow(/artist_key/);
  });

  it('rejects a name used twice and a missing column', () => {
    const twice = [HEADER, 's1,oraib-toukan-1.jpg,oraib-toukan,ok,,', 's2,oraib-toukan-1.jpg,oraib-toukan,ok,,'].join('\n');
    expect(() => parseManifest(twice)).toThrow(/twice/);
    expect(() => parseManifest('source,status\na,ok')).toThrow(/output_name/);
    expect(() => parseManifest('')).toThrow(/empty/);
  });
});

describe('findArtistDoc', () => {
  const seed = { key: 'chrystele-khodr', frenchName: 'Chrystèle Khodr' };

  it('matches despite accents, case and spacing', () => {
    const docs = [{ _id: 1, frenchName: 'Autre' }, { _id: 2, frenchName: ' chrystele  KHODR ' }];
    expect(findArtistDoc(seed, docs)).toEqual({ doc: docs[1] });
  });

  it('reports a missing or duplicated artist, never guesses', () => {
    expect(findArtistDoc(seed, [{ frenchName: 'Autre' }]).error).toMatch(/not in the database/);
    const dup = [{ frenchName: 'Chrystèle Khodr' }, { frenchName: 'Chrystele Khodr' }];
    expect(findArtistDoc(seed, dup).error).toMatch(/2 artists/);
  });
});

describe('planImages (only when empty)', () => {
  const urls = ['https://utfs.io/f/a', 'https://utfs.io/f/b'];

  it('sets the images of an artist that has none', () => {
    for (const images of [undefined, null, []]) {
      expect(planImages({ images }, urls)).toEqual({ action: 'set', images: urls });
    }
  });

  it('leaves an artist that already has images alone', () => {
    const plan = planImages({ images: ['https://utfs.io/f/old'] }, urls);
    expect(plan.action).toBe('skip');
  });

  it('does nothing without images to set', () => {
    expect(planImages({ images: [] }, []).action).toBe('skip');
  });
});

describe('publicUrl', () => {
  it('uses the host allowed in next.config.mjs', () => {
    expect(publicUrl('abc123')).toBe('https://utfs.io/f/abc123');
  });
});
