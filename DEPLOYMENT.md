# FridgeWise AI - Deployment Guide

## Docker Setup

### Development Environment

Per avviare l'applicazione in sviluppo:

```bash
# Avvia tutti i servizi
docker-compose up -d

# Visualizza i log
docker-compose logs -f

# Ferma i servizi
docker-compose down
```

### Production Environment

Per il deployment in produzione:

```bash
# Avvia con configurazione di produzione
docker-compose -f docker-compose.prod.yml up -d

# Ferma i servizi
docker-compose -f docker-compose.prod.yml down
```

## Configurazione Server Ubuntu

### 1. Installazione Docker

```bash
# Aggiorna il sistema
sudo apt update && sudo apt upgrade -y

# Installa Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER

# Installa Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Configurazione Firewall

```bash
# Configura UFW
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3. Setup SSL (Let's Encrypt)

```bash
# Installa Certbot
sudo apt install snapd
sudo snap install --classic certbot

# Genera certificati SSL
sudo certbot certonly --standalone -d your-domain.com

# Copia i certificati
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /path/to/project/nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem /path/to/project/nginx/ssl/key.pem
```

### 4. Configurazione Environment Variables

Crea il file `.env` nella directory `backend/`:

```env
# Database
MONGODB_URI=mongodb://mongodb:27017/fridgewiseai

# External APIs
RECOGNIZE_ANYTHING_API_URL=http://recognize-anything-api:8000
LIBRETRANSLATE_API_URL=http://libretranslate:5000

# JWT
JWT_SECRET=your-super-secure-jwt-secret-key

# Cloudinary (se utilizzato)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Other APIs
GEMINI_API_KEY=your-gemini-api-key
OPENROUTER_API_KEY=your-openrouter-api-key
```

## Deployment dal PC Locale al Server

### Opzione 1: Git + Docker Build sul Server

```bash
# Sul server
git clone https://github.com/your-username/fridgewiseai.git
cd fridgewiseai

# Configura le variabili d'ambiente
cp backend/.env.example backend/.env
# Modifica backend/.env con i tuoi valori

# Avvia i servizi
docker-compose -f docker-compose.prod.yml up -d --build
```

### Opzione 2: Docker Image Registry

```bash
# Sul PC locale - Build e push delle immagini
docker build -t your-registry/fridgewiseai-frontend:latest ./frontend
docker build -t your-registry/fridgewiseai-backend:latest ./backend

docker push your-registry/fridgewiseai-frontend:latest
docker push your-registry/fridgewiseai-backend:latest

# Sul server - Pull e avvia
docker pull your-registry/fridgewiseai-frontend:latest
docker pull your-registry/fridgewiseai-backend:latest
docker-compose -f docker-compose.prod.yml up -d
```

### Opzione 3: Rsync (per aggiornamenti rapidi)

```bash
# Dal PC locale
rsync -avz --exclude node_modules --exclude .git . user@server-ip:/path/to/fridgewiseai/

# Sul server
cd /path/to/fridgewiseai
docker-compose -f docker-compose.prod.yml up -d --build
```

## Monitoraggio e Manutenzione

### Logs

```bash
# Visualizza tutti i log
docker-compose logs -f

# Log di un servizio specifico
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Backup Database

```bash
# Backup MongoDB
docker exec fridgewiseai-mongo mongodump --out /data/backup

# Copia il backup
docker cp fridgewiseai-mongo:/data/backup ./backup-$(date +%Y%m%d)
```

### Aggiornamenti

```bash
# Aggiorna le immagini
docker-compose pull

# Riavvia con le nuove immagini
docker-compose up -d

# Rimuovi immagini vecchie
docker image prune -f
```

## Troubleshooting

### Problemi Comuni

1. **Errore di connessione al database**:
   - Verifica che MongoDB sia in esecuzione
   - Controlla le variabili d'ambiente

2. **Problemi SSL**:
   - Verifica che i certificati siano nel percorso corretto
   - Controlla i permessi dei file di certificato

3. **Errori di memoria**:
   - Aumenta la memoria disponibile per Docker
   - Ottimizza le immagini rimuovendo dipendenze non necessarie

### Comandi Utili

```bash
# Stato dei container
docker ps -a

# Utilizzo risorse
docker stats

# Spazio disco
docker system df

# Pulizia completa
docker system prune -a
```

## Sicurezza

### Checklist Sicurezza

- [ ] Firewall configurato (solo porte 80, 443, 22)
- [ ] SSL certificati installati
- [ ] Variabili d'ambiente sicure (JWT secret, API keys)
- [ ] Rate limiting configurato in Nginx
- [ ] Backup regolari del database
- [ ] Aggiornamenti di sicurezza del sistema
- [ ] Monitoraggio dei log

### Hardening Nginx

```bash
# Nascondere la versione di Nginx
server_tokens off;

# Configurare headers di sicurezza
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

## Performance

### Ottimizzazioni

1. **Nginx Caching**:
   - Abilitare cache per file statici
   - Configurare cache per API responses (dove appropriato)

2. **Database Optimization**:
   - Creare indici per query frequenti
   - Configurare connection pooling

3. **Container Optimization**:
   - Usare immagini multi-stage per ridurre dimensioni
   - Configurare health checks
   - Limitare risorse per container

### Monitoraggio

```bash
# Installa htop per monitoraggio sistema
sudo apt install htop

# Monitoraggio Docker
docker stats

# Monitoraggio spazio disco
df -h
```