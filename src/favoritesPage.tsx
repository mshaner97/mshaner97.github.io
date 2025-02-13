import React from 'react';

function FavoritesPage({ favorites, setFavorites }) {
    const toggleFavorite = (gif) => {
        if(favorites.some(fav => fav.id === gif.id)) {
            setFavorites(favorites.filter(fav => fav.id !== gif.id));
        } else {
            setFavorites([...favorites, gif]);
        }
    };

    const isFavorite = (gifId) => favorites.some(fav => fav.id === gifId);
return (
    <div>
        <h3>Favorites</h3>
        <div className="gif-gallery">
            {favorites.map((gif) => (
                <div key={gif.id} className="gif-item">
                    <img src={gif.images.fixed_height.url} alt={gif.title} className="gif-image" />
                    <button 
                        onClick={() => toggleFavorite(gif)} 
                        className={`favorite-button ${isFavorite(gif.id) ? 'favorited' : ''}`}>
                        {isFavorite(gif.id) ? 'Unfavorite' : 'Favorite'}
                    </button>
                </div>
            ))}
        </div>
    </div>
);
}
  export default FavoritesPage;