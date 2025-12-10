import { Recipe, RecipeWithIngredients } from "../types/recipes";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export const recipesApi = {

  getAll: async (): Promise<{ member: Recipe[] }> => {
    return fetchApi('/recipes');
  },


  getById: async (id: string): Promise<RecipeWithIngredients> => {
    const data = await fetchApi<any>(`/recipes/${id}`);
    
    if (!data.ingredients || data.ingredients.length === 0) {
      try {
        const ingredientsData = await fetchApi<any>(`/recipes/${id}/ingredients`);
        data.ingredients = ingredientsData || [];
      } catch (ingError) {
        console.error('Erreur chargement ingrédients:', ingError);
        data.ingredients = [];
      }
    }
    
    return data as RecipeWithIngredients;
  },


  create: async (recipeData: {
    title: string;
    category: string;
    steps: string;
    picture?: string;
    servings: number;
    ingredients: Array<{
      label: string;
      unit: string;
      quantity: number;
    }>;
  }): Promise<any> => {
    return fetchApi('/recipes', {
      method: 'POST',
      body: JSON.stringify(recipeData),
    });
  },


  update: async (id: string, recipeData: Partial<RecipeWithIngredients>): Promise<any> => {
    return fetchApi(`/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recipeData),
    });
  },


  delete: async (id: string): Promise<any> => {
    return fetchApi(`/recipes/${id}`, {
      method: 'DELETE',
    });
  },


  getIngredients: async (recipeId: string): Promise<any[]> => {
    return fetchApi(`/recipes/${recipeId}/ingredients`);
  }
};