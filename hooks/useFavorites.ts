import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'celestial-capture-favorites';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        try {
            const storedFavorites = localStorage.getItem(FAVORITES_KEY);
            if (storedFavorites) {
                setFavorites(JSON.parse(storedFavorites));
            }
        } catch (error) {
            console.error("Could not load favorites from local storage", error);
        }
    }, []);

    const toggleFavorite = useCallback((photoId: string) => {
        setFavorites(prev => {
            const newFavorites = prev.includes(photoId)
                ? prev.filter(id => id !== photoId)
                : [...prev, photoId];
            
            try {
                localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
            } catch (error) {
                console.error("Could not save favorites to local storage", error);
            }
            return newFavorites;
        });
    }, []);
    
    return { favorites, toggleFavorite };
};
