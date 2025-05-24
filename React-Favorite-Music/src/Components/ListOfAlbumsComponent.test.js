import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListOfAlbumsComponent from './ListOfAlbumsComponent';

// LocalStorage Mock using jest.spyOn
let store = {};
const getItemSpy = jest.spyOn(window.localStorage.__proto__, 'getItem');
const setItemSpy = jest.spyOn(window.localStorage.__proto__, 'setItem');
const clearSpy = jest.spyOn(window.localStorage.__proto__, 'clear');
const removeItemSpy = jest.spyOn(window.localStorage.__proto__, 'removeItem');

const sampleAlbums = [
  { collectionId: 1, artworkUrl100: 'url1.jpg', collectionCensoredName: 'Album One', artistName: 'Artist A', trackCount: 10, primaryGenreName: 'Pop', show: true, fav: false },
  { collectionId: 2, artworkUrl100: 'url2.jpg', collectionCensoredName: 'Album Two', artistName: 'Artist B', trackCount: 12, primaryGenreName: 'Rock', show: true, fav: false },
  { collectionId: 3, artworkUrl100: 'url3.jpg', collectionCensoredName: 'Album Three (Hidden)', artistName: 'Artist C', trackCount: 8, primaryGenreName: 'Jazz', show: false, fav: false },
];

const mockOnFavoriteChange = jest.fn();

describe('ListOfAlbumsComponent', () => {
  beforeEach(() => {
    store = {}; // Clear store for each test
    getItemSpy.mockImplementation((key) => store[key] || null);
    setItemSpy.mockImplementation((key, value) => { store[key] = value; }); // Value from component is already JSON.stringified
    clearSpy.mockImplementation(() => { store = {}; });
    removeItemSpy.mockImplementation((key) => { delete store[key]; });
    mockOnFavoriteChange.mockClear();
  });

  afterAll(() => {
    // Restore original localStorage methods
    getItemSpy.mockRestore();
    setItemSpy.mockRestore();
    clearSpy.mockRestore();
    removeItemSpy.mockRestore();
  });

  test('renders a list of albums from props (only those with show: true)', () => {
    render(<ListOfAlbumsComponent albums={sampleAlbums} onFavoriteChange={mockOnFavoriteChange} />);
    expect(screen.getByText(/Album One By Artist A/i)).toBeInTheDocument();
    expect(screen.getByText(/Album Two By Artist B/i)).toBeInTheDocument();
    expect(screen.queryByText(/Album Three \(Hidden\)/i)).not.toBeInTheDocument();
  });

  test('renders album details correctly', () => {
    render(<ListOfAlbumsComponent albums={[sampleAlbums[0]]} onFavoriteChange={mockOnFavoriteChange} />);
    const albumElement = screen.getByText(/Album One By Artist A/i);
    expect(albumElement).toBeInTheDocument();
    // Check for other details if needed, e.g., track count, genre, which are part of the text content
    expect(screen.getByText(/Total Tracks: 10/i)).toBeInTheDocument();
    expect(screen.getByText(/Genre: Pop/i)).toBeInTheDocument();
    
    const listItem = albumElement.closest('li');
    expect(listItem).toHaveStyle("background-image: url(url1.jpg)");
  });

  test('clicking an unfavorited album favorites it, updates localStorage, and calls onFavoriteChange', () => {
    render(<ListOfAlbumsComponent albums={[sampleAlbums[0]]} onFavoriteChange={mockOnFavoriteChange} />);
    const album1ListItem = screen.getByText(/Album One By Artist A/i).closest('li');
    
    expect(album1ListItem).not.toHaveClass('fav'); // Initially not favorited

    fireEvent.click(album1ListItem);

    // Check localStorage
    const expectedFavedAlbum = [{ ...sampleAlbums[0], fav: true }];
    expect(setItemSpy).toHaveBeenCalledWith('favedAlbums', JSON.stringify(expectedFavedAlbum));
    
    // Check onFavoriteChange callback
    expect(mockOnFavoriteChange).toHaveBeenCalledWith(sampleAlbums[0].collectionId.toString(), true);
    
    // Check for visual change (class)
    expect(album1ListItem).toHaveClass('fav');
  });

  test('clicking a favorited album unfavorites it, updates localStorage, and calls onFavoriteChange', () => {
    // Initial state: album 1 is favorited in localStorage and props
    const initialFavedAlbums = [{ ...sampleAlbums[0], fav: true }];
    store['favedAlbums'] = JSON.stringify(initialFavedAlbums);
    
    const albumsWithFav = sampleAlbums.map(a => a.collectionId === 1 ? {...a, fav: true} : a);

    render(<ListOfAlbumsComponent albums={albumsWithFav} onFavoriteChange={mockOnFavoriteChange} />);
    const album1ListItem = screen.getByText(/Album One By Artist A/i).closest('li');
    
    expect(album1ListItem).toHaveClass('fav'); // Pre-check: should be favorited

    fireEvent.click(album1ListItem);
    
    // Check localStorage (should be empty now)
    expect(setItemSpy).toHaveBeenCalledWith('favedAlbums', JSON.stringify([]));
    
    // Check onFavoriteChange callback
    expect(mockOnFavoriteChange).toHaveBeenCalledWith(sampleAlbums[0].collectionId.toString(), false);
    
    // Check for visual change (class)
    expect(album1ListItem).not.toHaveClass('fav');
  });

  test('initial favorite status is rendered correctly from localStorage if album in props', () => {
    // Album 1 is in localStorage as faved
    const initialFavedAlbums = [{ ...sampleAlbums[0], fav: true }];
    store['favedAlbums'] = JSON.stringify(initialFavedAlbums);

    // Pass all sample albums, album 1 should pick up its fav status
    render(<ListOfAlbumsComponent albums={sampleAlbums} onFavoriteChange={mockOnFavoriteChange} />);
    
    const album1ListItem = screen.getByText(/Album One By Artist A/i).closest('li');
    const album2ListItem = screen.getByText(/Album Two By Artist B/i).closest('li');

    expect(album1ListItem).toHaveClass('fav');
    expect(album2ListItem).not.toHaveClass('fav');
  });
  
  test('renders favorited albums from localStorage if albums prop is not provided', () => {
    // Album 2 is in localStorage as faved
    const favedAlbumInStorage = { ...sampleAlbums[1], fav: true, show: true }; // Ensure show is true
    store['favedAlbums'] = JSON.stringify([favedAlbumInStorage]);
  
    render(<ListOfAlbumsComponent albums={null} onFavoriteChange={mockOnFavoriteChange} />);
    
    // The component should load favedAlbums from its state (derived from localStorage)
    expect(screen.getByText(/Album Two By Artist B/i)).toBeInTheDocument();
    const album2ListItem = screen.getByText(/Album Two By Artist B/i).closest('li');
    expect(album2ListItem).toHaveClass('fav');

    // Album 1 should not be there
    expect(screen.queryByText(/Album One By Artist A/i)).not.toBeInTheDocument();
  });

  test('does not render albums with show: false', () => {
    render(<ListOfAlbumsComponent albums={sampleAlbums} onFavoriteChange={mockOnFavoriteChange} />);
    expect(screen.queryByText(/Album Three \(Hidden\)/i)).not.toBeInTheDocument();
  });
});
