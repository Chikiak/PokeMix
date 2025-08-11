import {useInfiniteQuery} from "@tanstack/react-query";
import {pokemonApi} from "../services/pokemonApi.ts";
import {useCallback, useEffect, useState} from "react";
import type {PokemonDetails, PokemonListItem} from "../types/pokemon.ts";
import {useCenterDetection} from "./useCenterDetection.ts";
import {useDebounce} from "./useDebounce.ts";

export function usePokemonData() {
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

    const pokemonList = data?.pages.flatMap(page => page.results) ?? [];

    const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null);

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
            const pokemonIdString = pokemon.url.split('/').filter(Boolean).pop();
            if (!pokemonIdString) return;

            const numericId = parseInt(pokemonIdString, 10);
            if (isNaN(numericId)) return;

            const details = await pokemonApi.getPokemonDetail(numericId);
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

    return {
        queryResult: {
            status,
            error,
            data,
            hasNextPage,
            isFetchingNextPage,
        },
        fetchNextPage,
        selectedPokemon,
        centerPokemon,
        listRef,
        handlePokemonClick
    };
}