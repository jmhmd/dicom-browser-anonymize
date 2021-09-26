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
  | 'contents'
  | 'date'
  | 'time'
  | 'param'
  | 'deidmethodcodeseq';

type OperationParameter = 'this' | string | Operation;

interface Operation {
  operationName: OperationName;
  operationParameters?: OperationParameter[];
}

export interface ScriptVariable {
  name: string;
  value: string;
}

export interface ScriptOptions {
  sequenceAction: string;
  removeDisabled: boolean;
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
