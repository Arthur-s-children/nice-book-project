import logo from '../../assets/logo/Logo.svg';
import logoLight from '../../assets/logo/Logo-light.svg';
import { useTheme } from '../layout/Header/useTheme';

type Props = {
  className?: string;
};

export const Logo = ({ className }: Props) => {
  const { isDark } = useTheme();

  return (
    <>
      {isDark ?
        <img
          src={logoLight}
          className={className}
          alt="Nice Boooks"
        />
      : <img
          src={logo}
          className={className}
          alt="Nice Boooks"
        />
      }
    </>
  );
};
