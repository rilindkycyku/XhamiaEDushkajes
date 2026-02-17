// src/pages/Home.jsx
import Hero from "../components/Hero";
import PrayerTimes from "../components/PrayerTimes";
import FacebookEmbed from "../components/FacebookEmbed";
import siteConfig from "../data/site.json";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowRight, HiMapPin, HiOutlineEnvelope, HiPhone, HiHeart } from "react-icons/hi2";

export default function Home() {
  const dataHapjes = new Date(siteConfig.dataEHapjesXhamis);
  const sot = new Date();

  const viteAktive = sot.getFullYear() - dataHapjes.getFullYear();

  const eshteSezonPervjetori =
    sot.getMonth() > 10 || (sot.getMonth() === 10 && sot.getDate() >= 4);

  const viteTeShfaqura = eshteSezonPervjetori ? viteAktive : viteAktive - 1;
  const vitiPervjetor = dataHapjes.getFullYear() + viteTeShfaqura;

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
      <Hero />

      <main className="container -mt-24 md:-mt-32 relative z-20 pb-24">
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
                  <div className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 text-white rounded-[2.5rem] p-10 md:p-14 shadow-2xl transition-all duration-500 hover:scale-[1.01] hover:shadow-emerald-900/20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-[100px] group-hover:bg-emerald-500/20 transition-colors" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/5 rounded-full -ml-20 -mb-20 blur-[80px]" />

                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-emerald-300 text-xs font-bold uppercase tracking-[0.2em] mb-8">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Historia Jonë
                      </div>
                      <h3 className="text-4xl md:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
                        {viteTeShfaqura} {viteTeShfaqura === 1 ? "Vit" : "Vite"} Dritë, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">Dije & Bamirësi</span>
                      </h3>
                      <p className="text-xl text-emerald-100/70 font-medium mb-10 max-w-xl">
                        Duke shërbyer komunitetin me përkushtim që nga {formatoDaten(dataHapjes)}.
                      </p>
                      <div className="inline-flex items-center gap-3 text-white font-bold bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl transition-all group-hover:gap-5">
                        Zbuloni Historinë <HiArrowRight className="text-xl text-emerald-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Welcome Section */}
            <motion.section variants={itemVariants} className="bg-white p-10 md:p-16 rounded-[3rem] shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl -mr-32 -mt-32 transition-standard group-hover:bg-emerald-100/50" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                  <span className="w-2 h-10 bg-emerald-600 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
                  Mirë se Vini
                </h2>
                <div className="prose prose-slate prose-lg max-w-none">
                  <p className="text-xl text-slate-600 leading-relaxed font-medium">
                    {siteConfig.textiMiresevini}
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Social Feed */}
            <motion.section variants={itemVariants} className="bg-white p-10 md:p-16 rounded-[3rem] shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-gold-500 opacity-50" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">Njoftimet e Fundit</h3>
                  <p className="text-slate-500">Qëndroni të informuar me aktivitetet tona.</p>
                </div>
                <a
                  href={siteConfig.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-emerald-700 font-bold bg-emerald-50 px-6 py-3 rounded-2xl hover:bg-emerald-100 transition-colors"
                >
                  Facebook <HiArrowRight />
                </a>
              </div>
              <div className="rounded-[2rem] overflow-hidden border border-slate-100 bg-slate-50/50 p-4">
                <FacebookEmbed />
              </div>
            </motion.section>
          </div>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 space-y-10 md:space-y-12">
            <motion.div variants={itemVariants} className="sticky top-28">
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                <PrayerTimes />
              </div>

              <div className="mt-10 bg-slate-950 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full -mr-20 -mt-20 blur-[60px] group-hover:bg-emerald-500/20 transition-standard" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold-500/5 rounded-full -ml-16 -mb-16 blur-[50px]" />

                <h3 className="text-2xl font-bold mb-8 relative z-10 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                  Kontakti
                </h3>

                <div className="space-y-8 relative z-10">
                  <div className="group/item flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-400 flex-shrink-0 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-standard scale-100 group-hover/item:scale-110">
                      <HiOutlineEnvelope size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1">Email</p>
                      <a href={`mailto:${siteConfig.email}`} className="text-lg text-slate-300 font-medium hover:text-white transition-colors break-all">
                        {siteConfig.email}
                      </a>
                    </div>
                  </div>

                  {siteConfig.telefoni && (
                    <div className="group/item flex items-start gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-400 flex-shrink-0 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-standard scale-100 group-hover/item:scale-110">
                        <HiPhone size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1">Telefoni</p>
                        <p className="text-lg text-slate-300 font-medium">{siteConfig.telefoni}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>


            </motion.div>
          </aside>
        </motion.div>
      </main>
    </div>
  );
}


