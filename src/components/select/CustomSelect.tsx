import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons';

interface CustomSelectProps {
  label: string;
  items: string[];
  value: string;
  onChange: (newValue: string) => void;
}

function CustomSelect({ label, items, value, onChange }: CustomSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger
          className="
            inline-flex items-center justify-between 
            w-full px-3 py-2 text-sm bg-white border border-gray-300 
            rounded shadow-sm focus:outline-none
          "
          aria-label={label}
        >
          <Select.Value />
          <Select.Icon>
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className="bg-white shadow-lg rounded border border-gray-200">
            <Select.Viewport className="p-1">
              {items.map((item) => (
                <Select.Item
                  key={item}
                  value={item}
                  className="
                    relative flex items-center px-6 py-2 text-sm text-gray-700 
                    rounded cursor-pointer hover:bg-gray-100
                  "
                >
                  <Select.ItemText>{item}</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-2">
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

export default CustomSelect;
