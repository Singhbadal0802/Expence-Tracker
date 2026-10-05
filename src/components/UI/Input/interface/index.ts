export interface InputProps
extends React.InputHTMLAttributes<HTMLInputElement> {
    type: string;
    placeholder: string;
    inputTitle?: string;
    defaultValue?: string | number;
    error?: boolean;
    errorMessage?: string;
    tabIndex?: number;
    name: string;
}