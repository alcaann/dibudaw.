Para la ejecución de este proyecto será necesario: 
    - Instalar las dependencias (ejecutar npm install)
    - Establecer una conexión a una base de datos MongoDB (server.ts:19)
    - Establecer un correo que mande los emails al registrarse (routes/auth.ts:8)
    - Establecer la contraseña del email anterior (routes/auth.ts:9)
    - Establecer href del botón que hay en el contenido del email de bienvenida (routes/auth.ts:58)
    - Establecer una clave privada RSA para firmar JWT (routes/auth.ts:69)
    - Establecer una clave privada para encriptar las contraseñas de la base de datos (models/user.ts:7)
    - Arrancar los servidores (ejecutar run dev:ssr)
