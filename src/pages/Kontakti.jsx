import { useState } from "react";
import { HiOutlineEnvelopeOpen, HiOutlineUser, HiOutlineEnvelope, HiOutlineChatBubbleLeftRight, HiSparkles } from "react-icons/hi2";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import SEO from "../components/SEO";

const eshteEmailValide = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Kontakti() {
  const [formulari, setFormulari] = useState({ emri: "", email: "", mesazhi: "" });
  const [statusi, setStatusi] = useState(null);

  const ndryshoFushen = (e) => {
    setFormulari({ ...formulari, [e.target.name]: e.target.value });
  };

  const dergoFormularin = async (e) => {
    e.preventDefault();
    setStatusi("sending");
    toast.dismiss();

    if (!formulari.emri || !formulari.email || !formulari.mesazhi) {
      toast.error("Të gjitha fushat janë të detyrueshme.");
      setStatusi("error");
      return;
    }
    if (!eshteEmailValide(formulari.email)) {
      toast.error("Ju lutem shkruani një email të vlefshëm.");
      setStatusi("error");
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      toast.error("Konfigurimi i EmailJS mungon.");
      setStatusi("error");
      return;
    }

    try {
      await emailjs.send(serviceId, templateId, {
        from_name: formulari.emri,
        from_email: formulari.email,
        message: formulari.mesazhi,
      }, publicKey);
      toast.success("Mesazhi u dërgua me sukses!");
      setFormulari({ emri: "", email: "", mesazhi: "" });
      setStatusi("success");
    } catch (err) {
      toast.error("Dështoi dërgimi. Provoni përsëri.");
      setStatusi("error");
    }
  };

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 relative overflow-hidden bg-[#f8fafc]">
      <SEO
        title="Kontakti"
        description="Na kontaktoni për pyetje, sugjerime apo informata shtesë rreth Xhamisë së Dushkajës. Jemi këtu për t'ju shërbyer."
        url="/kontakti"
      />
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="container relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          <div className="lg:col-span-4 text-slate-900 pt-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-6 md:mb-8 border border-emerald-100 shadow-sm"
                >
                  <HiSparkles className="text-emerald-500 animate-pulse" /> Flisni me ne
                </motion.div>
                <h1 className="text-4xl md:text-7xl font-black mb-6 md:mb-8 leading-[1.1] tracking-tighter">
                  Na <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800">kontaktoni</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
                  Keni pyetje apo sugjerime? Jemi këtu për ju. Na shkruani dhe do t'ju kthejmë përgjigje sa më shpejt të jetë e mundur.
                </p>
              </div>

              <div className="space-y-6">
                <div className="group flex items-center gap-6 bg-white p-6 rounded-3xl shadow-xl shadow-slate-300/20 border border-slate-100 hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-inner">
                    <HiOutlineEnvelope size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Na shkruani</p>
                    <p className="font-black text-slate-700 break-all">xhamiaedushkajes@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-emerald-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-125 transition-standard" />
                <p className="relative z-10 text-emerald-200 font-bold mb-4 uppercase tracking-widest text-xs">Përgjigje e shpejtë</p>
                <p className="relative z-10 text-lg font-medium leading-relaxed mb-6 italic">"Secili donacion i juaji është një dritë më shumë për ne."</p>
                <div className="relative z-10 w-12 h-1 bg-emerald-500 rounded-full" />
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)] border border-slate-100 relative group"
            >
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-emerald-500 via-emerald-400 to-gold-500 opacity-60 rounded-t-full" />

              <form onSubmit={dergoFormularin} className="space-y-8 md:space-y-10 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-2">
                      <HiOutlineUser className="text-emerald-500" /> Emri juaj
                    </label>
                    <input
                      name="emri"
                      value={formulari.emri}
                      onChange={ndryshoFushen}
                      className="w-full px-6 md:px-8 py-4 md:py-5 bg-slate-50 border border-slate-200 rounded-2xl md:rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all duration-300 font-bold text-slate-800 placeholder:text-slate-300 shadow-inner group-hover:border-slate-300 text-sm md:text-base"
                      placeholder="Shkruani emrin..."
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-2">
                      <HiOutlineEnvelope className="text-emerald-500" /> Email adresa
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formulari.email}
                      onChange={ndryshoFushen}
                      className="w-full px-6 md:px-8 py-4 md:py-5 bg-slate-50 border border-slate-200 rounded-2xl md:rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all duration-300 font-bold text-slate-800 placeholder:text-slate-300 shadow-inner group-hover:border-slate-300 text-sm md:text-base"
                      placeholder="email@shembull.com"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-2">
                    <HiOutlineChatBubbleLeftRight className="text-emerald-500" /> Mesazhi i juaj
                  </label>
                  <textarea
                    name="mesazhi"
                    value={formulari.mesazhi}
                    onChange={ndryshoFushen}
                    rows={6}
                    className="w-full px-6 md:px-8 py-4 md:py-6 bg-slate-50 border border-slate-200 rounded-[1.5rem] md:rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all duration-300 font-bold text-slate-800 placeholder:text-slate-300 resize-none shadow-inner group-hover:border-slate-300 text-sm md:text-base"
                    placeholder="Si mund t'ju ndihmojmë?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={statusi === "sending"}
                  className="w-full group/btn relative overflow-hidden flex items-center justify-center gap-4 px-8 md:px-10 py-5 md:py-6 bg-emerald-700 text-white font-black text-base md:text-lg rounded-2xl md:rounded-[2.5rem] shadow-2xl shadow-emerald-700/20 hover:bg-emerald-800 transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-600 to-emerald-800 translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />

                  {statusi === "sending" ? (
                    <div className="relative z-10 w-7 h-7 border-[4px] border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <div className="relative z-10 flex items-center gap-4">
                      <span>Dërgo Mesazhin</span>
                      <HiOutlineEnvelopeOpen size={26} className="group-hover/btn:rotate-12 transition-transform" />
                    </div>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}


