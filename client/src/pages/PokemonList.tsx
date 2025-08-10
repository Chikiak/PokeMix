import {useState, useEffect, useCallback} from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { pokemonApi } from '../services/pokemonApi';
import Sidebar from '../components/Sidebar';
import PokemonDetails from '../components/PokemonDetails';
import { useCenterDetection } from '../hooks/useCenterDetection';
import { useDebounce } from '../hooks/useDebounce';
import {type PokemonListItem, type PokemonDetails as PokemonDetailsType } from '../types/pokemon';

function PokemonList() {
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['pokemonList'],
        queryFn: pokemonApi.getPokemonList,
        getNextPageParam: (lastPage) => lastPage.nextPageParam,
        initialPageParam: 0,
    });

    const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetailsType | null>(null);

    const pokemonList = data?.pages.flatMap(page => page.results) ?? [];

    const { centerPokemon, listRef } = useCenterDetection(pokemonList);
    const debouncedCenterPokemon = useDebounce(centerPokemon, 500);

    useEffect(() => {
        if (debouncedCenterPokemon) {
            console.log(`Cargando detalles (debounced) de: ${debouncedCenterPokemon.name}`);
            loadPokemonDetails(debouncedCenterPokemon);
        }
    }, [debouncedCenterPokemon]);

    const loadPokemonDetails = async (pokemon: PokemonListItem) => {
        try {
            const pokemonId = pokemon.url.split('/').filter(Boolean).pop();
            if (!pokemonId) return;

            const details = await pokemonApi.getPokemonDetail(pokemonId);
            setSelectedPokemon(details);
        } catch (error) {
            console.error('Error cargando detalles del Pokémon:', error);
        }
    };

    const handlePokemonClick = useCallback((pokemon: PokemonListItem) => {
        const listElement = listRef.current;
        if (!listElement) return;

        const pokemonElement = listElement.querySelector(`[data-pokemon-name="${pokemon.name}"]`) as HTMLElement;
        const markerElement = listElement.parentElement?.querySelector('.center-marker') as HTMLElement;

        if (!pokemonElement || !markerElement) return;

        const listRect = listElement.getBoundingClientRect();
        const markerRect = markerElement.getBoundingClientRect();
        const pokemonRect = pokemonElement.getBoundingClientRect();

        const markerCenterY = markerRect.top + (markerRect.height / 2) - listRect.top;
        const pokemonCenterY = pokemonRect.top + (pokemonRect.height / 2) - listRect.top;

        const currentScrollTop = listElement.scrollTop;
        const scrollTop = currentScrollTop + pokemonCenterY - markerCenterY;

        listElement.scroll({
            top: scrollTop,
            behavior: 'smooth',
        });
    }, [listRef]);


    if (status === 'pending') {
        return <div className={"loading"}>Cargando Pokémon...</div>;
    }
    if (status === 'error') {
        return <div className={"loading"}>Error: {error.message}</div>;
    }

    return (
        <div className="app-container">
            <div className="sidebar-wrapper">
                <Sidebar
                    pokemonList={pokemonList}
                    onLoadMore={fetchNextPage}
                    hasMore={hasNextPage}
                    loading={isFetchingNextPage}
                    centerPokemon={centerPokemon}
                    onPokemonClick={handlePokemonClick}
                    ref={listRef}
                />
            </div>

            <div className={`main-content ${selectedPokemon ? 'pokemon-selected' : ''}`}>
                {selectedPokemon ? (
                    <PokemonDetails
                        key={selectedPokemon.id}
                        pokemon={selectedPokemon}
                    />
                ) : (
                    <div className="welcome-message">
                        <h2>Explorando...</h2>
                        <p>Haz scroll en la lista para ver los detalles de cada Pokémon</p>
                        {centerPokemon && (
                            <p style={{ marginTop: '1rem', opacity: 0.8 }}>
                                Pokémon en el centro: <strong>{centerPokemon.name}</strong>
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PokemonList;