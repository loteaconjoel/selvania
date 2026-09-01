declare namespace App {
  interface Locals {
    /** Usuario autenticado, puesto por el middleware en las rutas /admin. */
    admin?: string;
  }
}
