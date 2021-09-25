type SequenceAction = 'remove' | 'process';

export default interface AnonymizerOptions {
  sequenceAction: SequenceAction;
  removeDisabled: boolean;
  removePrivateGroups: boolean;
  removeOverlays: boolean;
  removeCurves: boolean;
  keepGroup0018: boolean;
  keepGroup0020: boolean;
  keepGroup0028: boolean;
}
