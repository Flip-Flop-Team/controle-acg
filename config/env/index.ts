import { env as environments } from './env'; ;

export interface IEnvironment {
  version?: string;
  provider?: string;
  description?: string;
  title?: string;
  apiUrl?: string;
  theme?: {};
}

export default {
  ...environments
};
