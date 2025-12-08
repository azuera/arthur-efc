export interface Ingredient {
  id: number;
  label: string;
  unit: string;
  quantity: number;
}

export interface Recipe {
  id: number;
  title: string;
  category: string;
  steps: string;
  picture: string;
  servings: number;
}

export interface RecipeWithIngredients extends Recipe {
  ingredients: Ingredient[];
}

export interface PaginatedResponse<T> {
  'hydra:member': T[];
  'hydra:totalItems': number;
  'hydra:view'?: {
    'hydra:first'?: string;
    'hydra:last'?: string;
    'hydra:next'?: string;
    'hydra:previous'?: string;
  };
}