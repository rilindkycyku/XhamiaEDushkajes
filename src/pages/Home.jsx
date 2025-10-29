import Hero from '../components/Hero'
import PrayerTimes from '../components/PrayerTimes'
import FacebookEmbed from '../components/FacebookEmbed'
import siteConfig from "../data/site.json"

export default function Home(){
  return (
    <div>
      <Hero />
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <section className="card">
            <h2 className="text-2xl font-semibold">Mirë se Vini</h2>
            <p className="mt-2 text-gray-600">{siteConfig.welcomeText}</p>
          </section>

          <section className="mt-6 card">
            <h3 className="text-xl font-semibold">Facebook</h3>
            <p className="mt-2 text-gray-600">Këtu mund të gjeni postimet në Facebook.</p>
            <FacebookEmbed />
          </section>
        </div>

        <aside>
          <PrayerTimes />
          <div className="mt-6 card">
            <h3 className="text-lg font-semibold">Contact</h3>
            <p className="mt-2 text-gray-600">{siteConfig.contactShort}</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
