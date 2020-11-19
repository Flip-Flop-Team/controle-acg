export interface IUserState {
  id?: number;
  email?: string;
  nome?: string;
  is_admin?: boolean;
}

interface IUserModel {
  namespace: 'user';
  state: IUserState;
}

const UserModel: IUserModel = {
  namespace: 'user',
  state: {},
};

export default UserModel;
