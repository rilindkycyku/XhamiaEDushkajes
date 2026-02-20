import FotoGallery from "../components/FotoGallery";
import VideoGallery from "../components/VideoGallery";
import { motion } from "framer-motion";
import SEO from "../components/SEO";
import { HiOutlineCalendar, HiOutlineMapPin, HiSparkles, HiOutlinePhoto, HiOutlineVideoCamera } from "react-icons/hi2";

export default function RrethXhamis() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container py-8 md:py-16 space-y-16 md:space-y-32 mb-12 mx-auto"
    >
      <SEO
        title="Rreth Xhamisë"
        description="Mësoni më shumë për historinë e Xhamisë së Dushkajës, aktivitetet tona dhe se si jemi bërë një qendër shpirtërore për komunitetin e Kaçanikut."
        url="/rrethxhamis"
      />
      <section className="text-center max-w-4xl mx-auto px-4 md:px-0">
        <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-6 md:mb-8 border border-emerald-100 shadow-sm">
          <HiSparkles className="text-emerald-500 animate-pulse" /> Historia Jonë
        </motion.div>
        <motion.h1 variants={itemVariants} className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-slate-950 mb-6 md:mb-10 leading-[1.05] tracking-tighter">
          Një Vatër Drite në <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-800">Dushkajë</span>
        </motion.h1>
        <motion.p variants={itemVariants} className="text-lg md:text-2xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed px-4">
          Zbuloni rrugëtimin tonë dhe se si një ëndërr u shndërrua në një qendër shpirtërore për komunitetin.
        </motion.p>
      </section>

      <motion.section variants={itemVariants} className="relative group px-2 sm:px-0">
        <div className="absolute inset-0 bg-emerald-600/5 rounded-[2.5rem] md:rounded-[4rem] -rotate-1 hidden md:block" />
        <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] p-6 md:p-20 max-w-6xl mx-auto border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full -mr-40 -mt-40 blur-[100px] opacity-60" />

          <div className="prose prose-slate prose-lg md:prose-xl max-w-none relative z-10">
            <div className="flex items-center gap-3 md:gap-4 text-emerald-800 font-black text-base md:text-xl mb-8 md:mb-12 bg-emerald-50 w-fit px-6 md:px-8 py-3 md:py-4 rounded-2xl md:rounded-3xl border border-emerald-100">
              <HiOutlineCalendar className="text-2xl md:text-3xl text-emerald-600" />
              <span>4 Nëntor 2022</span>
            </div>

            <p className="text-xl md:text-3xl text-slate-950 leading-[1.4] font-bold mb-10 md:mb-14">
              Në lagjen Dushkajë u ngrit një <span className="text-emerald-600">vatër drite</span> që bashkoi zemrat dhe u shndërrua në strehë dashurie.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 mt-12 md:mt-20">
              <div className="space-y-6 md:space-y-8">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-emerald-500 rounded-full" />
                  3 Vite Dritë
                </h3>
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
                  Xhamia jonë është kthyer në një qendër të gjallë adhurimi, edukimi dhe solidariteti, duke shërbyer me krenari komunitetin tonë.
                </p>
              </div>

              <div className="bg-slate-50 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 space-y-6">
                <h3 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Arritjet Tona</h3>
                <ul className="space-y-4">
                  {[
                    "Mbi 300 ligjërata fetare",
                    "Mbi 150 pako ushqimore",
                    "Mbështetje për studentët",
                    "Iftare të përbashkëta",
                    "Shpërblime për nxënësit"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-base md:text-lg text-slate-700 font-bold">
                      <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-16 md:mt-24 pt-10 md:pt-16 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
              <div className="flex -space-x-3 md:-space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-lg">
                    <div className="w-full h-full bg-emerald-700/10" />
                  </div>
                ))}
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-white bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                  +100
                </div>
              </div>
              <div>
                <p className="text-slate-400 italic mb-2 font-medium text-xs md:text-base">Me respekt,</p>
                <h5 className="text-xl md:text-2xl font-black text-slate-950">Nehat ef. Shehu</h5>
                <p className="text-emerald-700 font-black tracking-widest text-[9px] md:text-xs uppercase">Imam i Xhamisë</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* PHOTO & VIDEO SECTION */}
      <div className="space-y-24 md:space-y-32">
        <motion.section variants={itemVariants} className="space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between px-4 gap-4">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                <HiOutlinePhoto /> Galeria e Fotove
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight">Pamje nga Xhamia</h2>
            </div>
            <div className="hidden md:block w-32 h-1 bg-slate-100 rounded-full" />
          </div>
          <div className="w-full">
            <FotoGallery />
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between px-4 gap-4">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                <HiOutlineVideoCamera /> Galeria e Videove
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight">Video</h2>
            </div>
            <div className="hidden md:block w-32 h-1 bg-slate-100 rounded-full" />
          </div>
          <div className="w-full">
            <VideoGallery />
          </div>
        </motion.section>
      </div>

      <motion.section variants={itemVariants} className="space-y-8 md:space-y-12 pb-12 px-4 sm:px-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-emerald-700 font-black text-[10px] uppercase tracking-[0.2em] mb-4 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
              <HiOutlineMapPin /> Google Maps
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-950 mb-4 md:mb-6">Ku ndodhemi?</h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">Na vizitoni në lagjen Dushkajë, Kaçanik. Dyer tona janë gjithmonë të hapura për çdo besimtar.</p>
          </div>
        </div>

        <div className="rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl h-[300px] md:h-[550px] border-[6px] md:border-[12px] border-white relative">
          <iframe
            title="Harta e Xhamisë"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d184.6209379380092!2d21.248156395006678!3d42.2372014689467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13547b0051051135%3A0x2d74b93919af6951!2sXhamia%20e%20Dushkaj%C3%ABs%20-%20Ka%C3%A7anik!5e0!3m2!1sen!2s!4v1761779710522!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="filter contrast-[1.1]"
          />
        </div>
      </motion.section>
    </motion.div>
  );
}
