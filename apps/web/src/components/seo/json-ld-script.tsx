type JsonLdScriptProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function JsonLdScript({ data }: JsonLdScriptProps) {
  const payload = Array.isArray(data) ? data : [data];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
