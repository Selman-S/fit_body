import React from 'react'
import { render, screen } from '@testing-library/react'
import { Card } from '../Card'

describe('Card Component', () => {
  it('renders card with children content', () => {
    render(
      <Card>
        <h2>Card Title</h2>
        <p>Card content goes here</p>
      </Card>
    )
    
    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card content goes here')).toBeInTheDocument()
  })

  it('applies default variant styles', () => {
    render(<Card>Content</Card>)
    const card = screen.getByText('Content').closest('div')
    expect(card).toHaveClass('bg-white', 'dark:bg-gray-800', 'border', 'border-gray-200', 'dark:border-gray-700')
  })

  it('applies different variants correctly', () => {
    const { rerender } = render(<Card variant="workout">Workout Card</Card>)
    let card = screen.getByText('Workout Card').closest('div')
    expect(card).toHaveClass('border-l-4', 'border-l-blue-500', 'relative', 'overflow-hidden')

    rerender(<Card variant="stats">Stats Card</Card>)
    card = screen.getByText('Stats Card').closest('div')
    expect(card).toHaveClass('text-center')

    rerender(<Card variant="elevated">Elevated Card</Card>)
    card = screen.getByText('Elevated Card').closest('div')
    expect(card).toHaveClass('shadow-lg', 'hover:shadow-xl')
  })

  it('applies different sizes correctly', () => {
    const { rerender } = render(<Card size="sm">Small Card</Card>)
    let card = screen.getByText('Small Card').closest('div')
    expect(card).toHaveClass('p-3')

    rerender(<Card size="lg">Large Card</Card>)
    card = screen.getByText('Large Card').closest('div')
    expect(card).toHaveClass('p-6')

    rerender(<Card size="xl">Extra Large Card</Card>)
    card = screen.getByText('Extra Large Card').closest('div')
    expect(card).toHaveClass('p-8')
  })

  it('applies custom className', () => {
    render(<Card className="custom-card">Custom Card</Card>)
    const card = screen.getByText('Custom Card').closest('div')
    expect(card).toHaveClass('custom-card')
  })

  it('applies hover effects when hover prop is true', () => {
    render(<Card hover>Hover Card</Card>)
    const card = screen.getByText('Hover Card').closest('div')
    expect(card).toHaveClass('hover:shadow-md', 'hover:-translate-y-1')
  })

  it('applies clickable styles when clickable prop is true', () => {
    render(<Card clickable>Clickable Card</Card>)
    const card = screen.getByText('Clickable Card').closest('div')
    expect(card).toHaveClass('cursor-pointer')
  })

  it('combines multiple props correctly', () => {
    render(
      <Card variant="workout" size="lg" hover clickable className="custom">
        Combined Props Card
      </Card>
    )
    
    const card = screen.getByText('Combined Props Card').closest('div')
    expect(card).toHaveClass(
      'border-l-4',
      'border-l-blue-500',
      'p-6',
      'hover:shadow-md',
      'hover:-translate-y-1',
      'cursor-pointer',
      'custom'
    )
  })

  it('renders with proper semantic structure', () => {
    render(
      <Card>
        <header>Header</header>
        <main>Main content</main>
        <footer>Footer</footer>
      </Card>
    )
    
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Main content')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('handles onClick when clickable', () => {
    const handleClick = jest.fn()
    render(
      <Card clickable onClick={handleClick}>
        Clickable Card
      </Card>
    )
    
    const card = screen.getByText('Clickable Card').closest('div')
    expect(card).toHaveClass('cursor-pointer')
  })
})
