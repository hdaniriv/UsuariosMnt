import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column,BeforeUpdate } from 'typeorm';


 /* Clase base abstracta para entidades de TypeORM.
 * 
 * Esta clase proporciona propiedades comunes que pueden ser heredadas por otras entidades
 * en tu aplicación. Incluye un identificador único (`id`), así como marcas de tiempo
 * para la creación y actualización de registros.
 */
export abstract class AppBaseEntity {

  /**
   * Identificador único de la entidad.
   * 
   * - `@PrimaryGeneratedColumn`: Indica que esta columna es la clave primaria y su valor
   *   será generado automáticamente por la base de datos.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Fecha y hora de creación del registro.
   * 
   * - `@CreateDateColumn`: Este decorador crea automáticamente una columna que almacena
   *   la fecha y hora en que se creó el registro. El valor es generado automáticamente
   *   por TypeORM al insertar un nuevo registro.
   * - `type: 'timestamp'`: Define el tipo de dato como `timestamp` en la base de datos.
   */
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  /**
   * Fecha y hora de la última actualización del registro.
   * 
   * - `@UpdateDateColumn`: Este decorador crea automáticamente una columna que almacena
   *   la fecha y hora de la última actualización del registro. El valor se actualiza
   *   automáticamente cada vez que el registro es modificado.
   * - `type: 'timestamp'`: Define el tipo de dato como `timestamp` en la base de datos.
   */
  @UpdateDateColumn({ type: 'timestamp' })  //Esta es una opcion rapida y facil de actualizar la fecha de actualizacion
  updatedAt!: Date;

  // Hook que se ejecuta automáticamente antes de cada UPDATE
/*   @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = this.dateService.getNow();  // Aquí pones la fecha como tú quieras
  } */


}