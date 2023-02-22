import { clsx } from 'clsx';

type InputWithLabelProps = {
  id: string;
  label: string;
  value: string;
  name?: string;
  placeholder?: string;
  hint?: string;
  type?: React.HTMLInputTypeAttribute;
  autoComplete?: boolean;
  widthClass?: string;
  spaceBetweenClass?: string;
  additionalLabelClass?: string;
  additionalInputClass?: string;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function InputWithLabel({
  id,
  label,
  name,
  value,
  placeholder,
  hint,
  type = 'text',
  autoComplete,
  widthClass,
  spaceBetweenClass,
  additionalLabelClass,
  additionalInputClass,
  onChangeHandler
}: InputWithLabelProps): JSX.Element {
  return (
    <div className={spaceBetweenClass ?? 'space-y-1'}>
      <label htmlFor={id} className={clsx('text-darker', additionalLabelClass)}>
        {label} {hint && <span className='text-gray-500'>{hint}</span>}
      </label>
      <input
        id={id}
        type={type}
        name={name ?? id}
        value={value}
        placeholder={placeholder ?? label}
        autoComplete={autoComplete ? 'on' : 'off'}
        className={clsx(
          'block px-2 py-1 bg-white border-2 border-secondary focus:border-primary rounded focus:outline-none',
          widthClass ?? 'w-full',
          additionalInputClass
        )}
        onChange={onChangeHandler}
      />
    </div>
  );
}
