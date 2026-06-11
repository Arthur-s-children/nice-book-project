import logo from '../../assets/images/Logo.svg';

type Props = {
  className?: string;
};

export const Logo = ({ className }: Props) => {
  return (
    <img
      src={logo}
      className={className}
      alt="Nice Books"
    />
  );
};
