export interface InputProps {
    type: string;
    placeholder: string;
    inputTitle?: string;
    defaultValue?: string | number;
    error?: boolean;
    errorMessage?: string;
    tabIndex?: number;
    name: string;
}