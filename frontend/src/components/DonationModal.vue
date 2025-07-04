<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click="closeModal"
  >
    <div 
      class="bg-white rounded-xl max-w-md w-full shadow-xl"
      @click.stop
    >
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">{{ $t('donation.title') }}</h2>
            <p class="text-sm text-gray-600">{{ $t('donation.subtitle') }}</p>
          </div>
          <button 
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Benefits -->
        <div class="mb-6">
          <h3 class="font-semibold text-gray-900 mb-3">{{ $t('donation.benefits.title') }}</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li class="flex items-center">
              <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              {{ $t('donation.benefits.badge') }}
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              {{ $t('donation.benefits.support') }}
            </li>
            <li class="flex items-center">
              <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              {{ $t('donation.benefits.free') }}
            </li>
          </ul>
        </div>

        <!-- PayPal Button -->
        <div class="mb-4">
          <div ref="paypalButtonContainer" class="w-full"></div>
        </div>

        <!-- Alternative amounts -->
        <div class="text-center">
          <p class="text-xs text-gray-500 mb-2">{{ $t('donation.amounts') }}</p>
          <div class="flex justify-center space-x-2">
            <button 
              v-for="amount in suggestedAmounts" 
              :key="amount"
              @click="donateAmount(amount)"
              class="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            >
              €{{ amount }}
            </button>
          </div>
        </div>

        <!-- Close Button -->
        <div class="mt-6">
          <button 
            @click="closeModal"
            class="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            {{ $t('common.close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userService } from '@/services/api'

export default {
  name: 'DonationModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'donation-success'],
  data() {
    return {
      suggestedAmounts: [3, 5, 10, 15],
      paypalLoaded: false
    }
  },
  watch: {
    isOpen(newValue) {
      if (newValue && !this.paypalLoaded) {
        this.loadPayPal()
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },

    async loadPayPal() {
      if (window.paypal) {
        this.renderPayPalButton()
        return
      }

      try {
        // Load PayPal SDK
        const script = document.createElement('script')
        script.src = 'https://www.paypal.com/sdk/js?client-id=sb&currency=EUR&intent=capture'
        script.onload = () => {
          this.paypalLoaded = true
          this.renderPayPalButton()
        }
        document.head.appendChild(script)
      } catch (error) {
        console.error('Failed to load PayPal SDK:', error)
      }
    },

    renderPayPalButton() {
      if (!window.paypal || !this.$refs.paypalButtonContainer) {
        return
      }

      // Clear existing button
      this.$refs.paypalButtonContainer.innerHTML = ''

      window.paypal.Buttons({
        createOrder: (_data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: '5.00', // Default amount
                currency_code: 'EUR'
              },
              description: 'FridgeWise AI Support'
            }]
          })
        },
        onApprove: async (_data, actions) => {
          try {
            const details = await actions.order.capture()
            await this.handleDonationSuccess(details)
          } catch (error) {
            console.error('PayPal transaction error:', error)
            this.$toast.error(this.$t('donation.error'))
          }
        },
        onError: (err) => {
          console.error('PayPal error:', err)
          this.$toast.error(this.$t('donation.error'))
        },
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'donate'
        }
      }).render(this.$refs.paypalButtonContainer)
    },

    async donateAmount(amount) {
      // Open PayPal with specific amount
      const url = `https://www.paypal.com/donate/?hosted_button_id=DU757WK9EXN3Q&amount=${amount}`
      window.open(url, '_blank')
    },

    async handleDonationSuccess(details) {
      try {
        // Register supporter status
        await userService.registerSupporter({
          paypalTransactionId: details.id,
          amount: details.purchase_units[0].amount.value
        })

        this.$toast.success(this.$t('donation.success'))
        this.$emit('donation-success')
        this.closeModal()
      } catch (error) {
        console.error('Failed to register supporter:', error)
        this.$toast.error(this.$t('donation.registerError'))
      }
    }
  }
}
</script>