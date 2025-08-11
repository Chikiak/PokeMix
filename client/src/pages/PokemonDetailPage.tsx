import { typeColors } from '../lib/constants';
import { useParams } from 'react-router-dom';
import { usePokemonDetail } from '../hooks/usePokemonDetail';

function PokemonDetailPage() {
    const { pokemonId } = useParams();

    const numericId = pokemonId ? parseInt(pokemonId, 10) : undefined;

    const { data: pokemon, status, error } = usePokemonDetail(numericId);

    if (pokemonId && isNaN(parseInt(pokemonId, 10)))  {
        return <div>Invalid pokemon ID</div>
    }

    if (status === 'pending') {
        return <div>Loading...</div>
    }

    if (status === 'error') {
        return <div>Error: {error?.message}</div>
    }


    return (
        <div className="pokemon-detail-page">
            <div className="detail-header">
                <h1 className="pokemon-name-detail">{pokemon.name}</h1>
                <span className="pokemon-id-detail">#{pokemon.id.toString().padStart(3, '0')}</span>
            </div>

            <div className="detail-content-wrapper">
                <div className="detail-left-column">
                    <div className="detail-image-container">
                        <img
                            src={pokemon.sprites.other?.['official-artwork']?.front_default ?? ''}
                            alt={`Ilustración de ${pokemon.name}`}
                            className="detail-image"
                        />
                    </div>

                    <div className="detail-types">
                        {pokemon.types.map(({ type }) => (
                            <span key={type.name} className="type-badge-detail" style={{ backgroundColor: typeColors[type.name] || '#68A090' }}>
              {type.name}
            </span>
                        ))}
                    </div>
                </div>

                <div className="detail-right-column">
                    <div className="detail-info-section">
                        <h2>Información Física</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Altura</span>
                                <span className="info-value">{pokemon.height / 10} m</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Peso</span>
                                <span className="info-value">{pokemon.weight / 10} kg</span>
                            </div>
                        </div>
                    </div>

                    <div className="detail-info-section">
                        <h2>Habilidades</h2>
                        <ul className="abilities-list">
                            {pokemon.abilities.map(({ ability, is_hidden }) => (
                                <li key={ability.name} className={is_hidden ? 'hidden-ability' : ''}>
                                    {ability.name.replace('-', ' ')}
                                    {is_hidden && <span> (Oculta)</span>}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="detail-info-section">
                        <h2>Estadísticas Base</h2>
                        <ul className="stats-list">
                            {pokemon.stats.map(({ stat, base_stat }) => (
                                <li key={stat.name} className="stat-item">
                                    <span className="stat-name">{stat.name.replace('-', ' ')}</span>
                                    <div className="stat-bar-container">
                                        <div
                                            className="stat-bar"
                                            style={{ width: `${(base_stat / 255) * 100}%` }}
                                            title={`${base_stat} / 255`}
                                        >
                                        </div>
                                    </div>
                                    <span className="stat-value">{base_stat}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PokemonDetailPage;