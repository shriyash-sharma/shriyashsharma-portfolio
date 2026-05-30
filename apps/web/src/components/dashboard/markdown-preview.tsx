import { MarkdownContent } from "@/components/content/markdown-content";

type MarkdownPreviewProps = {
  value: string;
};

export function MarkdownPreview({ value }: MarkdownPreviewProps) {
  return (
    <MarkdownContent
      value={value}
      emptyMessage="Preview appears here as you write."
      className="gap-5"
    />
  );
}