# App de Tareas - Mi Proyecto

¡Hola! Este es el repositorio de mi proyecto de **App de Tareas**. La desarrollé como parte de un challenge y es una aplicación web sencilla pero funcional para organizar mis (y tus) tareas diarias.

La idea es tener un lugar donde pueda anotar pendientes, marcar los más importantes, ver qué tengo que hacer "Hoy" y tener una vista general de todo.

## Un Vistazo al Proyecto

La aplicación se divide en dos partes principales:

* **Frontend:** Es la parte visual con la que interactúas, construida con React.
* **Backend:** Es el servidor que guarda y administra las tareas, hecho con Node.js, Express y una pequeña base de datos SQLite.

También incluí una carpeta `capturas/` donde guardé algunas imágenes de cómo se ve la app funcionando.

## Tecnologías Utilizadas

Me basé en estas herramientas para construir el proyecto:

* **Frontend:** React (con sus hooks como `useState`, `useEffect`, `useMemo`), React Router para navegar entre vistas, y React Icons para los iconitos chulos. Todas las dependencias están en `frontend/package.json`.
* **Backend:** Node.js y Express para el servidor, y `sqlite3` para la base de datos. Las dependencias están en `backend/package.json`.
* **Para gestionar el código:** Obviamente, Git.

## Cómo Poner Esto a Andar (Instrucciones para Ejecutar Localmente)

Si quieres probar la app en tu máquina, sigue estos pasos:

1.  **Clona el Repo:** Abre tu terminal, ve a la carpeta donde quieras guardar el proyecto y clona esto:
    ```bash
    git clone <URL de tu repositorio en GitHub, la que empieza con https>
    cd nombre-de-la-carpeta-del-proyecto # Entra a la carpeta que se creó
    ```

2.  **Arranca el Servidor (Backend):**
    * Entra a la carpeta `backend`:
        ```bash
        cd backend
        ```
    * Instala las cosas que necesita el servidor:
        ```bash
        npm install
        ```
    * Inicia el servidor. Va a correr en `http://localhost:3000`:
        ```bash
        node server.js
        # Si usas nodemon (recomendado para desarrollo):
        # nodemon server.js
        ```

3.  **Arranca la App (Frontend):**
    * Vuelve a la carpeta principal del proyecto y entra a `frontend`:
        ```bash
        cd ..
        cd frontend
        ```
    * Instala las dependencias de la app visual:
        ```bash
        npm install
        ```
    * Inicia la app en tu navegador. Normalmente se abre en `http://localhost:5173/`:
        ```bash
        npm run dev
        ```
    ¡Listo! Recuerda tener el backend corriendo para que la app funcione correctamente.

## Algunas Imágenes de la App

Aquí te dejo unas capturas rápidas para que veas cómo luce:

![Vista principal - Mi Día](./capturas/image.png)
![Vista de Tareas Importantes](capturas/image2.png)
![Vista de Todas las Tareas con filtros](capturas/image3.png)
![El modal para agregar o editar una tarea](capturas/image4.png)

---



