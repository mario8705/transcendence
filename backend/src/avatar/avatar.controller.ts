// /* eslint-disable prettier/prettier */
// import { Controller, Get } from "@nestjs/common";
// import { AvatarService } from "./avatar.service";

// @Controller('/static')
// export class AvatarController {
//     constructor( 
//         private readonly avatarService: AvatarService
//     ) {}

//     @Get(':avatarpath')
//     async seeUploadedFile() {
//         return this.avatarService.seeUploadedFile("User1");
//     }
// }