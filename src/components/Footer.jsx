// components/Footer.jsx
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-green-700 to-green-900 text-white py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm font-bold hover:text-green-300 transition duration-200">
          © {year} – Nga Xhemati i Xhamisë së Dushkajës
        </p>
      </div>
    </footer>
  );
}
