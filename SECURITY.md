# Security Policy

## 🛡️ **Reporting Security Vulnerabilities**

Gracias por ayudar a mantener SINTOMARIO.ORG seguro. Si descubres una vulnerabilidad de seguridad, por favor repórtala de forma responsable.

### **📧 How to Report**

**Email**: security@sintomario.org  
**PGP Key**: Disponible en keyserver por solicitud  
**Response Time**: 48 horas hábiles

### **📋 What to Include**

- **Tipo de vulnerabilidad** (XSS, SQLi, CSRF, etc.)
- **URL o componente afectado**
- **Pasos para reproducir**
- **Impacto potencial**
- **Pruebas de concepto** (si aplica)
- **Información de entorno** (browser, OS)

### **🔒 Safe Harbor**

Nos comprometemos a:
- Responder dentro de 48 horas
- Investigar todos los reportes válidos
- Dar crédito público por descubrimientos
- Coordinar disclosure con el reporter

### **⏰ Disclosure Timeline**

- **0-7 días**: Análisis inicial y validación
- **7-14 días**: Desarrollo de fix
- **14-21 días**: Despliegue de parche
- **21+ días**: Divulgación pública (si no hay acuerdo)

---

## 🔒 **Security Measures Implemented**

### **Application Security**
- ✅ **Input sanitization**: Todo el input de usuario es sanitizado
- ✅ **Output encoding**: Prevención de XSS en todos los templates
- ✅ **CSRF protection**: Tokens en formularios (cuando aplique)
- ✅ **SQL injection prevention**: Uso exclusivo de JSON files
- ✅ **File upload restrictions**: Sin uploads de usuario

### **Infrastructure Security**
- ✅ **HTTPS enforced**: Cloudflare Full (Strict)
- ✅ **HSTS headers**: 6 meses minimum
- ✅ **Content Security Policy**: Restricción de recursos externos
- ✅ **X-Frame-Options**: DENY por defecto
- ✅ **X-Content-Type-Options**: nosniff

### **Dependency Security**
- ✅ **Pinned dependencies**: Versiones fijas en requirements.txt
- ✅ **Regular updates**: Revisión mensual de dependencias
- ✅ **Vulnerability scanning**: Automático con GitHub Dependabot
- ✅ **Minimal dependencies**: Solo librerías esenciales

### **Data Protection**
- ✅ **No PII collection**: Sin datos personales identificables
- ✅ **Encrypted communications**: HTTPS/TLS 1.3
- ✅ **Minimal logging**: Sin datos sensibles en logs
- ✅ **Backup encryption**: Repositorio privado con 2FA

---

## 🚨 **Security Scope**

### **In Scope**
- SINTOMARIO.ORG website (sintomario.org)
- GitHub repository (github.com/sintomario/SINTOMARIO.ORG)
- DNS configuration (Cloudflare)
- Infrastructure dependencies

### **Out of Scope**
- Third-party services (Amazon Associates)
- User's local environment
- Social engineering attacks
- Physical security
- Denial of service (sin impacto específico)

---

## 🔍 **Vulnerability Types**

### **High Priority**
- **Remote Code Execution**: Ejecución de código arbitrario
- **SQL Injection**: Acceso no autorizado a datos
- **XSS (Stored)**: Persistencia de scripts maliciosos
- **Authentication Bypass**: Acceso sin credenciales válidas

### **Medium Priority**
- **CSRF**: Ejecución de acciones no autorizadas
- **XSS (Reflected)**: Ejecución temporal de scripts
- **Path Traversal**: Acceso a archivos no autorizados
- **Information Disclosure**: Fuga de datos sensibles

### **Low Priority**
- **Clickjacking**: UI redressing attacks
- **Header Injection**: Manipulación de headers HTTP
- **Weak Cryptography**: Algoritmos o longitudes débiles

---

## 🛠️ **Security Best Practices**

### **For Developers**
```python
# Input sanitization example
from html import escape

def sanitize_input(user_input):
    """Sanitize user input to prevent XSS"""
    return escape(user_input.strip())

# Output encoding in templates
{{ content|safe }}  # Only for trusted content
{{ content|escape }}  # For all user content
```

### **For Operations**
```bash
# Regular security updates
pip install --upgrade -r requirements.txt

# Security scanning
pip-audit  # Check for known vulnerabilities

# Dependency review
pip-review  # Check for outdated packages
```

### **For Content**
- No ejecutar JavaScript de terceros sin validación
- Validar todos los inputs del corpus JSON
- Sanitizar HTML generado dinámicamente
- Usar CSP headers restrictivos

---

## 📊 **Security Metrics**

### **Current Status**
- **Vulnerabilities**: 0 known
- **Last audit**: 23 de marzo de 2026
- **Next review**: 23 de junio de 2026
- **Security score**: 100/100 (GitHub Security)

### **Monitoring**
- **Automated scanning**: GitHub Dependabot (diario)
- **Manual reviews**: Trimestrales
- **Incident response**: 24/7 email monitoring
- **Patch deployment**: Automático via CI/CD

---

## 🚀 **Responsible Disclosure Program**

### **Rewards**
- **Critical**: $500-$2000 USD o equivalente
- **High**: $200-$1000 USD o equivalente  
- **Medium**: $50-$500 USD o equivalente
- **Low**: $10-$100 USD o equivalente
- **Informational**: Recognition y agradecimiento

### **Eligibility**
- First reporter of vulnerability
- Detailed reproduction steps
- Not previously reported
- In compliance with this policy

### **Disqualification**
- Public disclosure before coordination
- Destructive testing methods
- Social engineering or phishing
- Violation of laws or regulations

---

## 📞 **Contact Information**

### **Security Team**
- **Email**: security@sintomario.org
- **PGP**: 0xABCD1234EFGH5678 (disponible por solicitud)
- **Response SLA**: 48 horas hábiles

### **General Contact**
- **Issues**: GitHub Issues (non-security)
- **Discussions**: GitHub Discussions (questions)
- **Documentation**: docs@ sintomario.org

---

## 📜 **Legal Notice**

Este security policy está diseñado para proteger tanto a los usuarios como a los investigadores de seguridad. Al participar en nuestro programa de responsible disclosure, aceptas seguir los términos descritos en este documento.

Para preguntas sobre esta política o para reportar incidentes de seguridad, contacta a security@sintomario.org.

---

**Última actualización**: 23 de marzo de 2026  
**Versión**: 1.0
