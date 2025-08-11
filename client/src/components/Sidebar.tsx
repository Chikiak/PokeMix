import React, { useRef, useCallback } from 'react';
import { type PokemonListItem as PokemonListItemType } from '../types/pokemon';
import PokemonListItem from './PokemonListItem';

interface SidebarProps {
    pokemonList: PokemonListItemType[];
    onLoadMore: () => void;
    hasMore: boolean;
    loading: boolean;
    centerPokemon: PokemonListItemType | null;
    onPokemonClick: (pokemon: PokemonListItemType) => void;
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


Sidebar.displayName = 'Sidebar';

export default Sidebar;