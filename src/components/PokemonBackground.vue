<template>
  <div>
    <transition name="pikachu">
      <img
        v-if="store.pikachu"
        src="pikachu-happy.png"
        class="
          absolute
          transform
          rotate-90
          h-32
          top-1/4
          left-0
          -translate-x-1/4
        "
      />
    </transition>
    <transition name="psyduck">
      <img
        src="psyduck.png"
        v-if="store.psyduck"
        class="
          absolute
          transform
          -rotate-90
          h-36
          top-1/4
          right-0
          translate-x-1/4
        "
      />
    </transition>
  </div>
</template>

<script>
import Store from "@/store";
export default {
  setup() {
    return {
      store: Store,
    };
  },
};
</script>

<style>
.pikachu-enter-active {
  animation: showpikachu 1.2s;
}
.pikachu-leave-active {
  animation: showpikachu 1.2s reverse;
}

.psyduck-enter-active {
  animation: showpsyduck 1.2s;
}
.psyduck-leave-active {
  animation: showpsyduck 1.2s reverse;
}

@keyframes showpikachu {
  0% {
    transform: translateX(-128px) rotate(90deg);
  }
  100% {
    transform: translateX(-56px) rotate(90deg);
  }
}

@keyframes showpsyduck {
  0% {
    transform: translateX(144px) rotate(-90deg);
  }
  100% {
    transform: translateX(28px) rotate(-90deg);
  }
}
</style>
