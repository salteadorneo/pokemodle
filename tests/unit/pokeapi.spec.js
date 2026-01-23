import fetch from 'node-fetch';

describe('PokeAPI', () => {
  it('should fetch the first 151 Pokémon', async () => {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0');
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(Array.isArray(data.results)).toBe(true);
    expect(data.results.length).toBe(151);
    expect(data.results[0]).toHaveProperty('name');
    expect(data.results[0]).toHaveProperty('url');
  });
});
