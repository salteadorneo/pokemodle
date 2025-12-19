import { mount } from "@vue/test-utils";
import App from "@/App.vue";

test("press any", async () => {
  const wrapper = mount(App, {
    mocks: {
      $t: (key) => key,
    },
  });
  const button = wrapper.find(".popup .close");
  await button.trigger("click");

  const pokedexTab = wrapper.find(".key");
  await pokedexTab.trigger("click");

  const input = wrapper.find(".textInput");
  expect(input.exists()).toBe(true);
});
