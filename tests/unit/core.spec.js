import { shallowMount } from '@vue/test-utils';
import App from '@/App.vue';

describe('Core del juego Pokemodle', () => {
  it('randomPokemon selecciona un Pokémon aleatorio no activo', async () => {
    const wrapper = shallowMount(App, {
      mocks: {
        $t: (key) => key,
      },
    });
    // Simula un pokedex con 3 pokémon, uno activo
    wrapper.vm.pokedex = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/', active: false },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/', active: false },
      { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/', active: true },
    ];
    wrapper.vm.randomPokemon();
    expect(wrapper.vm.pokemon).toHaveProperty('name');
    expect(['bulbasaur', 'ivysaur']).toContain(wrapper.vm.pokemon.name);
    expect(wrapper.vm.pokemon).toHaveProperty('id');
    expect(wrapper.vm.pokemon).toHaveProperty('date');
  });

  it('checkPokemon reconoce un acierto', async () => {
    const wrapper = shallowMount(App, {
      mocks: {
        $t: (key) => key,
      },
    });
    wrapper.vm.pokedex = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/', active: false },
    ];
    wrapper.vm.pokemon = { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/', id: '1', date: new Date() };
    wrapper.vm.input = 'bulbasaur';
    wrapper.vm.intents = 5;
    wrapper.vm.checkPokemon();
    expect(wrapper.vm.win).toBe(true);
    expect(wrapper.vm.pokedex[0].active).toBe(true);
  });
});
