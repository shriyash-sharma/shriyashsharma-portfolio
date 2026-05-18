function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderInlineMarkdown(value: string) {
  const escaped = escapeHtml(value);

  return escaped
    .replace(/`([^`]+)`/g, '<code class="rounded bg-[var(--color-surface)] px-1 py-0.5 font-mono text-[0.9em]">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a class="text-[var(--color-foreground)] underline underline-offset-4" href="$2" target="_blank" rel="noreferrer">$1</a>'
    );
}

type MarkdownPreviewProps = {
  value: string;
};

export function MarkdownPreview({ value }: MarkdownPreviewProps) {
  const blocks = value.split(/\n\s*\n/).filter(Boolean);

  if (!blocks.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-8 text-center text-[14px] text-[var(--color-muted)]">
        Preview appears here as you write.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {blocks.map((block, index) => {
        if (block.startsWith("```") && block.endsWith("```")) {
          const code = escapeHtml(block.slice(3, -3).trim());
          return (
            <pre
              key={`${block}-${index}`}
              className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-black/30 p-4 text-[13px] text-[var(--color-secondary)]"
            >
              <code dangerouslySetInnerHTML={{ __html: code }} />
            </pre>
          );
        }

        if (/^#{1,3}\s/.test(block)) {
          const level = block.match(/^#{1,3}/)?.[0].length ?? 1;
          const html = renderInlineMarkdown(block.replace(/^#{1,3}\s/, ""));

          if (level === 1) {
            return (
              <h1
                key={`${block}-${index}`}
                className="text-[32px] font-semibold tracking-[-0.05em] text-[var(--color-foreground)]"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          }

          if (level === 2) {
            return (
              <h2
                key={`${block}-${index}`}
                className="text-[24px] font-semibold tracking-[-0.04em] text-[var(--color-foreground)]"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          }

          return (
            <h3
              key={`${block}-${index}`}
              className="text-[18px] font-medium text-[var(--color-foreground)]"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }

        if (/^>\s/m.test(block)) {
          const lines = block
            .split("\n")
            .map((line) => line.replace(/^>\s?/, ""))
            .join(" ");
          return (
            <blockquote
              key={`${block}-${index}`}
              className="border-l-2 border-[var(--color-border-strong)] pl-4 text-[15px] italic text-[var(--color-secondary)]"
              dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(lines) }}
            />
          );
        }

        if (/^(-|\*)\s/m.test(block)) {
          const items = block
            .split("\n")
            .map((line) => line.replace(/^(-|\*)\s/, ""))
            .filter(Boolean);
          return (
            <ul key={`${block}-${index}`} className="grid gap-2 pl-5 text-[15px] text-[var(--color-secondary)]">
              {items.map((item) => (
                <li
                  key={item}
                  className="list-disc"
                  dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item) }}
                />
              ))}
            </ul>
          );
        }

        if (/^\d+\.\s/m.test(block)) {
          const items = block
            .split("\n")
            .map((line) => line.replace(/^\d+\.\s/, ""))
            .filter(Boolean);
          return (
            <ol key={`${block}-${index}`} className="grid gap-2 pl-5 text-[15px] text-[var(--color-secondary)]">
              {items.map((item) => (
                <li
                  key={item}
                  className="list-decimal"
                  dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item) }}
                />
              ))}
            </ol>
          );
        }

        return (
          <p
            key={`${block}-${index}`}
            className="text-[15px] leading-8 text-[var(--color-secondary)]"
            dangerouslySetInnerHTML={{
              __html: renderInlineMarkdown(block).replace(/\n/g, "<br />"),
            }}
          />
        );
      })}
    </div>
  );
}