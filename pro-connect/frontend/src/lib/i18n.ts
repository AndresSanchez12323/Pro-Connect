export function traducirEstado(estado: string): string {
  const mapa: Record<string, string> = {
    PENDING: 'PENDIENTE',
    CONFIRMED: 'CONFIRMADA',
    CANCELLED: 'CANCELADA',
    COMPLETED: 'COMPLETADA',
  };

  return mapa[estado] ?? estado;
}

export function traducirModalidad(modalidad: string): string {
  const mapa: Record<string, string> = {
    ONLINE: 'EN LINEA',
    IN_PERSON: 'PRESENCIAL',
  };

  return mapa[modalidad] ?? modalidad;
}

export function traducirRol(rol: string): string {
  const mapa: Record<string, string> = {
    USER: 'USUARIO',
    PROFESSIONAL: 'PROFESIONAL',
    VISITANTE: 'VISITANTE',
  };

  return mapa[rol] ?? rol;
}
