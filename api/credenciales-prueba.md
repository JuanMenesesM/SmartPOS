# Credenciales de Prueba

Para hacer peticiones en Postman a rutas protegidas (`/empresa`, `/ventas`, etc.), inicia sesión primero con estas credenciales:

**Endpoint:** `POST http://localhost:3000/auth/login`

**Body (JSON):**
```json
{
    "correo": "admin@smartpos.com",
    "contrasena": "admin123"
}
```

Recuerda copiar el token generado y ponerlo en la pestaña **Authorization > Bearer Token** de Postman para el resto de peticiones.
