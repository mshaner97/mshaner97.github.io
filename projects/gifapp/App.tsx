import Button from '@mui/material/Button';
import './App.css'
import React, { useContext, useState} from 'react';
import SearchPage from './searchPage'
import LoginForm from './loginPage'
import { UserProvider, UserContext } from './userContext'
import {QueryClient, QueryClientProvider, useQuery,} from "@tanstack/react-query";
import FavoritesPage from './favoritesPage';

  const queryClient= new QueryClient();

  function App() {
    const { user } = useContext(UserContext);
    const [favorites, setFavorites] = useState([]);
    const [currentPage, setCurrentPage] = useState('search');
  
    if (!user) {
      return <LoginForm />;
    }
  
    return (
      <div>
        <nav>
          <Button className="searchpage" onClick={() => setCurrentPage('search')}>Search</Button>
          <Button className="favoritespage" onClick={() => setCurrentPage('favorites')}>Favorites</Button>
        </nav>
  
        {currentPage === 'search' ? (
          <SearchPage favorites={favorites} setFavorites={setFavorites} />
        ) : (
          <FavoritesPage favorites={favorites} setFavorites={setFavorites}/>
        )}
      </div>
    );
  }
  
  function AppWrapper() {
    return (
      <UserProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </UserProvider>
    );
  }
  
  export default AppWrapper;