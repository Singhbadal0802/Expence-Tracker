export interface CustomDropdownProps {
  options: optionType[];
  selectedOption?: string;
  onSelect: (option: string) => void;
  customClass?: string;
  tabIndex?: number;
  icon?: React.ReactNode;
  inputTitle?: string;
  error?: boolean;
  name: string;
}

type optionType = {
  label: string;
  value: string | undefined;
};