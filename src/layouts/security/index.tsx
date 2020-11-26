import React from 'react';
import { connect, Loading, Dispatch, history } from 'umi';
import { removeExpired, hasItem } from '@/utils/storage';
import { IUserState } from '@/pages/login/model';
import PageLoading from '@/components/page-loading';

interface SecurityLayoutProps {
  loading: boolean;
  user: IUserState;
  location: any;
  dispatch: Dispatch;
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    const loginUrl = `/login/`;

    removeExpired();

    if (!hasItem('session')) {
      history.replace(loginUrl);
      return;
    }

    this.setState({ isReady: true });
  }

  render() {
    const { isReady } = this.state;
    const { loading, children } = this.props;

    if (!isReady || loading) {
      return <PageLoading showFooter message="validando acesso" />;
    }

    return children;
  }
}

interface IConnect {
  user: IUserState;
  loading: Loading;
}

export default connect(({ user, loading }: IConnect) => ({
  user,
  loading: loading.models.user,
}))(SecurityLayout);
