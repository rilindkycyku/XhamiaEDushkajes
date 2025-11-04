// components/Kontakti.jsx
import { useState } from "react";
import { TbMailForward } from "react-icons/tb";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";

const eshteEmailValide = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Kontakti() {
  const [formulari, setFormulari] = useState({ emri: "", email: "", mesazhi: "" });
  const [statusi, setStatusi] = useState(null); // null | 'sending' | 'success' | 'error'

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
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formulari.emri,
          from_email: formulari.email,
          message: formulari.mesazhi,
        },
        publicKey
      );

      toast.success("Mesazhi u dërgua me sukses! Faleminderit!");
      setFormulari({ emri: "", email: "", mesazhi: "" });
      setStatusi("success");
    } catch (err) {
      console.error(err);
      toast.error("Dështoi dërgimi. Ju lutem provoni përsëri.");
      setStatusi("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Na Kontaktoni</h1>
          <p className="text-slate-400 text-lg">Xhamia e Dushkajës – Kaçanik</p>
        </div>

        <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">
          <form onSubmit={dergoFormularin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Emri juaj
              </label>
              <input
                name="emri"
                type="text"
                value={formulari.emri}
                onChange={ndryshoFushen}
                required
                className="w-full px-4 py-3 bg-white/10 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Shkruani emrin tuaj..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Email adresa
              </label>
              <input
                name="email"
                type="email"
                value={formulari.email}
                onChange={ndryshoFushen}
                required
                className="w-full px-4 py-3 bg-white/10 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="email@juaj.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Mesazhi
              </label>
              <textarea
                name="mesazhi"
                value={formulari.mesazhi}
                onChange={ndryshoFushen}
                rows={5}
                required
                className="w-full px-4 py-3 bg-white/10 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                placeholder="Shkruani mesazhin tuaj këtu..."
              />
            </div>

            <button
              type="submit"
              disabled={statusi === "sending"}
              className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/25 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {statusi === "sending" ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Po dërgohet...</span>
                </>
              ) : (
                <>
                  <span>Dërgo Mesazhin</span>
                  <TbMailForward
                    size={22}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </>
              )}
            </button>

            {statusi === "success" && (
              <p className="text-center text-emerald-400 font-medium animate-fade-in">
                Mesazhi u dërgua me sukses! Faleminderit!
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}