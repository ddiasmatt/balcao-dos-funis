#!/bin/bash

# Script para build da imagem Docker para deploy no Swarm
# Execute este script na VPS antes de fazer o deploy no Portainer

echo "🔧 Iniciando build da imagem Docker..."

# Verificar se estamos no diretório correto
if [ ! -f "Dockerfile" ]; then
    echo "❌ Erro: Dockerfile não encontrado. Execute este script no diretório raiz do projeto."
    exit 1
fi

# Build da imagem
echo "📦 Fazendo build da imagem..."
docker build -t balcao-dos-funis:latest .

if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
    echo "📋 Imagem criada: balcao-dos-funis:latest"
    echo ""
    echo "🚀 Próximos passos:"
    echo "1. Vá para o Portainer"
    echo "2. Crie um novo Stack"
    echo "3. Use o arquivo docker-compose.swarm.yml"
    echo "4. Faça o deploy"
else
    echo "❌ Erro durante o build da imagem"
    exit 1
fi