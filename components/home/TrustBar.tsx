import { getTranslations } from "next-intl/server";

// Slim 5-icon trust strip — CTF-style: light grey background, plain icons.

const ICONS = {
  daily:  TruckIcon,
  cert:   ShieldIcon,
  moq:    BoxIcon,
  oem:    WrenchIcon,
  global: GlobeIcon,
};

export async function TrustBar() {
  const t = await getTranslations("trustBar");
  const ITEMS = [
    { title: t("dailyOutput"),  sub: t("dailyOutputSub"),  icon: ICONS.daily },
    { title: t("certified"),    sub: t("certifiedSub"),    icon: ICONS.cert },
    { title: t("lowMoq"),       sub: t("lowMoqSub"),       icon: ICONS.moq },
    { title: t("brandOem"),     sub: t("brandOemSub"),     icon: ICONS.oem },
    { title: t("globalExport"), sub: t("globalExportSub"), icon: ICONS.global },
  ];

  return (
    <section className="bg-paper border-y border-line">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 grid grid-cols-2 md:grid-cols-5 gap-y-6 gap-x-2">
        {ITEMS.map(({ title, sub, icon: Icon }) => (
          <div key={title} className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 inline-flex items-center justify-center text-ink"><Icon /></div>
            <p className="text-[12px] font-medium text-ink">{title}</p>
            <p className="text-[10px] text-ink-mute tracking-wide2">{sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TruckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M3 7h11v8H3z" /><path d="M14 10h4l3 3v2h-7" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M12 3l8 3v6c0 4-3 7-8 9-5-2-8-5-8-9V6l8-3Z" /><path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function BoxIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M3 7l9-4 9 4v10l-9 4-9-4Z" /><path d="M3 7l9 4 9-4M12 11v10" />
    </svg>
  );
}
function WrenchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M14 6a4 4 0 0 0 6 6l-9 9-3-3 9-9-3-3Z" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" />
    </svg>
  );
}
