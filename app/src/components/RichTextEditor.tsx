'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string, wordCount: number) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing your story...',
      }),
      CharacterCount,
    ],
    content,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const text = editor.getText();
      const words = text.split(/\s+/).filter(w => w.length > 0).length;
      onChange(JSON.stringify(json), words);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-100 px-4 py-3',
      },
    },
  });

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      try {
        const parsed = JSON.parse(content);
        editor.commands.setContent(parsed);
      } catch {
        // If not JSON, treat as plain text
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const wordCount = editor.storage.characterCount.words();
  const charCount = editor.storage.characterCount.characters();

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 bg-white/5 border-b border-white/10">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm transition-all ${
            editor.isActive('bold')
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm transition-all ${
            editor.isActive('italic')
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1 rounded text-sm transition-all ${
            editor.isActive('strike')
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          <s>S</s>
        </button>
        
        <div className="w-px h-6 bg-white/20 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1 rounded text-sm transition-all ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded text-sm transition-all ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 rounded text-sm transition-all ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          H3
        </button>

        <div className="w-px h-6 bg-white/20 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm transition-all ${
            editor.isActive('bulletList')
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded text-sm transition-all ${
            editor.isActive('orderedList')
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded text-sm transition-all ${
            editor.isActive('blockquote')
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          &quot; Quote
        </button>

        <div className="w-px h-6 bg-white/20 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="px-3 py-1 rounded text-sm bg-white/10 text-white/70 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          ↶ Undo
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="px-3 py-1 rounded text-sm bg-white/10 text-white/70 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          ↷ Redo
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="text-white" />

      {/* Stats */}
      <div className="flex justify-between items-center p-3 bg-white/5 border-t border-white/10 text-sm text-white/60">
        <span>{wordCount} words</span>
        <span>{charCount} characters</span>
      </div>
    </div>
  );
}
