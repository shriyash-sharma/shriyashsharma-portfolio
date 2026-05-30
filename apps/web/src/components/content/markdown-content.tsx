import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  value: string;
  className?: string;
  emptyMessage?: string;
};

function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}

function languageLabel(className?: string): string | null {
  if (!className) {
    return null;
  }

  const match = className.match(/language-([\w-]+)/);
  return match?.[1] ?? null;
}

export function MarkdownContent({
  value,
  className,
  emptyMessage = "No markdown content has been published yet.",
}: MarkdownContentProps) {
  const trimmed = value.trim();

  if (!trimmed) {
    return (
      <div className="rounded-[24px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-8 text-[14px] text-[var(--color-muted)]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={["markdown-content grid gap-6", className].filter(Boolean).join(" ")}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-[32px] font-semibold tracking-[-0.05em] text-[var(--color-foreground)] sm:text-[40px]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="pt-3 text-[24px] font-semibold tracking-[-0.04em] text-[var(--color-foreground)] sm:text-[28px]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="pt-2 text-[18px] font-medium text-[var(--color-foreground)] sm:text-[20px]">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-[15px] leading-8 text-[var(--color-secondary)] sm:text-[16px]">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="grid gap-3 pl-5 text-[15px] leading-8 text-[var(--color-secondary)] sm:text-[16px]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="grid gap-3 pl-5 text-[15px] leading-8 text-[var(--color-secondary)] sm:text-[16px]">
              {children}
            </ol>
          ),
          li: ({ className, children }) => {
            const isTaskItem = className?.includes("task-list-item");

            return (
              <li
                className={isTaskItem ? "list-none pl-0" : "list-disc"}
              >
                {children}
              </li>
            );
          },
          input: ({ type, checked, disabled }) => {
            if (type !== "checkbox") {
              return null;
            }

            return (
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                readOnly
                className="mr-3 h-4 w-4 rounded border border-[var(--color-border)] bg-[var(--color-surface-2)] align-middle accent-[var(--color-foreground)]"
              />
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="rounded-r-[20px] border-l-2 border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-5 py-4 text-[15px] italic leading-8 text-[var(--color-secondary)]">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-t border-[var(--color-border)]" />,
          table: ({ children }) => (
            <div className="overflow-x-auto rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)]">
              <table className="min-w-full border-collapse text-left text-[14px] text-[var(--color-secondary)]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[var(--color-surface-2)] text-[12px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border-b border-[var(--color-border)] px-4 py-3 font-medium text-[var(--color-foreground)]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-t border-[var(--color-border)] px-4 py-3 align-top">
              {children}
            </td>
          ),
          img: ({ src, alt }) => (
            <img
              src={src ?? ""}
              alt={alt ?? ""}
              className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)]"
            />
          ),
          a: ({ href, children }) => {
            const linkHref = href ?? "#";

            if (isExternalHref(linkHref)) {
              return (
                <a
                  className="text-[var(--color-foreground)] underline underline-offset-4 transition-colors hover:text-white"
                  href={linkHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  {children}
                </a>
              );
            }

            return (
              <Link
                className="text-[var(--color-foreground)] underline underline-offset-4 transition-colors hover:text-white"
                href={linkHref}
              >
                {children}
              </Link>
            );
          },
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-b-[20px] bg-transparent px-5 py-5 text-[13px] leading-7 text-[var(--color-foreground)]">
              {children}
            </pre>
          ),
          code: ({ className, children }) => {
            const language = languageLabel(className);
            const content = String(children).replace(/\n$/, "");

            if (!className) {
              return (
                <code className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-1.5 py-0.5 font-mono text-[0.92em] text-[var(--color-foreground)]">
                  {content}
                </code>
              );
            }

            return (
              <div className="overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)]">
                <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  {language ?? "code"}
                </div>
                <code className={["hljs block", className].filter(Boolean).join(" ")}>
                  {content}
                </code>
              </div>
            );
          },
        }}
      >
        {trimmed}
      </ReactMarkdown>
    </div>
  );
}