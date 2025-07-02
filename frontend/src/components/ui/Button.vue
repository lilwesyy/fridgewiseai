<template>
  <button 
    :class="[
      'btn',
      {
        'btn-primary': props.variant === 'primary',
        'btn-secondary': props.variant === 'secondary',
        'opacity-50 cursor-not-allowed': props.loading || props.disabled
      }
    ]"
    :disabled="props.loading || props.disabled"
    @click="handleClick"
  >
    <div v-if="props.loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.loading && !props.disabled) {
    emit('click', event)
  }
}
</script>
