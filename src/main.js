import Vue from "vue";
import App from "./App.vue";
import labels from "../static/labels.json";

Vue.config.productionTip = false;

new Vue({
  render: h =>
    h(App, {
      props: {
        choices: Object.values(labels)
      }
    })
}).$mount("#app");
