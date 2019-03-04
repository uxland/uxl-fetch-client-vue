<template>
  <div>
    <button @click="fetch">FETCH</button>
    <div>Fetching: {{isBusy}}</div>
    <pre>{{response}}</pre>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import fetchClient from "../src";

@Component
export default class App extends Vue {
  isBusy: boolean = false;
  response: any = undefined;

  async fetch() {
    this.isBusy = true;
    this.response = await fetchClient(
      "https://anapioficeandfire.com/api/characters/583"
    );
    this.isBusy = false;
  }
}
</script>
