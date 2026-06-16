import { Button } from '@mui/material';
import styles from './Button.module.scss';

type Props = {
  variant?: 'primary' | 'selected';
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export const AppButton = ({
  variant = 'primary',
  children,
  onClick,
}: Props) => {
  return (
    <Button
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      disableRipple
      sx={{
        'boxShadow': '0 4px 20px rgba(31, 99, 108, 0.3)',
        '&:hover': {
          boxShadow: '0 6px 30px rgba(31, 99, 108, 0.4)',
        },
      }}
    >
      {children}
    </Button>
  );
};
