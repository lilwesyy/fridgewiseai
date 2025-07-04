<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 safe-area-top">
    <div class="flex items-center justify-between h-16 px-4 mx-auto max-w-3xl w-full">
      <div class="flex items-center space-x-2">
        <h1 class="text-xl font-bold text-primary-600">{{ t('app.name') }}</h1>
        <SupporterBadge v-if="currentUser" :is-supporter="isSupporter" />
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative inline-flex">
          <!-- Donate button - only show if not supporter -->
          <button 
            v-if="props.showDonateButton && !isSupporter" 
            @click="openDonation"
            class="relative w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
            :title="t('common.donateTooltip')"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
            </svg>
            <!-- Subtle pulse animation -->
            <div class="absolute inset-0 rounded-full bg-yellow-400 animate-ping opacity-20"></div>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { DonationHelper } from '@/utils/donationHelper'
import SupporterBadge from '@/components/SupporterBadge.vue'

const { t } = useI18n()
const authStore = useAuthStore()

const currentUser = computed(() => authStore.currentUser)
const isSupporter = computed(() => DonationHelper.isUserSupporter(currentUser.value))

const openDonation = () => {
  DonationHelper.openPayPalDonation()
}

const props = defineProps({
  showDonateButton: {
    type: Boolean,
    default: true
  }
})
</script>
