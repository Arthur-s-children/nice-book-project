import { FormControl, MenuItem, Select } from '@mui/material';
import styles from './Dropdown.module.scss';
import { Icon } from '../ui/Icon';
import { useState } from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
};

export const Dropdown = ({ value, onChange, options, placeholder }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FormControl className={styles.formControl}>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
        className={styles.select}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        IconComponent={() => <Icon name={isOpen ? 'arrow-up' : 'arrow-down'} />}
        renderValue={(selected) => selected || placeholder || 'Default'}
        MenuProps={{
          slotProps: {
            paper: {
              sx: {
                marginTop: '4px',
                borderRadius: '0',
                boxShadow: '0px 2px 15px 0px rgba(0, 0, 0, 0.05)',
                border: '1px solid #E2E6E9 !important',
              },
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            value={option}
            className={styles.menuItem}
            disableRipple
          >
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
