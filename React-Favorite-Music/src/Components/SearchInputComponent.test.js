import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchInputComponent from './SearchInputComponent';

describe('SearchInputComponent', () => {
  test('renders correctly with initial elements', () => {
    render(<SearchInputComponent onSearchChange={() => {}} />);
    
    // Check for the "Search" span
    expect(screen.getByText('Search')).toBeInTheDocument();
    
    // Check for the input field (textbox role)
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('updates input value on change', () => {
    render(<SearchInputComponent onSearchChange={() => {}} />);
    const inputElement = screen.getByRole('textbox');
    
    fireEvent.change(inputElement, { target: { value: 'test query' } });
    expect(inputElement.value).toBe('test query');
  });

  test('calls onSearchChange callback with the input value', () => {
    const mockOnSearchChange = jest.fn();
    render(<SearchInputComponent onSearchChange={mockOnSearchChange} />);
    const inputElement = screen.getByRole('textbox');
    
    fireEvent.change(inputElement, { target: { value: 'another query' } });
    
    // Check if the mock function was called
    expect(mockOnSearchChange).toHaveBeenCalledTimes(1);
    
    // Check if the mock function was called with the correct argument
    expect(mockOnSearchChange).toHaveBeenCalledWith('another query');
  });
});
