// src/pages/PokemonList.tsx
import { useState, useEffect } from 'react';
import { pokemonApi } from '../services/pokemonApi';
import Sidebar from '../components/Sidebar';
import PokemonDetails from '../components/PokemonDetails';
import { useCenterDetection } from '../hooks/useCenterDetection';
import {type PokemonListItem, type PokemonDetails as PokemonDetailsType } from '../types/pokemon';

function PokemonList() {
    const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
    const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetailsType | null>(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const LIMIT = 20;
    const { centerPokemon, listRef } = useCenterDetection(pokemonList);

    useEffect(() => {
        loadPokemon(0, true);
    }, []);

    useEffect(() => {
        if (centerPokemon) {
            console.log(`Cargando detalles de: ${centerPokemon.name}`);
            loadPokemonDetails(centerPokemon);
        }
    }, [centerPokemon]);

    const loadPokemon = async (currentOffset: number, isInitial = false) => {
        if (loading && !isInitial) return;

        setLoading(true);
        if (isInitial) setInitialLoading(true);

        try {
            console.log(`Cargando Pokémon desde offset: ${currentOffset}`);
            const data = await pokemonApi.getPokemonList(LIMIT, currentOffset);

            if (isInitial) {
                setPokemonList(data.results);
                setOffset(LIMIT);
            } else {
                setPokemonList(prev => [...prev, ...data.results]);
                setOffset(currentOffset + LIMIT);
            }

            if (data.results.length < LIMIT || currentOffset + LIMIT >= 1010) {
                setHasMore(false);
            }

            console.log(`Cargados ${data.results.length} Pokémon. Total: ${isInitial ? data.results.length : pokemonList.length + data.results.length}`);

        } catch (error) {
            console.error('Error cargando Pokémon:', error);
        } finally {
            setLoading(false);
            if (isInitial) setInitialLoading(false);
        }
    };

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

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            loadPokemon(offset);
        }
    };

    if (initialLoading) {
        return <div className="loading">Cargando Pokémon...</div>;
    }

    return (
        <div className="app-container">
            <div className="sidebar-wrapper">
                <Sidebar
                    pokemonList={pokemonList}
                    onLoadMore={handleLoadMore}
                    hasMore={hasMore}
                    loading={loading}
                    centerPokemon={centerPokemon}
                    ref={listRef}
                />
            </div>

            <div className="main-content">
                {selectedPokemon ? (
                    <PokemonDetails pokemon={selectedPokemon} />
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