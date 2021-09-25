type OperationName =
  | 'empty'
  | 'keep'
  | 'remove'
  | 'hash'
  | 'hashuid'
  | 'hashdate'
  | 'require'
  | 'always'
  | 'append'
  | 'contents';

interface Operation {
  operationName: OperationName;
  operationParameters: OperationParameter[];
}
type OperationParameter = 'this' | string | Operation;

export interface ScriptVariable {
  name: string;
  value: string;
}

export interface ScriptOptions {
  removeUnchecked: boolean;
  removePrivateGroups: boolean;
  removeOverlays: boolean;
  removeCurves: boolean;
  keepGroup0018: boolean;
  keepGroup0020: boolean;
  keepGroup0028: boolean;
}

export interface ScriptRule {
  // Enabled?
  enabled: boolean;
  // Tag to match (unpunctuated, i.e. '00100010')
  tag: string;
  // Tag name (PatientID)
  name?: string;
  // Base rule operation to apply
  operation: Operation;
}

export default interface Script {
  options: ScriptOptions;
  variables: ScriptVariable[];
  rules: ScriptRule[];
}
