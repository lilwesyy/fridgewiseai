<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 safe-area-top">
    <div class="flex items-center justify-between h-16 px-4">
      <div class="flex items-center">
        <h1 class="text-xl font-bold text-primary-600">{{ t('app.name') }}</h1>
      </div>
      <div class="flex items-center space-x-4">
        <button 
          v-if="props.showProfileButton" 
          @click="emit('profile-click')"
          class="p-2 rounded-full bg-primary-100 text-primary-600"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  showProfileButton: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['profile-click'])
</script>
