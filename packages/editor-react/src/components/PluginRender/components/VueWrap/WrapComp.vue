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
    childProp: {
      type: Object as PropType<VueWrapProps['childProp']>,
      default: null,
    },
    onMount: {
      type: Function as PropType<VueWrapProps['onMount']>,
      default: null,
    },
  },
  setup({ comp, childProp }) {
    return () => h(comp, childProp);
  },
  mounted() {
    this.$props.onMount?.();
  },
};
</script>
