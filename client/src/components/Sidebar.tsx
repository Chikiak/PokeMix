import React, { useRef, useCallback } from 'react';
import { type PokemonListItem } from '../types/pokemon';

interface SidebarProps {
    pokemonList: PokemonListItem[];
    onLoadMore: () => void;
    hasMore: boolean;
    loading: boolean;
    centerPokemon: PokemonListItem | null;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>((props, listRef) => {
    const { pokemonList, onLoadMore, hasMore, loading, centerPokemon } = props;
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
            <h1 className="app-title">PokéMix</h1>
            <div className="pokemon-list" ref={listRef}>
                {pokemonList.map((pokemon, index) => {
                    const isLast = pokemonList.length === index + 1;
                    // ✅ Arreglamos el error aquí: verificamos que centerPokemon no sea null
                    const isCenter = centerPokemon !== null && centerPokemon.name === pokemon.name;

                    return (
                        <PokemonListItem
                            key={`${pokemon.name}-${index}`}
                            pokemon={pokemon}
                            isCenter={isCenter} // Ahora siempre es boolean
                            ref={isLast ? lastPokemonElementRef : null}
                        />
                    );
                })}

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

const PokemonListItem = React.forwardRef<HTMLDivElement, {
    pokemon: PokemonListItem;
    isCenter: boolean;
}>(({ pokemon, isCenter }, ref) => {
    const pokemonId = pokemon.url.split('/').filter(Boolean).pop();

    return (
        <div
            ref={ref}
            className={`pokemon-item ${isCenter ? 'center-highlight' : ''}`}
        >
            <span className="pokemon-number">#{pokemonId?.padStart(3, '0') || '???'}</span>
            <span className="pokemon-name">{pokemon.name}</span>
        </div>
    );
});

Sidebar.displayName = 'Sidebar';
PokemonListItem.displayName = 'PokemonListItem';

export default Sidebar;