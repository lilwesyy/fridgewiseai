<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 safe-area-top">
    <div class="flex items-center justify-between h-16 px-4 mx-auto max-w-3xl w-full">
      <div class="flex items-center">
        <h1 class="text-xl font-bold text-primary-600">{{ t('app.name') }}</h1>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative inline-flex">
          <button 
            v-if="props.showDonateButton" 
            @click="emit('donate-click')"
            class="relative w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
            :title="t('common.donateTooltip')"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  showDonateButton: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['donate-click'])
</script>
