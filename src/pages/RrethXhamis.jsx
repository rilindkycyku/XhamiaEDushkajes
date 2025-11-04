// pages/RrethXhamis.jsx
import { useEffect, useState } from "react";
import FotoGallery from "../components/FotoGallery";

export default function RrethXhamis() {
  const [aktual, setAktual] = useState(0);

  const fotot = [
    "/img/xhamia/XhamiaJasht.jpg",
    "/img/xhamia/XhamiaMbrenda.jpg",
    "/img/xhamia/XhamiaNatenDritatEReja.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAktual((para) => (para + 1) % fotot.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [fotot.length]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <h1 className="text-3xl font-semibold text-center mb-6 text-teal-700">
        Rreth Xhamisë
      </h1>

      <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none text-justify">
          <p className="lead text-xl font-medium text-gray-800">
            <strong>4 nëntor 2022 – një ëndërr u bë realitet.</strong>
          </p>
          <p>
            Në lagjen Dushkajë u ngrit një vatër drite që bashkoi zemrat, hapi
            dyert për dijen dhe u shndërrua në strehë bamirësie e dashurie ndaj
            fesë.
          </p>

          <h2 className="text-2xl font-bold mt-6 text-green-700">
            4 nëntor 2022 – 4 nëntor 2025: 3 vite dritë, dije dhe bamirësi
          </h2>

          <p>
            <strong>4 nëntor 2025</strong>, xhamia jonë feston{" "}
            <strong>3 vjetorin e hapjes</strong> – tre vite plot përkushtim,
            frymë dhe dashuri për fenë dhe komunitetin.
          </p>
          <p>
            Falë ndihmës së Allahut dhe mbështetjes së xhematit, xhamia është
            kthyer në një qendër të gjallë adhurimi, edukimi dhe solidariteti.
          </p>

          <h3 className="text-xl font-semibold mt-6 text-teal-700">
            Aktivitetet tona gjatë periudhës 2022–2025:
          </h3>
          <ul className="list-disc pl-6 space-y-2 mt-3 text-gray-700">
            <li>
              <strong>Mbi 300 ligjërata</strong> të mbajtura për ndriçimin e
              mendjeve dhe zemrave të besimtarëve.
            </li>
            <li>
              <strong>Mbi 150 pako ushqimore</strong> shpërndarë për familjet në
              nevojë.
            </li>
            <li>
              <strong>Paisje shtëpiake</strong> dhuruar familjeve me gjendje të
              vështirë.
            </li>
            <li>
              <strong>Fëmijët</strong> që prezantojnë në xhami shpërblehen
              rregullisht me dhurata për t’i motivuar në dashurinë ndaj dijes
              dhe fesë.
            </li>
            <li>
              <strong>Nxënësit dhe studentët</strong> mbështeten financiarisht
              dhe me pajisje elektronike për rrugëtimin e tyre arsimor.
            </li>
            <li>
              <strong>Mbi 50 iftare</strong> të organizuara për xhematin dhe
              komunitetin.
            </li>
            <li>
              <strong>Veshje dhe dhurata</strong> shpërndarë për nxënësit e
              Dushkajës – shenjë kujdesi për brezin e ri.
            </li>
          </ul>

          <p className="mt-6 text-gray-700">
            Sot xhamia jonë njihet për{" "}
            <strong>
              aktivitetet e shumta, rregullin, pastërtinë dhe organizimin
              shembullor
            </strong>
            , duke u bërë një model i gjallë i xhamisë së vërtetë.
          </p>

          <p className="mt-6 text-gray-700">
            <strong>Falënderime të sinqerta</strong> për të gjithë donatorët që
            dhanë me zemër dhe u angazhuan gjatë këtyre 3 viteve, si dhe{" "}
            <strong>xhematin e Xhamisë së Dushkajës</strong> për dashurinë,
            kujdesin dhe mbështetjen e pandalshme.
          </p>

          <p className="text-right italic mt-8 border-t pt-4 border-gray-200 text-gray-600">
            <em>Me respekt,</em>
            <br />
            <strong>Imami i Xhamisë së Dushkajës,</strong>
            <br />
            <strong>Nehat ef. Shehu</strong>
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center text-teal-700">
          Foto
        </h2>
        <FotoGallery />
      </section>

      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center text-teal-700">
          Vendndodhja
        </h2>
        <div className="rounded-2xl overflow-hidden shadow-lg h-[400px] bg-gray-50">
          <iframe
            title="Harta e Xhamisë"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d184.6209379380092!2d21.248156395006678!3d42.2372014689467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13547b0051051135%3A0x2d74b93919af6951!2sXhamia%20e%20Dushkaj%C3%ABs%20-%20Ka%C3%A7anik!5e0!3m2!1sen!2s!4v1761779710522!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          />
        </div>
      </section>
    </div>
  );
}