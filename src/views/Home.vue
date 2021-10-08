<template>
  <div class="w-full h-full container flex justify-center">
    <div class="flex flex-col py-10 items-center">
      <h1
        class="
          font-press-start
          text-4xl text-yellow-pokemon
          stroke-text
          font-bold
          lg:text-left
          text-center
        "
      >
        POKEMON
      </h1>
      <who :pokemon="pokemon" :loading="loading" :reveal="revealPokemon" />
      <transition name="fade">
        <button
          class="
            bg-yellow-pokemon
            px-10
            py-5
            rounded-md
            border-2 border-blue-pokemon
            font-press-start
            hover:bg-yellow-400
            transition
            duration-500
            ease-in-out
          "
          v-if="!gameStarted"
          @click="startGame"
        >
          Start
        </button>
      </transition>
      <transition name="fade">
        <p class="font-press-start py-5" v-if="gameStarted">
          who's that pokemon?
        </p>
      </transition>
      <transition name="fade">
        <p class="font-press-start py-2 text-green-600" v-if="isRight">
          You're right!
        </p>
      </transition>
      <transition name="fade">
        <p class="font-press-start py-2 text-red-600" v-if="isWrong">
          you missed
        </p>
      </transition>
      <transition name="fade">
        <p class="font-press-start py-2 text-sm" v-if="isWrong || isRight">
          next game starts in {{ timerDown }}
        </p>
      </transition>

      <transition name="fade" class="mt-5">
        <div
          v-if="gameStarted"
          class="
            flex flex-col
            lg:flex-row
            space-x-0
            lg:space-x-2
            space-y-2
            lg:space-y-0
          "
        >
          <button
            v-for="pokemon in pokemonsOptions"
            :key="pokemon.id"
            class="
              bg-yellow-pokemon
              px-6
              py-3
              rounded-md
              border-2 border-blue-pokemon
              font-press-start
              hover:bg-yellow-400
              transition
              duration-500
              ease-in-out
              disabled:opacity-60
            "
            @click="selecPokemon(pokemon)"
            :disabled="pokemonNameSelected != ''"
          >
            {{ pokemon.name }}
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { showPikachu, showPsyduck, reset } from "@/store";
import { computed, ref } from "@vue/reactivity";
import { onMounted, watchEffect, watchPostEffect } from "@vue/runtime-core";
import Who from "../components/Who.vue";
import { useTimer } from "vue-timer-hook";
export default {
  components: { Who },
  name: "Home",
  setup() {
    const pokemon = ref({});
    const pokemons = ref([]);
    const loading = ref(true);
    const gameStarted = ref(false);
    const pokemonsOptions = ref([]);
    const pokemonNameSelected = ref("");
    const revealPokemon = ref(false);
    const time = new Date();
    time.setSeconds(time.getSeconds() + 5);
    const timerDown = useTimer(time, false);
    function getRandomPokemon(pokemons) {
      let arr = [...pokemons];
      let j, x, index;
      for (index = arr.length - 1; index > 0; index--) {
        j = Math.floor(Math.random() * (index + 1));
        x = arr[index];
        arr[index] = arr[j];
        arr[j] = x;
      }
      return arr[0];
    }

    function random() {
      for (let index = 0; index < 3; index++) {
        const pkrandom = getRandomPokemon(pokemons.value);
        if (pokemonsOptions.value.find((item) => item.name == pkrandom.name)) {
          pokemonsOptions.value[index] = getRandomPokemon(pokemons.value);
        } else {
          pokemonsOptions.value[index] = pkrandom;
        }
      }

      pokemon.value = getRandomPokemon(pokemonsOptions.value);
    }

    function nextGame() {
      const time = new Date();
      time.setSeconds(time.getSeconds() + 5);
      timerDown.restart(time, false);
      pokemonNameSelected.value = "";
      pokemonsOptions.value = [];
      revealPokemon.value = false;
      random();
    }

    function selecPokemon(pokemon) {
      pokemonNameSelected.value = pokemon.name;
      revealPokemon.value = true;
      timerDown.start();
    }

    function startGame() {
      loading.value = false;
      gameStarted.value = true;
    }

    async function fetchPokemon() {
      const url = `https://pokeapi.co/api/v2/pokemon?limit=200`;
      const res = await fetch(url);
      const data = await res.json();
      const pokemonsApi = data.results.map((data, index) => ({
        name: data.name,
        id: index + 1,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
          index + 1
        }.png`,
      }));
      pokemons.value.push(...pokemonsApi);
    }
    onMounted(async () => {
      await fetchPokemon();
      random();
      watchEffect(async () => {
        if (timerDown.seconds.value == 2) {
          reset();
        }
        if (timerDown.isExpired.value) {
          nextGame();
        }
      });
    });

    const isRight = computed(
      () => pokemon.value.name == pokemonNameSelected.value
    );
    const isWrong = computed(
      () =>
        pokemon.value.name != pokemonNameSelected.value &&
        pokemonNameSelected.value != ""
    );

    watchPostEffect(() => {
      if (isRight.value) {
        showPikachu();
      }

      if (isWrong.value) {
        showPsyduck();
      }
    });

    return {
      pokemon,
      loading,
      pokemonsOptions,
      startGame,
      gameStarted,
      isRight,
      isWrong,
      selecPokemon,
      pokemonNameSelected,
      revealPokemon,
      timerDown: timerDown.seconds,
    };
  },
};
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
