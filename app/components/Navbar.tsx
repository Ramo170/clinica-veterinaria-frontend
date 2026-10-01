import Link from "next/link"

export default function Navbar() {
    return (
        <nav className="bg-gray-900 border-b border-gray-800 p-4 mb-">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <span className="text-xl font-bold text-blue-500">PetClinic</span>
                <div className="flex gap-6 font-medium text-gray-300">
                    <Link href="/" className="hover:text-blue-400 transition-colors">Clínicas</Link>
                    <Link href="/" className="hover:text-blue-400 transition-colors">Tutores</Link>
                    <Link href="/" className="hover:text-blue-400 transition-colors">Pacientes</Link>
                    <Link href="/" className="hover:text-blue-400 transition-colors">Veterinarios</Link>
                </div>
            </div>
        </nav>
    )
}