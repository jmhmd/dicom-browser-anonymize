// Project = ABCD-WXYZ, version 1.0 created on x/xx/12
// Basic Profile with no options
// Works with CTP version 5-21-2012 or later
// All dates and times replaced with current dates and times.
// Patient Name and Patient ID are hashed in this default script
// All PRIVATE TAGS Removed

/**
 * @type {import('../Script').default}
 */
const basicScript = {
  variables: [
    {
      name: 'UIDROOT',
      value: '1613192914',
    },
  ],
  rules: [
    {
      enabled: true,
      tag: '00001000',
      name: 'AffectedSOPInstanceUID',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00001001',
      name: 'RequestedSOPInstanceUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '00020003',
      name: 'MediaStorageSOPInstanceUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '00041511',
      name: 'ReferencedSOPInstanceUIDinFile',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '00080012',
      name: 'InstanceCreationDate',
      operation: { operationName: 'date' },
    },
    {
      enabled: true,
      tag: '00080014',
      name: 'InstanceCreatorUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '00080018',
      name: 'SOPInstanceUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '00080020',
      name: 'StudyDate',
      operation: { operationName: 'date' },
    },
    {
      enabled: true,
      tag: '00080021',
      name: 'SeriesDate',
      operation: { operationName: 'date' },
    },
    {
      enabled: true,
      tag: '00080022',
      name: 'AcquisitionDate',
      operation: { operationName: 'date' },
    },
    {
      enabled: true,
      tag: '00080023',
      name: 'ContentDate',
      operation: { operationName: 'date' },
    },
    {
      enabled: true,
      tag: '00080024',
      name: 'OverlayDate',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00080025',
      name: 'CurveDate',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '0008002a',
      name: 'AcquisitionDatetime',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00080030',
      name: 'StudyTime',
      operation: { operationName: 'time' },
    },
    {
      enabled: true,
      tag: '00080031',
      name: 'SeriesTime',
      operation: { operationName: 'time' },
    },
    {
      enabled: true,
      tag: '00080032',
      name: 'AcquisitionTime',
      operation: { operationName: 'time' },
    },
    {
      enabled: true,
      tag: '00080033',
      name: 'ContentTime',
      operation: { operationName: 'time' },
    },
    {
      enabled: true,
      tag: '00080034',
      name: 'OverlayTime',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00080035',
      name: 'CurveTime',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00080050',
      name: 'AccessionNumber',
      operation: { operationName: 'hash', operationParameters: ['this', '16'] },
    },
    {
      enabled: true,
      tag: '00080058',
      name: 'FailedSOPInstanceUIDList',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '00080070',
      name: 'Manufacturer',
      operation: { operationName: 'keep' },
    },
    {
      enabled: true,
      tag: '00080080',
      name: 'InstitutionName',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00080081',
      name: 'InstitutionAddress',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00080082',
      name: 'InstitutionCodeSequence',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00080090',
      name: 'ReferringPhysicianName',
      operation: { operationName: 'empty' },
    },
    {
      enabled: true,
      tag: '00080092',
      name: 'ReferringPhysicianAddress',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00080094',
      name: 'ReferringPhysicianPhoneNumbers',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00080096',
      name: 'ReferringPhysiciansIDSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '0008010d',
      name: 'ContextGroupExtensionCreatorUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '00080201',
      name: 'TimezoneOffsetFromUTC',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00081010',
      name: 'StationName',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00081030',
      name: 'StudyDescription',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '0008103e',
      name: 'SeriesDescription',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00081040',
      name: 'InstitutionalDepartmentName',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00081048',
      name: 'PhysicianOfRecord',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00081049',
      name: 'PhysicianOfRecordIdSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00081050',
      name: 'PerformingPhysicianName',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00081052',
      name: 'PerformingPhysicianIdSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00081060',
      name: 'NameOfPhysicianReadingStudy',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00081062',
      name: 'PhysicianReadingStudyIdSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00081070',
      name: 'OperatorName',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00081072',
      name: 'OperatorsIdentificationSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00081080',
      name: 'AdmittingDiagnosesDescription',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00081084',
      name: 'AdmittingDiagnosesCodeSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00081090',
      name: 'ManufacturerModelName',
      operation: { operationName: 'keep' },
    },
    {
      enabled: true,
      tag: '00081110',
      name: 'RefStudySeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00081111',
      name: 'RefPPSSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00081120',
      name: 'RefPatientSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00081140',
      name: 'RefImageSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00081150',
      name: 'RefSOPClassUID',
      operation: { operationName: 'keep' },
    },
    {
      enabled: true,
      tag: '00081155',
      name: 'RefSOPInstanceUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '00081195',
      name: 'TransactionUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '00082111',
      name: 'DerivationDescription',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00082112',
      name: 'SourceImageSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00083010',
      name: 'IrradiationEventUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '00084000',
      name: 'IdentifyingComments',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00089123',
      name: 'CreatorVersionUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '00100010',
      name: 'PatientName',
      operation: { operationName: 'hash', operationParameters: ['this', ' 64'] },
    },
    {
      enabled: true,
      tag: '00100020',
      name: 'PatientID',
      operation: { operationName: 'hash', operationParameters: ['this', ' 64'] },
    },
    {
      enabled: true,
      tag: '00100021',
      name: 'IssuerOfPatientID',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00100030',
      name: 'PatientBirthDate',
      operation: { operationName: 'empty' },
    },
    {
      enabled: true,
      tag: '00100032',
      name: 'PatientBirthTime',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00100040',
      name: 'PatientSex',
      operation: { operationName: 'empty' },
    },
    {
      enabled: true,
      tag: '00100050',
      name: 'PatientInsurancePlanCodeSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00100101',
      name: 'PatientPrimaryLanguageCodeSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00100102',
      name: 'PatientPrimaryLanguageModifierCodeSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00101000',
      name: 'OtherPatientIDs',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00101001',
      name: 'OtherPatientNames',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00101002',
      name: 'OtherPatientIDsSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00101005',
      name: 'PatientBirthName',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00101010',
      name: 'PatientAge',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00101020',
      name: 'PatientSize',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00101030',
      name: 'PatientWeight',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00101040',
      name: 'PatientAddress',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00101050',
      name: 'InsurancePlanIdentification',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00101060',
      name: 'PatientMotherBirthName',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00101080',
      name: 'MilitaryRank',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00101081',
      name: 'BranchOfService',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00101090',
      name: 'MedicalRecordLocator',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00102000',
      name: 'MedicalAlerts',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00102110',
      name: 'Allergies',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00102150',
      name: 'CountryOfResidence',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00102152',
      name: 'RegionOfResidence',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00102154',
      name: 'PatientPhoneNumbers',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00102160',
      name: 'EthnicGroup',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00102180',
      name: 'Occupation',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '001021a0',
      name: 'SmokingStatus',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '001021b0',
      name: 'AdditionalPatientHistory',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '001021c0',
      name: 'PregnancyStatus',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '001021d0',
      name: 'LastMenstrualDate',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '001021f0',
      name: 'PatientReligiousPreference',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00102203',
      name: 'PatientSexNeutered',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00102297',
      name: 'ResponsiblePerson',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00102299',
      name: 'ResponsibleOrganization',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00104000',
      name: 'PatientComments',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00120062',
      name: 'PatientIdentityRemoved',
      operation: {
        operationName: 'always',
        operationParameters: ['YES'],
      },
    },
    {
      enabled: true,
      tag: '00120063',
      name: 'DeIdentificationMethod',
      operation: {
        operationName: 'always',
        operationParameters: [
          {
            operationName: 'append',
            operationParameters: ['DICOM-PS3.15E-Basic'],
          },
        ],
      },
    },
    {
      enabled: false,
      tag: '00120064',
      name: 'DeIdentificationMethodCodeSequence',
      operation: { operationName: 'deidmethodcodeseq', operationParameters: ['113100'] },
    },
    {
      enabled: true,
      tag: '00180010',
      name: 'ContrastBolusAgent',
      operation: { operationName: 'empty' },
    },
    {
      enabled: true,
      tag: '00180015',
      name: 'BodyPartExamined',
      operation: { operationName: 'keep' },
    },
    {
      enabled: true,
      tag: '00181000',
      name: 'DeviceSerialNumber',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00181002',
      name: 'DeviceUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '00181004',
      name: 'PlateID',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00181005',
      name: 'GeneratorID',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00181007',
      name: 'CassetteID',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00181008',
      name: 'GantryID',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00181012',
      name: 'DateOfSecondaryCapture',
      operation: { operationName: 'date' },
    },
    {
      enabled: true,
      tag: '00181020',
      name: 'SoftwareVersion',
      operation: { operationName: 'keep' },
    },
    {
      enabled: true,
      tag: '00181030',
      name: 'ProtocolName',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00181078',
      name: 'Radiopharmaceutical Start DateTime',
      operation: { operationName: 'empty' },
    },
    {
      enabled: true,
      tag: '00181079',
      name: 'Radiopharmaceutical Stop DateTime',
      operation: { operationName: 'empty' },
    },
    {
      enabled: true,
      tag: '00181200',
      name: 'DateofLastCalibration',
      operation: { operationName: 'date' },
    },
    {
      enabled: true,
      tag: '00181400',
      name: 'AcquisitionDeviceProcessingDescription',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00184000',
      name: 'AcquisitionComments',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '0018700a',
      name: 'DetectorID',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '0018700c',
      name: 'DateofLastDetectorCalibration',
      operation: { operationName: 'date' },
    },
    {
      enabled: true,
      tag: '00189424',
      name: 'AcquisitionProtocolDescription',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '0018a003',
      name: 'ContributionDescription',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '0020000d',
      name: 'StudyInstanceUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '0020000e',
      name: 'SeriesInstanceUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '00200010',
      name: 'StudyID',
      operation: { operationName: 'empty' },
    },
    {
      enabled: true,
      tag: '00200052',
      name: 'FrameOfReferenceUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '00200200',
      name: 'SynchronizationFrameOfReferenceUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '00203401',
      name: 'ModifyingDeviceID',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00203404',
      name: 'ModifyingDeviceManufacturer',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00203406',
      name: 'ModifiedImageDescription',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00204000',
      name: 'ImageComments',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00209158',
      name: 'FrameComments',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00209161',
      name: 'ConcatenationUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '00209164',
      name: 'DimensionOrganizationUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '00280301',
      name: 'BurnedInAnnotation',
      operation: { operationName: 'keep' },
    },
    {
      enabled: true,
      tag: '00280303',
      name: 'LongitudinalTemporalInformationModified',
      operation: {
        operationName: 'always',
        operationParameters: ['REMOVED'],
      },
    },
    {
      enabled: true,
      tag: '00281199',
      name: 'PaletteColorLUTUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '00281214',
      name: 'LargePaletteColorLUTUid',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '00284000',
      name: 'ImagePresentationComments',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00320012',
      name: 'StudyIDIssuer',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00321000',
      name: 'ScheduledStudyStartDate',
      operation: { operationName: 'date' },
    },
    {
      enabled: true,
      tag: '00321020',
      name: 'ScheduledStudyLocation',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00321021',
      name: 'ScheduledStudyLocationAET',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00321030',
      name: 'ReasonforStudy',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00321032',
      name: 'RequestingPhysician',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00321033',
      name: 'RequestingService',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00321040',
      name: 'StudyArrivalDate',
      operation: { operationName: 'date' },
    },
    {
      enabled: true,
      tag: '00321050',
      name: 'StudyCompletionDate',
      operation: { operationName: 'date' },
    },
    {
      enabled: true,
      tag: '00321060',
      name: 'RequestedProcedureDescription',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00321070',
      name: 'RequestedContrastAgent',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00324000',
      name: 'StudyComments',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00380004',
      name: 'ReferencedPatientAliasSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00380010',
      name: 'AdmissionID',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00380011',
      name: 'IssuerOfAdmissionID',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '0038001e',
      name: 'ScheduledPatientInstitutionResidence',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00380020',
      name: 'AdmittingDate',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00380021',
      name: 'AdmittingTime',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00380040',
      name: 'DischargeDiagnosisDescription',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00380050',
      name: 'SpecialNeeds',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00380060',
      name: 'ServiceEpisodeID',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00380061',
      name: 'IssuerOfServiceEpisodeId',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00380062',
      name: 'ServiceEpisodeDescription',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00380300',
      name: 'CurrentPatientLocation',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00380400',
      name: 'PatientInstitutionResidence',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00380500',
      name: 'PatientState',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00384000',
      name: 'VisitComments',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00400001',
      name: 'ScheduledStationAET',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00400002',
      name: 'SPSStartDate',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00400003',
      name: 'SPSStartTime',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00400004',
      name: 'SPSEndDate',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00400005',
      name: 'SPSEndTime',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00400006',
      name: 'ScheduledPerformingPhysicianName',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00400007',
      name: 'SPSDescription',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '0040000b',
      name: 'ScheduledPerformingPhysicianIDSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00400010',
      name: 'ScheduledStationName',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00400011',
      name: 'SPSLocation',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00400012',
      name: 'PreMedication',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00400241',
      name: 'PerformedStationAET',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00400242',
      name: 'PerformedStationName',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00400243',
      name: 'PerformedLocation',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00400244',
      name: 'PPSStartDate',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00400245',
      name: 'PPSStartTime',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00400248',
      name: 'PerformedStationNameCodeSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00400250',
      name: 'PerformProcedureStepEndDate',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00400253',
      name: 'PPSID',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00400254',
      name: 'PPSDescription',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00400275',
      name: 'RequestAttributesSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00400280',
      name: 'CommentsOnPPS',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00400555',
      name: 'AcquisitionContextSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00401001',
      name: 'RequestedProcedureID',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00401004',
      name: 'PatientTransportArrangements',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00401005',
      name: 'RequestedProcedureLocation',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00401010',
      name: 'NamesOfIntendedRecipientsOfResults',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00401011',
      name: 'IntendedRecipientsOfResultsIDSequence',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00401101',
      name: 'PersonIdCodeSequence',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00401102',
      name: 'PersonAddress',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00401103',
      name: 'PersonTelephoneNumbers',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00401400',
      name: 'RequestedProcedureComments',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00402001',
      name: 'ReasonForImagingServiceRequest',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00402008',
      name: 'OrderEnteredBy',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00402009',
      name: 'OrderEntererLocation',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00402010',
      name: 'OrderCallbackPhoneNumber',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00402016',
      name: 'PlaceOrderNumberOfImagingServiceReq',
      operation: { operationName: 'empty' },
    },
    {
      enabled: true,
      tag: '00402017',
      name: 'FillerOrderNumber',
      operation: { operationName: 'empty' },
    },
    {
      enabled: true,
      tag: '00402400',
      name: 'ImagingServiceRequestComments',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00403001',
      name: 'ConfidentialityPatientData',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00404023',
      name: 'RefGenPurposeSchedProcStepTransUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '00404025',
      name: 'ScheduledStationNameCodeSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00404027',
      name: 'ScheduledStationGeographicLocCodeSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00404030',
      name: 'PerformedStationGeoLocCodeSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00404034',
      name: 'ScheduledHumanPerformersSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00404035',
      name: 'ActualHumanPerformersSequence',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00404036',
      name: 'HumanPerformersOrganization',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00404037',
      name: 'HumanPerformersName',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '0040a027',
      name: 'VerifyingOrganization',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '0040a073',
      name: 'VerifyingObserverSequence',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '0040a075',
      name: 'VerifyingObserverName',
      operation: { operationName: 'empty' },
    },
    {
      enabled: true,
      tag: '0040a078',
      name: 'AuthorObserverSequence',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '0040a07a',
      name: 'ParticipantSequence',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '0040a07c',
      name: 'CustodialOrganizationSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '0040a088',
      name: 'VerifyingObserverIdentificationCodeSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '0040a123',
      name: 'PersonName',
      operation: { operationName: 'empty' },
    },
    {
      enabled: true,
      tag: '0040a124',
      name: 'UID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '0040a730',
      name: 'ContentSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '0040db0c',
      name: 'TemplateExtensionOrganizationUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '0040db0d',
      name: 'TemplateExtensionCreatorUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '00540016',
      name: 'Radiopharmaceutical Information Sequence',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00700001',
      name: 'GraphicAnnotationSequence',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00700084',
      name: 'ContentCreatorsName',
      operation: { operationName: 'empty' },
    },
    {
      enabled: true,
      tag: '00700086',
      name: 'ContentCreatorsIdCodeSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '0070031a',
      name: 'FiducialUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '00880140',
      name: 'StorageMediaFilesetUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '00880200',
      name: 'IconImageSequence',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00880904',
      name: 'TopicTitle',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00880906',
      name: 'TopicSubject',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00880910',
      name: 'TopicAuthor',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '00880912',
      name: 'TopicKeyWords',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '04000100',
      name: 'DigitalSignatureUID',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '04000402',
      name: 'RefDigitalSignatureSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '04000403',
      name: 'RefSOPInstanceMACSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '04000404',
      name: 'MAC',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '04000550',
      name: 'ModifiedAttributesSequence',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '04000561',
      name: 'OriginalAttributesSequence',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '20300020',
      name: 'TextString',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '30060008',
      name: 'StructureSetDate',
      operation: { operationName: 'date' },
    },
    {
      enabled: true,
      tag: '30060024',
      name: 'ReferencedFrameOfReferenceUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '300600c2',
      name: 'RelatedFrameOfReferenceUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '300a0013',
      name: 'DoseReferenceUID',
      operation: { operationName: 'hashuid', operationParameters: ['@UIDROOT', 'this'] },
    },
    {
      enabled: true,
      tag: '300e0008',
      name: 'ReviewerName',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '40000010',
      name: 'Arbitrary',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '40004000',
      name: 'TextComments',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '40080042',
      name: 'ResultsIDIssuer',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '40080102',
      name: 'InterpretationRecorder',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '4008010a',
      name: 'InterpretationTranscriber',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '4008010b',
      name: 'InterpretationText',
      operation: { operationName: 'keep' },
    },
    {
      enabled: true,
      tag: '4008010c',
      name: 'InterpretationAuthor',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '40080111',
      name: 'InterpretationApproverSequence',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '40080114',
      name: 'PhysicianApprovingInterpretation',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '40080115',
      name: 'InterpretationDiagnosisDescription',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '40080118',
      name: 'ResultsDistributionListSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '40080119',
      name: 'DistributionName',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '4008011a',
      name: 'DistributionAddress',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '40080202',
      name: 'InterpretationIdIssuer',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '40080300',
      name: 'Impressions',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: '40084000',
      name: 'ResultComments',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: 'fffafffa',
      name: 'DigitalSignaturesSeq',
      operation: { operationName: 'remove' },
    },
    {
      enabled: true,
      tag: 'fffcfffc',
      name: 'DataSetTrailingPadding',
      operation: { operationName: 'remove' },
    },
  ],
  options: {
    sequenceAction: 'remove',
    removeDisabled: false,
    removePrivateGroups: true,
    removeOverlays: true,
    removeCurves: true,
    keepGroup0018: true,
    keepGroup0020: true,
    keepGroup0028: true,
  },
};

export default basicScript;
