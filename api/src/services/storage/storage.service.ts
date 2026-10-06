import path from "path";
import fs from "fs/promises";

const STORAGE_ROOT = path.resolve(process.cwd(), "uploads");

export enum StorageFolder {
    FACTURAS  = "facturas",
    LOGOS     = "logos",
    REPORTES  = "reportes",
    EXPORTS   = "exports",
}

const ensureDir = async (dir: string): Promise<void> => {
    await fs.mkdir(dir, { recursive: true });
};

const buildFolderPath = (folder: StorageFolder): string => {
    return path.join(STORAGE_ROOT, folder);
};

export const guardarPDF = async (
    buffer: Buffer,
    nombreArchivo: string,
    folder: StorageFolder = StorageFolder.FACTURAS): Promise<string> => {
    const fileName = nombreArchivo.endsWith(".pdf")
        ? nombreArchivo
        : `${nombreArchivo}.pdf`;

    const folderPath = buildFolderPath(folder);
    await ensureDir(folderPath);

    const filePath = path.join(folderPath, fileName);
    await fs.writeFile(filePath, buffer);

    return filePath;
};

export const guardarLogo = async (
    buffer: Buffer,
    nombreArchivo: string
): Promise<string> => {
    const folderPath = buildFolderPath(StorageFolder.LOGOS);
    await ensureDir(folderPath);

    const filePath = path.join(folderPath, nombreArchivo);
    await fs.writeFile(filePath, buffer);

    return filePath;
};

export const guardarArchivo = async (
    buffer: Buffer,
    nombreArchivo: string,
    folder: StorageFolder
): Promise<string> => {
    const folderPath = buildFolderPath(folder);
    await ensureDir(folderPath);

    const filePath = path.join(folderPath, nombreArchivo);
    await fs.writeFile(filePath, buffer);

    return filePath;
};

export const eliminarArchivo = async (rutaAbsoluta: string): Promise<void> => {
    try {
        await fs.unlink(rutaAbsoluta);
    } catch (err: any) {
        if (err.code !== "ENOENT") {
            throw err;
        }
    }
};

export const obtenerRutaArchivo = (
    folder: StorageFolder,
    nombreArchivo: string
): string => {
    return path.join(STORAGE_ROOT, folder, nombreArchivo);
};

export const obtenerRutaRelativa = (rutaAbsoluta: string): string => {
    return path.relative(STORAGE_ROOT, rutaAbsoluta).replace(/\\/g, "/");
};

export const existeArchivo = async (rutaAbsoluta: string): Promise<boolean> => {
    try {
        await fs.access(rutaAbsoluta);
        return true;
    } catch {
        return false;
    }
};

export const leerArchivo = async (rutaAbsoluta: string): Promise<Buffer> => {
    return await fs.readFile(rutaAbsoluta);
};
