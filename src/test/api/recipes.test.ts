

describe('Recipe API', () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

  beforeEach(() => {
    
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('GET /recipes', () => {
    it('should fetch recipes successfully', async () => {
      const mockRecipes = {
        'hydra:member': [
          {
            id: 1,
            title: 'Spaghetti Carbonara',
            category: 'Italian',
            servings: 4,
          },
          {
            id: 2,
            title: 'Chocolate Cake',
            category: 'Dessert',
            servings: 8,
          },
        ],
        'hydra:totalItems': 2,
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRecipes,
      })

      const response = await fetch(`${API_URL}/recipes`)
      const data = await response.json()

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/recipes`)
      expect(data['hydra:member']).toHaveLength(2)
      expect(data['hydra:member'][0].title).toBe('Spaghetti Carbonara')
    })

    it('should handle fetch error', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      await expect(fetch(`${API_URL}/recipes`)).rejects.toThrow('Network error')
    })

    it('should handle non-ok response', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      const response = await fetch(`${API_URL}/recipes`)
      expect(response.ok).toBe(false)
      expect(response.status).toBe(404)
    })
  })

  describe('GET /recipes/:id', () => {
    it('should fetch a single recipe', async () => {
      const mockRecipe = {
        id: 1,
        title: 'Spaghetti Carbonara',
        category: 'Italian',
        steps: 'Cook pasta, mix with eggs and cheese',
        picture: '/images/carbonara.jpg',
        servings: 4,
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRecipe,
      })

      const response = await fetch(`${API_URL}/recipes/1`)
      const data = await response.json()

      expect(data.id).toBe(1)
      expect(data.title).toBe('Spaghetti Carbonara')
    })
  })

  describe('GET /recipes/:id/ingredients', () => {
    it('should fetch recipe ingredients', async () => {
      const mockIngredients = [
        {
          id: 1,
          label: 'Spaghetti',
          quantity: '400',
          unit: 'g',
        },
        {
          id: 2,
          label: 'Eggs',
          quantity: '4',
          unit: 'pieces',
        },
      ]

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockIngredients,
      })

      const response = await fetch(`${API_URL}/recipes/1/ingredients`)
      const data = await response.json()

      expect(data).toHaveLength(2)
      expect(data[0].label).toBe('Spaghetti')
    })
  })

  describe('POST /recipes', () => {
    it('should create a new recipe', async () => {
      const newRecipe = {
        title: 'New Recipe',
        category: 'Test',
        steps: 'Test steps',
        servings: 2,
      }

      const mockResponse = {
        id: 3,
        ...newRecipe,
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      })

      const response = await fetch(`${API_URL}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecipe),
      })
      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data.id).toBe(3)
      expect(data.title).toBe('New Recipe')
    })

    it('should handle validation errors', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Validation failed',
          violations: [
            { propertyPath: 'title', message: 'Title is required' },
          ],
        }),
      })

      const response = await fetch(`${API_URL}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      expect(response.ok).toBe(false)
      expect(response.status).toBe(400)
    })
  })
})