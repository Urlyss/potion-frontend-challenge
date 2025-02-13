import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FilterValueTrade = {
  roi: { min: ""; max: "" };
  holding: { min: string; max: string };
  avgBuy: { min: string; max: string };
  avgSell: { min: string; max: string };
  held: { min: string; max: string };
  lastTrade: { min: string; max: string };
  marketCap: { min: string; max: string };
  realizedPNL: { min: string; max: string };
  invested: { min: string; max: string };
};



type FilterValueTrader = {
  rank: { min: string; max: string }
  followers: { min: string; max: string }
  tokens: { min: string; max: string }
  winRate: { min: string; max: string }
  avgBuy: { min: string; max: string }
  avgEntry: { min: string; max: string }
  realizedPNL: { min: string; max: string }
};

export type FilterValues = FilterValueTrader | FilterValueTrade

type FilterFormProps = {
  filters: FilterValues;
  onChange: (
    key: keyof FilterValues,
    subKey: "min" | "max",
    value: string
  ) => void;
};

export function FilterForm({ filters, onChange }: FilterFormProps) {
  return (
    <div className="grid gap-4 py-10">
      {Object.entries(filters).map(([key, value]) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={`${key}-min`} className="text-sm font-medium">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </Label>
          <div className="flex gap-2">
            <Input
              id={`${key}-min`}
              placeholder="Min"
              value={value.min}
              onChange={(e) =>
                onChange(key as keyof FilterValues, "min", e.target.value)
              }
              className="flex-1"
            />
            <Input
              id={`${key}-max`}
              placeholder="Max"
              value={value.max}
              onChange={(e) =>
                onChange(key as keyof FilterValues, "max", e.target.value)
              }
              className="flex-1"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
