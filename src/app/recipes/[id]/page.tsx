'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Recipe, PaginatedResponse } from '@/src/types/recipes';
import { fetchApi } from '@/src/lib/api';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    loadRecipes(currentPage);
  }, [currentPage]);

  async function loadRecipes(page: number) {
    setLoading(true);
    try {
      const data = await fetchApi<PaginatedResponse<Recipe>>(
        `/recipes?page=${page}`
      );
      setRecipes(data['hydra:member']);
      setTotalItems(data['hydra:totalItems']);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (loading) {
    return <div className="container mx-auto p-4">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Liste des Recettes</h1>
        <Link
          href="/recipes/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ajouter une recette
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipes/${recipe.id}`}
            className="border rounded-lg p-4 hover:shadow-lg transition"
          >
            {recipe.picture && (
              <img
                src={recipe.picture}
                alt={recipe.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">{recipe.title}</h2>
            <p className="text-gray-600 mb-2">{recipe.category}</p>
            <p className="text-sm text-gray-500">
              Pour {recipe.servings} personne{recipe.servings > 1 ? 's' : ''}
            </p>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="px-4 py-2">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}