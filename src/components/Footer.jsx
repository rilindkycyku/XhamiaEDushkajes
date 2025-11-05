// components/Footer.jsx
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-emerald-700 text-white py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm font-medium hover:text-green-300 transition duration-200">
          © {year} – Nga Xhemati i Xhamisë së Dushkajës
        </p>
      </div>
    </footer>
  );
}
