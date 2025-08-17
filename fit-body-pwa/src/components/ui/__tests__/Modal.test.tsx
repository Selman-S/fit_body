import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from '../Modal'

describe('Modal Component', () => {
  it('renders modal when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>Modal content</div>
      </Modal>
    )
    
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <div>Modal content</div>
      </Modal>
    )
    
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn()
    render(
      <Modal isOpen={true} onClose={handleClose} showCloseButton={true}>
        <div>Modal content</div>
      </Modal>
    )
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', () => {
    const handleClose = jest.fn()
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnBackdropClick={true}>
        <div>Modal content</div>
      </Modal>
    )
    
    const backdrop = screen.getByTestId('modal-backdrop')
    fireEvent.click(backdrop)
    
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when modal content is clicked', () => {
    const handleClose = jest.fn()
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal content</div>
      </Modal>
    )
    
    const content = screen.getByText('Modal content')
    fireEvent.click(content)
    
    expect(handleClose).not.toHaveBeenCalled()
  })

  it('applies different sizes correctly', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={() => {}} size="sm">
        <div>Small Modal</div>
      </Modal>
    )
    
    let modal = screen.getByTestId('modal-content')
    expect(modal).toHaveClass('max-w-sm')

    rerender(
      <Modal isOpen={true} onClose={() => {}} size="lg">
        <div>Large Modal</div>
      </Modal>
    )
    
    modal = screen.getByTestId('modal-content')
    expect(modal).toHaveClass('max-w-lg')
  })

  it('applies different variants correctly', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={() => {}} variant="default">
        <div>Default Modal</div>
      </Modal>
    )
    
    let modal = screen.getByTestId('modal-content')
    expect(modal).toHaveClass('bg-white', 'dark:bg-gray-800')

    rerender(
      <Modal isOpen={true} onClose={() => {}} variant="elevated">
        <div>Elevated Modal</div>
      </Modal>
    )
    
    modal = screen.getByTestId('modal-content')
    expect(modal).toHaveClass('shadow-2xl', 'border-0')
  })

  it('applies custom className', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} className="custom-modal">
        <div>Custom Modal</div>
      </Modal>
    )
    
    const modal = screen.getByTestId('modal-content')
    expect(modal).toHaveClass('custom-modal')
  })

  it('renders with title when provided', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    )
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
  })

  it('renders with description when provided', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} description="Modal description">
        <div>Modal content</div>
      </Modal>
    )
    
    expect(screen.getByText('Modal description')).toBeInTheDocument()
  })

  it('handles keyboard events when closeOnEscape is true', () => {
    const handleClose = jest.fn()
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnEscape={true}>
        <div>Modal content</div>
      </Modal>
    )
    
    // Test ESC key
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('does not handle keyboard events when closeOnEscape is false', () => {
    const handleClose = jest.fn()
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnEscape={false}>
        <div>Modal content</div>
      </Modal>
    )
    
    // Test ESC key
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handleClose).not.toHaveBeenCalled()
  })

  it('combines multiple props correctly', () => {
    render(
      <Modal
        isOpen={true}
        onClose={() => {}}
        size="lg"
        variant="elevated"
        title="Test Modal"
        description="Test Description"
        className="custom"
      >
        <div>Modal content</div>
      </Modal>
    )
    
    const modal = screen.getByTestId('modal-content')
    expect(modal).toHaveClass('max-w-lg', 'shadow-2xl', 'border-0', 'custom')
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('renders full screen modal when fullScreen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} fullScreen={true}>
        <div>Full Screen Modal</div>
      </Modal>
    )
    
    const modal = screen.getByTestId('modal-content')
    expect(modal).toHaveClass('max-w-full')
  })
})
