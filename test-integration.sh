#!/bin/bash

# 🧪 Test Script per Recognize Anything API Integration
# Questo script verifica che l'integrazione funzioni correttamente

echo "🔍 Testing FridgeWiseAI - Recognize Anything API Integration"
echo "============================================================"

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funzione per stampare test risultati
print_test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Funzione per test HTTP
test_http() {
    local url=$1
    local name=$2
    local expected_status=${3:-200}
    
    echo -n "Testing $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅ OK ($response)${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL ($response)${NC}"
        return 1
    fi
}

# Test 1: Verifica che Docker Compose sia in esecuzione
echo -e "\n${YELLOW}🐳 Testing Docker Services${NC}"
echo "----------------------------"

# Verifica se docker-compose è installato
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose not found${NC}"
    exit 1
fi

# Verifica servizi in esecuzione
echo "Checking running services..."
docker-compose ps

# Test 2: Verifica MongoDB
echo -e "\n${YELLOW}🗄️ Testing MongoDB${NC}"
echo "-------------------"

test_http "http://localhost:27017" "MongoDB Connection" 200
mongodb_status=$?

# Test 3: Verifica Recognize Anything API
echo -e "\n${YELLOW}🧠 Testing Recognize Anything API${NC}"
echo "-----------------------------------"

# Verifica che il container sia in esecuzione
if docker-compose ps | grep -q "recognize-anything-api"; then
    echo -e "${GREEN}✅ Recognize Anything API container is running${NC}"
    
    # Test endpoint health (se disponibile)
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Health endpoint accessible${NC}"
    else
        echo -e "${YELLOW}⚠️ Health endpoint not available (this is normal)${NC}"
    fi
    
    # Test memoria disponibile
    memory_usage=$(docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}" | grep recognize-anything-api)
    if [ -n "$memory_usage" ]; then
        echo -e "${GREEN}✅ Memory usage: $memory_usage${NC}"
    fi
    
    recognize_api_status=0
else
    echo -e "${RED}❌ Recognize Anything API container not running${NC}"
    recognize_api_status=1
fi

# Test 4: Test immagine di esempio
echo -e "\n${YELLOW}📸 Testing Image Recognition${NC}"
echo "-----------------------------"

# Crea un'immagine di test base64 (1x1 pixel PNG)
test_image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAHlWP5YIgAAAABJRU5ErkJggg=="

# Crea file JSON temporaneo per test
cat > /tmp/test_image.json << EOF
{
  "image": "$test_image"
}
EOF

# Test diretto all'API Recognize Anything (se disponibile)
if [ $recognize_api_status -eq 0 ]; then
    echo "Testing direct API call..."
    
    # Crea un file immagine di test
    echo "Creating test image..."
    test_image_file="/tmp/test_food.jpg"
    
    # Crea un'immagine di test semplice (richiede ImageMagick)
    if command -v convert &> /dev/null; then
        convert -size 100x100 xc:red "$test_image_file" 2>/dev/null
        
        if [ -f "$test_image_file" ]; then
            echo "Testing image recognition..."
            response=$(curl -s -X POST -F "file=@$test_image_file" http://localhost:8000/ 2>/dev/null)
            
            if [ -n "$response" ]; then
                echo -e "${GREEN}✅ Image recognition API responded${NC}"
                echo "Response preview: $(echo "$response" | head -c 100)..."
            else
                echo -e "${RED}❌ No response from image recognition API${NC}"
            fi
            
            # Cleanup
            rm -f "$test_image_file"
        else
            echo -e "${YELLOW}⚠️ Could not create test image${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️ ImageMagick not available for image test${NC}"
    fi
fi

# Test 5: Test Backend API (se disponibile)
echo -e "\n${YELLOW}🖥️ Testing Backend API${NC}"
echo "------------------------"

# Verifica se il backend è in esecuzione
if pgrep -f "node.*server.js" > /dev/null || pgrep -f "nodemon" > /dev/null; then
    echo -e "${GREEN}✅ Backend process is running${NC}"
    
    # Test endpoint backend (richiede autenticazione)
    test_http "http://localhost:5000/api/auth/health" "Backend Health" 200
    backend_status=$?
else
    echo -e "${YELLOW}⚠️ Backend not running (start with: cd backend && npm run dev)${NC}"
    backend_status=1
fi

# Test 6: Test Frontend (se disponibile)
echo -e "\n${YELLOW}🌐 Testing Frontend${NC}"
echo "--------------------"

if pgrep -f "vite" > /dev/null || pgrep -f "npm.*dev" > /dev/null; then
    echo -e "${GREEN}✅ Frontend development server is running${NC}"
    
    test_http "http://localhost:3000" "Frontend" 200
    frontend_status=$?
else
    echo -e "${YELLOW}⚠️ Frontend not running (start with: cd frontend && npm run dev)${NC}"
    frontend_status=1
fi

# Test 7: Test integrazione completa
echo -e "\n${YELLOW}🔄 Testing Full Integration${NC}"
echo "----------------------------"

if [ $recognize_api_status -eq 0 ] && [ $backend_status -eq 0 ]; then
    echo -e "${GREEN}✅ Core services are ready for integration${NC}"
    
    # Suggerimenti per test manuali
    echo -e "\n${YELLOW}📋 Manual Testing Suggestions:${NC}"
    echo "1. Open http://localhost:3000 in your browser"
    echo "2. Navigate to Camera page"
    echo "3. Take a photo of food ingredients"
    echo "4. Verify ingredients are detected"
    echo "5. Generate recipes from detected ingredients"
    
else
    echo -e "${RED}❌ Some services are not ready${NC}"
fi

# Cleanup
rm -f /tmp/test_image.json

# Riassunto finale
echo -e "\n${YELLOW}📊 Test Summary${NC}"
echo "==============="

total_tests=0
passed_tests=0

tests=("MongoDB:$mongodb_status" "Recognize API:$recognize_api_status" "Backend:$backend_status" "Frontend:$frontend_status")

for test in "${tests[@]}"; do
    name=$(echo "$test" | cut -d: -f1)
    status=$(echo "$test" | cut -d: -f2)
    total_tests=$((total_tests + 1))
    
    if [ "$status" = "0" ]; then
        passed_tests=$((passed_tests + 1))
        echo -e "${GREEN}✅ $name${NC}"
    else
        echo -e "${RED}❌ $name${NC}"
    fi
done

echo -e "\nPassed: $passed_tests/$total_tests tests"

if [ $passed_tests -eq $total_tests ]; then
    echo -e "\n${GREEN}🎉 All tests passed! System is ready.${NC}"
    exit 0
else
    echo -e "\n${YELLOW}⚠️ Some tests failed. Check the output above.${NC}"
    exit 1
fi
