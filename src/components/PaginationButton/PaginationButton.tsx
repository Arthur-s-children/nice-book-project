import { Button } from '@mui/material';
import styles from './PaginationButton.module.scss';

type Props = {
  isSelected?: boolean;
  children: React.ReactNode;
  onClick: () => void;
};

export const PaginationButton = ({
  isSelected = false,
  children,
  onClick,
}: Props) => {
  return (
    <Button
      className={`${styles.button} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      disableRipple
    >
      {children}
    </Button>
  );
};
