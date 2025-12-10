'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { recipesApi } from '@/src/lib/api';
import { Recipe } from '@/src/types/recipes';

export default function RecipesListPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await recipesApi.getAll();
        console.log('Liste des recettes:', data);
        setRecipes(data.member || []);
      } catch (error) {
        console.error('Error loading recipes:', error);
      } finally {
        setLoading(false);
      }
    }
    loadRecipes();
  }, []);

  if (loading) {
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
        <p>Chargement...</p>
      </div>
    );
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

      {recipes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucune recette disponible</p>
          <Link href="/recipes/new" className="text-blue-500 hover:underline mt-2 inline-block">
            Créer votre première recette
          </Link>
        </div>
      ) : (
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
      )}
    </div>
  );
}