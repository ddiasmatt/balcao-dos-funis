# 🚀 GUIA DEFINITIVO: Deploy Balcão dos Funis - Portainer + Traefik

Este projeto foi configurado seguindo as melhores práticas para deploy em Docker Swarm com Portainer e Traefik.

## 📋 Pré-requisitos

- Docker Swarm inicializado
- Traefik configurado como reverse proxy
- Portainer instalado para gerenciamento
- Rede `traefik-public` criada no Swarm
- Domínio `app.ltvtribe.com.br` apontando para o IP do servidor

## 📁 Estrutura do Projeto

```
balcao-dos-funis/
├── src/                         # Código fonte React
├── public/                      # Assets públicos
├── Dockerfile                   # Build otimizado multi-stage
├── nginx.conf                   # Configuração Nginx para SPA
├── docker-compose.yml           # Desenvolvimento local
├── docker-compose.swarm.yml     # Deploy produção (Portainer)
├── .github/workflows/deploy.yml # CI/CD automatizado
├── .env.example                 # Variáveis de ambiente
└── DEPLOYMENT.md               # Este guia

```

## ⚙️ Configurações Implementadas

### 🐳 Dockerfile Otimizado
- Multi-stage build (Node.js + Nginx)
- Produção com `npm ci --only=production`
- Nginx Alpine para menor tamanho
- Health checks integrados

### 🌐 Nginx.conf para React Router
- Suporte completo a SPA (try_files)
- Compressão gzip automática
- Cache inteligente para assets
- Headers de segurança aplicados

### 🔧 Docker Compose Swarm (Produção)
- **Configuração Traefik CORRETA** seguindo melhores práticas
- Router unificado (não separar HTTP/HTTPS)
- Rede `traefik-public` padronizada
- Health checks e resource limits
- Environment variables configuráveis

### 🚀 GitHub Actions CI/CD
- Build e push automático para GHCR
- Multi-architecture (amd64/arm64)
- Trigger webhook Portainer
- Cache otimizado

## 🔧 PASSO A PASSO: Deploy no Portainer

### 🛠️ 1. Preparação do Ambiente

#### Criar rede Traefik (uma vez só)
```bash
# Conectar no servidor
ssh root@seu-servidor

# Criar rede do Traefik no Swarm
docker network create --driver=overlay --attachable traefik-public

# Verificar se foi criada
docker network ls | grep traefik-public
```

### 🐳 2. Deploy via Portainer Stack

#### Passo A: Acessar Portainer
1. Acesse o Portainer: `https://portainer.seudominio.com`
2. Faça login com suas credenciais
3. Selecione o endpoint do Docker Swarm

#### Passo B: Criar Nova Stack
1. Clique em **"Stacks"** no menu lateral
2. Clique em **"Add stack"**
3. **Nome do stack**: `balcao-dos-funis-producao`

#### Passo C: Configurar Stack
1. **Build method**: `Web editor`
2. Cole o conteúdo do arquivo `docker-compose.swarm.yml`:

```yaml
version: '3.8'

networks:
  traefik-public:
    external: true

services:
  balcao-dos-funis:
    image: ghcr.io/ddiasmatt/balcao-dos-funis:${VERSION:-latest}
    networks:
      - traefik-public
    deploy:
      replicas: 2
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
      labels:
        # ✅ CONFIGURAÇÃO CORRETA DO TRAEFIK
        - "traefik.enable=true"
        - "traefik.docker.network=traefik-public"

        # ✅ PORTA OBRIGATÓRIA NO SWARM
        - "traefik.http.services.balcao-dos-funis.loadbalancer.server.port=80"

        # ✅ ROUTER UNIFICADO
        - "traefik.http.routers.balcao-dos-funis.rule=Host(`${DOMAIN:-app.ltvtribe.com.br}`)"
        - "traefik.http.routers.balcao-dos-funis.entrypoints=web,websecure"
        - "traefik.http.routers.balcao-dos-funis.tls=true"
        - "traefik.http.routers.balcao-dos-funis.tls.certresolver=letsencryptresolver"

        # ✅ MIDDLEWARES
        - "traefik.http.middlewares.balcao-dos-funis-compress.compress=true"
        - "traefik.http.routers.balcao-dos-funis.middlewares=balcao-dos-funis-compress"
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
```

#### Passo D: Environment Variables
Na seção **"Environment variables"**:
```
VERSION=latest
DOMAIN=app.ltvtribe.com.br
```

#### Passo E: Deploy Options
- ✅ **Enable auto-update** (via webhook)
- ✅ **Prune services**

#### Passo F: Deploy
1. Clique em **"Deploy the stack"**
2. Aguarde o download da imagem (alguns minutos na primeira vez)
3. Monitore logs na interface do Portainer

## ✅ 3. Verificação do Deploy

### Checklist de Validação
```bash
# 1. Verificar se o serviço está rodando
docker service ls | grep balcao

# 2. Verificar logs
docker service logs balcao-dos-funis-producao_balcao-dos-funis -f

# 3. Verificar certificado SSL
curl -I https://app.ltvtribe.com.br

# 4. Verificar se Traefik vê o serviço
# (acessar dashboard do Traefik)

# 5. Verificar health check
curl -f https://app.ltvtribe.com.br || echo "Site down"
```

### Verificar no Navegador
- ✅ Acesse: `https://app.ltvtribe.com.br`
- ✅ Verifica se carrega sem erros
- ✅ Teste funcionalidades principais
- ✅ Verifique console do navegador (sem erros)

## 🔄 4. Atualizações e CI/CD

### 🚀 Fluxo Automático (GitHub Actions)
1. **Fazer commit** no branch `main`
2. **GitHub Actions** executa automaticamente:
   - Build da aplicação
   - Build e push da imagem Docker
   - Trigger do webhook do Portainer
3. **Portainer** atualiza automaticamente o serviço

### 📱 Webhook para Auto-Deploy

#### Configurar no Portainer:
1. Stack → Settings → Webhooks
2. Copiar URL do webhook

#### Configurar no GitHub:
1. Repository → Settings → Secrets and variables → Actions
2. Adicionar secret: `PORTAINER_WEBHOOK_URL` = URL copiada

### 🔧 Deploy Manual via Portainer
1. Vá em **"Stacks"**
2. Clique no stack **"balcao-dos-funis-producao"**
3. Clique **"Update"**
4. Altere a versão em Environment Variables se necessário
5. Clique **"Update the stack"**

## 📊 5. Monitoramento

### Logs em Tempo Real
```bash
# Via Docker (no servidor)
docker service logs balcao-dos-funis-producao_balcao-dos-funis -f

# Via Portainer Web UI
# Stacks → balcao-dos-funis-producao → Services → Logs
```

### Métricas de Performance
```bash
# Uso de recursos dos containers
docker stats

# Verificar health checks
docker service ps balcao-dos-funis-producao_balcao-dos-funis
```

## 🚨 6. Troubleshooting

### Problema: 404 Not Found
```bash
# Verificar labels do serviço
docker service inspect balcao-dos-funis-producao_balcao-dos-funis --pretty

# Verificar rede
docker network ls | grep traefik-public
```
**Solução**: Labels DEVEM estar sob `deploy:` no docker-compose.swarm.yml

### Problema: SSL não funciona
```bash
# Verificar logs do Traefik
docker service logs traefik_traefik 2>&1 | grep acme

# Verificar se porta 80 está acessível
curl -I http://app.ltvtribe.com.br
```

### Problema: Bad Gateway
```bash
# Verificar se serviços estão na mesma rede
docker service inspect balcao-dos-funis-producao_balcao-dos-funis | grep Networks

# Verificar health check
docker service ps balcao-dos-funis-producao_balcao-dos-funis
```

### Imagem não encontrada
```bash
# Verificar se GitHub Actions executou
# Repository → Actions → último workflow

# Login manual no registry
echo "$GITHUB_TOKEN" | docker login ghcr.io -u username --password-stdin
```

## Configuração do Traefik

Certifique-se que o Traefik está configurado com:

```yaml
# traefik.yml
certificatesResolvers:
  letsencrypt:
    acme:
      email: seu-email@exemplo.com
      storage: acme.json
      httpChallenge:
        entryPoint: web
```

## Backup

### Backup do código
```bash
tar -czf balcao-backup-$(date +%Y%m%d).tar.gz /opt/balcao-dos-funis
```

### Automatizar backup
```bash
# Crontab para backup diário
0 2 * * * tar -czf /backups/balcao-$(date +\%Y\%m\%d).tar.gz /opt/balcao-dos-funis
```

## Contatos de Suporte

- **Suporte LTV Tribe:**
  - WhatsApp: +55 45 99852-1679
  - Email: suporte@ltvtribe.com.br

- **Repositório:** https://github.com/ddiasmatt/balcao-dos-funis