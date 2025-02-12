import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FilterForm, type FilterValues } from "./filter-form";
import { Settings2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

const initialFilters: FilterValues = {
  rank: { min: "", max: "" },
  followers: { min: "", max: "" },
  tokens: { min: "", max: "" },
  winRate: { min: "", max: "" },
  avgBuy: { min: "", max: "" },
  avgEntry: { min: "", max: "" },
  realizedPNL: { min: "", max: "" },
};

type FilterModalProps = {
  filters: FilterValues;
  applyFilters: (filters: FilterValues) => void;
  activeFiltersCount: number;
};

export function FilterModal({
  filters,
  applyFilters,
  activeFiltersCount,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterValues>(filters);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleFilterChange = (
    key: keyof FilterValues,
    subKey: "min" | "max",
    value: string
  ) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [subKey]: value,
      },
    }));
  };

  const handleApply = () => {
    applyFilters(localFilters);
  };

  const handleReset = () => {
    setLocalFilters(initialFilters);
    applyFilters(initialFilters);
  };

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={cn(activeFiltersCount > 0 && "bg-primary/10")}
          >
            <Settings2Icon />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filter Traders</DialogTitle>
          </DialogHeader>
          <FilterForm filters={localFilters} onChange={handleFilterChange} />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleApply}>Apply Filters</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={cn(activeFiltersCount > 0 && "bg-primary/10")}
        >
          <Settings2Icon />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter Traders</DrawerTitle>
        </DrawerHeader>
        <div className="mx-4">
          <FilterForm filters={localFilters} onChange={handleFilterChange} />
          <div className="flex justify-end gap-2 mt-4 mb-4">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleApply}>Apply Filters</Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
