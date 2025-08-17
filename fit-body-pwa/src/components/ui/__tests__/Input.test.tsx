import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '../Input'

describe('Input Component', () => {
  it('renders input with correct label', () => {
    render(<Input label="Email" name="email" id="email" />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('renders input without label', () => {
    render(<Input name="email" placeholder="Enter email" />)
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
  })

  it('handles value changes', () => {
    const handleChange = jest.fn()
    render(<Input name="email" onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('applies different sizes correctly', () => {
    const { rerender } = render(<Input name="email" size="sm" />)
    let input = screen.getByRole('textbox')
    expect(input).toHaveClass('h-8', 'px-3', 'text-sm')

    rerender(<Input name="email" size="lg" />)
    input = screen.getByRole('textbox')
    expect(input).toHaveClass('h-12', 'px-4', 'text-lg')
  })

  it('shows error state when error prop is provided', () => {
    render(<Input name="email" error="Invalid email" />)
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500')
  })

  it('shows success state when success prop is provided', () => {
    render(<Input name="email" success="Valid email" />)
    expect(screen.getByText('Valid email')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveClass('border-green-500')
  })

  it('applies custom className', () => {
    render(<Input name="email" className="custom-input" />)
    expect(screen.getByRole('textbox')).toHaveClass('custom-input')
  })

  it('renders with left icon when leftIcon prop is provided', () => {
    const TestIcon = () => <span data-testid="icon">📧</span>
    render(<Input name="email" leftIcon={<TestIcon />} />)
    
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('renders with right icon when rightIcon prop is provided', () => {
    const TestIcon = () => <span data-testid="icon">📧</span>
    render(<Input name="email" rightIcon={<TestIcon />} />)
    
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('handles disabled state', () => {
    render(<Input name="email" disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('handles required attribute', () => {
    render(<Input name="email" required />)
    expect(screen.getByRole('textbox')).toBeRequired()
  })

  it('handles different input types', () => {
    const { rerender } = render(<Input name="password" type="password" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'password')

    rerender(<Input name="email" type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
  })

  it('shows helper text when provided', () => {
    render(<Input name="email" helperText="We'll never share your email" />)
    expect(screen.getByText("We'll never share your email")).toBeInTheDocument()
  })

  it('combines multiple props correctly', () => {
    render(
      <Input
        name="email"
        label="Email"
        size="lg"
        error="Invalid email"
        className="custom"
        required
      />
    )
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom', 'px-4', 'text-lg')
    expect(input).toBeRequired()
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
  })

  it('shows required indicator when required prop is true', () => {
    render(<Input name="email" label="Email" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('applies full width when fullWidth prop is true', () => {
    render(<Input name="email" fullWidth />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('w-full')
  })
})
