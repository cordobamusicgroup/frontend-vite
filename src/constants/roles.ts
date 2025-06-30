/**
 * Enum de roles para control de acceso en el frontend.
 *
 * - Admin: rol de administrador (debe existir en backend)
 * - User: rol de usuario estándar (debe existir en backend)
 * - All: valor especial SOLO FRONTEND. Si se usa en allowedRoles o no se pasan roles,
 *   significa que cualquier usuario autenticado puede acceder, sin importar su rol.
 *   No debe enviarse al backend ni usarse para validaciones de permisos en el servidor.
 */
export enum Roles {
  Admin = 'ADMIN',
  AdminContent = 'ADMIN_CONTENT',
  User = 'USER',
  /**
   * Valor especial del frontend: permite acceso a cualquier usuario autenticado,
   * sin importar su rol. No existe en backend.
   */
  All = 'ALL',
}
