import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Rule, RuleType } from '@/types/rules';

const tags = [
  { value: 'archived', label: 'Archived' },
  { value: 'accessory', label: 'Accessory' },
  { value: 'premium', label: 'Premium' },
  { value: 'snow', label: 'Snow' },
  { value: 'snowboard', label: 'Snowboard' },
  { value: 'sport', label: 'Sport' },
];

const MOCK_OPTIONS = {
  specific_collections: [
    'Summer Collection',
    'Winter Collection',
    'Holiday Special',
    'Clearance',
    'New Arrivals',
  ],
  product_tags: [
    'Premium',
    'Sale',
    'New',
    'Limited Edition',
    'Archived',
    'Accessory',
    'Snow',
    'Snowboard',
  ],
  product_vendors: ['Nike', 'Adidas', 'Puma', 'Under Armour', 'Reebok'],
  specific_products: [
    'Running Shoes',
    'Cotton T-Shirt',
    'Denim Jeans',
    'Leather Jacket',
    'Winter Coat',
  ],
};

export default function SearchMultiSelect({
  rules,
  rule,
  addValueToRule,
  removeValueFromRule,
  getSelectedCount,
}: {
  rules: Rule[];
  rule: Rule;
  addValueToRule: any;
  removeValueFromRule: any;
  getSelectedCount: any;
}) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // ... (keep useEffect and other logic the same)

  const getFilteredOptions = (type: RuleType, ruleId: string) => {
    const rule = rules.find((r) => r.id === ruleId);
    if (!rule) return [];

    const options = MOCK_OPTIONS[type as keyof typeof MOCK_OPTIONS] || [];
    const filteredOptions = searchValue
      ? options.filter((opt) =>
          opt.toLowerCase().includes(searchValue.toLowerCase())
        )
      : options;

    return filteredOptions;
  };

  return (
    <div className='relative w-full max-w-md' ref={dropdownRef}>
      <div
        className='flex items-center rounded-lg border shadow-sm px-3 h-11'
        onClick={() => setOpen(true)}
      >
        <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
        <Input
          placeholder='Search product tags'
          className='border-0 h-9 flex-1 bg-transparent outline-none focus:outline-none focus:bottom-0 placeholder:text-muted-foreground'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onBlur={() => setTimeout(() => setOpen(false), 100)}
        />
        <div className='text-sm text-muted-foreground'>
          {getSelectedCount(rule.values)} {/* Use rule.values here */}
        </div>
      </div>

      {open && (
        <div className='absolute top-full left-0 w-full mt-1 rounded-lg border shadow-sm bg-popover z-10'>
          <Command>
            <CommandList>
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup className='p-2 max-h-[200px] overflow-auto'>
                {getFilteredOptions(rule.type, rule.id).map((option) => (
                  <CommandItem
                    key={option}
                    onSelect={() => {
                      // Simplified handler
                      if (rule.values.includes(option)) {
                        removeValueFromRule(rule.id, option);
                      } else {
                        addValueToRule(rule.id, option);
                      }
                    }}
                    className='flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer'
                  >
                    <Checkbox
                      checked={rule.values.includes(option)} // Directly check rule.values
                      className={cn(
                        rule.values.includes(option)
                          ? 'opacity-100'
                          : 'opacity-40'
                      )}
                    />
                    <span>{option}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
