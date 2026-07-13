export const MESSAGES = {
    SUCCESS: {
        VENTA_CREADA: "Venta creada exitosamente",
        USUARIO_CREADO: "Usuario creado exitosamente",
        PRODUCTO_CREADO: "Producto creado exitosamente",
        PRODUCTO_ACTUALIZADO: "Producto actualizado exitosamente",
        ROL_CREADO: "Rol creado exitosamente",
        AUTH_EXITOSA: "Autenticación exitosa",
        PROVEEDOR_CREADO: "Proveedor creado exitosamente",
        PROVEEDOR_ACTUALIZADO: "Proveedor actualizado exitosamente",
        COMPRA_CREADA: "Compra registrada exitosamente"
    },
    ERROR: {
        STOCK_INSUFICIENTE: (nombre: string, solicitado: number, disponible: number) => `Stock insuficiente para ${nombre}. Solicitado: ${solicitado}, Disponible: ${disponible}`,
        PRODUCTO_INACTIVO: (nombre: string) => `El producto ${nombre} se encuentra inactivo y no puede ser vendido`,
        PRODUCTOS_NO_ENCONTRADOS: "Uno o más productos enviados no existen en la base de datos",
        CAMPOS_OBLIGATORIOS: "Todos los campos son obligatorios",
        CREDENCIALES_INVALIDAS: "Credenciales inválidas",
        ROL_NO_ENCONTRADO: "El rol no existe o está inactivo",
        USUARIO_YA_EXISTE: "El correo ya existe",
        PRODUCTO_YA_EXISTE: "El producto con este código o nombre ya existe",
        PROVEEDOR_YA_EXISTE: "Ya existe un proveedor con este NIT",
        PROVEEDOR_NO_ENCONTRADO: "Proveedor no encontrado o inactivo",
        COMPRA_NO_ENCONTRADA: "Compra no encontrada",
        FORMATO_CORREO_INVALIDO: "El formato del correo es inválido",
        TOKEN_FALTANTE: "Token no proporcionado",
        TOKEN_INVALIDO: "Token inválido o expirado",
        ACCESO_DENEGADO: "No tienes permiso para realizar esta acción",
        ERROR_SERVIDOR: "Error interno del servidor",
    }
};
