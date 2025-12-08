import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-800">
          Livre de Recettes
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Découvrez et partagez vos recettes préférées
        </p>
        <Link
          href="/recipes"
          className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-600 transition"
        >
          Voir les recettes
        </Link>
      </div>
    </div>
  );
}