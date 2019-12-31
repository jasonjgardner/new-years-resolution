<template>
  <div class="container" id="app">
    <header class="header">
      <h1>
        <span class="bg">New Year's Resolution Generator</span>
      </h1>
    </header>

    <div class="sidebar">
      <h2>
        My
        <time class="color-accent">{{ goalYear }}</time> Resolutions
      </h2>
      <ol v-if="log && log.length > 0" class="list">
        <li v-for="(entry, entryIdx) in log" :key="entryIdx">{{ entry }}</li>
      </ol>
      <p v-else class="lead">Generate a resolution:</p>
    </div>

    <div :class="['main', {'active': !complete}]" :key="setKey">
      <div class="buttons">
        <div v-for="(set, itr) in sets" class="btn-wrapper" :key="itr">
          <transition name="fade">
            <ButtonReel
              v-if="idx > itr"
              class="btn"
              :speed="speed(itr)"
              :choices="set"
              @clicked="step"
            />
          </transition>
        </div>
      </div>

      <div class="actions" v-show="idx > 1">
        <button
          :class="['btn', idx % 3 === 1 ? 'active' : 'btn-secondary']"
          type="reset"
          @click.prevent="restart"
          title="Restart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"
            ></path>
          </svg>
          <span>Restart</span>
        </button>
        
        <button
          v-show="idx % 3 === 1"
          :class="['btn', 'active']"
          type="submit"
          @click.prevent="save"
          title="Save"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonReel from "./components/ButtonReel";

let restartTimeout;

export default {
  name: "App",
  components: {
    ButtonReel
  },
  props: {
    choices: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    idx: 1,
    rate: 10,
    value: "",
    log: [],
    sets: [],
    complete: false
  }),
  mounted() {
    this.sets = this.choices.map(this.shuffle);
  },
  methods: {
    save() {
      this.log.push(`${this.value.trim()}.`);
      this.restart();
    },
    step(text) {
      this.value += `${text} `;
      this.idx++;
      this.complete = this.idx > this.sets.length;

      if (this.complete) {
        restartTimeout = setTimeout(this.restart, 30000);
      }
    },
    restart() {
      clearTimeout(restartTimeout);
      this.complete = false;
      this.sets = this.choices.map(this.shuffle);
      this.value = "";
      this.idx = -1;
      this.$nextTick(() => {
        this.idx = 1;
      });
    },
    shuffle(arr) {
      for (let itr = arr.length - 1; itr > 0; itr--) {
        const idx = Math.floor(Math.random() * (itr + 1));
        [arr[itr], arr[idx]] = [arr[idx], arr[itr]];
      }

      return arr;
    },
    speed(x) {
      return Math.max(10, this.rate * (this.sets.length - x));
    }
  },
  computed: {
    goalYear() {
      const now = new Date();

      const year = now.getFullYear();

      if (now.getMonth() > 1) {
        return year + 1;
      }

      return year;
    },
    setKey() {
      const id = this.sets
        .flat()
        .join("")
        .replace(/[^A-Za-z]/, "");

      return `${id}`
        .split("")
        .sort(() => 0.5 - Math.random())
        .join("")
        .trim()
        .substring(50);
    }
  }
};
</script>

<style lang="scss">
@import "./assets/css/index";

#app {
  height: 100vh;
  overflow: auto;
}

.list {
  border-top: 1px solid currentColor;
  font-size: 1.125em;
  font-weight: normal;
  padding-right: 1em;
  padding-top: 1em;
}

.header {
  margin-bottom: 1em;
}

.header h1 {
  background: linear-gradient(var(--color-background) 0%, var(--color-background) 49%, var(--color-on-background) 50%, var(--color-on-background) 51%, var(--color-background) 52%, var(--color-background) 100%);
  color: var(--color-on-background);
  font-size: 1.25rem;
  margin: 0 auto;
  max-width: 75vw;
  overflow: hidden;
  text-align: center;
  text-transform: uppercase;
  text-overflow: ellipsis;
  white-space: nowrap;

  &,
  & > .bg {
    padding: 0 0.666em;
    position: relative;
  }
}

.sidebar h2 {
  font-size: 1rem;
  text-transform: uppercase;
}

.sidebar .lead {
  margin-right: 1em;
  text-align: right;
}

.actions {
  align-items: center;
  border-top: 1px dotted var(--color-on-background);
  display: flex;
  justify-content: space-between;
  flex-flow: row nowrap;
  margin: 0;
  padding: 1rem 2rem;
}

.active .actions {
  border-top: 1px dotted var(--color-on-background);
  justify-content: center;
}

.actions .btn {
  font-family: var(--font-family-title);
  letter-spacing: 0.1em;

  & > span {
    display: none;
    font-size: 1em;
    margin-left: 0.5em;
  }
}

.active .actions .btn > span {
  display: inline-block;
}

.buttons {
  align-items: flex-start;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  grid-area: buttons;
  margin-bottom: 1em;
  max-width: 100%;
  overflow: hidden;
  width: 100%;

  .btn-wrapper {
    background-color: var(--color-background);
    display: block;
    //flex: 0 1 100px;
    //height: var(--btn-height, 2em);
    max-width: 100%;
    text-align: left;
    transition: height 0.5s ease-out;
    width: 100%;
  }

  .btn {
    border-left: 0 solid var(--color-accent);
    color: var(--color-accent);
    display: flex;
    font-size: 1.5em;
    font-weight: normal;
    height: 100%;
    justify-content: flex-start;
    overflow: visible;
    padding-left: 1em;
    text-align: left;
    width: 100%;
    white-space: normal;
    will-change: contents;
  }
}

.btn-wrapper:empty {
  display: none;
}

.main.active {
  border-width: 0;
}

.main.active .buttons {
  align-items: stretch;
  flex-shrink: 1;
  
  .btn-wrapper {
    height: 3em;
    background-color: var(--color-background);
    min-height: 15vh;
    //flex-grow: 1;
  }

  .btn {
    border-left-width: 0.5em;
    color: var(--color-accent);
    font-size: 1.25em;
    font-weight: normal;
    justify-content: center;
    overflow: hidden;
    padding: 1em;
    text-align: center;
    white-space: nowrap;
  }

  .btn[disabled] {
    border-left-color: var(--color-background);
    color: var(--color-on-background);
  }
}

</style>
