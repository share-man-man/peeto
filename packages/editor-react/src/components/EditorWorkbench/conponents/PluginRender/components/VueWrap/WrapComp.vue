<script lang="ts">
import { PropType, h } from 'vue';
import { VueWrapProps } from './type';
import { Component } from 'react';

export default {
  props: {
    comp: {
      type: Component as PropType<VueWrapProps['comp']>,
      default: null,
    },
    compProp: {
      type: Object as PropType<VueWrapProps['compProp']>,
      default: null,
    },
    onMount: {
      type: Function as PropType<VueWrapProps['onMount']>,
      default: null,
    },
  },
  setup({ comp, compProp }) {
    return () => h(comp, compProp);
  },
  mounted() {
    this.$props.onMount?.();
  },
};
</script>
