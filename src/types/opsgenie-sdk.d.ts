declare module 'opsgenie-sdk' {
  interface OpsgenieConfig {
    host: string;
    api_key: string;
  }

  interface AlertData {
    message: string;
    alias?: string;
    description?: string;
    teams?: Array<{ name: string }>;
    tags?: string[];
    details?: any;
    entity?: string;
    priority?: string;
  }

  interface ListAlertsParams {
    query?: string;
    limit?: number;
    sort?: string;
    order?: string;
    searchIdentifier?: string;
    searchIdentifierType?: string;
  }

  interface AlertActionParams {
    identifier: string;
    identifierType?: string;
    note?: string;
    source?: string;
    user?: string;
    endTime?: string;
  }

  interface AlertV2 {
    create(data: AlertData, callback: (err: any, result: any) => void): void;
    list(params: ListAlertsParams, callback: (err: any, result: any) => void): void;
    get(params: { identifier: string; identifierType?: string }, callback: (err: any, result: any) => void): void;
    acknowledge(params: AlertActionParams, callback: (err: any, result: any) => void): void;
    close(params: AlertActionParams, callback: (err: any, result: any) => void): void;
    snooze(params: AlertActionParams, callback: (err: any, result: any) => void): void;
    unacknowledge(params: AlertActionParams, callback: (err: any, result: any) => void): void;
    addNote(params: AlertActionParams, callback: (err: any, result: any) => void): void;
  }

  interface OpsgenieSDK {
    configure(config: OpsgenieConfig): void;
    alertV2: AlertV2;
  }

  const opsgenie: OpsgenieSDK;
  export = opsgenie;
}