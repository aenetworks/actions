import { ErrorBase } from './seedWorks';

enum ReleaseType {
  PROD = 'prod',
  BETA = 'beta',
  ALPHA = 'alpha',
  RC = 'rc',
}

export class ReleaseTypeError extends ErrorBase {}

export default ReleaseType;
