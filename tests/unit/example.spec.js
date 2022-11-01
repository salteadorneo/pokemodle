import { shallowMount, mount } from "@vue/test-utils";
import App from "@/App.vue";

// describe("HelpModal.vue", () => {
//   it("renders props.msg when passed", () => {
//     const msg = "new message";
//     const wrapper = shallowMount(HelpModal, {
//       propsData: { msg },
//     });
//     expect(wrapper.text()).toMatch("Cómo jugar");
//   });
// });

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

  // const text = wrapper.find(".pokemon");
  // console.log(text);
  // expect(text.text()).toContain("Bulvasaur");
});
