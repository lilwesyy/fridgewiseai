<template>
  <div 
    v-if="isSupporter" 
    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200"
    :title="$t('supporter.badgeTooltip')"
  >
    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
    </svg>
    {{ $t('supporter.badge') }}
  </div>
</template>

<script>
export default {
  name: 'SupporterBadge',
  props: {
    isSupporter: {
      type: Boolean,
      default: false
    }
  }
}
</script>