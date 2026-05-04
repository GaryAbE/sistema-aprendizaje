# AVA / EVA — Sistema de Aprendizaje Comunitario

**AVA** (Acompañamiento y Valoración del Aprendizaje) / **EVA** (Evaluación y Valoración del Aprendizaje) es una plataforma pedagógica digital diseñada para comunidades educativas rurales e indígenas de Bolivia. Soporta cuatro idiomas: **Español, Aymara, Quechua y Guaraní**.

---

## 🏛️ Arquitectura

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router, Server Components) |
| Base de Datos | PostgreSQL via Prisma ORM |
| Autenticación | Sesión JWT en cookie HttpOnly |
| Estilos | CSS Variables + Vanilla CSS (sin Tailwind) |
| Storage | Archivos locales en `/public/uploads` |
| Deploy | Vercel / Node.js autohospedado |

---

## 👥 Roles del Sistema

| Rol | Acceso | Descripción |
|---|---|---|
| `MAESTRO` | `/maestro` | Panel completo de administración pedagógica |
| `ESTUDIANTE` | `/mapa` | Portal de aprendizaje por momentos |
| `PADRINO` | `/tutoria` | Mentoría y feedback digital a ahijados |
| `FAMILIA` | `/familia` → `/mapa?viewAs=familia` | Ve el progreso de su hijo/a |

---

## 🗺️ Flujo Pedagógico (4 Momentos)

Cada **Tema** tiene 4 momentos que el estudiante completa en orden:

```
1. PRÁCTICA  →  2. TEORÍA  →  3. VALORACIÓN  →  4. PRODUCCIÓN
   (Actividad)    (Contenido)    (Foro/Debate)     (Entrega + Autoevaluación)
```

### Detalle de cada Momento

| Momento | Estudiante puede | Maestro configura |
|---|---|---|
| **Práctica** | Subir foto/audio O jugar un minijuego | Tipo de actividad, instrucciones, recursos, tipo de juego |
| **Teoría** | Ver videos, leer docs, descargar recursos | Múltiples documentos, videos, audio de instrucción |
| **Valoración** | Participar en foro comunitario (texto/audio) | Pregunta del foro |
| **Producción** | Subir proyecto, reflexión, autoevaluación | Tipo de entrega, instrucciones |

---

## 🎮 Minijuegos Disponibles

El maestro puede asignar cualquiera de estos juegos en Práctica o Producción:

| Código | Juego | Descripción |
|---|---|---|
| `quiz` | 🎯 Quiz Dinámico | Auto-detecta banco de preguntas según el slug del tema |
| `quiz-multiplicacion` | ✖️ Quiz Multiplicación | Preguntas de tablas de multiplicar |
| `quiz-lectura` | 📖 Quiz Lectura | Comprensión lectora y gramática |
| `divide-pan` | 🍞 Divide el Pan | Representación visual de fracciones |
| `emparejar` | 🔗 Emparejar | Relaciona fracciones con sus decimales equivalentes |
| `ordenar` | 🔢 Ordenar | Ordena series numéricas de menor a mayor |

---

## 🔄 Panel del Maestro

Pestañas disponibles:

1. **Mis Alumnos** — Cards de cada estudiante con progreso visual y asignación de padrino
2. **Seguimiento** — Barras de progreso, estado de autoevaluación ("Necesita Ayuda" en rojo parpadeante), % completado
3. **Revisar Tareas** — Todas las producciones con filtro Pendientes/Revisadas. Permite dejar feedback por escrito
4. **Muro de Reflexión** — Comentarios del foro de Valoración con campo de respuesta para el maestro
5. **Configurar Temas** — Editor completo por tema/momento/idioma: título, descripción, audio, recursos (videos/docs/imgs), tipo de actividad, tipo de juego
6. **Registrar Usuario** — Crea estudiantes, padrinos, maestros o familias directamente

---

## 💬 Retroalimentación

El estudiante puede ver **en su portal de Producción**:
- 🟣 **Retroalimentación del Maestro** — Después de que el maestro revise la entrega
- 🟡 **Nota del Padrino Digital** — Mensaje de apoyo/corrección del padrino asignado

Los padrinos ven las entregas de sus ahijados en `/tutoria` y pueden dejar notas directamente.

---

## 🌐 Internacionalización

El sistema soporta 4 idiomas configurables por usuario:

| Código | Idioma | Bandera |
|---|---|---|
| `es` | Español / Castellano | 🇧🇴 |
| `ay` | Aymara | 🌄 |
| `qu` | Quechua (Qhichwa Simi) | 🌻 |
| `gu` | Guaraní (Avañe'ẽ) | 🦜 |

El idioma se cambia desde el botón 🌐 en cualquier pantalla o en `/idioma`. Todos los contenidos pedagógicos se guardan **por idioma** en la base de datos.

---

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+
- PostgreSQL 14+
- npm 9+

### 1. Clonar el repositorio
```bash
git clone <repo-url>
cd ava-eva-sistema
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

Edita `.env`:
```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/ava_eva"
SESSION_SECRET="una-clave-secreta-larga-y-aleatoria"
```

### 4. Crear la base de datos
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Poblar con datos de prueba
```bash
npm run db:seed
```

Esto crea:

| Usuario | PIN | Rol |
|---|---|---|
| `maestra.rosa` | `1234` | Maestro |
| `padrino.pedro` | `5678` | Padrino |
| `lucia.flores` | `1111` | Estudiante |
| `mario.choque` | `2222` | Estudiante |
| `mama.lucia` | `3333` | Familia |

### 6. Crear carpeta para uploads
```bash
mkdir -p public/uploads
```

### 7. Iniciar el servidor de desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── login/          # Página de login (PIN numérico)
│   ├── idioma/         # Selector de idioma visual
│   ├── mapa/           # Mapa de aprendizaje del estudiante
│   │   └── [tema]/
│   │       ├── practica/       # Momento 1
│   │       ├── teoria/         # Momento 2
│   │       ├── valoracion/     # Momento 3
│   │       ├── produccion/     # Momento 4
│   │       └── juegos/         # Minijuegos interactivos
│   ├── maestro/        # Panel administrativo del maestro
│   ├── tutoria/        # Portal del padrino digital
│   ├── familia/        # Vista familiar del progreso
│   └── api/            # Endpoints REST
│       ├── auth/       # Login / logout
│       ├── upload/     # Subida de archivos
│       ├── progress/   # Actualización de progreso
│       ├── produccion/ # CRUD de producciones y feedback
│       ├── maestro/    # APIs del panel maestro
│       └── tutoria/    # Feedback del padrino
├── lib/
│   ├── auth.ts         # Gestión de sesión JWT
│   ├── db.ts           # Cliente Prisma
│   ├── i18n.ts         # Sistema de traducciones (es/ay/qu/gu)
│   └── progress.ts     # Lógica de progreso
├── components/
│   ├── LogoutButton.tsx
│   ├── PadrinoFlotante.tsx
│   └── ...
└── styles/
    └── globals.css     # Design system completo (variables, componentes)
```

---

## 🎨 Design System

El sistema usa **CSS Variables** definidas en `globals.css`:

```css
--color-primario: #6366f1      /* Índigo */
--color-secundario: #8b5cf6    /* Violeta */
--color-acento: #f43f5e        /* Rosa */
--color-info: #38bdf8          /* Celeste */
--color-exito: #4ade80         /* Verde */
```

Clases de utilidad: `.btn-burbuja`, `.card`, `.badge`, `.form-input`, `.flex-center`, `.anim-flotar`, `.anim-fadeInUp`, `.anim-bounceIn`

---

## 📱 Offline / PWA

El sistema guarda intentos fallidos localmente y los sincroniza al recuperar conexión (experimental). Indicadores de estado de conexión visibles en la UI.

---

## 📜 Licencia

Proyecto educativo de acceso libre para comunidades rurales de Bolivia.
