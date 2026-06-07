import Link from "next/link";
import { Section } from "@/components/layout/section";
import { CONTEXT_WINDOW_FAQ } from "@/lib/ai-lab/context-window";

export function ContextWindowSeoContent() {
  return (
    <Section
      as="article"
      className="border-t border-[var(--color-border)] pt-12"
      aria-label="Learn about context windows"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <header className="flex flex-col gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-muted)]">
            Learn the concepts
          </span>
          <h2 className="text-[24px] font-medium tracking-[-0.015em] text-[var(--color-foreground)] sm:text-[28px]">
            Context Window Explained: Token Limits, Truncation, and Why RAG Matters
          </h2>
          <p className="text-[14px] leading-relaxed text-[var(--color-secondary)]">
            This guide explains what a context window is, why token limits
            create real engineering constraints, and how retrieval architecture
            helps AI systems remain reliable at scale.
          </p>
        </header>

        <Topic title="What Is a Context Window in an LLM?">
          <p>
            A context window is the maximum amount of text an LLM can process in
            a single request. The key detail many teams miss is that this budget
            includes everything: system instructions, user prompts, conversation
            history, tool output, retrieved documents, and space reserved for the
            answer. The model does not receive unlimited memory; it receives a
            finite token budget that must be partitioned carefully.
          </p>
          <p>
            In practical terms, token budgeting is as important as model
            selection. You can choose a powerful model, but if the prompt is not
            structured within the model&apos;s token limits, critical context can be
            dropped. That is why modern LLM engineering treats context windows as
            first-class architecture constraints rather than UI details.
          </p>
          <p>
            This is also why terms like &quot;LLM context window&quot; and &quot;token limits
            explained&quot; show up repeatedly in production guidance. Systems fail
            silently when budgets are exceeded. A model may still respond
            fluently, but it can answer from incomplete evidence because part of
            the prompt never reached the model.
          </p>
        </Topic>

        <Topic title="How Token Limits Work in Real Prompts">
          <p>
            Most teams think in characters or words, but models bill and limit by
            tokens. Tokens are subword pieces, not one token per word. Common
            English prose often lands near one token per four characters, but
            exact counts vary by tokenizer and language. Numbers, code, URLs, and
            mixed symbols can inflate token counts significantly.
          </p>
          <p>
            Suppose your model has a 128K context window. If you allocate 10K for
            system and orchestration instructions, 20K for chat history, and 30K
            for retrieved context, you have already consumed 60K before generation.
            If you reserve 4K for output, your effective input budget for the
            current user turn is lower than you might expect. This arithmetic is
            why token planning should be visible in tooling.
          </p>
          <p>
            Context windows are not just about whether content fits. They are also
            about signal-to-noise ratio. Even when text fits technically, sending
            too much irrelevant context can reduce answer quality because the model
            must attend over more distractors.
          </p>
        </Topic>

        <Topic title="Why AI Forgets Information">
          <p>
            A common complaint in LLM products is &quot;the model forgot what I gave
            it.&quot; In many cases, this is not random forgetting; it is truncation
            pressure. If accumulated prompt material exceeds the model window,
            some portion is excluded. Depending on orchestration policy, the
            dropped portion may be old chat turns, early system text, or document
            tail sections.
          </p>
          <p>
            This creates brittle behavior. A user may provide a critical detail,
            then continue the conversation. Several turns later, that detail can
            fall out of the visible context even though the interface still shows
            it in history. From the model&apos;s perspective, the detail is no longer
            present. That mismatch between UX memory and model memory is a core
            reliability challenge.
          </p>
          <p>
            Good systems surface this risk explicitly. They track token growth,
            compress low-value history, and favor retrieval over brute-force
            prompt accumulation. Context windows are large today, but they remain
            finite, and finite budgets require explicit policy.
          </p>
        </Topic>

        <Topic title="What Happens When a Context Window Is Exceeded?">
          <p>
            When prompts exceed limit, one of three outcomes typically happens.
            First, the request is rejected by provider validation. Second, the
            platform truncates content automatically before sending to the model.
            Third, your own orchestration layer trims content to fit. Only the
            visible tokens are processed; hidden tokens have zero effect on model
            behavior.
          </p>
          <p>
            Truncation risk is especially dangerous for long technical documents,
            legal text, and support logs where key constraints appear late in the
            document. If those segments are outside the visible window, the model
            may produce plausible but incomplete answers. This is one reason teams
            ask &quot;can context windows replace RAG?&quot; The short answer is no.
          </p>
          <p>
            Larger windows reduce the frequency of hard failures, but they do not
            solve selection quality. Even with huge limits, sending everything on
            every turn is costly and noisy. Retrieval still matters because it
            selects what is relevant now.
          </p>
        </Topic>

        <Topic title="How RAG Solves Context Limits">
          <p>
            Retrieval-Augmented Generation reframes the problem. Instead of
            pushing full corpora into each request, RAG preprocesses content into
            chunks, embeds them, and stores them for fast similarity search. At
            query time, the system retrieves only the highest-signal chunks and
            constructs a compact prompt around them.
          </p>
          <p>
            This approach provides three benefits. First, it keeps token usage
            predictable. Second, it improves grounding by limiting noise. Third,
            it scales better economically because each request transmits only a
            narrow context slice. In other words, RAG turns context windows from
            a brittle bottleneck into a manageable design parameter.
          </p>
          <p>
            The workflow is simple but powerful: large source document, chunking,
            embeddings, retrieval, focused context, then generation. If you want
            to see this in action, use the dedicated RAG flow tool:
            <span> </span>
            <Link
              href="/ai-lab/rag-explorer"
              className="font-medium text-[var(--color-foreground)] underline-offset-4 hover:underline"
            >
              Try the RAG Explorer
            </Link>
            .
          </p>
        </Topic>

        <Topic title="Context Window Strategy for Production Teams">
          <p>
            Strong AI products treat context as a budgeted resource. They reserve
            space intentionally for system policy, user intent, retrieved
            evidence, and output length. They also instrument token usage per
            request so engineering teams can detect prompt bloat early.
          </p>
          <p>
            A practical operating model includes: prompt templates with known
            token envelopes, retrieval caps by query type, adaptive history
            compression, and hard failsafes before model calls. These controls
            reduce both cost variance and hallucination risk. They also make
            performance more stable under high traffic.
          </p>
          <p>
            Most importantly, teams should run regular &quot;context drills&quot; where
            they simulate oversized documents and verify that the system preserves
            critical facts. Visualizing limits, like in this tool, helps teams
            build intuition faster than abstract docs.
          </p>
        </Topic>

        <section className="flex flex-col gap-5" aria-label="Frequently asked questions">
          <h3 className="text-[18px] font-medium tracking-[-0.01em] text-[var(--color-foreground)]">
            Frequently asked questions
          </h3>
          <dl className="flex flex-col gap-5">
            {CONTEXT_WINDOW_FAQ.map((item) => (
              <div key={item.question} className="flex flex-col gap-1.5">
                <dt className="text-[14.5px] font-medium text-[var(--color-foreground)]">
                  {item.question}
                </dt>
                <dd className="text-[14px] leading-relaxed text-[var(--color-secondary)]">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-[18px] font-medium tracking-[-0.01em] text-[var(--color-foreground)]">
            Key takeaways
          </h3>
          <ul className="list-disc pl-5 text-[14px] leading-relaxed text-[var(--color-secondary)]">
            <li>Context windows are finite and include every prompt component.</li>
            <li>Token limits affect quality, latency, and cost at the same time.</li>
            <li>Truncation can silently remove crucial evidence.</li>
            <li>RAG keeps prompts compact by selecting only relevant chunks.</li>
            <li>Reliable AI systems measure and visualize token budgets continuously.</li>
          </ul>
        </section>
      </div>
    </Section>
  );
}

function Topic({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-[18px] font-medium tracking-[-0.01em] text-[var(--color-foreground)]">
        {title}
      </h3>
      <div className="flex flex-col gap-3 text-[14px] leading-relaxed text-[var(--color-secondary)]">
        {children}
      </div>
    </section>
  );
}
