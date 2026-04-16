import Hero from "../components/Hero";
import PrayerTimes from "../components/PrayerTimes";
import { lazy, Suspense } from "react";
const FacebookEmbed = lazy(() => import("../components/FacebookEmbed"));
import siteConfig from "../data/site.json";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi2";
import { logEvent } from "../lib/analytics";

export default function Home() {
  const dataHapjes = new Date(siteConfig.home?.dataHapjes);
  const sot = new Date();

  const viteAktive = sot.getFullYear() - dataHapjes.getFullYear();

  const eshteSezonPervjetori =
    sot.getMonth() > 10 || (sot.getMonth() === 10 && sot.getDate() >= 4);

  const viteTeShfaqura = eshteSezonPervjetori ? viteAktive : viteAktive - 1;

  const formatoDaten = (data) => {
    const ditet = data.getDate();
    const viti = data.getFullYear();
    const emratEMuajve = ["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"];
    const muaji = emratEMuajve[data.getMonth()];
    return `${ditet} ${muaji} ${viti}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="overflow-hidden bg-[#f8fafc]">
      <SEO
        title="Ballina"
        description="Faqja zyrtare e Xhamisë së Dushkajës - Kaçanik. Informohuni mbi kohët e namazit, aktivitetet, historinë tonë dhe kontribuoni për xhaminë."
        url="/"
      />

      <Hero />

      <main className="container -mt-24 md:-mt-32 relative z-20 pb-24 mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12"
        >
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-10 md:space-y-12">

            {/* Anniversary Banner */}
            {viteTeShfaqura > 0 && (
              <motion.div variants={itemVariants}>
                <Link to="/rrethxhamis" className="group block">
                  <div className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 text-white rounded-[2.5rem] p-8 md:p-14 shadow-2xl transition-all duration-500 hover:scale-[1.01] hover:shadow-emerald-900/20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-[100px] group-hover:bg-emerald-500/20 transition-colors" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/5 rounded-full -ml-20 -mb-20 blur-[80px]" />

                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-emerald-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 md:mb-8">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Historia Jonë
                      </div>
                      <h2 className="text-3xl md:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
                        {viteTeShfaqura} {viteTeShfaqura === 1 ? "Vit" : "Vite"} Dritë, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">Dije & Bamirësi</span>
                      </h2>
                      <p className="text-lg md:text-xl text-emerald-100/70 font-medium mb-8 md:mb-10 max-w-xl">
                        Duke shërbyer komunitetin me përkushtim që nga {formatoDaten(dataHapjes)}.
                      </p>
                      <div className="inline-flex items-center gap-3 text-white font-bold bg-white/10 hover:bg-white/20 px-6 md:px-8 py-3.5 md:py-4 rounded-2xl transition-all group-hover:gap-5 text-sm md:text-base">
                        Zbuloni Historinë <HiArrowRight className="text-xl text-emerald-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Welcome Section */}
            <motion.section variants={itemVariants} className="bg-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[3rem] shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl -mr-32 -mt-32 transition-standard group-hover:bg-emerald-100/50" />
              <div className="relative z-10">
                <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-6 md:mb-8 flex items-center gap-4">
                  <span className="w-2 h-8 md:h-10 bg-emerald-600 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
                  Mirë se Vini
                </h2>
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
                    {siteConfig.home?.welcomeText}
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Social Feed */}
            <motion.section variants={itemVariants} className="bg-white p-6 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-gold-500 opacity-50" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-10 gap-4">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Njoftimet e Fundit</h3>
                  <p className="text-slate-500">Qëndroni të informuar me aktivitetet tona.</p>
                </div>
                <a
                  href={siteConfig.socials?.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => logEvent('click_social', { event_category: 'engagement', event_label: 'Facebook_Home' })}
                  className="inline-flex items-center justify-center w-full sm:w-auto gap-2 text-emerald-700 font-bold bg-emerald-50 px-6 py-3 rounded-2xl hover:bg-emerald-100 transition-colors"
                >
                  Facebook <HiArrowRight />
                </a>
              </div>
              <div className="rounded-xl md:rounded-[2rem] overflow-hidden border border-slate-100 bg-slate-50/50 p-2 md:p-4">
                <Suspense fallback={<div className="h-96 flex items-center justify-center text-slate-400">Duke u ngarkuar...</div>}>
                  <FacebookEmbed />
                </Suspense>
              </div>
            </motion.section>
          </div>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 space-y-10 md:space-y-12">
            <motion.div variants={itemVariants} className="sticky top-28">
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                <PrayerTimes />
              </div>

            </motion.div>
          </aside>
        </motion.div>
      </main>
    </div>
  );
}
