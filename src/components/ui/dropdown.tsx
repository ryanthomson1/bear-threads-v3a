tsx
import * as React from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DropdownProps {
  placeholder?: string;
  value?: string;
  options?: { label: string; value: string }[];
  onSelect?: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  placeholder = "Select an option",
  value,
  options = [],
  onSelect,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSelect = (selectedValue: string) => {
    setLocalValue(selectedValue);
    onSelect?.(selectedValue);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-[200px] justify-between text-sm border border-gray-300 rounded-md focus:border-teal-500"
        >
          {localValue
            ? options.find((option) => option.value === localValue)?.label
            : placeholder}
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList className="max-h-[300px]">
            <CommandInput placeholder={placeholder} />
            <CommandEmpty>No options found.</CommandEmpty>
            <ScrollArea className="h-auto max-h-[200px] overflow-y-auto">
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      localValue === option.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Dropdown;