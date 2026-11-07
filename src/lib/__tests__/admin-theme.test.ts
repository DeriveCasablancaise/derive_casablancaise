import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(
  resolve(process.cwd(), 'src/app/(admin)/globals.css'),
  'utf8',
);

const token = (name: string) => {
  const match = new RegExp(`--admin-${name}:\\s*(#[0-9a-f]{6})`, 'i').exec(css);
  if (!match) throw new Error(`Unknown token ${name}`);
  return match[1];
};

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5]
    .map((start) => parseInt(hex.slice(start, start + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ratio = (a: string, b: string) => {
  const [dark, light] = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (light + 0.05) / (dark + 0.05);
};

// text token on background token
const PAIRS: [string, string][] = [
  ['text', 'bg'],
  ['text', 'surface'],
  ['text', 'raised'],
  ['muted', 'bg'],
  ['muted', 'surface'],
  ['muted', 'raised'],
  ['placeholder', 'bg'],
  ['on-primary', 'primary'],
  ['on-primary', 'primary-hover'],
  ['on-danger', 'danger'],
  ['on-danger', 'danger-hover'],
  ['danger-text', 'bg'],
  ['danger-text', 'surface'],
  ['danger-text', 'raised'],
  ['success-text', 'surface'],
  ['disabled-text', 'disabled-bg'],
  ['ring', 'bg'],
  ['ring', 'surface'],
  ['page-text', 'page'],
  ['page-link', 'page'],
];

describe('admin colour pairs reach 4.5:1', () => {
  for (const [text, background] of PAIRS) {
    const value = ratio(token(text), token(background));

    it(`${text} on ${background} = ${value.toFixed(2)}:1`, () => {
      expect(value).toBeGreaterThanOrEqual(4.5);
    });
  }
});
