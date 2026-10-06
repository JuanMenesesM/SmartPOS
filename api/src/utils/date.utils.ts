export const obtenerInicioDelDia = (fecha: Date = new Date()): Date => {
    return new Date(
        fecha.getFullYear(),
        fecha.getMonth(),
        fecha.getDate()
    );
};

export const obtenerInicioDelMes = (fecha: Date = new Date()): Date => {
    return new Date(
        fecha.getFullYear(),
        fecha.getMonth(),
        1
    );
};

export const obtenerFinDelMes = (fecha: Date = new Date()): Date => {
    return new Date(
        fecha.getFullYear(),
        fecha.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
    );
};
