// an empty editor is stored as '', but Tiptap serialises it as '<p></p>'
const normalize = (html?: string) => {
  const value = (html ?? '').trim();
  return value === '<p></p>' ? '' : value;
};

// true when the prop already matches what the editor holds
export const isSameEditorContent = (
  content: string | undefined,
  editorHtml: string,
) => normalize(content) === normalize(editorHtml);
