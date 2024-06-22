'use client';

import { useMemo } from 'react';
import { type SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';

type Props = {
    onChange: (value?: string) => void;
    onCreate?: (value: string) => void;
    options?: { label: string; value: string }[];
    value?: string | null | undefined;
    disabled?: boolean;
    placeholder?: string;
};

export const Select = ({
    value,
    onChange,
    disabled,
    onCreate,
    options = [],
    placeholder,
}: Props) => {
    const onSelect = (
        option: SingleValue<{ label: string; value: string }>
    ) => {
        onChange(option?.value);
    };

    const formattedValue = useMemo(() => {
        return options.find(option => option.value === value);
    }, [options, value]);

    return (
        <CreatableSelect
            placeholder={placeholder}
            className="text-sm h-10"
            styles={{
                singleValue: base => ({
                    ...base,
                    color: 'white',
                }),
                control: base => ({
                    ...base,
                    backgroundColor: 'bg-popover',
                    borderColor: 'border-input',
                    borderRadius: '10px',

                    ':hover': {
                        backgroundColor: 'inherit',
                    },
                }),
                menuList: base => ({
                    ...base,
                    backgroundColor: '#171717',
                }),
                option: base => ({
                    ...base,
                    backgroundColor: 'rgba(34, 197, 94, 0.5)',
                }),
            }}
            value={formattedValue}
            onChange={onSelect}
            options={options}
            onCreateOption={onCreate}
            isDisabled={disabled}
        />
    );
};
