import { usePokemonData } from '../hooks/usePokemonData';
import Sidebar from '../components/Sidebar';
import PokemonPreview from '../components/PokemonPreview.tsx';
import LoadingSpinner from "../components/common/LoadingSpinner.tsx";
import ErrorMessage from "../components/common/ErrorMessage.tsx";
import WelcomeMessage from "../components/common/WelcomeMessage.tsx";

function HomePage() {
    const { queryResult, fetchNextPage, selectedPokemon, centerPokemon, listRef, handlePokemonClick } = usePokemonData();

    const pokemonList = queryResult.data?.pages.flatMap(page => page.results) ?? [];

    if (queryResult.status === 'pending') {
        return <LoadingSpinner />;
    }
    if (queryResult.status === 'error') {
        const errorMessage = queryResult.error?.message || 'Ocurrió un error desconocido';
        return <ErrorMessage message={errorMessage} />;
    }

    return (
        <div className="app-container">
            <div className="sidebar-wrapper">
                <Sidebar
                    pokemonList={pokemonList}
                    onLoadMore={fetchNextPage}
                    hasMore={queryResult.hasNextPage}
                    loading={queryResult.isFetchingNextPage}
                    centerPokemon={centerPokemon}
                    onPokemonClick={handlePokemonClick}
                    ref={listRef}
                />
            </div>

            <div className={`main-content ${selectedPokemon ? 'pokemon-selected' : ''}`}>
                {selectedPokemon ? (
                    <PokemonPreview
                        key={selectedPokemon.id}
                        pokemon={selectedPokemon}
                    />
                ) : (
                    <WelcomeMessage />
                )}
            </div>
        </div>
    );
}

export default HomePage;