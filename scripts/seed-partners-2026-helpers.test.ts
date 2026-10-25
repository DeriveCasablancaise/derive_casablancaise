import { describe, expect, it } from 'vitest';
import {
  buildPartnerRecord,
  csvLine,
  lackingEdition,
  looseKey,
  matchKey,
  nameFlags,
  needsNameReview,
  outputSlug,
  parseManifest,
  partnerEditions,
  partnerNameFromFile,
  planPartners,
} from './seed-partners-2026-helpers.mjs';

describe('partnerNameFromFile', () => {
  it('drops the extension and trims, keeping accents and capitals', () => {
    expect(partnerNameFromFile('  Asso des anciens élèves La Coupole.jpg ')).toBe(
      'Asso des anciens élèves La Coupole',
    );
    expect(partnerNameFromFile('CDN.jpeg')).toBe('CDN');
  });

  it('turns underscores into spaces only when the name has no space', () => {
    expect(partnerNameFromFile('LECONOMISTE_Logo_NOIR.png')).toBe('LECONOMISTE Logo NOIR');
    expect(partnerNameFromFile('5- If_Maroc_Logo.png')).toBe('5- If_Maroc_Logo');
  });

  it('keeps a dot that is not an extension', () => {
    expect(partnerNameFromFile('St. Jo')).toBe('St. Jo');
  });
});

describe('nameFlags', () => {
  it('flags leading numbers, copies, logo and colour words', () => {
    expect(nameFlags('1- AR2D')).toEqual(['leading-number']);
    expect(nameFlags('Logo AMME (1)')).toEqual(['logo-word', 'copy-suffix']);
    expect(nameFlags('Jooj black')).toEqual(['colour-word']);
  });

  it('leaves a plain name alone', () => {
    expect(nameFlags('CDN')).toEqual([]);
    expect(needsNameReview(nameFlags('CDN'))).toBe(false);
    expect(needsNameReview(nameFlags('Logo MJCC'))).toBe(true);
  });
});

describe('matchKey and looseKey', () => {
  it('ignores case, accents, punctuation and spacing', () => {
    expect(matchKey('  Institut  Français-du Maroc ')).toBe('institut francais du maroc');
    expect(matchKey('Élèves & Co.')).toBe('eleves co');
  });

  it('looseKey also drops a number prefix, the word logo and a copy suffix', () => {
    expect(looseKey('7- Logo MJCC')).toBe('mjcc');
    expect(looseKey('Logo AMME (1)')).toBe('amme');
  });
});

describe('outputSlug', () => {
  it('gives clean lowercase ascii', () => {
    expect(outputSlug('Asso des anciens élèves La Coupole')).toBe('asso-des-anciens-eleves-la-coupole');
    expect(outputSlug('???')).toBe('partner');
  });
});

describe('csvLine', () => {
  it('quotes commas and quotes', () => {
    expect(csvLine(['a,b', 'say "hi"', 3])).toBe('"a,b","say ""hi""",3');
  });
});

const HEADER = 'partner_name,source,output_name,status,flags';

describe('parseManifest', () => {
  it('keeps only ok rows and splits the flags', () => {
    const rows = parseManifest(
      [HEADER, 'CDN,CDN.jpeg,cdn.webp,ok,', 'X,x.pdf,,skipped,not-an-image', '7- Logo MJCC,m.png,7-logo-mjcc.webp,ok,leading-number|logo-word'].join('\n'),
    );
    expect(rows.map((r) => r.outputName)).toEqual(['cdn.webp', '7-logo-mjcc.webp']);
    expect(rows[1].flags).toEqual(['leading-number', 'logo-word']);
  });

  it('rejects a missing column, an unsafe name and duplicates', () => {
    expect(() => parseManifest('a,b\n1,2')).toThrow(/no "partner_name" column/);
    expect(() => parseManifest(`${HEADER}\nA,a.png,../a.webp,ok,`)).toThrow(/unsafe/);
    expect(() => parseManifest(`${HEADER}\nA,a.png,a.webp,ok,\nB,b.png,a.webp,ok,`)).toThrow(/used twice/);
    expect(() => parseManifest(`${HEADER}\nA,a.png,a.webp,ok,\nÀ,b.png,b.webp,ok,`)).toThrow(/same partner/);
  });
});

describe('planPartners', () => {
  const rows = parseManifest(
    [HEADER, 'CDN,CDN.jpeg,cdn.webp,ok,', 'Institut Français,if.png,institut-francais.webp,ok,', 'Logo MJCC,m.png,logo-mjcc.webp,ok,logo-word', 'Nouveau,n.png,nouveau.webp,ok,'].join('\n'),
  );
  const docs = [
    { frenchName: 'cdn', editions: ['2024'] },
    { frenchName: 'Institut francais', editions: ['2022', '2026'] },
    { frenchName: 'MJCC', yearOfPartnership: 'both' },
  ];

  it('skips existing partners, holds flagged names, creates the rest', () => {
    const plan = planPartners(rows, docs);
    expect(plan.map((p: { action: string }) => p.action)).toEqual(['skip', 'skip', 'review', 'create']);
    expect(plan[2].hint).toBe('MJCC');
  });

  it('lists matched partners without 2026, reading the legacy field too', () => {
    const lacking = lackingEdition(planPartners(rows, docs));
    expect(lacking.map((d: { frenchName: string }) => d.frenchName)).toEqual(['cdn']);
  });
});

describe('partnerEditions', () => {
  it('reads editions, then the legacy field', () => {
    expect(partnerEditions({ editions: ['2026'] })).toEqual(['2026']);
    expect(partnerEditions({ yearOfPartnership: 'both' })).toEqual(['2022', '2024']);
    expect(partnerEditions({})).toEqual([]);
  });
});

describe('buildPartnerRecord', () => {
  it('carries the model defaults and only 2026', () => {
    const now = new Date('2026-01-01T00:00:00Z');
    expect(buildPartnerRecord({ partnerName: 'CDN' }, 'https://utfs.io/f/k', now)).toEqual({
      frenchName: 'CDN',
      hrefLink: '#',
      editions: ['2026'],
      logoImage: 'https://utfs.io/f/k',
      order: 0,
      createdAt: now,
      __v: 0,
    });
  });
});
