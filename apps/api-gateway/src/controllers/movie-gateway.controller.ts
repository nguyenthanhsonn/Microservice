import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SERVICE_NAMES, ServicePatterns } from '@app/contracts';

@Controller('movies')
export class MovieGatewayController {
  constructor(@Inject(SERVICE_NAMES.MOVIE) private readonly movieClient: ClientProxy) {}

  @Get()
  list() {
    return firstValueFrom(this.movieClient.send(ServicePatterns.movie.list, {}));
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return firstValueFrom(this.movieClient.send(ServicePatterns.movie.findById, { id }));
  }
}
