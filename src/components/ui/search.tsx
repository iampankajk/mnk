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
  addValueToRule: (ruleId: string, value: string) => void;
  removeValueFromRule: (ruleId: string, value: string) => void;
  getSelectedCount: (values: string[], totalOptions: number) => string;
}) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearchValue('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getFilteredOptions = (type: RuleType, ruleId: string) => {
    const rule = rules.find((r) => r.id === ruleId);
    if (!rule) return [];

    const options = MOCK_OPTIONS[type as keyof typeof MOCK_OPTIONS] || [];
    return searchValue
      ? options.filter((opt) =>
          opt.toLowerCase().includes(searchValue.toLowerCase())
        )
      : options;
  };

  return (
    <div className='relative w-full max-w-md' ref={dropdownRef}>
      <div
        className='flex items-center rounded-lg border shadow-sm px-3 h-11 cursor-pointer'
        onClick={() => setOpen((prev) => !prev)}
      >
        <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
        <Input
          placeholder={`Search ${rule.type.split('_').join(' ')}...`}
          className='h-9 flex-1 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus:border-transparent focus-visible:ring-0 focus-visible:outline-none placeholder:text-muted-foreground'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <div className='text-sm text-muted-foreground'>
          {getSelectedCount(
            rule.values,
            MOCK_OPTIONS[rule.type as keyof typeof MOCK_OPTIONS]?.length
          )}
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
                    onMouseDown={(e) => e.stopPropagation()} // Prevent dropdown from closing on checkbox click
                    onSelect={() => {
                      if (rule.values.includes(option)) {
                        removeValueFromRule(rule.id, option);
                      } else {
                        addValueToRule(rule.id, option);
                      }
                    }}
                    className='flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer'
                  >
                    <Checkbox
                      checked={rule.values.includes(option)}
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
