# 🍳 FridgeWise AI

<div align="center">

![FridgeWise AI Logo](frontend/src/assets/black_simbol.svg)

**Trasforma gli ingredienti del tuo frigorifero in ricette deliziose con l'intelligenza artificiale**

[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://docker.com/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-green.svg)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green.svg)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[🌐 Demo Live](https://fridgewiseai.com) | [📖 Documentazione](docs/) | [🐛 Segnala Bug](https://github.com/your-repo/issues)

</div>

## 🌟 Panoramica

**FridgeWise AI** è un'applicazione web innovativa che rivoluziona il modo di cucinare. Utilizzando tecnologie di intelligenza artificiale all'avanguardia, l'app è in grado di:

- 📷 **Riconoscere ingredienti** dalle foto del tuo frigorifero
- 🤖 **Generare ricette personalizzate** basate su ciò che hai disponibile
- 🌍 **Tradurre automaticamente** ingredienti e ricette in 4 lingue
- 👨‍🍳 **Guidarti step-by-step** durante la cottura
- 💾 **Salvare le tue ricette** preferite per il futuro

## ✨ Funzionalità Principali

### 🔍 Riconoscimento Intelligente degli Ingredienti
- **AI-Powered Detection**: Utilizza il modello RAM+ per identificare oltre 6000 categorie di oggetti
- **Scansione Multi-Item**: Riconosce più ingredienti contemporaneamente in una singola foto
- **Traduzione Automatica**: Traduce ingredienti riconosciuti nella tua lingua preferita

### 🍽️ Generazione Ricette AI
- **Personalizzazione Avanzata**: Ricette basate sui tuoi ingredienti disponibili
- **Preferenze Dietetiche**: Supporto per vegetariano, vegano, senza glutine, keto, etc.
- **Difficoltà Scalabile**: Da principiante a chef esperto
- **Tempi di Cottura**: Ottimizzazione basata sul tempo disponibile

### 🌐 Supporto Multilingue
- **4 Lingue Supportate**: Italiano, Inglese, Francese, Tedesco
- **Detection Automatica**: Rileva automaticamente la lingua dall'IP geografico
- **Traduzione Real-time**: Interfaccia e contenuti tradotti istantaneamente

### 👨‍🍳 Modalità Cottura Avanzata
- **Guida Step-by-Step**: Istruzioni dettagliate per ogni fase
- **Timer Integrati**: Promemoria automatici per tempi di cottura
- **Progress Tracking**: Segui i tuoi progressi durante la preparazione

### 💫 Caratteristiche Social
- **Sistema Utenti**: Profili personalizzati con avatar
- **Ricette Salvate**: Organizza e gestisci le tue ricette preferite
- **Attività Recenti**: Cronologia delle tue sessioni di cucina
- **Sistema Donazioni**: Supporta lo sviluppo del progetto

## 🏗️ Architettura Tecnica

### 📱 Frontend (Vue.js 3)
```
frontend/
├── src/
│   ├── components/          # Componenti riutilizzabili
│   │   ├── ui/             # Sistema di design base
│   │   ├── layout/         # Layout e navigazione
│   │   └── features/       # Componenti specifici per funzionalità
│   ├── views/              # Pagine principali
│   │   ├── Home.vue        # Dashboard principale
│   │   ├── Camera.vue      # Scansione ingredienti
│   │   ├── Recipes.vue     # Generazione ricette
│   │   ├── SavedRecipes.vue # Ricette salvate
│   │   ├── CookingMode.vue # Modalità cottura
│   │   └── Profile.vue     # Gestione profilo
│   ├── stores/             # Gestione stato (Pinia)
│   ├── services/           # API e servizi esterni
│   ├── composables/        # Logica riutilizzabile
│   ├── assets/             # Risorse statiche
│   └── locales/            # File di traduzione
```

### 🔧 Backend (Node.js + Express)
```
backend/
├── src/
│   ├── controllers/        # Logica dei controller
│   │   ├── auth.js        # Autenticazione e autorizzazione
│   │   ├── recipes.js     # Gestione ricette
│   │   ├── ingredients.js # Riconoscimento ingredienti
│   │   └── activity.js    # Tracciamento attività
│   ├── models/            # Modelli database (Mongoose)
│   │   ├── User.js        # Schema utente
│   │   ├── Recipe.js      # Schema ricetta
│   │   └── Activity.js    # Schema attività
│   ├── middleware/        # Middleware personalizzati
│   ├── routes/            # Definizione route API
│   ├── services/          # Servizi business logic
│   │   ├── aiService.js   # Integrazione AI (Gemini/OpenRouter)
│   │   ├── translationService.js # Servizio traduzione
│   │   └── cloudinaryService.js  # Gestione immagini
│   └── utils/             # Utilità e helper
```

### 🗄️ Database (MongoDB)
```javascript
// Schema Utente
{
  name: String,
  email: String,
  password: String (hashed),
  avatar: String,
  preferences: {
    language: String,
    dietaryRestrictions: Array,
    cuisinePreferences: Array,
    difficulty: String,
    maxCookingTime: Number
  },
  stats: {
    totalRecipes: Number,
    totalScans: Number,
    savedRecipes: Number
  },
  supporter: {
    isSupporter: Boolean,
    supporterSince: Date,
    donationAmount: Number
  }
}

// Schema Ricetta
{
  title: String,
  description: String,
  ingredients: Array,
  instructions: Array,
  cookingTime: Object,
  difficulty: String,
  cuisine: String,
  tags: Array,
  nutrition: Object,
  generatedFrom: Object,
  createdBy: ObjectId,
  ratings: Object
}
```

## 🚀 Quick Start

### Prerequisiti
- Docker e Docker Compose
- Git
- Account Cloudinary (per storage immagini)
- API Key OpenRouter o Google Gemini

### 1. Clona il Repository
```bash
git clone https://github.com/your-username/fridgewiseai.git
cd fridgewiseai
```

### 2. Configurazione Environment
```bash
# Backend configuration
cp backend/.env.example backend/.env
```

Modifica `backend/.env` con le tue credenziali:
```env
MONGODB_URI=mongodb://mongodb:27017/fridgewiseai
JWT_SECRET=your-super-secret-jwt-key
OPENROUTER_API_KEY=sk-or-v1-your-api-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
LIBRETRANSLATE_API_URL=http://libretranslate:5000
NODE_ENV=development
```

### 3. Avvio in Sviluppo
```bash
# Avvia tutti i servizi
docker-compose up -d

# Verifica lo stato dei container
docker-compose ps
```

L'applicazione sarà disponibile su:
- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:3000
- **MongoDB**: localhost:27017

### 4. Avvio in Produzione
```bash
# Con configurazione ottimizzata per produzione
docker-compose -f docker-compose.prod.yml up -d
```

## 🐳 Servizi Docker

Il progetto utilizza una architettura microservizi con i seguenti container:

| Servizio | Porta | Descrizione |
|----------|-------|-------------|
| **frontend** | 80 | Applicazione Vue.js servita da Nginx |
| **backend** | 3000 | API Express.js |
| **mongodb** | 27017 | Database MongoDB |
| **recognize-api** | 8000 | Servizio AI per riconoscimento ingredienti |
| **libretranslate** | 5000 | Servizio di traduzione automatica |
| **nginx** | 80/443 | Reverse proxy (solo produzione) |

## 🔧 Sviluppo

### Setup Locale per Sviluppo
```bash
# Frontend
cd frontend
npm install
npm run dev  # Server di sviluppo con hot reload

# Backend
cd backend
npm install
npm run dev  # Server con nodemon per auto-restart
```

### Comandi Utili
```bash
# Logs dei container
docker-compose logs -f [service-name]

# Rebuild completo
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Accesso shell container
docker-compose exec backend sh
docker-compose exec frontend sh

# Backup database
docker-compose exec mongodb mongodump --out /tmp/backup
```

### Testing
```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm run test

# E2E tests
npm run test:e2e
```

## 📡 API Reference

### Autenticazione
```bash
# Registrazione
POST /api/auth/register
{
  "name": "Nome Utente",
  "email": "user@example.com",
  "password": "password123"
}

# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Profilo utente
GET /api/auth/me
Authorization: Bearer <jwt-token>
```

### Riconoscimento Ingredienti
```bash
# Scansione immagine
POST /api/ingredients/detect
Content-Type: multipart/form-data
Authorization: Bearer <jwt-token>

FormData: {
  image: <file>,
  language: "it" // opzionale
}
```

### Gestione Ricette
```bash
# Lista ricette
GET /api/recipes?page=1&limit=10&search=pasta
Authorization: Bearer <jwt-token>

# Creazione ricetta
POST /api/recipes
Authorization: Bearer <jwt-token>
{
  "ingredients": ["pomodoro", "basilico", "mozzarella"],
  "preferences": {
    "cuisine": "italiana",
    "difficulty": "facile",
    "maxTime": 30,
    "dietary": ["vegetarian"]
  }
}

# Salva ricetta
POST /api/recipes/:id/save
Authorization: Bearer <jwt-token>
```

## 🌍 Internazionalizzazione

Il progetto supporta 4 lingue con detection automatica:

- 🇮🇹 **Italiano** (predefinito)
- 🇬🇧 **English**
- 🇫🇷 **Français**
- 🇩🇪 **Deutsch**

### Aggiungere una Nuova Lingua

1. **Frontend**: Aggiungi file traduzione in `frontend/src/locales/`
2. **Backend**: Aggiorna dizionario ingredienti in `backend/src/data/`
3. **LibreTranslate**: Verifica supporto lingua nel servizio

## 🔐 Sicurezza

### Misure Implementate
- **JWT Authentication**: Token sicuri con scadenza configurabile
- **Password Hashing**: bcryptjs con salt per protezione password
- **Input Validation**: Validazione rigorosa con Joi su tutti gli endpoint
- **CORS Policy**: Configurazione restrittiva per ambiente produzione
- **Rate Limiting**: Protezione contro spam e attacchi DDoS
- **Security Headers**: Helmet.js per header di sicurezza HTTP

### Anti-Bot Protection
- **Honeypot Fields**: Campi nascosti per rilevare bot
- **Math CAPTCHA**: Verifica umana durante registrazione
- **Timing Analysis**: Rilevamento compilazione form troppo veloce
- **Behavioral Tracking**: Analisi pattern di interazione

## 📊 Monitoring & Analytics

### Logging
- **Request Logging**: Morgan per tracking richieste HTTP
- **Error Logging**: Sistema centralizzato per errori applicazione
- **Performance Monitoring**: Metriche tempo risposta API

### Health Checks
```bash
# Verifica stato applicazione
GET /health

# Stato database
GET /api/health/database

# Metriche sistema
GET /api/metrics
```

## 🤝 Contribuire

Benvenuti i contributi! Segui questi step:

1. **Fork** il repository
2. **Crea** un branch per la tua feature (`git checkout -b feature/amazing-feature`)
3. **Commit** le modifiche (`git commit -m 'Add amazing feature'`)
4. **Push** al branch (`git push origin feature/amazing-feature`)
5. **Apri** una Pull Request

### Guidelines
- Segui le convenzioni di codice esistenti
- Aggiungi test per nuove funzionalità
- Aggiorna la documentazione se necessario
- Usa commit messages descrittivi

## 🗺️ Roadmap

### 🔄 Prossime Versioni

#### v2.1 - Miglioramenti UX
- [ ] **Progressive Web App (PWA)**: Installazione come app nativa
- [ ] **Notifiche Push**: Reminder cottura e suggerimenti
- [ ] **Modalità Offline**: Funzionalità base senza connessione
- [ ] **Ricerca Vocale**: Controllo tramite comandi vocali

#### v2.2 - Social Features
- [ ] **Condivisione Ricette**: Share su social media
- [ ] **Community**: Sistema rating e recensioni
- [ ] **Sfide Culinarie**: Challenges settimanali
- [ ] **Marketplace**: Store per ingredienti speciali

#### v2.3 - AI Enhancement
- [ ] **Computer Vision Avanzata**: Riconoscimento stato ingredienti
- [ ] **Nutrizione AI**: Calcolo automatico valori nutrizionali
- [ ] **Suggerimenti Personalizzati**: ML per preferenze utente
- [ ] **Chatbot Culinario**: Assistente AI per domande cucina

#### v3.0 - Enterprise
- [ ] **Multi-tenant**: Supporto team e ristoranti
- [ ] **API Pubblica**: SDK per sviluppatori terzi
- [ ] **Analytics Dashboard**: Metriche avanzate uso app
- [ ] **White Label**: Versione brandizzabile

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi il file [LICENSE](LICENSE) per dettagli completi.

## 👥 Team

- **Mirco** - *Lead Developer* - [GitHub](https://github.com/mirco)

## 💖 Supporta il Progetto

Se FridgeWise AI ti è utile, considera di supportare lo sviluppo:

- ⭐ **Stella** questo repository
- 🐛 **Segnala bug** e richiedi feature
- 💰 **Dona** tramite l'app per aiutare i costi server
- 📢 **Condividi** con amici e famiglia

## 🙏 Ringraziamenti

Ringraziamo i seguenti progetti open-source:

- [Vue.js](https://vuejs.org/) - Framework frontend reattivo
- [Express.js](https://expressjs.com/) - Framework backend minimalista
- [MongoDB](https://mongodb.com/) - Database NoSQL flessibile
- [LibreTranslate](https://libretranslate.com/) - Traduzione open-source
- [Recognize Anything](https://recognize-anything.github.io/) - Modello AI recognition
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first

---

<div align="center">

**[🔝 Torna all'inizio](#-fridgewise-ai)**

Fatto con ❤️ e 🤖 AI • [fridgewiseai.com](https://fridgewiseai.com)

</div>