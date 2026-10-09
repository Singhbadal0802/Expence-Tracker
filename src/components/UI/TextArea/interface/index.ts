export default interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  inputTitle: string;
  error?: boolean;
  errorMessage?: string;
  name:string;
  props?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
}
