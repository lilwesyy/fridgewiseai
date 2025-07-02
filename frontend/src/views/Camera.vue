<template>
  <AuthenticatedLayout>
    <div class="h-full flex flex-col">
      <!-- Safari Ask permission overlay -->
      <div v-if="isAskPermission" class="absolute inset-0 flex items-center justify-center px-4 bg-white">
        <div class="text-center max-w-sm mx-auto">
          <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ t('camera.needPermission') || 'Camera Access Required' }}</h3>
          <p class="text-gray-600 mb-6">{{ t('camera.safariAskMode') || 'Safari is set to ask for permission each time. Please click the button below and then allow camera access when prompted.' }}</p>
          
          <div class="flex justify-center">
            <BaseButton variant="primary" @click="triggerSafariPermissionPrompt">
              {{ t('camera.enableCamera') || 'Enable Camera' }}
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Camera View -->
      <div v-if="!capturedImage && !permissionDenied && !isAskPermission" class="flex-1 relative bg-black">
        <video 
          ref="videoElement"
          autoplay
          playsinline="true"
          muted
          webkit-playsinline="true"
          x-webkit-airplay="allow"
          playsInline
          disablePictureInPicture
          class="w-full h-full object-cover"
          @loadedmetadata="onVideoLoaded"
        ></video>
        
        <!-- Camera overlay for mobile full screen -->
        <div class="absolute inset-0 flex flex-col">
          <!-- Minimal top overlay -->
          <div class="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
            <div class="text-white text-center">
              <h2 class="text-lg font-semibold">{{ t('camera.title') }}</h2>
            </div>
          </div>
          
          <!-- Center guide frame -->
          <div class="flex-1 flex items-center justify-center p-8">
            <div class="w-64 h-64 border-2 border-white/30 border-dashed rounded-2xl"></div>
          </div>
          
          <!-- Bottom controls -->
          <div class="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/70 to-transparent p-6 pb-safe">
            <div class="flex items-center justify-center space-x-12">
              <!-- Gallery button -->
              <button 
                @click="openGallery"
                class="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center transition-all active:scale-95"
              >
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </button>
              
              <!-- Capture button -->
              <button 
                @click="capturePhoto"
                :disabled="!cameraReady"
                class="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-50 transition-all active:scale-95"
              >
                <div class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  </svg>
                </div>
              </button>
              
              <!-- Switch camera button -->
              <button 
                @click="switchCamera"
                class="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center transition-all active:scale-95"
              >
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Gallery Button sempre visibile per problemi di compatibilità su iOS/Safari -->
        <div class="absolute top-4 right-4 z-20">
          <button
            @click="openGallery"
            class="bg-white/20 backdrop-blur rounded-full p-3 shadow-lg"
            title="Apri Galleria"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Image Preview -->
      <div v-if="capturedImage && !permissionDenied" class="flex-1 flex flex-col">
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

      <!-- Permission denied with iOS guidance -->
      <div v-if="permissionDenied" class="absolute inset-0 flex items-center justify-center px-4 bg-white">
        <div class="text-center max-w-sm mx-auto">
          <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ t('camera.permissionDenied') }}</h3>
          <p class="text-gray-600 mb-4">{{ t('camera.permissionInstructions') || 'We need camera access to scan your ingredients' }}</p>
          
          <!-- iOS specific guidance -->
          <div v-if="isIOS" class="bg-blue-50 p-4 rounded-lg mb-6 text-left">
            <h4 class="font-medium text-blue-800 mb-1">{{ t('camera.iOSInstructionsTitle') || 'On iOS devices:' }}</h4>
            <ul class="list-disc pl-5 text-sm text-blue-700 space-y-1">
              <li>{{ t('camera.iOSInstructions1') || 'Make sure you\'re using Safari browser' }}</li>
              <li>{{ t('camera.iOSInstructions2') || 'Go to iOS Settings > Safari > Camera' }}</li>
              <li>{{ t('camera.iOSInstructions3') || 'Enable camera access for this website' }}</li>
              <li>{{ t('camera.iOSInstructions4') || 'Return to Safari and reload this page' }}</li>
            </ul>
          </div>
          
          <div class="flex justify-center">
            <BaseButton variant="primary" @click="requestCameraPermission">
              {{ t('camera.tryAgain') || 'Try Again' }}
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Permission denied with iOS gallery option -->
      <div v-if="permissionDenied && isIOS" class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <div class="text-center">
          <p class="text-sm text-gray-600 mb-3">{{ t('camera.useGalleryInstead') || 'Or upload a photo from your gallery:' }}</p>
          <BaseButton variant="outline" full-width @click="openGallery">
            <span class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>{{ t('camera.uploadPhoto') || 'Upload Photo from Gallery' }}</span>
            </span>
          </BaseButton>
        </div>
      </div>

      <!-- Attempting permission loading state -->
      <div v-if="attemptingPermission && !permissionDenied" class="absolute inset-0 flex items-center justify-center bg-white">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ t('camera.requestingAccess') || 'Requesting Camera Access' }}</h3>
          <p class="text-gray-600">{{ t('camera.pleaseAllowAccess') || 'Please allow access when prompted' }}</p>
        </div>
      </div>

      <!-- Hidden file input for gallery -->
      <input 
        ref="fileInput"
        type="file"
        accept="image/*"
        capture="false"
        class="hidden"
        @change="handleFileSelect"
      />

      <!-- Hidden textarea to force keyboard on iOS -->
      <textarea 
        ref="dummyInput"
        class="opacity-0 absolute top-0 left-0 w-0 h-0 -z-10"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
      ></textarea>
      
      <!-- Hidden canvas for image capture -->
      <canvas ref="canvasElement" class="hidden"></canvas>

      <!-- Permission denied with iOS guidance -->
      <div v-if="permissionDenied" class="absolute inset-0 flex items-center justify-center px-4 bg-white">
        <div class="text-center max-w-sm mx-auto">
          <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ t('camera.permissionDenied') }}</h3>
          <p class="text-gray-600 mb-4">{{ t('camera.permissionInstructions') || 'We need camera access to scan your ingredients' }}</p>
          
          <!-- iOS specific guidance -->
          <div v-if="isIOS" class="bg-blue-50 p-4 rounded-lg mb-6 text-left">
            <h4 class="font-medium text-blue-800 mb-1">{{ t('camera.iOSInstructionsTitle') || 'On iOS devices:' }}</h4>
            <ul class="list-disc pl-5 text-sm text-blue-700 space-y-1">
              <li>{{ t('camera.iOSInstructions1') || 'Make sure you\'re using Safari browser' }}</li>
              <li>{{ t('camera.iOSInstructions2') || 'Go to iOS Settings > Safari > Camera' }}</li>
              <li>{{ t('camera.iOSInstructions3') || 'Enable camera access for this website' }}</li>
              <li>{{ t('camera.iOSInstructions4') || 'Return to Safari and reload this page' }}</li>
            </ul>
          </div>
          
          <div class="flex justify-center">
            <BaseButton variant="primary" @click="requestCameraPermission">
              {{ t('camera.tryAgain') || 'Try Again' }}
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Permission denied with iOS gallery option -->
      <div v-if="permissionDenied && isIOS" class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <div class="text-center">
          <p class="text-sm text-gray-600 mb-3">{{ t('camera.useGalleryInstead') || 'Or upload a photo from your gallery:' }}</p>
          <BaseButton variant="outline" full-width @click="openGallery">
            <span class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>{{ t('camera.uploadPhoto') || 'Upload Photo from Gallery' }}</span>
            </span>
          </BaseButton>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import BaseButton from '@/components/ui/Button.vue'
import { ingredientService, userDataService } from '@/services/api'

const router = useRouter()
const { t } = useI18n()
const toast = useToast()

// Reactive state
const stream = ref(null)
const cameraReady = ref(false)
const capturedImage = ref(null)
const processing = ref(false)
const permissionDenied = ref(false)
const detectedIngredients = ref([])
const facingMode = ref('environment') // 'user' for front camera, 'environment' for back camera
const isIOS = ref(false)
const isSafari = ref(false)
const isAskPermission = ref(false) // Flag for Safari's "Ask" permission mode
const attemptingPermission = ref(false)
const permissionAttempts = ref(0) // Track permission attempts for fallbacks
const galleryFallbackTimer = ref(null) // Timer for gallery fallback
const showGalleryAlways = ref(false) // Always show gallery button

// Template refs
const videoElement = ref(null)
const canvasElement = ref(null)
const fileInput = ref(null)
const dummyInput = ref(null)

// Check if browser is Safari with potential camera issues
const isSafariWithCameraIssues = () => {
  // More permissive iOS detection
  const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  // More accurate Safari detection (detects Safari but not Chrome)
  const isSafariBrowser = /AppleWebKit/.test(navigator.userAgent) && 
    !/Chrome/.test(navigator.userAgent) &&
    /Safari/.test(navigator.userAgent);
  
  // Also detect iOS WebView
  const isIOSWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
  
  return isIOSDevice || isSafariBrowser || isIOSWebView;
}

// Force gallery open as fallback
const forceOpenGallery = () => {
  // Reset gallery input before opening
  if (fileInput.value) {
    // For Safari, specifically remove the capture attribute which can cause issues
    fileInput.value.removeAttribute('capture');
    
    // Reset file input by replacing it (more reliable on iOS)
    const parent = fileInput.value.parentNode;
    const newInput = document.createElement('input');
    newInput.type = 'file';
    newInput.accept = 'image/*';
    newInput.className = 'hidden';
    newInput.addEventListener('change', handleFileSelect);
    
    // Replace old input with new one
    parent.replaceChild(newInput, fileInput.value);
    fileInput.value = newInput;
    
    // Then trigger click after a small delay
    setTimeout(() => {
      fileInput.value.click();
    }, 100);
  } else {
    // Fallback if ref not available
    openGallery();
  }
}

// Methods
const initCamera = async () => {
  try {
    // Reset state
    permissionDenied.value = false
    attemptingPermission.value = true
    isAskPermission.value = false
    
    // Check if iOS/Safari with potential camera issues
    const hasPotentialCameraIssues = isSafariWithCameraIssues();
    isIOS.value = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    isSafari.value = /AppleWebKit/.test(navigator.userAgent) && 
      !/Chrome/.test(navigator.userAgent);
    
    // Always show gallery on problematic browsers
    showGalleryAlways.value = hasPotentialCameraIssues;
    
    // Set timer for gallery fallback in case camera doesn't initialize
    if (galleryFallbackTimer.value) clearTimeout(galleryFallbackTimer.value);
    galleryFallbackTimer.value = setTimeout(() => {
      if (!cameraReady.value && !capturedImage.value) {
        console.log('Camera not ready after timeout, showing gallery option');
        showGalleryAlways.value = true;
        // Don't show error message, just make gallery prominent
        toast.info(t('camera.useGalleryInstead') || 'Please use gallery upload instead');
      }
    }, 2000); // 2 seconds timeout for camera initialization

    // Special handling for iOS Safari
    if (isIOS.value || isSafari.value) {
      // Force reflow of video element to help Safari
      if (videoElement.value) {
        videoElement.value.style.display = 'none'
        setTimeout(() => {
          videoElement.value.style.display = 'block'
        }, 0)
      }

      // Check if we might be in Safari "Ask" mode by trying to detect permissions state
      try {
        // First try to check permissions
        if (navigator.permissions && navigator.permissions.query) {
          const permissionStatus = await navigator.permissions.query({ name: 'camera' })
          if (permissionStatus.state === 'prompt') {
            console.log('Camera permission state is prompt (Ask mode)')
            isAskPermission.value = true
            attemptingPermission.value = false
            return // Exit and show the special UI for Ask mode
          }
        }
      } catch (permError) {
        console.log('Permission query not supported, continuing with regular flow:', permError)
        // Some browsers don't support permissions API, continue with normal flow
      }

      // Check if camera APIs are actually available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia not supported on this browser - showing gallery option');
        permissionDenied.value = true
        attemptingPermission.value = false
        showGalleryAlways.value = true;
        // Don't block with error message, just switch to gallery
        toast.info(t('camera.galleryFallback') || 'Using gallery upload instead');
        return
      }

      // Ensure we're using the safest possible constraints for iOS
      const constraints = {
        audio: false,
        video: {
          facingMode: facingMode.value,
          // Avoid setting width/height on iOS as it can cause issues
        }
      }
      
      try {
        // First try with simple constraints
        try {
          stream.value = await navigator.mediaDevices.getUserMedia({ video: true })
          console.log('Got camera with simple constraints')
        } catch (simpleError) {
          console.log('Simple constraints failed, trying facingMode:', simpleError)
          stream.value = await navigator.mediaDevices.getUserMedia(constraints)
        }
        
        // If stream is obtained successfully
        if (videoElement.value) {
          // Make sure all attributes are set properly
          videoElement.value.setAttribute('playsinline', 'true')
          videoElement.value.setAttribute('webkit-playsinline', 'true')
          videoElement.value.setAttribute('x-webkit-airplay', 'allow')
          videoElement.value.setAttribute('autoplay', 'true')
          videoElement.value.setAttribute('playsInline', 'true')
          videoElement.value.setAttribute('disablePictureInPicture', 'true')
          videoElement.value.muted = true
          
          videoElement.value.srcObject = stream.value
          
          try {
            // Try to play the video
            const playPromise = videoElement.value.play()
            if (playPromise !== undefined) {
              playPromise.catch(playError => {
                console.error('Error playing video on iOS:', playError)
                // If play fails, we'll still consider the camera initialized
                // but we'll log the error and leave cameraReady false
                showGalleryAlways.value = true; // Ensure gallery is available
              }).then(() => {
                console.log('Video playing successfully')
                cameraReady.value = true;
                // Clear fallback timer if camera successfully started
                if (galleryFallbackTimer.value) {
                  clearTimeout(galleryFallbackTimer.value);
                  galleryFallbackTimer.value = null;
                }
              })
            }
          } catch (playError) {
            console.error('Exception during play() on iOS:', playError)
            showGalleryAlways.value = true;
          }
        }
      } catch (iosError) {
        console.error('iOS camera error:', iosError)
        // Try again with even simpler constraints or show Ask mode UI
        if (iosError.name === 'NotAllowedError' || iosError.name === 'SecurityError') {
          // Likely a permission issue
          isAskPermission.value = true
          attemptingPermission.value = false
          return
        }
        
        try {
          // Last attempt with minimal constraints
          const lastResortConstraints = { 
            video: true,
            audio: false
          }
          
          stream.value = await navigator.mediaDevices.getUserMedia(lastResortConstraints)
          if (videoElement.value) {
            videoElement.value.srcObject = stream.value
            videoElement.value.setAttribute('playsinline', 'true')
            try {
              await videoElement.value.play()
              cameraReady.value = true;
            } catch (playError) {
              console.error('Error playing video on iOS (fallback):', playError)
              showGalleryAlways.value = true;
            }
          }
        } catch (fallbackError) {
          console.error('iOS fallback camera error:', fallbackError)
          // Instead of throwing error, show gallery option
          showGalleryAlways.value = true;
          permissionDenied.value = true;
          toast.info(t('camera.galleryFallback') || 'Using gallery upload instead');
        }
      }
    } else {
      // Non-iOS handling
      const constraints = {
        video: {
          facingMode: facingMode.value,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      }

      stream.value = await navigator.mediaDevices.getUserMedia(constraints)
      
      if (videoElement.value) {
        videoElement.value.srcObject = stream.value
        cameraReady.value = true;
        // Clear fallback timer if camera successfully started
        if (galleryFallbackTimer.value) {
          clearTimeout(galleryFallbackTimer.value);
          galleryFallbackTimer.value = null;
        }
      }
    }
    
    permissionDenied.value = false
    attemptingPermission.value = false
  } catch (error) {
    console.error('Camera access error:', error)
    attemptingPermission.value = false
    
    // For all errors, always make gallery available
    showGalleryAlways.value = true;
    
    // For Safari/iOS, instead of showing permission denied, offer gallery
    if (isSafariWithCameraIssues()) {
      console.log('Safari/iOS with camera issues detected, offering gallery instead');
      // Don't set permissionDenied to true to avoid showing that UI
      // Just inform user about gallery option
      toast.info(t('camera.galleryFallback') || 'Using gallery upload instead');
      return;
    }
    
    // Handle NotFoundError specially - no need to show permission denied UI
    if (error.name === 'NotFoundError') {
      console.log('No camera device found, using gallery mode');
      toast.info(t('camera.deviceNotFoundGallery') || 'No camera found. You can upload from your gallery instead.');
      return;
    }
    
    // For other browsers, handle permission errors as before
    permissionDenied.value = true;
    
    // More specific error handling
    if (error.name === 'NotAllowedError') {
      toast.error(t('camera.permissionDenied') || 'Camera access was denied')
    } else if (isIOS.value) {
      toast.error(t('camera.iOSPermissionError') || 'On iOS, you need to grant camera permission in Settings')
    } else {
      toast.error(t('camera.generalError') || 'Could not access camera')
    }
  }
}

const switchToBackCamera = async () => {
  // iOS-specific handling for switching to back camera
  if (!isIOS.value) return
  
  try {
    // Clean up existing stream
    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop())
    }
    
    // Try multiple approaches to get the back camera on iOS
    
    // First approach: try with exact constraint
    try {
      const backCameraConstraints = {
        audio: false,
        video: { 
          facingMode: { exact: "environment" } 
        }
      }
      
      stream.value = await navigator.mediaDevices.getUserMedia(backCameraConstraints)
    } catch (exactError) {
      console.warn('Exact environment camera failed on iOS:', exactError)
      
      // Second approach: try with non-exact constraint
      try {
        const simpleConstraints = {
          audio: false,
          video: { 
            facingMode: "environment" 
          }
        }
        
        stream.value = await navigator.mediaDevices.getUserMedia(simpleConstraints)
      } catch (simpleError) {
        console.warn('Simple environment camera failed on iOS:', simpleError)
        
        // Third approach: just get any video
        stream.value = await navigator.mediaDevices.getUserMedia({ video: true })
      }
    }
    
    if (videoElement.value && stream.value) {
      videoElement.value.srcObject = stream.value
      videoElement.value.setAttribute('playsinline', 'true')
      await videoElement.value.play()
    }
  } catch (error) {
    console.error('Failed to switch to back camera:', error)
    // Fall back to default camera if back camera is not available
  }
}

const onVideoLoaded = () => {
  cameraReady.value = true
}

/* 
 * NOTE: Previously there was a duplicate requestCameraPermission function here
 * that was causing a "Identifier 'requestCameraPermission' has already been declared" error.
 * This function was removed and replaced by the improved version at line ~974.
 */

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
    // Call backend API to detect ingredients
    const response = await ingredientService.detectIngredients(capturedImage.value)
    detectedIngredients.value = response.ingredients || []
    
    toast.success(t('notifications.camera.detectSuccess'))
  } catch (error) {
    console.error('Ingredient detection error:', error)
    toast.error(t('notifications.camera.detectError'))
    
    // Fallback to mock ingredients for demo
    detectedIngredients.value = [
      'Tomatoes',
      'Onions', 
      'Garlic',
      'Basil'
    ]
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
    userDataService.setCurrentIngredients(detectedIngredients.value)
    
    // Navigate to recipes page
    router.push('/app/recipes')
  } catch (error) {
    console.error('Recipe generation error:', error)
  } finally {
    processing.value = false
  }
}

const switchCamera = async () => {
  // Toggle between front and back camera
  facingMode.value = facingMode.value === 'environment' ? 'user' : 'environment'
  
  // On iOS, we need to clean up first
  cleanup()

  // Display loading indicator for camera switch
  attemptingPermission.value = true
  
  try {
    // Special handling for iOS
    if (isIOS.value) {
      // For iOS, try first with exact constraints
      try {
        const iosConstraints = {
          audio: false,
          video: {
            facingMode: { exact: facingMode.value === 'environment' ? 'environment' : 'user' }
          }
        }
        
        stream.value = await navigator.mediaDevices.getUserMedia(iosConstraints)
        
        if (videoElement.value) {
          videoElement.value.srcObject = stream.value
          videoElement.value.setAttribute('playsinline', 'true')
          await videoElement.value.play()
        }
        
        cameraReady.value = true
      } catch (iosError) {
        console.warn('Failed with exact facingMode on iOS:', iosError)
        
        // Try again with less specific constraints
        try {
          const fallbackConstraints = {
            audio: false,
            video: { facingMode: facingMode.value }
          }
          
          stream.value = await navigator.mediaDevices.getUserMedia(fallbackConstraints)
          
          if (videoElement.value) {
            videoElement.value.srcObject = stream.value
            videoElement.value.setAttribute('playsinline', 'true')
            await videoElement.value.play()
          }
          
          cameraReady.value = true
        } catch (fallbackError) {
          console.error('Fallback camera access failed:', fallbackError)
          
          // Last resort - just get any video stream
          try {
            stream.value = await navigator.mediaDevices.getUserMedia({ video: true })
            
            if (videoElement.value) {
              videoElement.value.srcObject = stream.value
              videoElement.value.setAttribute('playsinline', 'true')
              await videoElement.value.play()
            }
            
            cameraReady.value = true
            toast.warning(t('camera.switchLimited') || 'Limited camera switching on this device')
          } catch (lastError) {
            console.error('Last resort camera access failed:', lastError)
            toast.error(t('camera.switchFailed') || 'Failed to switch camera')
            facingMode.value = facingMode.value === 'environment' ? 'user' : 'environment' // Toggle back
          }
        }
      }
    } else {
      // Standard approach for other devices
      await initCamera()
    }
  } catch (error) {
    console.error('Error switching camera:', error)
    toast.error(t('camera.switchFailed') || 'Failed to switch camera')
  } finally {
    attemptingPermission.value = false
  }
}

/* 
 * NOTE: openGallery function was moved to the improved version below (line ~981)
 * NOTE: handleFileSelect function was also moved to the improved version below (line ~988)
 */

const triggerSafariPermissionPrompt = async () => {
  if (permissionAttempts.value >= 3) {
    console.log('Maximum permission attempts reached, showing gallery instead');
    isAskPermission.value = false;
    showGalleryAlways.value = true;
    toast.info(t('camera.galleryFallback') || 'Using gallery upload instead');
    return;
  }
  
  permissionAttempts.value++;
  attemptingPermission.value = true;
  
  try {
    // Focus the dummy input first (creates a user interaction context)
    if (dummyInput.value) {
      dummyInput.value.focus();
      // Wait a moment for focus to register
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Try to get camera permission with basic constraints
    const constraints = { 
      video: true, 
      audio: false 
    };
    
    console.log('Triggering Safari permission prompt, attempt:', permissionAttempts.value);
    
    try {
      // First try with minimal constraints
      stream.value = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoElement.value) {
        videoElement.value.srcObject = stream.value;
        videoElement.value.setAttribute('playsinline', 'true');
        videoElement.value.setAttribute('webkit-playsinline', 'true');
        videoElement.value.setAttribute('autoplay', 'true');
        
        try {
          await videoElement.value.play();
          cameraReady.value = true;
          isAskPermission.value = false;
          attemptingPermission.value = false;
          console.log('Successfully got camera permission from prompt');
          
          // Clear fallback timer if camera successfully started
          if (galleryFallbackTimer.value) {
            clearTimeout(galleryFallbackTimer.value);
            galleryFallbackTimer.value = null;
          }
        } catch (playError) {
          console.error('Error playing video after permission:', playError);
          attemptingPermission.value = false;
          // Try again or show gallery
          if (permissionAttempts.value < 3) {
            toast.info(t('camera.tryAgain') || 'Please try again');
          } else {
            isAskPermission.value = false;
            showGalleryAlways.value = true;
            toast.info(t('camera.galleryFallback') || 'Using gallery upload instead');
          }
        }
      }
    } catch (error) {
      console.error('Error getting user media after prompt:', error);
      attemptingPermission.value = false;
      
      // Check if permission was denied
      if (error.name === 'NotAllowedError') {
        permissionDenied.value = true;
        isAskPermission.value = false;
        toast.error(t('camera.permissionDenied') || 'Camera access was denied');
      } 
      // Otherwise might still be in Ask mode, wait for next attempt
      else if (permissionAttempts.value < 3) {
        toast.info(t('camera.tapToAllowCamera') || 'Tap to allow camera access');
      } else {
        // Max attempts reached, show gallery option instead
        isAskPermission.value = false;
        showGalleryAlways.value = true;
        toast.info(t('camera.galleryFallback') || 'Using gallery upload instead');
      }
    }
  } catch (error) {
    console.error('Error in triggering Safari permission:', error);
    attemptingPermission.value = false;
    
    // After multiple failed attempts, fall back to gallery
    if (permissionAttempts.value >= 3) {
      isAskPermission.value = false;
      showGalleryAlways.value = true;
      toast.info(t('camera.galleryFallback') || 'Using gallery upload instead');
    }
  }
}

// Request camera permission with improved handling for Safari/iOS
const requestCameraPermission = async () => {
  try {
    // Check if we're dealing with Safari/iOS with potential camera issues
    if (isSafariWithCameraIssues()) {
      // Check if mediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia not supported in this browser/device');
        showGalleryAlways.value = true;
        toast.info(t('camera.galleryFallback') || 'Using gallery upload instead');
        return;
      }
      
      // For Safari, initialize our special handling
      await initCamera();
    } else {
      // For other browsers, proceed normally
      await initCamera();
    }
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    // Instead of showing unsupported browser message, always provide gallery fallback
    showGalleryAlways.value = true;
    toast.info(t('camera.galleryFallback') || 'Using gallery upload instead');
  }
}

// Improved gallery opening function
const openGallery = () => {
  // For Safari/iOS with potential issues, use our enhanced method
  if (isSafariWithCameraIssues()) {
    forceOpenGallery();
    return;
  }
  
  // For other browsers, use normal approach
  if (fileInput.value) {
    fileInput.value.click();
  }
}

// Handle file selection with improved error handling
const handleFileSelect = (event) => {
  try {
    const file = event.target.files[0];
    if (!file) {
      console.log('No file selected');
      return;
    }
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error(t('camera.notAnImage') || 'Selected file is not an image');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      capturedImage.value = e.target.result;
      // If we have a stream active, stop it
      if (stream.value) {
        const tracks = stream.value.getTracks();
        tracks.forEach(track => track.stop());
        stream.value = null;
      }
    };
    reader.onerror = () => {
      toast.error(t('camera.fileReadError') || 'Error reading the selected file');
    };
    reader.readAsDataURL(file);
  } catch (error) {
    console.error('Error handling file selection:', error);
    toast.error(t('camera.fileSelectionError') || 'Error selecting file');
  }
}

// Clean up resources when component is unmounted
onBeforeUnmount(() => {
  if (galleryFallbackTimer.value) {
    clearTimeout(galleryFallbackTimer.value);
  }
  
  if (stream.value) {
    const tracks = stream.value.getTracks();
    tracks.forEach(track => track.stop());
    stream.value = null;
  }
});

// Component lifecycle
onMounted(async () => {
  try {
    await requestCameraPermission();
  } catch (error) {
    console.error('Error during component initialization:', error);
    // Fallback to gallery mode if camera initialization fails
    showGalleryAlways.value = true;
    toast.info(t('camera.galleryFallback') || 'Using gallery upload instead');
  }
})
</script>
