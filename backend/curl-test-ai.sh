#!/bin/bash

# AI Endpoints Test Script
# Make sure your NestJS server is running on http://localhost:3000

BASE_URL="http://localhost:3000/ai"

echo "=== Testing AI Endpoints ==="
echo ""

# 1. Health Check
echo "1. Testing Health Check..."
curl -X GET \
  "${BASE_URL}/health" \
  -H "Content-Type: application/json"
echo -e "\n"

# 2. Generate Text
echo "2. Testing Generate Text..."
curl -X POST \
  "${BASE_URL}/generate-text" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a short description about Vietnamese food"
  }'
echo -e "\n"

# 3. Semantic Search
echo "3. Testing Semantic Search..."
curl -X POST \
  "${BASE_URL}/semantic-search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Vietnamese pho recipe"
  }'
echo -e "\n"

# 4. Embed Text
echo "4. Testing Embed Text..."
curl -X POST \
  "${BASE_URL}/embed" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Pho is a Vietnamese soup consisting of broth, rice noodles, herbs, and meat"
  }'
echo -e "\n"

# 5. Embed Text with custom embedder
echo "5. Testing Embed Text with custom embedder..."
curl -X POST \
  "${BASE_URL}/embed" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Banh mi is a Vietnamese sandwich",
   
  }'
echo -e "\n"

# 6. Batch Embed
echo "6. Testing Batch Embed..."
curl -X POST \
  "${BASE_URL}/batch-embed" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [
      "Vietnamese pho soup",
      "Banh mi sandwich", 
      "Spring rolls with dipping sauce",
      "Vietnamese coffee with condensed milk"
    ]
  }'
echo -e "\n"

# 7. Batch Embed with custom embedder
echo "7. Testing Batch Embed with custom embedder..."
curl -X POST \
  "${BASE_URL}/batch-embed" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [
      "Cao lau noodles",
      "Bun bo hue soup"
    ],
   
  }'
echo -e "\n"

# 8. Summarize Text
echo "8. Testing Summarize Text..."
curl -X POST \
  "${BASE_URL}/summarize" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Vietnamese cuisine encompasses the foods and beverages of Vietnam, and features a combination of five fundamental tastes in overall meals. Each Vietnamese dish has a distinctive flavor which reflects one or more of these elements. Common ingredients include fish sauce, shrimp paste, soy sauce, rice, fresh herbs, fruit and vegetables. Vietnamese recipes use lemongrass, ginger, mint, Vietnamese mint, long coriander, Saigon cinnamon, bird eye chili, lime, and Thai basil leaves. Traditional Vietnamese cooking is greatly admired for its fresh ingredients, minimal use of dairy and oil, complementary textures, and reliance on herbs and vegetables."
  }'
echo -e "\n"

# 9. Summarize Text with max length
echo "9. Testing Summarize Text with max length..."
curl -X POST \
  "${BASE_URL}/summarize" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Vietnamese cuisine encompasses the foods and beverages of Vietnam, and features a combination of five fundamental tastes in overall meals. Each Vietnamese dish has a distinctive flavor which reflects one or more of these elements. Common ingredients include fish sauce, shrimp paste, soy sauce, rice, fresh herbs, fruit and vegetables. Vietnamese recipes use lemongrass, ginger, mint, Vietnamese mint, long coriander, Saigon cinnamon, bird eye chili, lime, and Thai basil leaves.",
    "maxLength": 50
  }'
echo -e "\n"

echo "=== All AI endpoint tests completed ==="
