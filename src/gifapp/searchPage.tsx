import React, { useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { UserContext } from './userContext';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import './GifGallery.css';
import './app.css';

const API_KEY = 'd1lgw3dmuT68Vv3MCwp8wpvFOQRkFq07';

function SearchPage({ favorites, setFavorites }) {
    const { user } = useContext(UserContext);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchGifs = useCallback(async () => {
        if (!searchTerm) return [];
        const response = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
            params: {
                api_key: API_KEY,
                q: searchTerm,
                limit: 10
            }
        });
        return response.data.data;
    }, [searchTerm]);

    const { data: searchResults, isLoading, isError } = useQuery({
        queryKey: ['gifs', searchTerm],
        queryFn: fetchGifs,
        enabled: !!searchTerm,
        placeholderData: keepPreviousData
    });

    const toggleFavorite = (gif) => {
        if(favorites.some(fav => fav.id === gif.id)) {
            setFavorites(favorites.filter(fav => fav.id !== gif.id));
        } else {
            setFavorites([...favorites, gif]);
        }
    };

    const isFavorite = (gifId) => favorites.some(fav => fav.id === gifId);

    const handleSearch = (e) => {
        e.preventDefault();
    };

    return (
        <div>
            <h2>Search</h2>
            <form onSubmit={handleSearch}>
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="search for gifs"
                />
                <button type="submit">Search</button>
            </form>
           <div>
           <h3>Search Results</h3>
                {isLoading && <p>Loading...</p>}
                {isError && <p>Error fetching GIFs</p>}
                <div className="gif-gallery">
                    {searchResults && searchResults.map((gif) => (
                        <div key={gif.id} className="gif-item">
                            <img src={gif.images.fixed_height.url} alt={gif.title} className="gif-image" />
                            <button onClick={() => toggleFavorite(gif)} className="favorite-button">
                            {isFavorite(gif.id) ? 'Unfavorite' : 'Favorite'}</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SearchPage;