**PROYECTO: "Liga Manager" (Gestor de Torneos de E-sports o Fútbol)**

**Concepto:** Una plataforma para gestionar una liga pequeña. No solo muestra resultados, sino que gestiona la integridad de la competición. Requiere manejar lógica de "Partidos", "Equipos" y la generación automática de una "Tabla de Posiciones" basada en los resultados ingresados.

**Stack Tecnológico Aplicado:**
- Astro: Vistas de brackets (llaves) del torneo y tablas de clasificación.
- Tailwind: Grid layouts complejos para mostrar los enfrentamientos.
- Node/Express: Validación de resultados (no se puede editar un partido ya cerrado).
- SQL: Funciones de agregación (SUM, COUNT) y ordenamiento complejo.

**Requerimientos Detallados (Sprints sugeridos):**

**1. Base de Datos (SQL):**
- Diseño ER:
   - Equipos (ID, nombre, logo, puntos_totales).
   - Partidos (ID, equipo_local_id, equipo_visitante_id, goles_local, goles_visitante, fecha, estado [pendiente/en_juego/jugado]).
- Reto SQL: No guardar la "Tabla de Posiciones" como una tabla física fija. La tabla de posiciones debe ser una Vista (View) o una consulta compleja que calcule los puntos al vuelo:
   - Si (goles_local > goles_visitante) -> Local gana 3 pts.
   - Si (empate) -> Ambos ganan 1 pt.


**2. Backend (API REST Node/Express):**
- Lógica de Negocio:
   - POST /api/match-result: Recibe el resultado. Debe validar que los equipos no sean el mismo y que el partido exista.
   - Al guardar un resultado, el backend podría actualizar una caché o simplemente guardar el dato crudo para que SQL haga el trabajo sucio.
   - GET /api/leaderboard: Devuelve el JSON ya ordenado de quién va primero, segundo, etc., calculado desde la DB.

**3. Frontend (Astro + Tailwind):**
- Vista Pública (SSG con revalidación o SSR):
   - Leaderboard: Tabla estilizada con Tailwind (Puesto, Equipo, PJ, PG, PE, PP, Puntos).
   - Fixture: Lista de partidos por fecha.
- Panel de Árbitro (SSR Protegido):
   - Solo un usuario logueado (admin/árbitro) puede ingresar los marcadores.
   - Al editar un marcador, la vista pública debe reflejar el cambio en la tabla de posiciones inmediatamente (ideal para practicar la reactividad del servidor o re-fetching).