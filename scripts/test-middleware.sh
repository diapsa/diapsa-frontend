#!/bin/bash

# Script de prueba del middleware de limpieza de URLs
# Ejecutar: bash test-middleware.sh

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URL base (cambiar según entorno)
BASE_URL="http://localhost:3000"

echo "=========================================="
echo "🧪 Test Suite - Middleware de URLs Spam"
echo "=========================================="
echo ""
echo "Base URL: $BASE_URL"
echo ""

# Contador de tests
TESTS_PASSED=0
TESTS_FAILED=0

# Función para test
test_url() {
    local url=$1
    local expected_status=$2
    local description=$3
    
    echo -n "Testing: $description... "
    
    # Hacer request con curl y capturar status code
    status=$(curl -s -o /dev/null -w "%{http_code}" -L "$url")
    
    if [ "$status" == "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (Status: $status)"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (Expected: $expected_status, Got: $status)"
        ((TESTS_FAILED++))
    fi
}

# Función para test de redirect
test_redirect() {
    local url=$1
    local expected_location=$2
    local description=$3
    
    echo -n "Testing: $description... "
    
    # Capturar status y Location header
    response=$(curl -s -I "$url")
    status=$(echo "$response" | grep -i "HTTP" | head -1 | awk '{print $2}')
    location=$(echo "$response" | grep -i "Location:" | awk '{print $2}' | tr -d '\r')
    
    if [ "$status" == "301" ] && [[ "$location" == *"$expected_location"* ]]; then
        echo -e "${GREEN}✓ PASS${NC} (301 → $location)"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (Expected 301 → $expected_location, Got: $status → $location)"
        ((TESTS_FAILED++))
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  Tests: Parámetros Spam (Expect 301)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

test_redirect "${BASE_URL}/cursos?m=1" "/cursos" "Param ?m= should redirect"
test_redirect "${BASE_URL}/productos?r=abc" "/productos" "Param ?r= should redirect"
test_redirect "${BASE_URL}/contacto?l=test" "/contacto" "Param ?l= should redirect"
test_redirect "${BASE_URL}/?_g=123" "/" "Param ?_g= should redirect"
test_redirect "${BASE_URL}/nosotros?w=xyz" "/nosotros" "Param ?w= should redirect"
test_url "${BASE_URL}/blog?fbclid=IwAR123" "200" "Param ?fbclid= should be preserved (attribution)"
test_url "${BASE_URL}/blog?utm_source=newsletter" "200" "UTM params should be preserved (attribution)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  Tests: Rutas Spam (Expect 404)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

test_url "${BASE_URL}/f/special/test" "404" "/f/special/* should be blocked"
test_url "${BASE_URL}/guide/something" "404" "/guide/* should be blocked"
test_url "${BASE_URL}/politician-test" "404" "/politician* should be blocked"
test_url "${BASE_URL}/mandate-123" "404" "/mandate* should be blocked"
test_url "${BASE_URL}/sponsor-abc" "404" "/sponsor* should be blocked"
test_url "${BASE_URL}/technical-docs" "404" "/technical* should be blocked"
test_url "${BASE_URL}/e/12345678/" "404" "/e/[numbers]/ should be blocked"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  Tests: Rutas Válidas (Expect 200 o 404 legítimo)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Nota: Algunas pueden dar 404 si no existen en la app, pero no deben dar 301
test_url "${BASE_URL}/" "200" "Homepage should work"
test_url "${BASE_URL}/cursos" "200" "/cursos should work"
test_url "${BASE_URL}/productos" "200" "/productos should work"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  Tests: Recursos Estáticos (No middleware)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

test_url "${BASE_URL}/favicon.ico" "200" "favicon.ico should bypass middleware"
test_url "${BASE_URL}/robots.txt" "200" "robots.txt should bypass middleware"

echo ""
echo "=========================================="
echo "📊 RESULTADOS"
echo "=========================================="
echo -e "${GREEN}✓ Tests Pasados: $TESTS_PASSED${NC}"
echo -e "${RED}✗ Tests Fallidos: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 TODOS LOS TESTS PASARON${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  ALGUNOS TESTS FALLARON - Revisar configuración${NC}"
    exit 1
fi
