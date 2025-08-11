import { usePokemonData } from '../hooks/usePokemonData';
import Sidebar from '../components/Sidebar';
import PokemonDetails from '../components/PokemonDetails';

function PokemonList() {
    const { queryResult, fetchNextPage, selectedPokemon, centerPokemon, listRef, handlePokemonClick } = usePokemonData();

    const pokemonList = queryResult.data?.pages.flatMap(page => page.results) ?? [];

    if (queryResult.status === 'pending') {
        return <div className={"loading"}>Cargando Pokémon...</div>;
    }
    if (queryResult.status === 'error') {
        if (queryResult.error) {
            return <div className={"loading"}>Error: {queryResult.error.message}</div>;
        }
        return <div className={"loading"}>Ocurrio un error desconocido</div>;
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