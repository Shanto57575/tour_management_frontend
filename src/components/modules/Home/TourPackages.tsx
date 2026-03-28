import { Container } from "@/components/shared/Container";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setV(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, v] as const;
}

function PhotoTile({
  src, alt, label, region, delay = 0, className = "",
}: {
  src: string; alt: string; label: string; region?: string;
  delay?: number; className?: string;
}) {
  const [ref, v] = useInView();
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        opacity: v ? 1 : 0,
        transform: v ? "scale(1)" : "scale(0.97)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-3 left-3">
        <p className="text-white font-semibold text-sm drop-shadow">{label}</p>
        {region && (
          <p className="text-white/55 text-[10px] uppercase tracking-widest mt-0.5">{region}</p>
        )}
      </div>
    </div>
  );
}

function WideCard({ item, index }: {
  item: { src: string; alt: string; label: string; caption: string };
  index: number;
}) {
  const [ref, v] = useInView(0.1);
  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl"
      style={{
        opacity: v ? 1 : 0,
        transform: v ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s`,
      }}
    >
      <div className="h-60">
        <img src={item.src} alt={item.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-white/50 text-[10px] uppercase tracking-[0.18em] mb-1">{item.label}</p>
        <p className="text-white/90 text-sm leading-relaxed">{item.caption}</p>
      </div>
    </div>
  );
}

function QuoteStrip() {
  const [ref, v] = useInView(0.15);
  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl mt-3"
      style={{
        opacity: v ? 1 : 0,
        transform: v ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1673632417072-b1366fda0e22?w=1400&q=80"
          alt="Bandarban"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/52" />
      </div>
      <div className="relative py-14 px-6 sm:px-16 text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-7">
          <div className="h-px w-12 bg-white/25" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <div className="h-px w-12 bg-white/25" />
        </div>
        <p className="text-white text-xl sm:text-2xl font-light italic leading-relaxed tracking-wide mb-5">
          "A land where rivers breathe, forests whisper,<br className="hidden sm:block" /> and every horizon holds a different shade of green."
        </p>
        <p className="text-white/40 text-[10px] uppercase tracking-[0.22em]">Bangladesh · Land of Rivers</p>
        <div className="flex items-center justify-center gap-4 mt-7">
          <div className="h-px w-12 bg-white/25" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <div className="h-px w-12 bg-white/25" />
        </div>
      </div>
    </div>
  );
}

const stats = [
  { value: "700+", label: "Rivers & tributaries" },
  { value: "64", label: "Diverse districts" },
  { value: "1 UNESCO", label: "World Heritage Site" },
  { value: "120 km", label: "Longest sea beach" },
];

function StatBar() {
  const [ref, v] = useInView(0.15);
  return (
    <div
      ref={ref}
      className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-purple-100 dark:bg-purple-900/30 rounded-2xl overflow-hidden"
      style={{ opacity: v ? 1 : 0, transition: "opacity 0.6s ease 0.1s" }}
    >
      {stats.map((s, i) => (
        <div key={i} className="bg-white dark:bg-zinc-900/80 px-5 py-5 text-center">
          <p className="text-xl font-bold bg-gradient-to-r from-purple-500 to-violet-600 bg-clip-text text-transparent mb-1">
            {s.value}
          </p>
          <p className="text-xs text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

function Header() {
  const [ref, v] = useInView(0.2);
  return (
    <div
      ref={ref}
      className="mb-8"
      style={{
        opacity: v ? 1 : 0,
        transform: v ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-purple-500 dark:text-purple-400 mb-3">
        — Visual Journal
      </p>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <h2 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight leading-[1.1]">
          The Beauty of<br />
          <span className="bg-gradient-to-r from-purple-500 to-violet-500 bg-clip-text text-transparent">
            Bangladesh
          </span>
        </h2>
        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed sm:text-right">
          From hill-tribe valleys to ancient mosques, tidal forests to endless beaches — this is what awaits.
        </p>
      </div>
      <div className="mt-5 h-px bg-gradient-to-r from-purple-400/40 via-purple-200/20 to-transparent" />
    </div>
  );
}

export default function TourPackages() {
  return (
    <Container className="relative py-20 overflow-hidden bg-background">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.08),transparent_45%)]" />
      {/* ── Grid background (full section width) ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.045) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative">
        <Header />

        {/* ── Desktop masonry: fixed pixel heights so no gaps ── */}
        <div className="hidden lg:grid grid-cols-3 gap-3" style={{ height: "560px" }}>
          {/* Col 1: two equal halves */}
          <div className="flex flex-col gap-3">
            <PhotoTile
              src="https://images.unsplash.com/photo-1576419326170-74f6f9451993?w=700&q=85"
              alt="Kaptai Lake" label="Kaptai Lake" region="Rangamati"
              delay={0} className="flex-1"
            />
            <PhotoTile
              src="https://images.unsplash.com/photo-1643001607577-0a0332e79aab?w=700&q=85"
              alt="Jaflong" label="Jaflong" region="Sylhet"
              delay={0.1} className="flex-1"
            />
          </div>

          {/* Col 2: full height hero */}
          <PhotoTile
            src="https://images.unsplash.com/photo-1706459671567-43529d418cd1?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3VuZGFyYmFufGVufDB8fDB8fHww?w=600&q=80"
            alt="Sundarbans" label="Sundarbans" region="Khulna"
            delay={0.05} className="h-full"
          />

          {/* Col 3: short top + taller bottom */}
          <div className="flex flex-col gap-3">
            <PhotoTile
              src="https://images.unsplash.com/photo-1673632417072-b1366fda0e22?w=700&q=85"
              alt="Bandarban Hills" label="Bandarban Hills" region="Chittagong"
              delay={0.15} className="h-52"
            />
            <PhotoTile
              src="https://images.unsplash.com/photo-1658383895221-173f07c6a9d0?w=700&q=85"
              alt="Sajek Valley" label="Sajek Valley" region="Rangamati"
              delay={0.2} className="flex-1"
            />
          </div>
        </div>

        {/* ── Mobile grid ── */}
        <div className="grid lg:hidden grid-cols-2 gap-3">
          <PhotoTile
            src="https://indiantigersafaris.com/wp-content/uploads/2024/09/sun-banner-3.webp"
            alt="Sundarbans" label="Sundarbans" region="Khulna"
            delay={0} className="col-span-2 h-56"
          />
          <PhotoTile src="https://images.unsplash.com/photo-1576419326170-74f6f9451993?w=700&q=85" alt="Kaptai Lake" label="Kaptai Lake" region="Rangamati" delay={0.05} className="h-40" />
          <PhotoTile src="https://images.unsplash.com/photo-1658383895221-173f07c6a9d0?w=700&q=85" alt="Sajek Valley" label="Sajek Valley" region="Rangamati" delay={0.1} className="h-40" />
          <PhotoTile src="https://images.unsplash.com/photo-1673632417072-b1366fda0e22?w=700&q=85" alt="Bandarban" label="Bandarban Hills" region="Chittagong" delay={0.15} className="h-40" />
          <PhotoTile src="https://images.unsplash.com/photo-1643001607577-0a0332e79aab?w=700&q=85" alt="Jaflong" label="Jaflong" region="Sylhet" delay={0.2} className="h-40" />
        </div>

        {/* ── Wide landscape row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 lg:mt-12">
          {[
            { src: "https://images.unsplash.com/photo-1587222318667-31212ce2828d?w=900&q=85", alt: "Cox's Bazar", label: "Cox's Bazar", caption: "The world's longest natural sea beach — 120 km of unbroken horizon." },
            { src: "https://images.unsplash.com/photo-1724257288409-dd6e1de5c20d?w=900&q=85", alt: "Sreemangal", label: "Sreemangal", caption: "Endless emerald tea estates rolling through the hills of Sylhet." },
            { src: "https://www.travelmate.com.bd/wp-content/uploads/2020/08/kuakata-patuakhai.jpg.webp", alt: "Kuakata", label: "Kuakata", caption: "The only beach where you watch the sun both rise and set from the shore." },
          ].map((item, i) => <WideCard key={item.label} item={item} index={i} />)}
        </div>

        {/* ── Stats ── */}
        <div className="mt-3 mb-3">
          <StatBar />
        </div>

        {/* ── Quote ── */}
        <QuoteStrip />
      </div>
    </Container>
  );
}