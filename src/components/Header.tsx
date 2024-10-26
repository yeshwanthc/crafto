import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="mb-4 sm:mb-0">
          <Link href="/" className="text-2xl font-bold tracking-tight hover:text-gray-300 transition duration-300">
            Crafto
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link 
                href="/quote" 
                className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Quotes
              </Link>
            </li>
            <li>
              <Link 
                href="/create-quote" 
                className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Create Quote
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}