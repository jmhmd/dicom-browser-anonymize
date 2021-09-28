import Series from './Series';

export default interface Study {
  studyInstanceUID: string;
  studyDescription?: string;
  series: Series[];
}
