# Deployment Guide - Balcão dos Funis

## Pré-requisitos

- VPS Contabo com Docker e Docker Compose instalados
- Traefik configurado como reverse proxy
- Portainer instalado para gerenciamento
- Domínio `balcao.ltvtribe.com.br` apontando para o IP da VPS

## Arquivos de Configuração

### 1. Dockerfile
Multi-stage build que:
- Constrói a aplicação React/TypeScript
- Serve via Nginx otimizado
- Inclui configurações de cache e segurança

### 2. docker-compose.yml
Configurado com:
- Labels Traefik para roteamento automático
- SSL/TLS automático via Let's Encrypt
- Redirecionamento HTTP → HTTPS
- Headers de segurança
- Rede externa do Traefik

### 3. nginx.conf
- Suporte ao React Router (SPA)
- Compressão gzip
- Cache para assets estáticos
- Headers de segurança

## Deploy no Contabo

### Opção 1: Deploy via CLI (Docker Compose Standalone)

#### Passo 1: Preparar o ambiente
```bash
# Conectar na VPS
ssh root@seu-ip-contabo

# Criar diretório do projeto
mkdir -p /opt/balcao-dos-funis
cd /opt/balcao-dos-funis
```

#### Passo 2: Clonar o repositório
```bash
# Clonar via HTTPS
git clone https://github.com/ddiasmatt/balcao-dos-funis.git .

# Ou via SSH (se configurado)
git clone git@github.com:ddiasmatt/balcao-dos-funis.git .
```

#### Passo 3: Configurar variáveis de ambiente
```bash
# Copiar arquivo de produção
cp .env.production .env

# Editar se necessário
nano .env
```

#### Passo 4: Deploy via Docker Compose
```bash
# Build e start dos containers
docker-compose up -d --build

# Verificar logs
docker-compose logs -f balcao-dos-funis
```

### Opção 2: Deploy via Portainer (Docker Swarm) - Método Git Repository

#### Passo 1: Preparar VPS e Configurar GitHub Registry
```bash
# Conectar na VPS
ssh root@seu-ip-contabo

# Verificar se rede traefik existe no Swarm
docker network ls | grep traefik

# Se não existir, criar rede traefik no Swarm
docker network create --driver overlay traefik

# Fazer login no GitHub Container Registry
# (use um Personal Access Token com permissão packages:read)
echo "SEU_GITHUB_TOKEN" | docker login ghcr.io -u SEU_USUARIO --password-stdin
```

**Importante**: A imagem Docker será construída automaticamente pelo GitHub Actions e disponibilizada em `ghcr.io/ddiasmatt/balcao-dos-funis:main`

#### Passo 2: Deploy via Portainer Web UI
1. Acesse `https://portainer.ltvtribe.com.br`
2. Faça login com suas credenciais
3. Clique em **"Stacks"** no menu lateral
4. Clique em **"Add stack"**
5. Nome do stack: `balcao-dos-funis`

#### Passo 3: Configurar Git Repository
1. Selecione **"Git repository"**
2. **Repository URL**: `https://github.com/ddiasmatt/balcao-dos-funis`
3. **Reference**: `refs/heads/main`
4. **Compose path**: `docker-compose.swarm.yml`
5. **Auto-update**: Deixe desmarcado (ou configure conforme necessário)

#### Passo 4: Configurar Environment Variables
Na seção **"Environment variables"**, adicione:
- **Nome**: `VITE_SUPABASE_URL` → **Valor**: `https://db.ltvtribe.com.br`
- **Nome**: `VITE_SUPABASE_PUBLISHABLE_KEY` → **Valor**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### Passo 5: Deploy
1. Clique em **"Deploy the stack"**
2. Aguarde o download da imagem e deploy (alguns minutos na primeira vez)
3. Monitore logs na interface do Portainer

**Nota**: Se der erro de imagem não encontrada, certifique-se de que:
- O GitHub Actions executou com sucesso (check na aba Actions do repositório)
- A imagem foi publicada em `ghcr.io/ddiasmatt/balcao-dos-funis:main`
- O login no registry foi feito na VPS

### Passo 6: Verificar no Portainer
1. Acesse o Portainer da VPS
2. Vá em "Containers" ou "Services" (para Swarm)
3. Verifique se o container/service `balcao-dos-funis` está rodando
4. Monitore logs e recursos

## Verificação do Deploy

### 1. Verificar container
```bash
docker ps | grep balcao
docker logs balcao-dos-funis
```

### 2. Testar conectividade
```bash
# Testar HTTP (deve redirecionar para HTTPS)
curl -I http://balcao.ltvtribe.com.br

# Testar HTTPS
curl -I https://balcao.ltvtribe.com.br
```

### 3. Verificar no navegador
- Acesse: https://balcao.ltvtribe.com.br
- Verifique se carrega corretamente
- Teste o login com webhooks

## Atualizações

### Deploy de nova versão

**Via Docker Compose (CLI):**
```bash
cd /opt/balcao-dos-funis

# Pull das mudanças
git pull origin main

# Rebuild e restart
docker-compose down
docker-compose up -d --build
```

**Via Portainer (Swarm) - Método Git Repository:**
No Portainer:
1. Vá em **"Stacks"**
2. Clique no stack **"balcao-dos-funis"**  
3. Clique **"Update the stack"**
4. Clique **"Pull and redeploy"** (para puxar as últimas mudanças do Git)
5. Clique **"Update"**

Obs: O Portainer automaticamente fará o pull do repositório Git e rebuild da aplicação.

### Rollback rápido
```bash
# Voltar para commit anterior
git reset --hard HEAD~1
docker-compose down
docker-compose up -d --build
```

## Monitoramento

### Logs em tempo real
```bash
docker-compose logs -f balcao-dos-funis
```

### Uso de recursos
```bash
docker stats balcao-dos-funis
```

### Health check
```bash
curl -f https://balcao.ltvtribe.com.br || echo "Site down"
```

## Troubleshooting

### Container não inicia
```bash
# Verificar logs detalhados
docker-compose logs balcao-dos-funis

# Verificar build
docker-compose build --no-cache
```

### SSL não funciona
1. Verificar se domínio aponta para VPS
2. Verificar logs do Traefik
3. Verificar configuração do Let's Encrypt

### Webhook CORS em produção
- Em produção, os webhooks funcionam diretamente (sem proxy)
- URLs configuradas em `.env.production`

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