'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { recipesApi } from '@/src/lib/api';

interface IngredientForm {
  label: string;
  unit: string;
  quantity: number;
}

export default function NewRecipePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [steps, setSteps] = useState('');
  const [picture, setPicture] = useState('');
  const [servings, setServings] = useState(4);
  const [ingredients, setIngredients] = useState<IngredientForm[]>([
    { label: '', unit: '', quantity: 0 }
  ]);
  const [submitting, setSubmitting] = useState(false);

  function addIngredient() {
    setIngredients([...ingredients, { label: '', unit: '', quantity: 0 }]);
  }

  function removeIngredient(index: number) {
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  function updateIngredient(index: number, field: keyof IngredientForm, value: string | number) {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await recipesApi.create({
        title,
        category,
        steps,
        picture,
        servings,
        ingredients: ingredients.filter(ing => ing.label && ing.unit && ing.quantity > 0)
      });

      router.push('/recipes');
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert('Erreur lors de la création de la recette');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Link href="/recipes" className="text-blue-500 hover:underline mb-4 block">
        ← Retour aux recettes
      </Link>

      <h1 className="text-3xl font-bold mb-6">Nouvelle Recette</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Titre *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Catégorie *</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">URL de l'image</label>
          <input
            type="url"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Nombre de portions *</label>
          <input
            type="number"
            min="1"
            value={servings}
            onChange={(e) => setServings(parseInt(e.target.value) || 1)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Étapes de préparation *</label>
          <textarea
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            required
            rows={6}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="font-semibold">Ingrédients</label>
            <button
              type="button"
              onClick={addIngredient}
              className="text-blue-500 hover:underline text-sm"
            >
              + Ajouter un ingrédient
            </button>
          </div>

          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Nom"
                value={ingredient.label}
                onChange={(e) => updateIngredient(index, 'label', e.target.value)}
                className="flex-1 px-3 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Quantité"
                value={ingredient.quantity || ''}
                onChange={(e) => updateIngredient(index, 'quantity', parseFloat(e.target.value) || 0)}
                className="w-24 px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Unité"
                value={ingredient.unit}
                onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                className="w-24 px-3 py-2 border rounded"
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="px-3 py-2 text-red-500 hover:bg-red-50 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {submitting ? 'Création...' : 'Créer la recette'}
          </button>
          <Link
            href="/recipes"
            className="flex-1 text-center border px-4 py-2 rounded hover:bg-gray-50"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}