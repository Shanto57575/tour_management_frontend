import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCheck } from "lucide-react";
import { Container } from "@/components/shared/Container";

const topics = ["General Inquiry", "Sales & Pricing", "Technical Support", "Partnership", "Other"];

export default function Contact() {
    const [_form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
    const [focused, setFocused] = useState<string | null>(null);
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        setSending(true);
        setTimeout(() => { setSending(false); setSent(true); }, 1400);
    }

    const labelClass = (field: string) =>
        `block text-xs font-semibold uppercase tracking-widest mb-2 transition-colors duration-200 ` +
        (focused === field ? "text-violet-600 dark:text-violet-400" : "text-zinc-400 dark:text-zinc-500");

    const inputClass = (field: string) =>
        `w-full rounded-lg px-4 py-3 text-sm bg-zinc-100 dark:bg-zinc-900 ` +
        `text-zinc-900 dark:text-white outline-none border transition-all duration-200 ` +
        `placeholder:text-zinc-400 dark:placeholder:text-zinc-600 ` +
        (focused === field
            ? "border-violet-600 ring-2 ring-violet-600/10"
            : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700");

    return (
        <Container className="bg-white dark:bg-zinc-950 min-h-screen" innerClassName="flex flex-col items-center justify-center pt-24 pb-12">

            {/* Header */}
            <div className="text-center mb-12 max-w-lg">
                <span className="inline-block text-[10px] uppercase tracking-[0.2em] font-bold
          text-violet-600 dark:text-violet-400 mb-4">
                    Contact Us
                </span>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight
          text-zinc-900 dark:text-white mb-4">
                    Say hello.
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Have a question or want to see TrekOn in action?<br />
                    Drop us a message — we reply within 2 hours.
                </p>
            </div>

            {/* Card */}
            <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 dark:border-zinc-800
        bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/60 dark:shadow-black/40 p-8 md:p-10">

                {!sent ? (
                    <form onSubmit={submit} className="space-y-5">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Name */}
                            <div>
                                <label className={labelClass("name")}>Name</label>
                                <input
                                    className={inputClass("name")}
                                    placeholder="Your full name"
                                    required
                                    onFocus={() => setFocused("name")}
                                    onBlur={() => setFocused(null)}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className={labelClass("email")}>Email</label>
                                <input
                                    type="email"
                                    className={inputClass("email")}
                                    placeholder="you@company.com"
                                    required
                                    onFocus={() => setFocused("email")}
                                    onBlur={() => setFocused(null)}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* Topic */}
                        <div>
                            <label className={labelClass("topic")}>Topic</label>
                            <div className="relative">
                                <select
                                    className={`${inputClass("topic")} appearance-none cursor-pointer pr-10`}
                                    required
                                    defaultValue=""
                                    onFocus={() => setFocused("topic")}
                                    onBlur={() => setFocused(null)}
                                    onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                                >
                                    <option value="" disabled className="bg-white dark:bg-zinc-900">
                                        Select a topic…
                                    </option>
                                    {topics.map(t => (
                                        <option key={t} value={t} className="bg-white dark:bg-zinc-900">{t}</option>
                                    ))}
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none
                  w-4 h-4 text-zinc-400"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label className={labelClass("message")}>Message</label>
                            <textarea
                                rows={5}
                                className={`${inputClass("message")} resize-none`}
                                placeholder="Tell us how we can help…"
                                required
                                onFocus={() => setFocused("message")}
                                onBlur={() => setFocused(null)}
                                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                            />
                        </div>

                        {/* Footer row */}
                        <div className="flex items-center justify-between pt-1">
                            <p className="text-xs text-zinc-400 dark:text-zinc-600">
                                We never share your details.
                            </p>
                            <button
                                type="submit"
                                disabled={sending}
                                className="group inline-flex items-center gap-2
                  px-6 py-2.5 rounded-lg text-sm font-bold text-white
                  bg-violet-600 hover:bg-violet-700
                  transition-all duration-200
                  hover:shadow-lg hover:shadow-violet-500/30
                  disabled:opacity-60 disabled:cursor-not-allowed">
                                {sending ? (
                                    <><Send size={14} className="animate-spin" />Sending…</>
                                ) : (
                                    <>
                                        Send Message
                                        <Send size={13}
                                            className="transition-transform duration-200 group-hover:translate-x-0.5" />
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                ) : (
                    <div className="flex flex-col items-center text-center py-10">
                        <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-950
              flex items-center justify-center mb-5">
                            <CheckCheck size={26} className="text-violet-600" />
                        </div>
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">
                            Message sent!
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-7">
                            We'll get back to you within 2 hours.
                        </p>
                        <button
                            onClick={() => setSent(false)}
                            className="text-sm font-semibold text-violet-600 dark:text-violet-400
                hover:text-violet-700 dark:hover:text-violet-300
                underline underline-offset-4 transition-colors duration-200">
                            Send another message
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom contact strip */}
            <div className="flex flex-wrap justify-center gap-8 mt-10">
                {[
                    { icon: Mail, text: "hello@trekon.app" },
                    { icon: Phone, text: "+1 (800) 835–2940" },
                    { icon: MapPin, text: "32 Trailhead Ave, Denver" },
                ].map(({ icon: Icon, text }, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <Icon size={13} className="text-violet-500" />
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{text}</span>
                    </div>
                ))}
            </div>

        </Container>
    );
}