// src/app/recipes/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchApi } from '@/src/lib/api';
import { RecipeWithIngredients } from '@/src/types/recipes';

export default function RecipeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [recipe, setRecipe] = useState<RecipeWithIngredients | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecipe() {
      try {
        const data = await fetchApi<any>(`/recipes/${id}`);
        console.log('Détail recette:', data);
        
        // Charger les ingrédients si ce n'est pas inclus
        let ingredients = [];
        if (!data.ingredients || data.ingredients.length === 0) {
          try {
            const ingredientsData = await fetchApi<any>(`/recipes/${id}/ingredients`);
            ingredients = ingredientsData || [];
          } catch (ingError) {
            console.error('Erreur chargement ingrédients:', ingError);
          }
        } else {
          ingredients = data.ingredients;
        }
        
        setRecipe({
          ...data,
          ingredients
        });
      } catch (error) {
        console.error('Error loading recipe:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      loadRecipe();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Link href="/recipes" className="text-blue-500 hover:underline mb-4 block">
          ← Retour aux recettes
        </Link>
        <p>Chargement de la recette...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container mx-auto p-4">
        <Link href="/recipes" className="text-blue-500 hover:underline mb-4 block">
          ← Retour aux recettes
        </Link>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Recette non trouvée
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Link href="/recipes" className="text-blue-500 hover:underline mb-4 block">
        ← Retour aux recettes
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {recipe.picture && (
          <img
            src={recipe.picture}
            alt={recipe.title}
            className="w-full h-64 object-cover"
          />
        )}
        
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {recipe.category}
            </span>
            <span className="text-gray-600">
              Pour {recipe.servings} personne{recipe.servings > 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Ingrédients</h2>
              <ul className="space-y-2">
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                  recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="border-b pb-2">
                      <span className="font-medium">{ingredient.label}</span>
                      <span className="text-gray-600 ml-2">
                        - {ingredient.quantity} {ingredient.unit}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">Aucun ingrédient</li>
                )}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Préparation</h2>
              <div className="whitespace-pre-line bg-gray-50 p-4 rounded">
                {recipe.steps || "Aucune étape de préparation"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}