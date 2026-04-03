/** 
 * Define los datos básicos de una entrada de fichaje dentro del programa.
 * Aquí solo indicamos qué campos tiene una entry (id, fichaje, proyecto, inicio y fin),
 * sin mezclar todavía detalles técnicos de cómo viene esa fila desde MySQL.
 */
export interface FichajeEntryData {
    id: number;
    fichaje_id: number;
    project_id: number;
    started_at: Date;
    ended_at: Date | null;
}