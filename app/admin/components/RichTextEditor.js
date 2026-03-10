'use client';

import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';

const RichTextEditor = forwardRef(function RichTextEditor({ initialContent }, ref) {
  const editorRef = useRef(null);

  // Set initial content once on mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent || '<p></p>';
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Expose getContent method to parent
  useImperativeHandle(ref, () => ({
    getContent: () => editorRef.current?.innerHTML || '',
  }));

  const exec = useCallback((cmd, val = null) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
  }, []);

  const ToolbarButton = useCallback(({ onClick, title, children, active }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className={`px-2.5 py-1.5 text-sm rounded transition-colors ${
        active ? 'bg-gray-300 text-black' : 'hover:bg-gray-200 text-gray-700'
      }`}
    >
      {children}
    </button>
  ), []);

  const Divider = () => <div className="w-px h-6 bg-gray-300 mx-1" />;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
        <ToolbarButton onClick={() => exec('bold')} title="Bold (Ctrl+B)">
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('italic')} title="Italic (Ctrl+I)">
          <em className="font-serif">I</em>
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('underline')} title="Subliniat (Ctrl+U)">
          <span className="underline">U</span>
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => exec('formatBlock', '<h2>')} title="Titlu Mare (H2)">
          <span className="font-bold text-xs">H2</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('formatBlock', '<h3>')} title="Titlu Mic (H3)">
          <span className="font-bold text-xs">H3</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('formatBlock', '<p>')} title="Paragraf">
          <span className="text-xs">¶</span>
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => exec('insertUnorderedList')} title="Listă cu Puncte">
          <span className="text-xs">• Listă</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('insertOrderedList')} title="Listă Numerotată">
          <span className="text-xs">1. Listă</span>
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => {
            const url = prompt('Introdu URL-ul linkului:');
            if (url) exec('createLink', url);
          }}
          title="Adaugă Link"
        >
          <span className="text-xs">🔗 Link</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('unlink')} title="Șterge Link">
          <span className="text-xs">✂️ Unlink</span>
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={() => exec('removeFormat')} title="Șterge Formatarea">
          <span className="text-xs">✕ Format</span>
        </ToolbarButton>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[500px] p-6 page-content focus:outline-none cursor-text"
        style={{ minHeight: '500px' }}
      />
    </div>
  );
});

export default RichTextEditor;
