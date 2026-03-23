# SINTOMARIO.ORG - Configuración Manual Cloudflare

## ❌ **Error de Token Detectado**

El token de Cloudflare API está retornando error 403 - "Invalid access token". Esto puede ocurrir por varias razones:

### 🔍 **Causas Posibles**
1. **Token expirado o revocado**
2. **Permisos insuficientes del token**
3. **Token copiado incorrectamente**
4. **Formato del token incorrecto**

---

## 🔧 **Solución: Configuración Manual**

### 🌐 **Paso 1: Acceder a Cloudflare Dashboard**
1. Ve a: https://dash.cloudflare.com/
2. Inicia sesión con tu cuenta
3. Selecciona el dominio: `sintomario.org`

### 📍 **Paso 2: Configurar Registros DNS**
1. Ve a **DNS** > **Records**
2. **Eliminar registros existentes** (si hay alguno)
3. **Añadir 4 registros A**:

   | Tipo | Nombre | Contenido | TTL | Proxy |
   |------|--------|-----------|-----|-------|
   | A | sintomario.org | 185.199.108.153 | Auto | Activado |
   | A | sintomario.org | 185.199.109.153 | Auto | Activado |
   | A | sintomario.org | 185.199.110.153 | Auto | Activado |
   | A | sintomario.org | 185.199.111.153 | Auto | Activado |

4. **Añadir 1 registro CNAME**:

   | Tipo | Nombre | Contenido | TTL | Proxy |
   |------|--------|-----------|-----|-------|
   | CNAME | www | sintomario.github.io | Auto | Activado |

### 🔒 **Paso 3: Configurar SSL/TLS**
1. Ve a **SSL/TLS** > **Overview**
2. Selecciona **Full (Strict)**
3. Activa **Always Use HTTPS**
4. Configura **HSTS** si está disponible

---

## 🔄 **Verificación Post-Configuración**

### 🔍 **Comandos de Verificación**
```bash
# Verificar registros DNS
nslookup sintomario.org
nslookup www.sintomario.org

# Verificar certificado SSL
curl -I https://sintomario.org
curl -I https://www.sintomario.org

# Verificar propagación (más detallado)
dig sintomario.org A
dig www.sintomario.org CNAME
```

### 🌐 **Verificación en Navegador**
1. **Esperar 15-30 minutos** para propagación DNS
2. Abrir: https://sintomario.org
3. Abrir: https://www.sintomario.org
4. Verificar certificado SSL (candado verde)

---

## 🚀 **Configuración GitHub Pages**

### 📝 **Verificar CNAME**
El archivo `public/CNAME` ya está configurado con:
```
sintomario.github.io
```

### 🔄 **Verificar Deploy**
1. Ve a: https://github.com/sintomario/SINTOMARIO.ORG
2. Ve a **Settings** > **Pages**
3. Verifica que el dominio esté configurado
4. Espera deploy automático

---

## 📊 **Troubleshooting**

### ❌ **Si los registros DNS no funcionan**
1. **Verifica los IPs de GitHub Pages**:
   - Las IPs pueden cambiar ocasionalmente
   - Verifica en: https://docs.github.com/en/pages/

2. **Limpia caché DNS**:
   ```bash
   # Windows
   ipconfig /flushdns
   
   # macOS/Linux
   sudo dscacheutil -flushcache
   ```

3. **Usa diferentes DNS servers**:
   - Google: 8.8.8.8
   - Cloudflare: 1.1.1.1

### ❌ **Si el certificado SSL no funciona**
1. **Verifica que el proxy esté activado** en Cloudflare
2. **Espera más tiempo** para propagación SSL
3. **Verifica modo SSL/TLS** esté en "Full (Strict)"

---

## 🎯 **Checklist Final**

### ✅ **Configuración DNS**
- [ ] 4 registros A configurados
- [ ] 1 registro CNAME configurado
- [ ] Proxy naranja activado
- [ ] TTL en Automático

### ✅ **Configuración SSL**
- [ ] Modo Full (Strict) activado
- [ ] Always Use HTTPS activado
- [ ] HSTS configurado (si disponible)

### ✅ **Verificación**
- [ ] Propagación DNS completada
- [ ] Acceso a https://sintomario.org
- [ ] Acceso a https://www.sintomario.org
- [ ] Certificado SSL válido
- [ ] GitHub Pages deploy activo

---

## 🚀 **Estado Actual**

**SINTOMARIO.ORG necesita configuración manual de Cloudflare debido a problemas con el token API.**

### ✅ **Listo para Configurar**
- Instrucciones detalladas proporcionadas
- IPs de GitHub Pages verificadas
- Proceso paso a paso documentado

### 🔄 **Pendiente**
- Configuración manual en Cloudflare Dashboard
- Verificación de propagación DNS
- Testeo de acceso y certificado SSL

**Sigue los pasos manuales y el sitio estará funcionando en 30 minutos.** 🚀
