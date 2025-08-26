import 'dotenv/config';
import * as opsgenie from 'opsgenie-sdk';
import { log, error } from './logger.js';

interface OpsgenieTeam {
  name: string;
}

interface AlertListParams {
  query?: string;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  searchIdentifier?: string;
  searchIdentifierType?: 'id' | 'tiny' | 'alias';
}

interface AlertActionParams {
  note?: string;
  source?: string;
  user?: string;
}

interface SnoozeParams extends AlertActionParams {
  endTime: string;
}

interface AddNoteParams extends AlertActionParams {
  note: string;
}

export class OpsgenieClient {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPSGENIE_API_KEY || '';
    
    if (!this.apiKey) {
      throw new Error('Opsgenie API key is required');
    }

    // Configure Opsgenie SDK
    opsgenie.configure({
      host: 'https://api.opsgenie.com',
      api_key: this.apiKey,
    });
  }

  async createAlert(params: {
    message: string;
    alias?: string;
    description?: string;
    teams?: OpsgenieTeam[];
    tags?: string[];
    details?: any;
    entity?: string;
    priority?: string;
  }): Promise<any> {
    const createAlertJson = {
      message: params.message,
      alias: params.alias,
      description: params.description,
      teams: params.teams || [],
      tags: params.tags || [],
      details: params.details || {},
      entity: params.entity,
      priority: params.priority || 'P3',
    };

    return new Promise((resolve, reject) => {
      opsgenie.alertV2.create(createAlertJson, function (err: any, alert: any) {
        if (err) {
          error('Opsgenie Create Alert Error:', err);
          return reject(new Error(`Failed to create alert: ${err.message || err}`));
        } else {
          log('Opsgenie Alert Created:', alert);
          resolve(alert);
        }
      });
    });
  }

  async listAlerts(params: AlertListParams = {}): Promise<any> {
    const listParams = {
      query: params.query,
      limit: params.limit || 20,
      sort: params.sort || 'createdAt',
      order: params.order || 'desc',
      searchIdentifier: params.searchIdentifier,
      searchIdentifierType: params.searchIdentifierType,
    };

    return new Promise((resolve, reject) => {
      opsgenie.alertV2.list(listParams, function (err: any, alerts: any) {
        if (err) {
          error('Opsgenie List Alerts Error:', err);
          return reject(new Error(`Failed to list alerts: ${err.message || err}`));
        } else {
          log('Opsgenie Alerts Listed:', alerts?.data?.length || 0, 'alerts');
          resolve(alerts);
        }
      });
    });
  }

  async getAlert(identifier: string, identifierType: 'id' | 'tiny' | 'alias' = 'id'): Promise<any> {
    const getParams = {
      identifier,
      identifierType,
    };

    return new Promise((resolve, reject) => {
      opsgenie.alertV2.get(getParams, function (err: any, alert: any) {
        if (err) {
          error('Opsgenie Get Alert Error:', err);
          return reject(new Error(`Failed to get alert: ${err.message || err}`));
        } else {
          log('Opsgenie Alert Retrieved:', alert?.data?.id);
          resolve(alert);
        }
      });
    });
  }

  async acknowledgeAlert(
    identifier: string,
    identifierType: 'id' | 'tiny' | 'alias' = 'id',
    params: AlertActionParams = {}
  ): Promise<any> {
    const ackParams = {
      identifier,
      identifierType,
      note: params.note,
      source: params.source,
      user: params.user,
    };

    return new Promise((resolve, reject) => {
      opsgenie.alertV2.acknowledge(ackParams, function (err: any, result: any) {
        if (err) {
          error('Opsgenie Acknowledge Alert Error:', err);
          return reject(new Error(`Failed to acknowledge alert: ${err.message || err}`));
        } else {
          log('Opsgenie Alert Acknowledged:', identifier);
          resolve(result);
        }
      });
    });
  }

  async closeAlert(
    identifier: string,
    identifierType: 'id' | 'tiny' | 'alias' = 'id',
    params: AlertActionParams = {}
  ): Promise<any> {
    const closeParams = {
      identifier,
      identifierType,
      note: params.note,
      source: params.source,
      user: params.user,
    };

    return new Promise((resolve, reject) => {
      opsgenie.alertV2.close(closeParams, function (err: any, result: any) {
        if (err) {
          error('Opsgenie Close Alert Error:', err);
          return reject(new Error(`Failed to close alert: ${err.message || err}`));
        } else {
          log('Opsgenie Alert Closed:', identifier);
          resolve(result);
        }
      });
    });
  }

  async snoozeAlert(
    identifier: string,
    identifierType: 'id' | 'tiny' | 'alias' = 'id',
    params: SnoozeParams
  ): Promise<any> {
    const snoozeParams = {
      identifier,
      identifierType,
      endTime: params.endTime,
      note: params.note,
      source: params.source,
      user: params.user,
    };

    return new Promise((resolve, reject) => {
      opsgenie.alertV2.snooze(snoozeParams, function (err: any, result: any) {
        if (err) {
          error('Opsgenie Snooze Alert Error:', err);
          return reject(new Error(`Failed to snooze alert: ${err.message || err}`));
        } else {
          log('Opsgenie Alert Snoozed:', identifier, 'until', params.endTime);
          resolve(result);
        }
      });
    });
  }

  async unacknowledgeAlert(
    identifier: string,
    identifierType: 'id' | 'tiny' | 'alias' = 'id',
    params: AlertActionParams = {}
  ): Promise<any> {
    const unackParams = {
      identifier,
      identifierType,
      note: params.note,
      source: params.source,
      user: params.user,
    };

    return new Promise((resolve, reject) => {
      opsgenie.alertV2.unacknowledge(unackParams, function (err: any, result: any) {
        if (err) {
          error('Opsgenie Unacknowledge Alert Error:', err);
          return reject(new Error(`Failed to unacknowledge alert: ${err.message || err}`));
        } else {
          log('Opsgenie Alert Unacknowledged:', identifier);
          resolve(result);
        }
      });
    });
  }

  async addNoteToAlert(
    identifier: string,
    identifierType: 'id' | 'tiny' | 'alias' = 'id',
    params: AddNoteParams
  ): Promise<any> {
    const noteParams = {
      identifier,
      identifierType,
      note: params.note,
      source: params.source,
      user: params.user,
    };

    return new Promise((resolve, reject) => {
      opsgenie.alertV2.addNote(noteParams, function (err: any, result: any) {
        if (err) {
          error('Opsgenie Add Note Error:', err);
          return reject(new Error(`Failed to add note to alert: ${err.message || err}`));
        } else {
          log('Note added to Opsgenie Alert:', identifier);
          resolve(result);
        }
      });
    });
  }
}

// Legacy function for backward compatibility
export async function sendOpsgenieAlert(
  message: string,
  alias: string,
  description: string,
  teams: OpsgenieTeam[],
  tags: string[],
  details: any,
  entity: string,
  priority: string,
  opsgenieApiKey?: string
): Promise<any> {
  const client = new OpsgenieClient(opsgenieApiKey);
  return client.createAlert({
    message,
    alias,
    description,
    teams,
    tags,
    details,
    entity,
    priority,
  });
}