<template>
  <AuthenticatedLayout>
    <div class="h-full flex flex-col">
      <!-- Camera View -->
      <div v-if="!capturedImage" class="flex-1 relative bg-black">
        <video 
          ref="videoElement"
          autoplay
          playsinline
          muted
          class="w-full h-full object-cover"
          @loadedmetadata="onVideoLoaded"
        ></video>
        
        <!-- Camera overlay -->
        <div class="absolute inset-0 flex flex-col">
          <!-- Top overlay -->
          <div class="flex-1 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="text-white text-center px-4">
              <h2 class="text-xl font-semibold mb-2">{{ t('camera.title') }}</h2>
              <p class="text-sm opacity-80">Position ingredients clearly in the frame</p>
            </div>
          </div>
          
          <!-- Center frame -->
          <div class="h-64 relative">
            <div class="absolute inset-4 border-2 border-white border-dashed rounded-lg opacity-50"></div>
          </div>
          
          <!-- Bottom controls -->
          <div class="flex-1 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="flex items-center space-x-8">
              <!-- Gallery button -->
              <button 
                @click="openGallery"
                class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center"
              >
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </button>
              
              <button 
                @click="capturePhoto"
                :disabled="!cameraReady"
                class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-50"
              >
                <div class="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  </svg>
                </div>
              </button>
              
              <!-- Switch camera button -->
              <button 
                @click="switchCamera"
                class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center"
              >
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Image Preview -->
      <div v-else class="flex-1 flex flex-col">
        <div class="flex-1 relative bg-black">
          <img 
            :src="capturedImage" 
            alt="Captured ingredients"
            class="w-full h-full object-contain"
          />
          
          <!-- Processing overlay -->
          <div v-if="processing" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="text-white text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <h3 class="text-lg font-semibold mb-2">{{ t('camera.scanning') }}</h3>
              <p class="text-sm opacity-80">Analyzing your ingredients...</p>
            </div>
          </div>
        </div>

        <!-- Preview Controls -->
        <div class="bg-white p-4 space-y-4">
          <div v-if="detectedIngredients.length > 0" class="mb-4">
            <h3 class="font-semibold text-gray-900 mb-2">Detected Ingredients:</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="ingredient in detectedIngredients" 
                :key="ingredient"
                class="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
              >
                {{ ingredient }}
              </span>
            </div>
          </div>

          <div class="flex space-x-3">
            <BaseButton 
              variant="secondary" 
              full-width
              @click="retakePhoto"
              :disabled="processing"
            >
              {{ t('camera.retake') }}
            </BaseButton>
            <BaseButton 
              variant="primary" 
              full-width
              @click="generateRecipe"
              :loading="processing"
              :disabled="detectedIngredients.length === 0"
            >
              {{ t('recipes.generate') }}
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Permission denied -->
      <div v-if="permissionDenied" class="flex-1 flex items-center justify-center px-4">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5C3.312 20.333 4.274 22 5.814 22z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ t('camera.permissionDenied') }}</h3>
          <p class="text-gray-600 mb-4">We need camera access to scan your ingredients</p>
          <BaseButton variant="primary" @click="requestCameraPermission">
            Enable Camera
          </BaseButton>
        </div>
      </div>

      <!-- Hidden file input for gallery -->
      <input 
        ref="fileInput"
        type="file"
        accept="image/*"
        capture="environment"
        class="hidden"
        @change="handleFileSelect"
      />

      <!-- Hidden canvas for image capture -->
      <canvas ref="canvasElement" class="hidden"></canvas>
    </div>
  </AuthenticatedLayout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import BaseButton from '@/components/ui/Button.vue'

const router = useRouter()
const { t } = useI18n()

// Reactive state
const stream = ref(null)
const cameraReady = ref(false)
const capturedImage = ref(null)
const processing = ref(false)
const permissionDenied = ref(false)
const detectedIngredients = ref([])
const facingMode = ref('environment') // 'user' for front camera, 'environment' for back camera

// Template refs
const videoElement = ref(null)
const canvasElement = ref(null)
const fileInput = ref(null)

// Methods
const initCamera = async () => {
  try {
    const constraints = {
      video: {
        facingMode: facingMode.value,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    }

    stream.value = await navigator.mediaDevices.getUserMedia(constraints)
    videoElement.value.srcObject = stream.value
    permissionDenied.value = false
  } catch (error) {
    console.error('Camera access error:', error)
    permissionDenied.value = true
  }
}

const onVideoLoaded = () => {
  cameraReady.value = true
}

const requestCameraPermission = async () => {
  await initCamera()
}

const capturePhoto = () => {
  if (!cameraReady.value) return

  const video = videoElement.value
  const canvas = canvasElement.value
  const context = canvas.getContext('2d')

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  context.drawImage(video, 0, 0, canvas.width, canvas.height)
  
  capturedImage.value = canvas.toDataURL('image/jpeg', 0.8)
  cleanup()
  
  // Process the image
  processImage()
}

const processImage = async () => {
  processing.value = true
  detectedIngredients.value = []

  try {
    // Simulate API call for ingredient detection
    // In real app, this would call your backend API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock detected ingredients
    detectedIngredients.value = [
      'Tomatoes', 'Onions', 'Garlic', 'Basil', 'Cheese'
    ]
  } catch (error) {
    console.error('Image processing error:', error)
    // Handle error
  } finally {
    processing.value = false
  }
}

const retakePhoto = () => {
  capturedImage.value = null
  detectedIngredients.value = []
  processing.value = false
  initCamera()
}

const generateRecipe = async () => {
  if (detectedIngredients.value.length === 0) return

  processing.value = true
  
  try {
    // Store ingredients for recipe generation
    localStorage.setItem('currentIngredients', JSON.stringify(detectedIngredients.value))
    
    // Navigate to recipes page
    router.push('/app/recipes')
  } catch (error) {
    console.error('Recipe generation error:', error)
  } finally {
    processing.value = false
  }
}

const switchCamera = async () => {
  facingMode.value = facingMode.value === 'environment' ? 'user' : 'environment'
  cleanup()
  await initCamera()
}

const openGallery = () => {
  fileInput.value.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      capturedImage.value = e.target.result
      cleanup()
      processImage()
    }
    reader.readAsDataURL(file)
  }
}

const cleanup = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
  cameraReady.value = false
}

// Lifecycle hooks
onMounted(async () => {
  await initCamera()
})

onBeforeUnmount(() => {
  cleanup()
})
</script>
