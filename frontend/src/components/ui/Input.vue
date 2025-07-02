<template>
  <div class="mb-4">
    <label v-if="props.label" :for="props.id" class="block text-sm font-medium text-gray-700 mb-2">
      {{ props.label }}
    </label>
    <input
      :id="props.id"
      :type="props.type"
      :placeholder="props.placeholder"
      :value="props.modelValue"
      :class="[
        'input',
        {
          'border-red-500 focus:ring-red-500': props.error,
          'border-gray-300 focus:ring-primary-500': !props.error
        }
      ]"
      @input="updateValue"
      @blur="emit('blur')"
      @focus="emit('focus')"
    />
    <p v-if="props.error" class="mt-1 text-sm text-red-600">{{ props.error }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const updateValue = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>
