"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { useEffect } from "react";

const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize || null,
            renderHTML: (attributes: { fontSize?: string | null }) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
});

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const FONT_SIZES = [
  { label: "Normal", value: "" },
  { label: "Pequeño", value: "13px" },
  { label: "Grande", value: "20px" },
  { label: "Muy grande", value: "26px" },
];

function ToolbarButton({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`min-w-[28px] h-7 px-1.5 rounded-md text-xs font-semibold flex items-center justify-center transition-colors ${
        active ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ label, value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontSize,
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[120px] px-3 py-2 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current && value !== undefined) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
      <div className="rounded-xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500">
        <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-100 bg-slate-50 px-2 py-1.5">
          <ToolbarButton title="Negrita" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
            <span className="font-bold">B</span>
          </ToolbarButton>
          <ToolbarButton title="Cursiva" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <span className="italic">I</span>
          </ToolbarButton>
          <ToolbarButton title="Subrayado" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <span className="underline">U</span>
          </ToolbarButton>
          <span className="w-px h-5 bg-slate-200 mx-1" />
          <ToolbarButton title="Título" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            H
          </ToolbarButton>
          <ToolbarButton title="Lista con viñetas" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            •≡
          </ToolbarButton>
          <ToolbarButton title="Lista numerada" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            1≡
          </ToolbarButton>
          <span className="w-px h-5 bg-slate-200 mx-1" />
          <select
            title="Tamaño de texto"
            onChange={(e) => {
              const size = e.target.value;
              if (size) {
                editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
              } else {
                editor.chain().focus().unsetMark("textStyle").run();
              }
            }}
            className="h-7 text-xs border border-slate-200 rounded-md px-1 text-slate-600 bg-white"
            defaultValue=""
          >
            {FONT_SIZES.map((s) => (
              <option key={s.label} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <ToolbarButton
            title="Limpiar formato"
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          >
            ⟲
          </ToolbarButton>
        </div>
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>
    </div>
  );
}
