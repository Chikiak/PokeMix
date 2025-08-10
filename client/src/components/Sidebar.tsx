import React, { useState, useEffect, useRef, useCallback } from 'react';
import { type PokemonListItem } from '../types/pokemon';

interface SidebarProps {
    pokemonList: PokemonListItem[];
    onLoadMore: () => void;
    hasMore: boolean;
    loading: boolean;
    centerPokemon: PokemonListItem | null;
    onPokemonClick: (pokemon: PokemonListItem) => void;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>((props, listRef) => {
    const { pokemonList, onLoadMore, hasMore, loading, centerPokemon, onPokemonClick } = props;
    const observer = useRef<IntersectionObserver | null>(null);

    const lastPokemonElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        if (node) {
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore) {
                    console.log('Cargando más Pokémon...');
                    onLoadMore();
                }
            }, {
                threshold: 0.1
            });

            observer.current.observe(node);
        }
    }, [loading, hasMore, onLoadMore]);

    return (
        <div className="sidebar">
            <div className={"center-marker"}></div>
            <h1 className="app-title">PokéMix</h1>
            <div className="pokemon-list" ref={listRef}>

                <div className="scroll-spacer-top" />
                {pokemonList.map((pokemon, index) => {
                    const isLast = pokemonList.length === index + 1;
                    const isCenter = centerPokemon !== null && centerPokemon.name === pokemon.name;

                    return (
                        <PokemonListItem
                            key={`${pokemon.name}-${index}`}
                            pokemon={pokemon}
                            isCenter={isCenter}
                            onClick={() => onPokemonClick(pokemon)}
                            ref={isLast ? lastPokemonElementRef : null}
                        />
                    );
                })}
                <div className="scroll-spacer-bottom" />

                {loading && (
                    <div className="loading-more">
                        <div className="spinner-small"></div>
                        <span>Cargando...</span>
                    </div>
                )}

                {!hasMore && pokemonList.length > 0 && (
                    <div className="end-message">
                        <p>¡Has visto todos los Pokémon!</p>
                    </div>
                )}
            </div>
        </div>
    );
});

const PokemonListItem = React.forwardRef<
    HTMLDivElement,
    {
        pokemon: PokemonListItem;
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

Sidebar.displayName = 'Sidebar';
PokemonListItem.displayName = 'PokemonListItem';

export default Sidebar;