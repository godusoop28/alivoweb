interface RichTextViewProps {
  html: string;
  className?: string;
}

/** Renders HTML authored by an admin via RichTextEditor. Content is admin-only, not user-submitted. */
export default function RichTextView({ html, className = "" }: RichTextViewProps) {
  return (
    <div
      className={`prose prose-sm max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
