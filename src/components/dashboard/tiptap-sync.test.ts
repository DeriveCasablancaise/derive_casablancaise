import { describe, expect, it } from 'vitest';
import { isSameEditorContent } from './tiptap-sync';

describe('isSameEditorContent', () => {
  it('treats "", undefined and "<p></p>" as equal', () => {
    expect(isSameEditorContent('', '<p></p>')).toBe(true);
    expect(isSameEditorContent(undefined, '<p></p>')).toBe(true);
    expect(isSameEditorContent('<p></p>', '')).toBe(true);
  });

  it('matches identical html', () => {
    expect(isSameEditorContent('<p>Salut</p>', '<p>Salut</p>')).toBe(true);
  });

  it('detects late content, the 2026 form case', () => {
    expect(isSameEditorContent('<p>Texte</p>', '<p></p>')).toBe(false);
  });

  it('detects content cleared from outside', () => {
    expect(isSameEditorContent('', '<p>Texte</p>')).toBe(false);
  });
});
