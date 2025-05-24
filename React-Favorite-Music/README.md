# React Favorite Music App

## Description

A simple React application that retrieves data from the iTunes API and allows users to search for music albums and mark their favorite albums. Favorited albums are saved in the browser's localStorage. This application provides a seamless experience for music enthusiasts to discover new albums and keep track of their preferred ones.

## Features

*   Search for music albums by artist name using the iTunes API.
*   View album details including artwork, name, artist, track count, and genre.
*   Mark albums as favorites.
*   View a list of all favorited albums.
*   Filter favorited albums by artist name.
*   Favorite selections persist across browser sessions using localStorage.

## Setup and Running Instructions

### Prerequisites

*   Node.js and npm (or yarn) installed.

### Steps

1.  Clone the repository: `git clone <repository_url>`
2.  Navigate to the project directory: `cd React-Favorite-Music`
3.  Install dependencies: `npm install` (or `yarn install`)
4.  Start the development server: `npm start` (or `yarn start`)
5.  Open your browser and go to `http://localhost:3000` (or the port specified by the start command).

## Project Structure

*   `public/`: Static assets and `index.html`.
*   `src/`: React application source code.
    *   `App.jsx`: Main application component, handles routing.
    *   `Nav.jsx`: Navigation bar component.
    *   `Components/`: UI components.
        *   `SearchArtistsComponent.jsx`: Handles album search functionality.
        *   `FilterFavoritesComponent.jsx`: Handles display and filtering of favorite albums.
        *   `ListOfAlbumsComponent.jsx`: Displays lists of albums and manages favoriting actions.
        *   `SearchInputComponent.jsx`: Reusable search input field.
    *   `index.js`: Entry point for the React application.
    *   `App.css`, `index.css`, `albumsStyles.css`: CSS styles.

## API Used

*   iTunes Search API.

## Future Improvements

*   Implement more robust error handling and user feedback.
*   Add pagination for search results.
*   Allow searching by album title or song.
*   Add unit and integration tests.
