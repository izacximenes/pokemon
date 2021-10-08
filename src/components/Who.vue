<template>
  <div class="relative h-60">
    <transition name="pokeball">
      <svg
        v-if="show"
        viewBox="0 0 100 100"
        :class="cssSvg"
        width="200"
        height="200"
      >
        <g transform="translate(50 50) scale(0.8)">
          <g class="stars" transform="scale(0)">
            <path
              fill="#303030"
              stroke="#303030"
              stroke-width="3"
              stroke-linejoin="round"
              stroke-linecap="round"
              d="M -50 -50 l 4.5 0 l 2.5 -4.5 l 2.5 4.5 l 4.5 0 l -3.5 3.5 l 1.5 5 l -5 -2.5 l -5 2.5 l 1.5 -5 l -3.5 -3.5"
            ></path>
            <path
              fill="#303030"
              stroke="#303030"
              stroke-width="3"
              stroke-linejoin="round"
              stroke-linecap="round"
              d="M 36 -50 l 4.5 0 l 2.5 -4.5 l 2.5 4.5 l 4.5 0 l -3.5 3.5 l 1.5 5 l -5 -2.5 l -5 2.5 l 1.5 -5 l -3.5 -3.5"
            ></path>
          </g>

          <g transform="translate(0 50)">
            <g class="gravity">
              <g transform="translate(0 -50)">
                <g class="ball" transform="scale(1 1)">
                  <g class="bottom">
                    <path
                      fill="#ffffff"
                      stroke="#303030"
                      stroke-width="5"
                      d="M -47.5 0 a 47.5 47.5 0 0 0 95 0z"
                    ></path>
                  </g>
                  <g class="top">
                    <path
                      fill="#f15d5f"
                      d="M -47.5 0 a 47.5 47.5 0 0 1 95 0"
                    ></path>
                    <path
                      fill="none"
                      stroke="#ffffff"
                      stroke-width="5"
                      stroke-linecap="round"
                      stroke-dasharray="0 15 9 9 20 100"
                      d="M -38 -0 a 38 38 0 0 1 76 0"
                    ></path>
                    <path
                      fill="none"
                      stroke="#303030"
                      stroke-width="5"
                      d="M -47.5 0 a 47.5 47.5 0 0 1 95 0z"
                    ></path>
                  </g>

                  <g class="open" transform="scale(1 0)">
                    <path
                      fill="#303030"
                      stroke="#303030"
                      stroke-width="5"
                      stroke-linejoin="round"
                      d="M -47.5 -10 a 190 190 0 0 1 95 0 a 190 190 0 0 1 -95 0"
                    ></path>
                    <path
                      fill="#303030"
                      stroke="#303030"
                      stroke-width="5"
                      stroke-linejoin="round"
                      d="M -47.5 5 a 160 160 0 0 0 95 0 a 180 180 0 0 0 -95 0"
                    ></path>
                  </g>

                  <g class="center">
                    <circle
                      fill="#ffffff"
                      stroke="#303030"
                      stroke-width="5"
                      cx="0"
                      cy="0"
                      r="12"
                    ></circle>
                    <circle
                      fill="#ffffff"
                      stroke="#303030"
                      stroke-width="3"
                      cx="0"
                      cy="0"
                      r="6"
                    ></circle>
                    <g class="inner" opacity="0">
                      <circle fill="#f15d5f" cx="0" cy="0" r="4.5"></circle>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </transition>
    <transition name="pokemon">
      <img
        v-if="showPokemon"
        :src="pokemon.image"
        alt="pokemon"
        class="filter w-56"
        :class="classImagePokemon"
      />
    </transition>
  </div>
</template>

<script>
import { computed, ref } from "@vue/reactivity";
import { onMounted, watch, watchEffect } from "@vue/runtime-core";
export default {
  name: "Who",
  props: {
    pokemon: Object,
    loading: Boolean,
    reveal: Boolean,
  },
  setup(props) {
    const failure = ref(false);
    const show = ref(props.loading);
    const showPokemon = ref(false);

    watch(
      () => props.loading,
      (newVal) => {
        if (!newVal) {
          setTimeout(() => {
            failure.value = true;
          }, 500);
        }
      }
    );

    watch(
      failure,
      (newVal) => {
        console.log("newVal", newVal);
        if (newVal) {
          setTimeout(() => {
            show.value = false;
          }, 1000);
        }
      },
      {
        deep: true,
      }
    );

    watch(show, (newVal) => {
      if (!newVal) {
        setTimeout(() => {
          showPokemon.value = true;
        }, 1200);
      }
    });

    function reset() {
      failure.value = false;
      show.value = true;
      showPokemon.value = false;
    }

    onMounted(() => {
      watchEffect(() => {
        if (!props.loading && props.pokemon) {
          reset();
          failure.value = true;
        }
      });
    });

    return {
      cssSvg: computed(() => ({
        fetching: props.loading,
        failure: failure.value,
      })),
      failure,
      show,
      showPokemon,
      classImagePokemon: computed(() => ({
        "brightness-0": !props.reveal,
      })),
    };
  },
};
</script>

<style>
svg.fetching g.gravity {
  /* ! infinite given the unknown time it takes for the request to be resolved/rejected */
  animation: shake 0.75s infinite cubic-bezier(0.645, 0.045, 0.355, 1);
}
@keyframes shake {
  20% {
    transform: rotate(-10deg);
  }
  60% {
    transform: rotate(10deg);
  }
  80% {
    transform: rotate(0deg);
  }
}

/* pulse to change the color of the innermost circle */
svg.fetching g.inner {
  /* ! infinite given the unknown time it takes for the request to be resolved/rejected */
  animation: pulse 0.75s infinite cubic-bezier(0.645, 0.045, 0.355, 1);
}
@keyframes pulse {
  25% {
    opacity: 0.7;
  }
  50% {
    opacity: 0;
  }
}

/* squash for the pokeball and the success animation */
svg.success g.ball {
  animation: squash 0.2s cubic-bezier(0.645, 0.045, 0.355, 1) 2 alternate;
}
@keyframes squash {
  to {
    transform: scaleY(0.9);
  }
}

/* scaleUp for the stars and the success animation */
svg.success g.stars {
  animation: scaleUp 0.2s 0.2s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
}
@keyframes scaleUp {
  to {
    transform: scale(1);
  }
}

/* scaleUp for the arcs in between the ball's halves and for the failure animation */
svg.failure g.open {
  animation: scaleUp 0.2s 0.1s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
}

/* translateUp for the top half and the failure animation */
svg.failure g.top {
  animation: translateUp 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
}
@keyframes translateUp {
  to {
    transform: translateY(-10px);
  }
}

/* translateDown for the bottom half and the failure animation */
svg.failure g.bottom {
  animation: translateDown 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
}
@keyframes translateDown {
  to {
    transform: translateY(5px);
  }
}

/* translateHigher for the center and the failure animation */
svg.failure g.center {
  animation: translateHigher 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
}
@keyframes translateHigher {
  to {
    transform: translateY(-18px);
  }
}

.pokeball-enter-active {
  transition: opacity 0.5s;
}
.pokeball-leave-active {
  animation: pokeball 1.2s;
}
.pokeball-enter {
  opacity: 0;
}

@keyframes pokeball {
  0.0% {
    transform: translate(250px, -60px) scale(0.2);
  }
  100% {
    transform: translate(100px, -40px) scale(0.4) rotate(-60deg);
  }
}
@keyframes show {
  0% {
    transform: scale(0.2) translateY(-200px) translateX(200px) rotate(-45deg);
  }
  100% {
    transform: scale(1) translateY(0) translateX(0) rotate(0);
  }
}
</style>
