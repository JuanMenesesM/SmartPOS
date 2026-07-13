export const obtenerRangoHoy = () => {
    const hoy = new Date();

    const inicioDia = new Date(hoy);
    inicioDia.setHours(0, 0, 0, 0);

    const finDia = new Date(hoy);
    finDia.setHours(23, 59, 59, 999);

    return { inicioDia, finDia };
};

// También podemos agregar otros rangos útiles a futuro, por ejemplo:
export const obtenerRangoMes = () => {
    const hoy = new Date();
    
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    inicioMes.setHours(0, 0, 0, 0);
    
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    finMes.setHours(23, 59, 59, 999);
    
    return { inicioMes, finMes };
};
