import { PartialType, OmitType } from "@nestjs/swagger";
import { CreateUsuarioDto } from "./create-usuario.dto";


// Eliminar la propiedad "password" de CreateUsuarioDto
export class UpdateUsuarioDto extends PartialType(
  OmitType(CreateUsuarioDto, ["password"] as const)
) {}
