
export default function Footer(){
  const year = new Date().getFullYear()
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <p>Nga Xhemati i Xhamisë së Dushkajës - Kaçanik. © {year} </p>
      </div>
    </footer>
  )
}
