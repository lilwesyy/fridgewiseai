#!/bin/bash

# MongoDB Docker Management Script for FridgeWiseAI

case "$1" in
  start)
    echo "🚀 Starting MongoDB container..."
    docker-compose up -d mongodb
    echo "✅ MongoDB is starting on http://localhost:27017"
    echo "📊 Database: fridgewiseai"
    ;;
  stop)
    echo "🛑 Stopping MongoDB container..."
    docker-compose stop mongodb
    echo "✅ MongoDB stopped"
    ;;
  restart)
    echo "🔄 Restarting MongoDB container..."
    docker-compose restart mongodb
    echo "✅ MongoDB restarted"
    ;;
  logs)
    echo "📋 MongoDB logs:"
    docker-compose logs -f mongodb
    ;;
  shell)
    echo "🐚 Connecting to MongoDB shell..."
    docker exec -it fridgewiseai-mongo mongosh fridgewiseai
    ;;
  status)
    echo "📊 MongoDB container status:"
    docker-compose ps mongodb
    ;;
  clean)
    echo "🧹 Cleaning MongoDB data (WARNING: This will delete all data!)"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      docker-compose down -v
      docker volume rm fridgewiseai_mongodb_data 2>/dev/null || true
      echo "✅ MongoDB data cleaned"
    else
      echo "❌ Operation cancelled"
    fi
    ;;
  *)
    echo "🍀 FridgeWiseAI MongoDB Management"
    echo ""
    echo "Usage: $0 {start|stop|restart|logs|shell|status|clean}"
    echo ""
    echo "Commands:"
    echo "  start   - Start MongoDB container"
    echo "  stop    - Stop MongoDB container" 
    echo "  restart - Restart MongoDB container"
    echo "  logs    - Show MongoDB logs"
    echo "  shell   - Connect to MongoDB shell"
    echo "  status  - Show container status"
    echo "  clean   - Remove all MongoDB data (destructive!)"
    echo ""
    exit 1
    ;;
esac
