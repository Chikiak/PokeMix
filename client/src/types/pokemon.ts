export interface PokemonListItem {
    name: string;
    url: string;
}

export interface PokemonType {
    type: {
        name: string;
        url: string;
    };
}

export interface PokemonSprites {
    front_default: string;
    other: {
        'official-artwork': {
            front_default: string;
        };
    };
}

export interface PokemonDetails {
    id: number;
    name: string;
    types: PokemonType[];
    sprites: PokemonSprites;
    height: number;
    weight: number;
}

export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonListItem[];
}