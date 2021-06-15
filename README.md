Para la ejecución de este proyecto será necesario: 
<br>    - Instalar las dependencias (ejecutar npm install)
<br>    - Establecer una conexión a una base de datos MongoDB (server.ts:19)
<br>    - Establecer un correo que mande los emails al registrarse (routes/auth.ts:8)
<br>    - Establecer la contraseña del email anterior (routes/auth.ts:9)
<br>    - Establecer href del botón que hay en el contenido del email de bienvenida (routes/auth.ts:58)
<br>    - Establecer una clave privada RSA para firmar JWT (routes/auth.ts:69)
<br>    - Establecer una clave privada para encriptar las contraseñas de la base de datos (models/user.ts:7)
<br>    - Arrancar los servidores (ejecutar run dev:ssr)
