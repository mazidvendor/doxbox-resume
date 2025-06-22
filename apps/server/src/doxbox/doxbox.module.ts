import { forwardRef, Module } from "@nestjs/common";

import { DoxboxController } from "./doxbox.controller";
import { DoxboxService } from "./doxbox.service";

@Module({
  imports: [],
  controllers: [DoxboxController],
  providers: [DoxboxService],
  exports: [DoxboxService],
})
export class DoxboxModule {}
