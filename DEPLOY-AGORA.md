# 🚀 DEPLOY IMEDIATO - Balcão dos Funis

## **✅ STATUS: PRONTO PARA DEPLOY!**

Todas as configurações foram implementadas e commitadas. O projeto está preparado para deploy no Portainer + Traefik.

---

## **📋 PRÓXIMOS PASSOS PARA FAZER O DEPLOY:**

### **PASSO 1: Push para GitHub (AGORA!)**
```bash
# Execute este comando para fazer push e triggerar o CI/CD:
git push origin main
```

**O que acontece:**
- ✅ GitHub Actions vai buildar a aplicação
- ✅ Vai criar e publicar imagem Docker em `ghcr.io/ddiasmatt/balcao-dos-funis:latest`
- ✅ Imagem ficará disponível para o Portainer usar

### **PASSO 2: Verificar GitHub Actions**
1. Acesse: `https://github.com/ddiasmatt/balcao-dos-funis/actions`
2. Verifique se o workflow "Build and Deploy" está executando
3. Aguarde até aparecer ✅ verde (cerca de 3-5 minutos)

### **PASSO 3: Deploy no Portainer**
1. **Acesse Portainer:** `https://portainer.ltvtribe.com.br`
2. **Login** com suas credenciais
3. **Stacks** → **Add stack**
4. **Nome do stack:** `balcao-dos-funis-producao`
5. **Build method:** `Web editor`

6. **Cole este docker-compose:**
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

7. **Environment Variables:** (opcional)
```
VERSION=latest
DOMAIN=app.ltvtribe.com.br
```

8. **Deploy Options:**
   - ✅ Enable auto-update
   - ✅ Prune services

9. **Clique "Deploy the stack"**

---

## **⏱️ TIMELINE ESPERADO:**

- **0-2 min:** GitHub Actions executando
- **2-5 min:** Build da imagem Docker
- **5-7 min:** Push para GitHub Container Registry
- **7-10 min:** Deploy no Portainer
- **10-12 min:** Download da imagem no servidor
- **12-15 min:** SSL certificate generation (primeira vez)

**🎯 Total: ~15 minutos até estar online**

---

## **🎉 VERIFICAÇÃO FINAL:**

Após deploy, a aplicação estará disponível em:
**https://app.ltvtribe.com.br**

### Comandos para verificar no servidor:
```bash
# Verificar serviços rodando
docker service ls | grep balcao

# Ver logs em tempo real
docker service logs balcao-dos-funis-producao_balcao-dos-funis -f

# Testar HTTPS
curl -I https://app.ltvtribe.com.br
```

---

## **🚨 SE ALGO DER ERRADO:**

### 1. GitHub Actions falhou?
- Verifique na aba Actions do GitHub
- Problemas comuns: lint errors, build failures

### 2. Imagem não encontrada no Portainer?
- Verifique se o workflow completou com sucesso
- Aguarde alguns minutos para propagação

### 3. 404 no site?
- Verifique logs do Traefik
- Confirme que rede `traefik-public` existe

### 4. SSL não funciona?
- Pode levar alguns minutos na primeira vez
- Verifique se porta 80 está acessível

---

## **🔄 PARA FUTURAS ATUALIZAÇÕES:**

Depois do primeiro deploy, updates são automáticos:
1. Faça commit no branch `main`
2. GitHub Actions atualiza automaticamente
3. (Opcional) Configure webhook para auto-deploy

---

**🚀 AGORA É SÓ EXECUTAR! BOA SORTE!**