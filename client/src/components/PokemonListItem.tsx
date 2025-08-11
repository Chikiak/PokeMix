import React, {useCallback, useEffect, useRef, useState} from "react";
import { type PokemonListItem as PokemonListItemType } from '../types/pokemon';

const PokemonListItem = React.forwardRef<
    HTMLDivElement,
    {
        pokemon: PokemonListItemType;
        isCenter: boolean;
        onClick: () => void;
    }
>(({ pokemon, isCenter, onClick }, ref) => {
    const pokemonId = pokemon.url.split('/').filter(Boolean).pop();
    const itemRef = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                rootMargin: '0px',
                threshold: 0.1,
            }
        );

        if (itemRef.current) {
            observer.observe(itemRef.current);
        }

        return () => {
            if (itemRef.current) {
                observer.unobserve(itemRef.current);
            }
        };
    }, []);

    const setRefs = useCallback(
        (node: HTMLDivElement) => {
            itemRef.current = node;
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref) {
                ref.current = node;
            }
        },
        [ref]
    );

    return (
        <div
            ref={setRefs}
            className={`pokemon-item ${isVisible ? 'is-visible' : ''} ${
                isCenter ? 'center-highlight' : ''
            }`}
            onClick={onClick}
            data-pokemon-name={pokemon.name}
        >
            <span className="pokemon-number">
                #{pokemonId?.padStart(3, '0') || '???'}
            </span>
            <span className="pokemon-name">{pokemon.name}</span>
        </div>
    );
});

PokemonListItem.displayName = 'PokemonListItem';

export default PokemonListItem;