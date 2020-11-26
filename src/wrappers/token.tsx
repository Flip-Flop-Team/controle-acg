import { history } from 'umi';
import { setItem } from '@/utils/storage';

export default (props: any) => {
  const {
    children,
    location: {
      pathname,
      query: { token },
    },
  } = props;

  if (token) {
    setItem('session', { token });
    history.replace(pathname);
  }

  return children;
};
