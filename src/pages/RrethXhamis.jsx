import { useEffect, useState } from "react";

export default function RrethXhamis() {
  const [current, setCurrent] = useState(0);

  // Make sure these paths match exactly your folder and file names in /public/img/xhamia/
  const images = [
    "/img/xhamia/XhamiaJasht.jpg",
    "/img/xhamia/XhamiaMbrenda.jpg",
    "/img/xhamia/XhamiaNatenDritatEReja.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-6">Rreth Xhamisë</h1>

      {/* Fade Gallery */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-lg mx-auto" style={{ height: "400px" }}>
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Xhamia ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-3 w-3 rounded-full ${
                i === current ? "bg-white" : "bg-gray-400"
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-center">Vendndodhja</h2>
        <div className="rounded-2xl overflow-hidden shadow-lg h-[400px]">
          <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d184.6209379380092!2d21.248156395006678!3d42.2372014689467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13547b0051051135%3A0x2d74b93919af6951!2sXhamia%20e%20Dushkaj%C3%ABs%20-%20Ka%C3%A7anik!5e0!3m2!1sen!2s!4v1761779710522!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
