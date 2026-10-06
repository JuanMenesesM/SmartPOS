# Credenciales de Prueba

Para hacer peticiones en Postman a rutas protegidas (`/empresa`, `/ventas`, etc.), inicia sesión primero con estas credenciales:

**Endpoint:** `POST http://localhost:3000/auth/login`

**Body (JSON):**

```json
http://localhost:3000/auth/login
{
    "correo": "admin@smartpos.com",
    "contrasena": "Juan123"
}
```

http://localhost:3000/ventas
No olvidar poner el token en Authorization > Bearer Token
{
"nombre": "Mi Tienda Principal",
"nit": "900.123.456-7",
"telefono": "3001234567",
"correo": "contacto@mitienda.com",
"direccion": "Calle Principal 123",
"ciudad": "Bogotá"
}

http://localhost:3000/openai/test

Recuerda copiar el token generado y ponerlo en la pestaña **Authorization > Bearer Token** de Postman para el resto de peticiones.
