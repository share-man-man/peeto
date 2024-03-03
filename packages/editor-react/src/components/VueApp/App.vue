<script setup lang="ts">
import { ref } from 'vue';
import { VueRender } from '@peeto/render-vue';

// import { schema as testObj } from '../../schema/vue/base';

const packageList = ref();

const schemaStr = ref(JSON.stringify({}));
</script>

<template>
  <VueRender :schema-str="schemaStr" :package-list="packageList">
    <template #loading><div>vue-loading</div></template>
    <template #noMatchPackage="{ packageName }">
      <div>木有包{{ packageName }}</div>
    </template>
    <template #noMatchComp="{ componentName }">
      <div>木有组件{{ componentName }}</div>
    </template>
  </VueRender>
</template>
