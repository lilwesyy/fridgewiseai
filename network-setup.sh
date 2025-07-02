#!/bin/bash

# Network Setup Script for FridgeWiseAI
# Configura automaticamente l'accesso dalla rete locale

echo "🌐 FridgeWiseAI - Configurazione Rete Locale"
echo "============================================="
echo

# Rileva l'IP locale principale
LOCAL_IP=$(hostname -I | awk '{print $1}')

if [ -z "$LOCAL_IP" ]; then
    echo "❌ Impossibile rilevare l'IP locale"
    exit 1
fi

echo "🔍 IP locale rilevato: $LOCAL_IP"
echo "ℹ️  Il backend è sempre configurato per accettare connessioni da 0.0.0.0"
echo

case "$1" in
  frontend)
    # Configura solo il frontend per la rete
    FRONTEND_ENV="frontend/.env"
    if [ -f "$FRONTEND_ENV" ]; then
        echo "📝 Configurazione frontend per rete locale..."
        
        # Backup del file originale
        cp "$FRONTEND_ENV" "$FRONTEND_ENV.backup"
        
        # Sostituisce localhost con l'IP locale
        sed -i "s/VITE_API_BASE_URL=http:\/\/localhost:3001\/api/VITE_API_BASE_URL=http:\/\/$LOCAL_IP:3001\/api/" "$FRONTEND_ENV"
        sed -i "s/VITE_API_BASE_URL=http:\/\/[0-9.]*:3001\/api/VITE_API_BASE_URL=http:\/\/$LOCAL_IP:3001\/api/" "$FRONTEND_ENV"
        
        echo "✅ Frontend configurato per IP: $LOCAL_IP"
        echo "� Riavvia il frontend per applicare le modifiche"
    else
        echo "❌ File $FRONTEND_ENV non trovato"
    fi
    ;;
  
  restore)
    echo "🔄 Ripristino configurazione localhost..."
    FRONTEND_ENV="frontend/.env"
    if [ -f "$FRONTEND_ENV.backup" ]; then
        mv "$FRONTEND_ENV.backup" "$FRONTEND_ENV"
        echo "✅ Configurazione localhost ripristinata"
    else
        # Ripristina manualmente
        sed -i "s/VITE_API_BASE_URL=http:\/\/[0-9.]*:3001\/api/VITE_API_BASE_URL=http:\/\/localhost:3001\/api/" "$FRONTEND_ENV"
        echo "✅ Configurazione localhost ripristinata (manuale)"
    fi
    echo "🔄 Riavvia il frontend per applicare le modifiche"
    ;;
  
  info)
    echo "📊 Stato attuale della configurazione:"
    echo "   💻 IP locale: $LOCAL_IP"
    echo "   🔗 Backend: sempre accessibile da $LOCAL_IP:3001 (configurato su 0.0.0.0)"
    echo "   📱 Frontend: http://$LOCAL_IP:5173/"
    echo
    FRONTEND_ENV="frontend/.env"
    if [ -f "$FRONTEND_ENV" ]; then
        echo "🔧 Configurazione frontend attuale:"
        grep "VITE_API_BASE_URL" "$FRONTEND_ENV"
    fi
    ;;
  
  *)
    echo "� Il backend è sempre configurato per accettare connessioni da 0.0.0.0"
    echo "   Questo significa che è già accessibile da $LOCAL_IP:3001"
    echo
    echo "📱 Accesso diretto (backend già pronto):"
    echo "   Frontend: http://$LOCAL_IP:5173"
    echo "   Backend API: http://$LOCAL_IP:3001"
    echo
    echo "🛠️  Comandi disponibili:"
    echo "   $0 frontend  - Configura solo il frontend per la rete"
    echo "   $0 restore   - Ripristina configurazione localhost"
    echo "   $0 info      - Mostra informazioni attuali"
    echo
    echo "� Suggerimento: se vuoi che il frontend usi l'IP di rete"
    echo "   esegui: $0 frontend"
    ;;
esac
