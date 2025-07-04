<template>
  <div class="text-center py-8 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
    <div class="max-w-md mx-auto px-4">
      <div class="mb-4">
        <svg class="w-8 h-8 mx-auto text-purple-600 mb-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
        </svg>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('footer.supportTitle') }}</h3>
        <p class="text-sm text-gray-600 mb-4">{{ $t('footer.supportDescription') }}</p>
      </div>
      <button 
        @click="openDonation"
        class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
        </svg>
        <span>{{ $t('footer.supportButton') }}</span>
      </button>
      <p class="text-xs text-gray-500 mt-3">{{ $t('footer.supportNote') }}</p>
    </div>
  </div>
</template>

<script>
import { DonationHelper } from '@/utils/donationHelper'

export default {
  name: 'DonationFooter',
  methods: {
    openDonation() {
      DonationHelper.openPayPalDonation()
    }
  }
}
</script>