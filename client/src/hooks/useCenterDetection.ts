import { useState, useEffect, useRef } from 'react';
import { type PokemonListItem } from '../types/pokemon';

export function useCenterDetection(pokemonList: PokemonListItem[]) {
    const [centerPokemon, setCenterPokemon] = useState<PokemonListItem | null>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!listRef.current || pokemonList.length === 0) return;

            const listElement = listRef.current;
            const listRect = listElement.getBoundingClientRect();
            const listCenter = listRect.top + listRect.height / 2;

            const items = listElement.querySelectorAll('.pokemon-item');
            let closestItem: PokemonListItem | null = null;
            let closestDistance = Infinity;

            for (let i = 0; i < Math.min(items.length, pokemonList.length); i++) {
                const item = items[i];
                const pokemon = pokemonList[i];

                if (!item || !pokemon) continue;

                const itemRect = item.getBoundingClientRect();
                const itemCenter = itemRect.top + itemRect.height / 2;
                const distance = Math.abs(itemCenter - listCenter);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestItem = pokemon;
                }
            }

            if (closestItem && (!centerPokemon || closestItem.name !== centerPokemon.name)) {
                console.log(`Centro detectado: ${closestItem.name}`);
                setCenterPokemon(closestItem);
            }
        };

        const listElement = listRef.current;
        if (listElement) {
            listElement.addEventListener('scroll', handleScroll);

            const timer = setTimeout(handleScroll, 100);

            return () => {
                listElement.removeEventListener('scroll', handleScroll);
                clearTimeout(timer);
            };
        }
    }, [pokemonList, centerPokemon]);

    useEffect(() => {
        if (pokemonList.length > 0 && !centerPokemon) {
            const firstPokemon = pokemonList[0];
            if (firstPokemon) {
                setCenterPokemon(firstPokemon);
            }
        }
    }, [pokemonList.length, centerPokemon]);

    return { centerPokemon, listRef };
}