'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { isSameEditorContent } from './tiptap-sync';
import { cleanPastedHtml } from './tiptap-paste';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from 'lucide-react';
import { AdminButton } from './admin-ui';
import TextAlign from '@tiptap/extension-text-align';

const TiptapEditor = ({
  content,
  onChange,
  dir = 'ltr',
  label,
}: {
  content?: string;
  onChange: (content?: string) => void;
  dir?: 'ltr' | 'rtl';
  label: string;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base',
        dir,
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-label': label,
      },
      transformPastedHTML: cleanPastedHtml,
    },
    onUpdate: ({ editor }) => {
      // an empty editor is stored as '', not '<p></p>'
      const isEmpty =
        !editor.getText().trim() &&
        !editor.getJSON().content?.some((node) =>
          ['image', 'horizontalRule'].includes(node.type ?? ''),
        );
      onChange(isEmpty ? '' : editor.getHTML());
    },
  });

  // content can arrive after the editor is created (form.reset), so I sync it
  useEffect(() => {
    if (!editor || editor.isFocused) return;
    if (isSameEditorContent(content, editor.getHTML())) return;
    // false: no onUpdate, so no loop and the form is not marked dirty
    editor.commands.setContent(content ?? '', false);
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const tools = [
    {
      name: 'Gras',
      icon: Bold,
      active: editor.isActive('bold'),
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      name: 'Italique',
      icon: Italic,
      active: editor.isActive('italic'),
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      name: 'Barré',
      icon: Strikethrough,
      active: editor.isActive('strike'),
      run: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      name: 'Liste à puces',
      icon: List,
      active: editor.isActive('bulletList'),
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      name: 'Liste numérotée',
      icon: ListOrdered,
      active: editor.isActive('orderedList'),
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      name: 'Citation',
      icon: Quote,
      active: editor.isActive('blockquote'),
      run: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      name: 'Annuler',
      icon: Undo,
      run: () => editor.chain().focus().undo().run(),
    },
    {
      name: 'Rétablir',
      icon: Redo,
      run: () => editor.chain().focus().redo().run(),
    },
  ];

  return (
    <div className="admin-editor">
      <div className="admin-editor-toolbar">
        {tools.map(({ name, icon: Icon, active, run }) => (
          <AdminButton
            key={name}
            type="button"
            variant="ghost"
            size="icon"
            title={name}
            aria-label={name}
            aria-pressed={active}
            onClick={run}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </AdminButton>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
