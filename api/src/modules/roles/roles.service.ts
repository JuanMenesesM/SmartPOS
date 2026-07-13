import { prisma } from "../../config/prisma";

export const listarRoles = async() =>{
  return await prisma.rol.findMany()
}
