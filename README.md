# Plataforma Web de Noticias

## Descripción

NEXT Noticias es un prototipo académico para explorar noticias, guardar favoritos
y gestionar publicaciones locales. Reutiliza el proyecto Angular existente y el
[diseño NEXT Noticias en Figma](https://www.figma.com/design/iLZrtS6bVlLgCuEsXHtKJL/NEXT-Noticias).
Las diez noticias del catálogo son ejemplos académicos, no periodismo verificado.

## Tecnologías

- Angular 22 y Angular Router.
- TypeScript, HTML y CSS.
- Reactive Forms y RxJS.
- JSON local y HttpClient.
- localStorage para favoritos y noticias creadas.
- Vitest para pruebas automatizadas.

## Funcionalidades

- Home con hero, categorías, noticias destacadas y últimas noticias dinámicas.
- Listado con tarjetas, búsqueda por título, categorías y paginación de seis noticias.
- Detalle con autor, fecha, contenido completo, favoritos y noticias relacionadas.
- Favoritos sin duplicados y persistentes después de recargar.
- Contacto con validación de nombre, correo, asunto y mensaje.
- Administración: crear, listar y eliminar noticias locales.
- Estados de carga, error, reintento, búsqueda vacía y noticia inexistente.
- Avisos globales de problemas de almacenamiento e imagen local de respaldo.
- Diseño adaptable a escritorio, tablet y móvil.

## Estructura general

```text
public/
  data/noticias.json       # Diez noticias iniciales
  images/                 # Fotografías y respaldo local
  icons/                  # Iconos del diseño
  404.html                # Recuperación de enlaces en GitHub Pages
src/app/
  layout/                 # Header y footer
  models/news.ts          # Modelo compartido
  pages/                  # Home, noticias, detalle, favoritos, contacto, admin
  services/               # Catálogo, publicaciones locales y favoritos
  shared/                 # Tarjetas, botón favorito y directiva de imágenes
  app.routes.ts           # Rutas del portal
```

`NewsService` lee y valida el JSON, comparte su carga y lo combina con
`LocalNewsService`. Ofrece obtenerNoticias, obtenerNoticiaPorId,
obtenerDestacadas, buscarNoticias y filtrarPorCategoria. La búsqueda ignora
mayúsculas y tildes. No se modifica físicamente el archivo JSON.

## Instalación

Usar Node.js compatible con Angular 22 (para esta entrega se verificó Node 24.19.0).
Desde la carpeta del proyecto:

```bash
npm install
```

Para reproducir exactamente las dependencias del lockfile se puede usar `npm ci`.

## Ejecución

```bash
npx ng serve
```

Si Angular CLI está instalado globalmente, también se puede ejecutar `ng serve`.

## Acceso

Abrir [http://localhost:4200](http://localhost:4200).

| Ruta              | Vista                       |
| ----------------- | --------------------------- |
| `/`               | Home                        |
| `/noticias`       | Listado, búsqueda y filtros |
| `/noticias/:id`   | Detalle                     |
| `/favoritos`      | Noticias guardadas          |
| `/contacto`       | Formulario de contacto      |
| `/administracion` | Gestión de noticias locales |

La búsqueda conserva `q`, `categoria` y `pagina` en la URL.

## Entrega 2 – Prototipo funcional

Esta versión incluye visualización dinámica de noticias, navegación con Angular
Router, detalle, favoritos, formulario validado, mini CRUD y persistencia local.
El contacto exige nombre de al menos 3 caracteres, correo válido, asunto y mensaje
de al menos 10 caracteres. Al enviar muestra una confirmación simulada: no envía
correos ni guarda datos personales.

Administración exige los campos de la noticia, una fecha válida y una URL HTTPS
para la imagen. Permite marcar destacadas y eliminar solo publicaciones locales.
Si una imagen falla se muestra una ilustración local. No incluye edición.

### Persistencia y límites

- `next-noticias:favorites`: IDs de favoritos.
- `next-noticias:local-news`: noticias creadas localmente.
- Los datos pertenecen al navegador y origen; no se comparten entre dispositivos.
- Ante fallos de escritura se conserva el estado previo y se muestra un aviso.
- Ante datos locales inválidos se muestra un aviso global y se usa un estado vacío;
  el contenido original no se borra automáticamente del almacenamiento.
- No hay backend ni autenticación real. Los enlaces sociales y páginas
  legales son elementos pendientes del diseño, fuera del alcance funcional de esta entrega.
- Los datos de contacto proceden del diseño y son ejemplos.

## Validación

```bash
npm test -- --watch=false
npx ng build
```

No hay un objetivo de lint ni un ejecutor e2e configurado. Las pruebas incluyen
carga y errores del JSON, búsqueda, filtros, rutas, favoritos, contacto,
persistencia y eliminación local, integración del catálogo e imágenes de respaldo.
Se revisaron los flujos principales en navegador y tamaños de 1440, 768, 390 y
320 px. La tabla de administración permite desplazamiento dentro de su contenedor.

## GitHub Pages

```bash
npx ng build --base-href /Next_Noticias/
```

El resultado se genera en `dist/Next_Noticias/browser`. El workflow existente
publica desde `master` hacia `gh-pages`; trabajar en una rama feature no publica.
`public/404.html` redirige los enlaces profundos al índice y `src/index.html`
restaura la ruta antes de iniciar Angular, conservando consulta y fragmento.
Así se admiten recargas y enlaces como `/Next_Noticias/noticias/2`.
Si cambia el nombre del repositorio hay que ajustar tanto el base-href como la
constante `base` de `404.html`. Esta recuperación requiere JavaScript y el primer
acceso a una ruta profunda recibe el 404 de Pages antes de la redirección.
La validación local no sustituye una comprobación del sitio después de publicar.

## Autor

Jonathan Moreno

## Sesión de demostración

La ruta `/login` permite acceder con la cuenta pública de prueba:

- Correo: `admin@nextnoticias.demo`
- Contraseña: `DemoNoticias2026`

El menú Administración solo aparece con sesión. Un guard protege el acceso directo
a `/administracion` y redirige al formulario de inicio de sesión. Al entrar se
recupera la ruta protegida solicitada. Cerrar sesión borra el marcador de sesión y
regresa al inicio; no elimina noticias ni favoritos.

`AuthService` conserva únicamente el marcador `admin-demo` en
`sessionStorage`, bajo `next-noticias:demo-session`; no guarda contraseñas.
La sesión sobrevive a recargas. Es una simulación académica: el almacenamiento
puede manipularse y no constituye autorización segura. Para producción se requiere
validar identidad y permisos en un backend o proveedor de autenticación.

Validación de esta etapa: 31 pruebas aprobadas, compilación de producción y
verificación en navegador de login válido/inválido, guard, menú, recarga, logout y
adaptación del formulario a 1440, 768, 390 y 320 px.
