import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ValidationGuard implements CanActivate {
  private readonly logger = new Logger(ValidationGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { query } = request;

    if (query.page && (!Number.isInteger(+query.page) || +query.page < 1)) {
      this.logger.warn(`Invalid page parameter: ${query.page}`);
      throw new BadRequestException('Page must be a positive integer');
    }

    if (query.limit && (!Number.isInteger(+query.limit) || +query.limit < 1)) {
      this.logger.warn(`Invalid limit parameter: ${query.limit}`);
      throw new BadRequestException('Limit must be a positive integer');
    }

    if (query.limit && +query.limit > 100) {
      this.logger.warn(`Limit too high: ${query.limit}`);
      throw new BadRequestException('Limit cannot exceed 100');
    }

    return true;
  }
}
