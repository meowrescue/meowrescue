
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DatePickerProps {
  mode?: "single" | "multiple" | "range";
  selected?: Date | Date[] | { from: Date; to?: Date } | undefined;
  onSelect?: (date: Date | Date[] | { from: Date; to?: Date } | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean | ((date: Date) => boolean);
}

export function DatePicker({
  mode = "single",
  selected,
  onSelect,
  placeholder,
  className,
  disabled,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected instanceof Date ? (
            format(selected, "PPP")
          ) : (
            <span>{placeholder || "Pick a date"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {mode === "single" && (
          <Calendar
            mode="single"
            selected={selected as Date}
            onSelect={onSelect as (date: Date | undefined) => void}
            disabled={disabled}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        )}
        {mode === "multiple" && (
          <Calendar
            mode="multiple"
            selected={selected as Date[]}
            onSelect={onSelect as (date: Date[] | undefined) => void}
            disabled={disabled}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        )}
        {mode === "range" && (
          <Calendar
            mode="range"
            selected={selected as { from: Date; to?: Date }}
            onSelect={onSelect as (date: { from: Date; to?: Date } | undefined) => void}
            disabled={disabled}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
