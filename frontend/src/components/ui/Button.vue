<template>
  <button 
    :class="[
      'btn',
      {
        'btn-primary': props.variant === 'primary' || props.variant === 'default',
        'btn-secondary': props.variant === 'secondary',
        'btn-ghost': props.variant === 'ghost',
        'opacity-50 cursor-not-allowed': props.loading || props.disabled,
        'w-full': props.fullWidth
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
    validator: (value) => ['primary', 'secondary', 'ghost', 'default'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  fullWidth: {
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
