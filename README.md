# Comunidad Voz LATAM — Frontend

Interfaz web (Vite + React + TS + Tailwind + shadcn/ui) para capturar necesidades de comunidades y visualizar resultados en vivo.  
Se conecta al backend Express/Drizzle/PostgreSQL del mismo ejercicio técnico.

---

## 🧰 Stack
- **Vite + React + TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- Fetch API simple
- Live polling para feed en tiempo real

---

## ✅ Requisitos
- Node.js 18+
- Backend corriendo en `http://localhost:4000` (o configurar variable de entorno abajo)

---

## ⚙️ Configuración rápida

```bash
# 1) Instalar dependencias
npm i

# 2) Variables de entorno (crear un .env en la raíz del front)
#    Cambia la URL si tu API corre en otro host/puerto
echo "VITE_API_BASE_URL=http://localhost:4000" > .env

# 3) Ejecutar en desarrollo
npm run dev
# => abre http://localhost:5173
```

### Scripts útiles
- `npm run dev`
- `npm run build` → Build de producción (genera `/dist`)

---

## 🔌 Variables de entorno
Archivo `.env` en la **raíz del proyecto**:

```dotenv
VITE_API_BASE_URL=http://localhost:4000
```

---

## 🧩 Estructura relevante

```
src/
├─ api.ts                 # Cliente HTTP (tipado) hacia la API
├─ types.ts               # Tipos para categorías, preguntas, respuestas, etc.
├─ main.tsx               # Entrada de React
├─ pages/
│  └─ Index.tsx           # Página principal (form + paneles + tabs)
└─ components/
   ├─ SurveyForm.tsx      # Formulario con país (dropdown) y teléfono con prefijo
   ├─ CategoryStats.tsx   # Conteo por categoría
   ├─ ResponsesGrid.tsx   # Tabla de respuestas enriquecidas
   ├─ StatsCharts.tsx     # Gráficos con los datos
   └─ LiveFeed.tsx        # Feed en vivo con polling y manejo de baseline
public/
├─ favicon.svg
├─ favicon.ico
└─ og-image.png
index.html
```

---

## 🧭 Funcionalidad clave

- **SurveyForm**
  - Campos de persona (email único) + **país** (selector con 5 países LATAM) y **teléfono** numérico con **prefijo automático** según país.
  - Pregunta 1 (categoría + texto) y Pregunta 2 (texto opcional).
  - Al enviar:
    1) Registra/actualiza participante (`POST /participants/register`)
    2) Crea necesidad para Q1 (`POST /needs` con `category` requerido)
    3) Crea necesidad para Q2 si hay texto
  - Lanza `onSuccess()` para refrescar paneles.

- **CategoryStats**: muestra conteo por categoría (`GET /stats/categories`).
- **ResponsesGrid**: lista respuestas enriquecidas (`GET /responses`).
- **LiveFeed**: polling cada 5s a `/responses` para detectar “+N nuevas”.

---

## 🌐 Endpoints consumidos (backend)
- `GET /categories`
- `GET /questions`
- `POST /participants/register`
- `POST /needs`
- `GET /responses` (y `?questionId=1|2`)
- `GET /stats/categories`

> Asegúrate de que el backend permita CORS desde `http://localhost:5173` (ya está contemplado en el código de ejemplo).

---

## 🖼️ Metadatos y assets
- Coloca los íconos/manifest/og-image en **`/public`**.
- `index.html` incluye:
  ```html
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta property="og:image" content="/og-image.png" />
  ```
- Para compartir en redes, en producción conviene usar URLs absolutas en `og:image`.

---

## 🚀 Build y despliegue
```bash
npm run build
```
Si el backend está en otro dominio, define `VITE_API_BASE_URL` en el entorno de tu plataforma.


---

## 🧪 Pruebas manuales
1. Abre `http://localhost:5173`
2. Completa el formulario (Q1 con categoría obligatoria, Q2 opcional)
3. Verifica que:
   - Aumenta el conteo en “Resultados por categoría”
   - Aparece en la tabla de “Respuestas”
   - El **Feed en Vivo** muestra `+N` al llegar datos nuevos

---

## 📄 Licencia
Prueba técnica.
