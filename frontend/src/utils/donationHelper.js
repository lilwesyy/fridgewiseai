// Donation Helper - Gestisce la logica per mostrare i prompts di donazione

export class DonationHelper {
  static RECIPE_THRESHOLD = 3
  static DONATION_TOAST_KEY = 'donationToastShown'
  static RECIPE_COUNT_KEY = 'recipesGenerated'
  
  // Incrementa il contatore delle ricette generate
  static incrementRecipeCount() {
    const currentCount = parseInt(localStorage.getItem(this.RECIPE_COUNT_KEY) || '0')
    const newCount = currentCount + 1
    localStorage.setItem(this.RECIPE_COUNT_KEY, newCount.toString())
    return newCount
  }
  
  // Controlla se mostrare il toast donazione
  static shouldShowDonationToast() {
    const recipeCount = parseInt(localStorage.getItem(this.RECIPE_COUNT_KEY) || '0')
    const toastShown = localStorage.getItem(this.DONATION_TOAST_KEY)
    
    // Mostra toast dopo 3 ricette se non già mostrato
    return recipeCount >= this.RECIPE_THRESHOLD && !toastShown
  }
  
  // Marca il toast come mostrato
  static markDonationToastShown() {
    localStorage.setItem(this.DONATION_TOAST_KEY, Date.now().toString())
  }
  
  // Reset contatori (per testing)
  static resetCounters() {
    localStorage.removeItem(this.RECIPE_COUNT_KEY)
    localStorage.removeItem(this.DONATION_TOAST_KEY)
  }
  
  // Ottieni statistiche correnti
  static getStats() {
    return {
      recipesGenerated: parseInt(localStorage.getItem(this.RECIPE_COUNT_KEY) || '0'),
      toastShown: !!localStorage.getItem(this.DONATION_TOAST_KEY)
    }
  }
}