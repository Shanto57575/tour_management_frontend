import { useState, useEffect } from "react";
import { ArrowUpRight, Play, MapPin, Star, Users } from "lucide-react";

const destinations = ["Machu Picchu", "Santorini", "Kyoto", "Patagonia", "Serengeti"];

export default function HeroSection() {
  const [destIndex, setDestIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setDestIndex(i => (i + 1) % destinations.length);
        setVisible(true);
      }, 300);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col">
      {/* MAIN GRID */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 px-8 pt-12 pb-16 max-w-screen-xl mx-auto w-full">
        <div className="lg:col-span-7 flex flex-col justify-center pr-0 lg:pr-16">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px w-12 bg-stone-300" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400">
              Tour Management · Vol. 01
            </span>
          </div>
          <h1 className="font-black text-stone-900 dark:text-stone-100 leading-[0.95] tracking-tight mb-8"
            style={{ fontSize: "clamp(3.2rem, 6.5vw, 6rem)" }}>
            Manage<br />
            tours.{" "}
            <span className="italic font-light text-violet-600">Not</span><br />
            spreadsheets.
          </h1>

          <div className="flex gap-5 mb-10">
            <div className="w-0.5 bg-violet-300 flex-shrink-0 rounded-full" />
            <p className="text-stone-500 text-base leading-relaxed max-w-sm">
              One platform for bookings, guides, payments, and live updates —
              so operators can focus on the journey ahead.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-14">
            <button className="group inline-flex items-center gap-2 bg-stone-900 hover:bg-violet-600 text-white text-sm font-bold px-8 py-4 rounded-full transition-colors duration-300">
              Get started free
              <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button className="group inline-flex px-3 py-2 items-center gap-3 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 text-sm font-semibold transition-colors duration-200">
              <span className="w-10 h-10 rounded-full border border-stone-200 group-hover:border-stone-400 flex items-center justify-center transition-colors duration-200">
                <Play size={10} fill="currentColor" className="ml-0.5" />
              </span>
              Watch demo
            </button>
          </div>

          <div className="border-t border-stone-200 pt-7 flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  ["bg-violet-500", "A"],
                  ["bg-indigo-500", "R"],
                  ["bg-fuchsia-400", "S"],
                  ["bg-violet-300", "K"],
                ].map(([c, l], i) => (
                  <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-stone-50 flex items-center justify-center text-[9px] font-black text-white`}>
                    {l}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-stone-400">
                  <span className="text-stone-700 dark:text-stone-500 font-bold">2,400+</span> operators
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users size={13} className="text-violet-500" />
              <p className="text-xs text-stone-400">
                <span className="text-stone-700 dark:text-stone-500 font-bold">50,000+</span> travelers managed
              </p>
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-violet-500" />
              <p className="text-xs text-stone-400">
                Live in{" "}
                <span className={`text-violet-600 dark:text-violet-400 font-bold transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>
                  {destinations[destIndex]}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT — asymmetric visual column */}
        <div className="lg:col-span-5 relative flex items-center justify-end mt-12 lg:mt-0">
          <div className="relative w-full max-w-xs lg:max-w-none">

            {/* main image card */}
            <div className="relative rounded-2xl overflow-hidden bg-stone-200 aspect-[3/4] w-64 ml-auto shadow-2xl shadow-purple-200 dark:shadow-md dark:shadow-purple-200">
              <img
                src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80"
                alt="Patagonia landscape"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60 mb-1">Featured Route</p>
                <p className="text-white text-sm font-bold">Patagonia Trek</p>
              </div>
            </div>
            <div className="absolute -left-4 top-8 bg-white rounded-xl shadow-2xl shadow-purple-200 dark:shadow-md dark:shadow-purple-200 p-4 w-40">
              <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-1">Active Tours</p>
              <p className="text-2xl font-black text-stone-900 leading-none">1,284</p>
              <div className="flex items-center gap-1 mt-2">
                <div className="flex-1 h-1 rounded-full bg-stone-100 overflow-hidden">
                  <div className="w-3/4 h-full bg-violet-500 rounded-full" />
                </div>
                <span className="text-[9px] text-violet-500 font-bold">↑ 12%</span>
              </div>
            </div>

            {/* small second image */}
            <div className="absolute -left-8 -bottom-6 w-36 h-36 rounded-xl overflow-hidden shadow-2xl shadow-purple-200 dark:shadow-md dark:shadow-purple-200 border-4 border-stone-50">
              <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&q=80"
                alt="Mountain tour"
                className="w-full h-full object-cover"
              />
            </div>

            {/* editorial rotated label */}
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-black uppercase tracking-[0.3em] text-stone-300 select-none">
              2025 — Season
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}