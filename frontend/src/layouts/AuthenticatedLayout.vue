<template>
  <div class="min-h-screen bg-gray-50">
    <MobileHeader 
      :show-back="props.showHeader && props.showBack"
      :show-menu="props.showHeader && props.showMenu"
      :show-donate-button="props.showHeader"
      @menu-toggle="emit('menu-toggle')"
    />
    
    <main 
      class="flex-1"
      :class="{
        'pt-16 pb-20': props.showHeader && props.showNavigation,
        'pt-16': props.showHeader && !props.showNavigation,
        'pb-20': !props.showHeader && props.showNavigation
      }"
    >
      <slot />
    </main>

    <BottomNavigation v-if="props.showNavigation" />
  </div>
</template>

<script setup>
import MobileHeader from '../components/layout/MobileHeader.vue'
import BottomNavigation from '../components/layout/BottomNavigation.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  showHeader: {
    type: Boolean,
    default: true
  },
  showNavigation: {
    type: Boolean,
    default: true
  },
  showBack: {
    type: Boolean,
    default: false
  },
  showMenu: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['menu-toggle'])

</script>
