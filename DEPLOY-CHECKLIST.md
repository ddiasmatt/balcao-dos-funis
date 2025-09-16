# ✅ CHECKLIST DE DEPLOY - Balcão dos Funis

## **FASE 1: Verificar Pré-requisitos no Servidor**

### 1. Conectar no servidor e verificar Docker Swarm
```bash
# Conectar no servidor
ssh root@seu-servidor

# Verificar se Swarm está ativo
docker info | grep Swarm
# Deve mostrar: "Swarm: active"

# Se não estiver ativo, inicializar
docker swarm init
```

### 2. Verificar rede LTVTribeNet
```bash
# Verificar se rede existe (já existe no seu ambiente)
docker network ls | grep LTVTribeNet

# Rede LTVTribeNet já está configurada no seu Traefik
```

### 3. Verificar Traefik rodando
```bash
# Verificar serviços do Traefik
docker service ls | grep traefik

# Verificar logs do Traefik
docker service logs traefik_traefik --tail 50
```

### 4. Verificar Portainer
```bash
# Verificar se Portainer está rodando
docker service ls | grep portainer

# Testar acesso web
curl -I https://portainer.seudominio.com
```

## **FASE 2: Deploy via Portainer**

### 1. Acessar Portainer Web UI
- URL: `https://portainer.ltvtribe.com.br` (ou seu domínio)
- Login com credenciais administrativas

### 2. Criar Nova Stack
1. **Stacks** → **Add stack**
2. **Nome**: `balcao-dos-funis-producao`
3. **Build method**: `Web editor`

### 3. Colar docker-compose.swarm.yml
```yaml
version: '3.8'

networks:
  LTVTribeNet:
    external: true

services:
  balcao-dos-funis:
    image: ghcr.io/ddiasmatt/balcao-dos-funis:latest
    networks:
      - LTVTribeNet
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
        # Traefik Configuration
        - "traefik.enable=true"
        - "traefik.docker.network=LTVTribeNet"
        - "traefik.http.services.balcao-dos-funis.loadbalancer.server.port=80"
        - "traefik.http.routers.balcao-dos-funis.rule=Host(`app.ltvtribe.com.br`)"
        - "traefik.http.routers.balcao-dos-funis.entrypoints=web,websecure"
        - "traefik.http.routers.balcao-dos-funis.tls=true"
        - "traefik.http.routers.balcao-dos-funis.tls.certresolver=letsencryptresolver"
        - "traefik.http.middlewares.balcao-dos-funis-compress.compress=true"
        - "traefik.http.routers.balcao-dos-funis.middlewares=balcao-dos-funis-compress"
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 4. Environment Variables
```
VERSION=latest
DOMAIN=app.ltvtribe.com.br
```

### 5. Deploy Options
- ✅ **Enable auto-update** (para webhook)
- ✅ **Prune services**

## **FASE 3: Verificação Pós-Deploy**

### 1. Verificar serviços
```bash
# Listar serviços
docker service ls | grep balcao

# Verificar replicas
docker service ps balcao-dos-funis-producao_balcao-dos-funis

# Verificar logs
docker service logs balcao-dos-funis-producao_balcao-dos-funis -f
```

### 2. Testar conectividade
```bash
# Testar HTTP (deve redirecionar para HTTPS)
curl -I http://app.ltvtribe.com.br

# Testar HTTPS
curl -I https://app.ltvtribe.com.br

# Verificar certificado SSL
curl -vI https://app.ltvtribe.com.br 2>&1 | grep -E "(expire|issuer)"
```

### 3. Verificar no navegador
- ✅ Acessar: `https://app.ltvtribe.com.br`
- ✅ Verificar se carrega sem erros
- ✅ Testar funcionalidades principais
- ✅ Verificar console do navegador (F12)

## **TROUBLESHOOTING RÁPIDO**

### Problema: 404 Not Found
```bash
# Verificar labels do serviço
docker service inspect balcao-dos-funis-producao_balcao-dos-funis --format '{{json .Spec.Labels}}' | jq

# Verificar se está na rede correta
docker service inspect balcao-dos-funis-producao_balcao-dos-funis --format '{{json .Spec.TaskTemplate.Networks}}'
```

### Problema: SSL não funciona
```bash
# Verificar logs do Traefik sobre ACME
docker service logs traefik_traefik 2>&1 | grep -i acme | tail -10

# Verificar se porta 80 está acessível externamente
curl -I http://app.ltvtribe.com.br
```

### Problema: Container não inicia
```bash
# Verificar logs detalhados
docker service logs balcao-dos-funis-producao_balcao-dos-funis --details

# Verificar eventos do serviço
docker service ps balcao-dos-funis-producao_balcao-dos-funis --no-trunc
```

## **🎉 SUCESSO!**
Após completar todos os passos, a aplicação deve estar disponível em:
**https://app.ltvtribe.com.br**

Com:
- ✅ SSL/TLS automático via Let's Encrypt
- ✅ 2 replicas para alta disponibilidade
- ✅ Health checks funcionando
- ✅ Compressão gzip ativa
- ✅ Headers de segurança aplicados