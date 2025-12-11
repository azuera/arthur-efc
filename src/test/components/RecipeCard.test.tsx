import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'


describe('RecipeCard Component', () => {
  const mockRecipe = {
    id: 1,
    title: 'Spaghetti Carbonara',
    category: 'Italian',
    picture: '/images/carbonara.jpg',
    servings: 4,
  }

  it('should render recipe title', () => {
    
    const { container } = render(<div>{mockRecipe.title}</div>)
    expect(container).toHaveTextContent('Spaghetti Carbonara')
  })

  it('should display recipe category', () => {
    const { container } = render(<div>{mockRecipe.category}</div>)
    expect(container).toHaveTextContent('Italian')
  })

  it('should show servings information', () => {
    const { container } = render(<div>{mockRecipe.servings} servings</div>)
    expect(container).toHaveTextContent('4 servings')
  })
})

