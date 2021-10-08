import { reactive, readonly } from "vue";

const state = reactive({
  pikachu: false,
  psyduck: false,
});

export function showPikachu() {
  state.pikachu = true;
}

export function showPsyduck() {
  state.psyduck = true;
}

export function reset() {
  state.pikachu = false;
  state.psyduck = false;
}

export default readonly(state);
