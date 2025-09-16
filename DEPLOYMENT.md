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

### Passo 1: Preparar o ambiente
```bash
# Conectar na VPS
ssh root@seu-ip-contabo

# Criar diretório do projeto
mkdir -p /opt/balcao-dos-funis
cd /opt/balcao-dos-funis
```

### Passo 2: Clonar o repositório
```bash
# Clonar via HTTPS
git clone https://github.com/ddiasmatt/balcao-dos-funis.git .

# Ou via SSH (se configurado)
git clone git@github.com:ddiasmatt/balcao-dos-funis.git .
```

### Passo 3: Configurar variáveis de ambiente
```bash
# Copiar arquivo de produção
cp .env.production .env

# Editar se necessário
nano .env
```

### Passo 4: Deploy via Docker Compose
```bash
# Build e start dos containers
docker-compose up -d --build

# Verificar logs
docker-compose logs -f balcao-dos-funis
```

### Passo 5: Verificar no Portainer
1. Acesse o Portainer da VPS
2. Vá em "Containers"
3. Verifique se o container `balcao-dos-funis` está rodando
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
```bash
cd /opt/balcao-dos-funis

# Pull das mudanças
git pull origin main

# Rebuild e restart
docker-compose down
docker-compose up -d --build
```

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