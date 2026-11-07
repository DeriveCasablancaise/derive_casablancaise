import { describe, expect, it } from 'vitest';
import { cleanPastedHtml } from './tiptap-paste';

describe('cleanPastedHtml', () => {
  it('drops colour, background, font family and font size', () => {
    expect(
      cleanPastedHtml(
        '<span style="color: #000; background-color: yellow; font-family: Arial; font-size: 12pt">x</span>',
      ),
    ).toBe('<span>x</span>');
  });

  it('copes with the quoted font names Word writes', () => {
    expect(
      cleanPastedHtml(
        '<p style="font-family:&quot;Times New Roman&quot;,serif;text-align:center">x</p>',
      ),
    ).toBe('<p style="text-align:center">x</p>');
  });

  it('drops Word properties and single quoted styles', () => {
    expect(cleanPastedHtml(`<p style='mso-line-height:1;color:red'>x</p>`)).toBe(
      '<p>x</p>',
    );
  });

  it('keeps alignment and weight', () => {
    expect(
      cleanPastedHtml(
        '<p style="text-align: right; color: red"><b style="font-weight: normal">x</b></p>',
      ),
    ).toBe(
      '<p style="text-align: right"><b style="font-weight: normal">x</b></p>',
    );
  });

  it('keeps bold, italic, lists and links as they are', () => {
    const html =
      '<ul><li><strong>a</strong> <em>b</em></li></ul><a href="https://x.ma">c</a>';
    expect(cleanPastedHtml(html)).toBe(html);
  });

  it('drops the attributes of old font tags', () => {
    expect(
      cleanPastedHtml('<font color="#000" face="Arial" size=2>x</font>'),
    ).toBe('<font>x</font>');
  });

  it('leaves a colour named in the text alone', () => {
    expect(cleanPastedHtml('<p>color: red</p>')).toBe('<p>color: red</p>');
  });
});
