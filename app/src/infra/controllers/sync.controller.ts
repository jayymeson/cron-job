import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { UserSyncService } from '../../apps/users/services/user-sync.service';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Controller('sync')
export class SyncController {
  constructor(private readonly userSyncService: UserSyncService) {}

  @Post('start')
  @HttpCode(HttpStatus.OK)
  async startSync() {
    try {
      await this.userSyncService.syncFromExternalDb();
      await execAsync(
        'kubectl patch cronjob user-sync -p \'{"spec":{"suspend":false}}\'',
      );

      return {
        message:
          'Sincronização iniciada com sucesso. O CronJob está ativo e continuará sincronizando a cada minuto.',
        status: 'success',
      };
    } catch (error) {
      return {
        message: 'Erro ao iniciar a sincronização',
        error: error.message,
        status: 'error',
      };
    }
  }

  @Post('stop')
  @HttpCode(HttpStatus.OK)
  async stopSync() {
    try {
      // Desativar o CronJob no Kubernetes
      await execAsync(
        'kubectl patch cronjob user-sync -p \'{"spec":{"suspend":true}}\'',
      );

      return {
        message:
          'Sincronização interrompida com sucesso. O CronJob está suspenso.',
        status: 'success',
      };
    } catch (error) {
      return {
        message: 'Erro ao interromper a sincronização',
        error: error.message,
        status: 'error',
      };
    }
  }
}
