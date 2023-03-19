import { Combobox } from '@headlessui/react';
import { clsx } from 'clsx';
import { useId } from 'react';

type ExpandableInputProps = {
  label: string;
  cbLabel: string;
  cbValue: string | string[];
  cbOptions: string[];
  cbOnChange: (value: string | string[]) => string;
  cbInputOnChange: (event: React.ChangeEvent<HTMLInputElement>) => string;
  displayValue: string;
  disabled: boolean;
  isEmpty: boolean;
  maxLength?: number;
};

function TypeCastedCombobox({
  cbValue,
  cbOnChange,
  disabled,
  children
}: {
  cbValue: string | string[];
  cbOnChange: (value: string | string[]) => void;
  disabled: boolean;
  children: JSX.Element | JSX.Element[];
}): JSX.Element {
  if (typeof cbValue === 'string') {
    return (
      <Combobox
        value={cbValue}
        onChange={(value: string | string[]): void => {
          cbOnChange(value);
        }}
        disabled={disabled}
      >
        {children}
      </Combobox>
    );
  } else {
    return (
      <Combobox
        value={cbValue}
        onChange={(value: string | string[]): void => {
          cbOnChange(value);
        }}
        disabled={disabled}
        multiple
      >
        {children}
      </Combobox>
    );
  }
}

export default function ExpandableInput({
  label,
  cbLabel,
  cbValue,
  cbOptions,
  cbOnChange,
  cbInputOnChange,
  displayValue,
  disabled,
  isEmpty,
  maxLength
}: ExpandableInputProps): JSX.Element {
  const id = useId();

  return (
    <div className='flex flex-row items-center font-semibold text-sm italic text-secondary space-x-1'>
      <h3>{label}:</h3>
      <TypeCastedCombobox
        cbValue={cbValue}
        cbOnChange={(value: string | string[]): void => {
          const spanActual = document.getElementById(id) as HTMLSpanElement;

          const formattedValue = cbOnChange(value);

          spanActual.innerText = formattedValue;
        }}
        disabled={disabled}
      >
        <div className='relative'>
          {/* https://css-tricks.com/auto-growing-inputs-textareas/ */}
          <div
            id='input-grow-horizontal-wrapper'
            className='min-w-[4rem] px-2 flex flex-row items-center relative'
          >
            <span
              id={id}
              aria-hidden='true'
              className='min-w-[4rem] px-0.5 invisible empty:before:content-[""] before:inline-block whitespace-pre-wrap'
            >
              {displayValue}
            </span>
            <Combobox.Input
              onChange={(event): void => {
                const spanActual = document.getElementById(
                  id
                ) as HTMLSpanElement;

                const formattedValue = cbInputOnChange(event);
                spanActual.innerText = formattedValue;
              }}
              value={displayValue}
              className={clsx(
                'w-full min-w-[4rem] px-2 bg-inherit italic focus:outline-none absolute left-0 z-10',
                {
                  'border-b border-secondary': isEmpty
                }
              )}
              maxLength={maxLength}
            />
          </div>{' '}
          <Combobox.Options className='w-full mt-1 py-2 bg-white text-darker not-italic rounded shadow space-y-1 absolute z-10'>
            <p className='px-2 text-sm text-secondary'>{cbLabel}</p>
            <hr />
            {cbOptions.map((value) => (
              <Combobox.Option
                key={value}
                value={value}
                className={({ active }): string =>
                  clsx(
                    'px-2 hover:bg-primary hover:text-white break-words hover:cursor-pointer',
                    {
                      'bg-primary text-white': active
                    }
                  )
                }
              >
                {value}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </div>
      </TypeCastedCombobox>
    </div>
  );
}
