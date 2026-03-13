import { ipcMain } from 'electron';
import { readConfig, updateConfig } from '../workspace/config.js';
import type { AppConfig } from '../workspace/config.js';
import { getGatewayClient } from '../ws/index.js';
import type { GatewayAuth } from '@clawwork/shared';

function buildAuth(config: AppConfig): GatewayAuth | undefined {
  if (config.bootstrapToken) return { token: config.bootstrapToken };
  if (config.password) return { password: config.password };
  return undefined;
}

export function registerSettingsHandlers(): void {
  ipcMain.handle('settings:get', (): AppConfig | null => {
    return readConfig();
  });

  ipcMain.handle(
    'settings:update',
    (_event, partial: Partial<AppConfig>): { ok: boolean; config: AppConfig } => {
      const config = updateConfig(partial);

      const needsReconnect = partial.gatewayUrl || partial.bootstrapToken || partial.password;
      if (needsReconnect) {
        const gateway = getGatewayClient();
        if (gateway && config.gatewayUrl) {
          gateway.updateConfig(config.gatewayUrl, buildAuth(config));
        }
      }

      return { ok: true, config };
    },
  );
}
