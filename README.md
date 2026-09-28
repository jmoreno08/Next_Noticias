# NextNoticias

## Datos de noticias

`public/data/noticias.json` contiene diez noticias de demostración con ID,
título, categoría, descripción, contenido, imagen, fecha, autor y destacado.
Los contenidos son ejemplos académicos, no información periodística verificada.

El modelo compartido está en `src/app/models/news.ts`. `NewsService`, en
`src/app/services/news.service.ts`, lee el JSON mediante `HttpClient` y ofrece:

- `obtenerNoticias()` y `obtenerNoticiaPorId(id)`.
- `obtenerDestacadas()`.
- `buscarNoticias(titulo)`, sin distinguir mayúsculas ni tildes.
- `filtrarPorCategoria(categoria, titulo)`, con búsqueda y categoría combinables.

El servicio comparte la carga entre consumidores, rechaza datos incompletos o
IDs duplicados y devuelve un error amigable cuando falla la carga. Una nueva
suscripción permite reintentar. La URL relativa respeta el despliegue en GitHub
Pages. La portada, el listado y el detalle ya consumen este servicio.
Los favoritos se guardan localmente mediante `FavoritesService`.

Las seis fotografías de `public/images/news/` proceden del frame
[Noticias desktop de NEXT Noticias en Figma](https://www.figma.com/design/iLZrtS6bVlLgCuEsXHtKJL/NEXT-Noticias?node-id=68-10).
Sus posiciones son: computación cuántica, educación y turismo en la primera fila;
negocios, innovación médica y energía en la segunda. Los datos adicionales
reutilizan esas fotografías como ilustraciones de ejemplo.

Para verificar la lógica y la estructura actual: `npm test -- --watch=false`.

## Secciones de noticias de la portada

La portada incluye tres noticias destacadas y cuatro noticias recientes, basadas en
la referencia `next-noticias-home.png`. Las cuadrículas se adaptan a una columna
en pantallas de hasta 720 px.

Las fotografías ahora son imágenes individuales del JSON. Destacadas, últimas
noticias y hero abren su artículo mediante Angular Router; las categorías abren
el listado filtrado. La captura `public/images/news-reference.png` se conserva
como referencia histórica y ya no se utiliza para mostrar fotografías.

## Navegación y consulta — segunda etapa de la Entrega 2

- `/`: portada dinámica, tres destacadas y cuatro noticias ordenadas por fecha.
- `/noticias`: búsqueda por título, filtro por categoría y paginación de seis
  tarjetas. `q`, `categoria` y `pagina` se conservan en la URL para compartir
  búsquedas y restaurarlas al volver del detalle.
- `/noticias/:id`: título, categoría, autor, fecha, fotografía, contenido,
  regreso al listado y noticias relacionadas de la misma categoría.
- Las rutas o noticias inexistentes muestran un mensaje amigable. Los fallos
  de carga permiten reintentar y las búsquedas vacías permiten limpiar filtros.

`NewsCard` se reutiliza en portada, listado y noticias relacionadas. El listado
y el detalle siguen los frames `68:10` y `68:181` del archivo de Figma; el
contenido e imágenes cambian según la noticia consultada. Las fechas se muestran
en español. Las vistas se han verificado en escritorio, tablet y móvil.

Los accesos a Administración y Contacto están deshabilitados hasta implementar
esas etapas. El inicio de sesión no está incluido en el alcance de la entrega.
No hay backend.

## Favoritos — tercera etapa de la Entrega 2

- Guardar y quitar noticias desde las tarjetas y el detalle.
- Página `/favoritos`, con contador y el estado vacío «Aún no tienes noticias guardadas.».
- Persistencia en `localStorage` bajo la clave `next-noticias:favorites`.
  Solo se almacenan IDs; la información se obtiene del servicio de noticias.
- Se evitan duplicados, se descartan IDs inválidos y no se muestran noticias que
  ya no existan. Los botones comparten el estado durante la navegación.
- Los errores de lectura o escritura muestran un mensaje. Si una escritura
  falla, el estado anterior se conserva para no simular un guardado exitoso.

`FavoriteButton` se reutiliza en tarjetas y detalle con nombre accesible y
`aria-pressed`. El diseño sigue el frame `68:324` de Figma y reutiliza las fotos
de cada noticia. Los favoritos pertenecen al navegador y origen actual: no se
comparten entre dispositivos ni entre localhost y el sitio publicado.

Validación de esta etapa: 20 pruebas unitarias/de integración, compilación de
producción y comprobación en navegador de guardado, recarga, eliminación,
teclado y diseños a 1440, 768, 390 y 320 px.

En desarrollo, `ng serve` permite abrir directamente las rutas. En alojamiento
estático, el servidor debe devolver `index.html` para rutas de Angular. GitHub
Pages requiere configurar esa recuperación antes de garantizar recargas o
enlaces directos como `/Next_Noticias/noticias/2`; esta etapa no modifica el
workflow de despliegue.

La versión actual de Angular requiere Node.js 22.22.3+, 24.15.0+ o 26+.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
