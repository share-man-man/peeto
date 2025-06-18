<script setup lang="ts">
import { onMounted, ref } from 'vue';
import MyButton from './MyButton.vue';
import { ElInput } from 'element-plus';
import Editor from '@peeto/editor';
import { Extension } from '@peeto/extension';

const props = defineProps({
  editor: {
    type: Editor,
    default: null,
  },
  extension: {
    type: Extension,
    default: null,
  },
});
const inputValue = ref('');
onMounted(() => {
  props.extension.panel.onMounted();
});
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
