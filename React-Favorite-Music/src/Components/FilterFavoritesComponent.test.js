import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterFavoritesComponent from './FilterFavoritesComponent';

// Mock ListOfAlbumsComponent
jest.mock('./ListOfAlbumsComponent', () => (props) => (
  <div data-testid="list-of-albums">
    {/* Render only albums that are meant to be shown (show !== false) */}
    {props.albums && props.albums.filter(album => album.show !== false).map(album => (
      <div 
        key={album.collectionId} 
        data-testid={`album-${album.collectionId}`} 
        // Simulate the click behavior that calls onFavoriteChange
        onClick={() => props.onFavoriteChange(album.collectionId.toString(), false)}
      >
        {album.collectionCensoredName}
      </div>
    ))}
  </div>
));

// LocalStorage Mock setup
let store = {};
// No need to store originalLocalStorageProto if using jest.restoreAllMocks() in afterEach

const sampleFavedAlbums = [
  { collectionId: 1, artistName: 'Artist Alpha', collectionCensoredName: 'Alpha Album 1', artworkUrl100: 'url1', trackCount: 10, primaryGenreName: 'Pop', show: true, fav: true },
  { collectionId: 2, artistName: 'Artist Beta', collectionCensoredName: 'Beta Album 1', artworkUrl100: 'url2', trackCount: 12, primaryGenreName: 'Rock', show: true, fav: true },
  { collectionId: 3, artistName: 'Artist Alpha', collectionCensoredName: 'Alpha Album 2', artworkUrl100: 'url3', trackCount: 8, primaryGenreName: 'Pop', show: true, fav: true },
];

describe('FilterFavoritesComponent', () => {
  beforeEach(() => {
    store = {}; // Clear store for each test
    // Spy on prototype methods before each test. These spies will be restored in afterEach.
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => store[key] || null);
    jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation((key, value) => {
      store[key] = value; // Component already stringifies the value
    });
    jest.spyOn(window.localStorage.__proto__, 'clear').mockImplementation(() => {
        store = {};
    });
    jest.spyOn(window.localStorage.__proto__, 'removeItem').mockImplementation((key) => {
        delete store[key];
    });
  });

  afterEach(() => {
    // Restore all mocks after each test to ensure a clean state and prevent test leakage
    jest.restoreAllMocks(); 
  });
  
  // No afterAll needed if afterEach handles restoration comprehensively.

  test('renders SearchInputComponent and ListOfAlbumsComponent', () => {
    render(<FilterFavoritesComponent />);
    expect(screen.getByRole('textbox')).toBeInTheDocument(); // From SearchInputComponent
    expect(screen.getByTestId('list-of-albums')).toBeInTheDocument(); // Mocked ListOfAlbumsComponent
  });

  test('initially displays all favorited albums from localStorage', () => {
    store['favedAlbums'] = JSON.stringify(sampleFavedAlbums);
    render(<FilterFavoritesComponent />);
    
    expect(screen.getByText('Alpha Album 1')).toBeInTheDocument();
    expect(screen.getByText('Beta Album 1')).toBeInTheDocument();
    expect(screen.getByText('Alpha Album 2')).toBeInTheDocument();
  });

  test('filters albums based on search input (Artist Beta)', () => {
    store['favedAlbums'] = JSON.stringify(sampleFavedAlbums);
    render(<FilterFavoritesComponent />);
    
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'Artist Beta' } });
    
    // Based on the component's searchFaves logic, non-matching albums get show: false
    // The mocked ListOfAlbumsComponent filters based on album.show !== false
    expect(screen.queryByText('Alpha Album 1')).not.toBeInTheDocument();
    expect(screen.getByText('Beta Album 1')).toBeInTheDocument();
    expect(screen.queryByText('Alpha Album 2')).not.toBeInTheDocument();
  });

  test('filters albums based on search input (Artist Alpha)', () => {
    store['favedAlbums'] = JSON.stringify(sampleFavedAlbums);
    render(<FilterFavoritesComponent />);
    
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'Artist Alpha' } });
    
    expect(screen.getByText('Alpha Album 1')).toBeInTheDocument();
    expect(screen.queryByText('Beta Album 1')).not.toBeInTheDocument();
    expect(screen.getByText('Alpha Album 2')).toBeInTheDocument();
  });
  
  test('shows all albums again when search input is cleared', () => {
    store['favedAlbums'] = JSON.stringify(sampleFavedAlbums);
    render(<FilterFavoritesComponent />);
    
    const searchInput = screen.getByRole('textbox');
    // First, filter to something specific
    fireEvent.change(searchInput, { target: { value: 'Artist Beta' } });
    expect(screen.queryByText('Alpha Album 1')).not.toBeInTheDocument();
    expect(screen.getByText('Beta Album 1')).toBeInTheDocument();

    // Then, clear the search input
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText('Alpha Album 1')).toBeInTheDocument();
    expect(screen.getByText('Beta Album 1')).toBeInTheDocument();
    expect(screen.getByText('Alpha Album 2')).toBeInTheDocument();
  });

  test('updates list when an album is unfavorited via ListOfAlbumsComponent', () => {
    store['favedAlbums'] = JSON.stringify(sampleFavedAlbums);
    render(<FilterFavoritesComponent />);

    // Initially, all should be there
    expect(screen.getByText('Alpha Album 1')).toBeInTheDocument();
    expect(screen.getByText('Beta Album 1')).toBeInTheDocument();

    // Simulate unfavoriting "Alpha Album 1" (collectionId: 1) by clicking it in the mocked ListOfAlbumsComponent
    const album1ToUnfavorite = screen.getByTestId('album-1');
    fireEvent.click(album1ToUnfavorite);

    // Assert that "Alpha Album 1" is removed from display
    expect(screen.queryByText('Alpha Album 1')).not.toBeInTheDocument();
    // Assert that "Beta Album 1" is still present
    expect(screen.getByText('Beta Album 1')).toBeInTheDocument();
    // Assert that "Alpha Album 2" is also still present
    expect(screen.getByText('Alpha Album 2')).toBeInTheDocument();
  });
});
