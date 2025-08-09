// client/src/hooks/useCenterDetection.ts

import { useState, useEffect, useRef } from 'react';
import { type PokemonListItem } from '../types/pokemon';

export function useCenterDetection(pokemonList: PokemonListItem[]) {
    const [centerPokemon, setCenterPokemon] = useState<PokemonListItem | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const listElement = listRef.current;
        if (!listElement) return;

        const marker = listElement.parentElement?.querySelector('.center-marker');
        if (!marker) return;

       const handleScroll = () => {
            const markerRect = marker.getBoundingClientRect();
            const markerY = markerRect.top + markerRect.height / 2;

            let closestPokemon: PokemonListItem | null = null;
            let smallestDistance = Infinity;

            Array.from(listElement.children).forEach((item) => {
                if (item.classList.contains('pokemon-item')) {
                    const itemRect = item.getBoundingClientRect();
                    const itemCenterY = itemRect.top + itemRect.height / 2;
                    const distance = Math.abs(itemCenterY - markerY);

                    if (distance < smallestDistance) {
                        smallestDistance = distance;
                        const pokemonName = (item.querySelector('.pokemon-name') as HTMLElement)?.innerText.toLowerCase();
                        if (pokemonName) {
                            closestPokemon = pokemonList.find(p => p.name.toLowerCase() === pokemonName) || null;
                        }
                    }
                }
            });

            setCenterPokemon(closestPokemon);
        };

        handleScroll();

        listElement.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            listElement.removeEventListener('scroll', handleScroll);
        };

    }, [pokemonList]);

    return { centerPokemon, listRef };
}