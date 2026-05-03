type Props = {
  title: string;
  intro: string;
  body: string;
  lastUpdated: string;
  contactNote: string;
};

export function LegalArticle({ title, intro, body, lastUpdated, contactNote }: Props) {
  const paragraphs = body.split(/\n\n+/);
  return (
    <>
      <section className="bg-bg border-b border-line">
        <div className="max-w-[960px] mx-auto px-6 lg:px-12 py-20 lg:py-24">
          <p className="text-[11px] tracking-wide3 uppercase text-red">ZHUOHENG · Legal</p>
          <h1 className="mt-5 font-cnSerif text-[clamp(2rem,3.4vw,3rem)] text-ink leading-tight">{title}</h1>
          <p className="mt-4 text-[12px] text-ink-mute">{lastUpdated}</p>
        </div>
      </section>

      <article className="bg-bg py-16 lg:py-24">
        <div className="max-w-[760px] mx-auto px-6 lg:px-12">
          <p className="text-ink leading-loose text-[15px]">{intro}</p>

          <div className="mt-10 space-y-6">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-ink leading-loose text-[14px] whitespace-pre-line">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-line">
            <p className="text-[12px] text-ink-mute">{contactNote}</p>
          </div>
        </div>
      </article>
    </>
  );
}
