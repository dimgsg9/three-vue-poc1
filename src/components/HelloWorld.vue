<template>
  <div class="column is-full">
    <h1>{{ msg }}</h1>
    <p class="subtitle">
      Welcome to <strong>Bulma</strong>!
    </p>
  </div>
  <div class="column is-6">
    <div class="field">
      <label class="label">ACTION</label>
      <div class="control">
        <input class="input" type="text" placeholder="Type your command">
      </div>
    </div>
    <div class="field">
      <label class="label">DIRECTION</label>
      <div class="control">
        <input class="input" type="text" placeholder="Type your command">
      </div>
    </div>
    <div class="field">
      <label class="label">DISTANCE</label>
      <div class="control">
        <input class="input" type="number" placeholder="">
      </div>
    </div>
    <div class="field">
      <div class="control">
        <button class="button is-link" @click="sendCommand">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {reactive, onMounted} from 'vue'

const props = defineProps({
  msg: String
});

const emit = defineEmits(['newCommand']);

const state = reactive({
  command: '',
  steps: 0,
  busy: "true"
});

function sendCommand() {
  emit('newCommand');
}

onMounted(() => {
  console.log("component mounted");
});

</script>
