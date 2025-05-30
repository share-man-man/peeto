<script setup lang="ts">
import { ref } from 'vue';
import MyButton from './MyButton.vue';
import { ElInput } from 'element-plus';

const inputValue = ref('');
</script>

<template>
  <div>Test</div>
  <el-input v-model="inputValue" />
  {{ inputValue }}
  <my-button>
    <template #test="{ list }">
      list:
      <div>{{ JSON.stringify(list) }}</div>
    </template>
  </my-button>
</template>
