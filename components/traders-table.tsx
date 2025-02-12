"use client";

import {
  Search,
  CopyIcon,
  ExternalLink,
} from "lucide-react";
import type { Trader } from "@/types/trader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type SortingState,
  useReactTable,
  getFilteredRowModel,
  FilterFn,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { DataTablePagination } from "./DataTablePagination";
import {
  cn,
  formatAvgHold,
  formatMoney,
  formatSolanaAddress,
  SOL_PRICE,
} from "@/lib/utils";
import { Input } from "./ui/input";
import { rankItem } from "@tanstack/match-sorter-utils";
import { toast } from "@/hooks/use-toast";
import { FilterModal } from "./filter-modal";
import { FilterValues } from "./filter-form";
import Image from "next/image";

interface TradersTableProps {
  traders: Trader[];
  loading: boolean;
  error: string | null;
  applyFilters: (filters: FilterValues) => void;
  filters: FilterValues;
}

export function TradersTable({
  traders,
  loading,
  error,
  applyFilters,
  filters,
}: TradersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const fuzzyFilter: FilterFn<string> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value);

    // Store the itemRank info
    addMeta({ itemRank });

    // Return if the item should be filtered in/out
    return itemRank.passed;
  };

  const activeFiltersCount = Object.values(filters).reduce(
    (count, filter) => count + (filter.min ? 1 : 0) + (filter.max ? 1 : 0),
    0
  );

  const columns = useMemo<ColumnDef<Trader>[]>(
    () => [
      {
        accessorKey: "rank",
        enableGlobalFilter: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Rank" />
        ),
        cell: ({ row }) => {
          const rank = row.original.rank;
          return (
            <div className="md:w-12">
              <div
                className={cn(
                  "w-8 h-8 text-xs md:text-base rounded-full flex justify-center items-center",
                  rank == 1 && "bg-yellow-500 text-black",
                  rank == 2 && "bg-slate-500 text-black",
                  rank == 3 && "bg-yellow-800 text-black"
                )}
              >
                {rank}
              </div>
            </div>
          );
        },
      },
      {
        id: "name",
        accessorFn: (row) => `${row.name} ${row.address}`,
        header: "Trader",
        cell: ({ row }) => {
          const trader = row.original;
          return (
            <div className="flex items-center gap-2 w-40">
              <img
                src={trader.avatar || "/placeholder.svg"}
                alt={trader.name}
                className="h-8 w-8 rounded-full"
              />
              <div>
                <div className="font-medium">{trader.name}</div>
                <div className="flex gap-2 items-center md:text-sm text-gray-500 text-xs">
                  {formatSolanaAddress(trader.address)}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:w-6 md:h-6 h-4 w-4"
                    onClick={() => {
                      navigator.clipboard.writeText(trader.address)
                      .then(() => {
                        console.log('Text copied to clipboard: ' + trader.address);
                        toast({
                          description: "Address copied to clipboard",
                        });
                      })
                      .catch(err => {
                        console.error('Failed to copy text: ', err);
                      });
                      
                    }}
                  >
                    <CopyIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "handle",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Followers" />
        ),
        cell: ({ row }) => {
          const followers = row.original.followers;
          const handle = row.original.handle;
          return (
            <div className="flex flex-col items-end w-20">
              <div>{followers.toLocaleString()}</div>
              <a
                href={`https://x.com/${handle}`}
                target="_blank"
                className="text-gray-500 text-xs hover:text-primary"
              >
                {handle}
              </a>
            </div>
          );
        },
      },
      {
        accessorKey: "tokens",
        enableGlobalFilter: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Tokens" />
        ),
      },
      {
        accessorKey: "winRate",
        enableGlobalFilter: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Win Rate" />
        ),
        cell: ({ row }) => {
          const winRate = row.original.winRate;
          return (
            <span className={winRate >= 50 ? "text-green-500" : "text-red-500"}>
              {winRate}%
            </span>
          );
        },
      },
      {
        accessorKey: "trades",
        enableGlobalFilter: false,
        header: "Trades",
        cell: ({ row }) => {
          const trades = row.original.trades;
          return (
            <div>
              <span className="text-green-500">{trades.won}</span> /{" "}
              <span className="text-red-500">{trades.total}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "avgBuy",
        enableGlobalFilter: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Avg Buy" />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex flex-col items-end w-20">
              <div className="flex gap-1 items-center">
                <div>{row.original.avgBuy.toLocaleString()}</div>
                <div className="relative w-3 h-3 flex items-end">
                  <Image
                    src={
                      "https://cryptologos.cc/logos/solana-sol-logo.png?v=040"
                    }
                    alt="solana logo"
                    fill
                  />
                </div>
              </div>
              <div>
                {formatMoney(Math.round(row.original.avgBuy * SOL_PRICE))}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "avgEntry",
        enableGlobalFilter: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Avg Entry" />
        ),
        cell: ({ row }) => {
          return (
            <div>
              {formatMoney(Math.round(row.original.avgEntry * SOL_PRICE))}
            </div>
          );
        },
      },
      {
        accessorKey: "avgHold",
        enableGlobalFilter: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Avg Hold" />
        ),
        cell: ({ row }) => {
          return <span>{formatAvgHold(row.original.avgHold)}</span>;
        },
      },
      {
        accessorKey: "realizedPNL",
        enableGlobalFilter: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Realized PNL" />
        ),
        cell: ({ row }) => {
          const pnl = row.original.realizedPNL;
          return (
            <div className="flex flex-col items-end w-20">
              <div className="flex gap-1 items-center">
                <div className={pnl >= 0 ? "text-green-500" : "text-red-500"}>
                  {pnl >= 0 ? "+" : ""}
                  {pnl}
                </div>
                <div className="relative w-3 h-3 flex items-end">
                  <Image
                    src={
                      "https://cryptologos.cc/logos/solana-sol-logo.png?v=040"
                    }
                    alt="solana logo"
                    fill
                  />
                </div>
              </div>
              <div>{formatMoney(pnl * SOL_PRICE)}</div>
            </div>
          );
        },
      },
      {
        id: "actions",
        enableGlobalFilter: false,
        header: "Share",
        cell: () => {
          return (
            <Button variant="ghost" size="icon" className="w-6 h-6">
              <ExternalLink className="h-4 w-4 text-purple-500" />
            </Button>
          );
        },
      },
    ],
    [formatAvgHold]
  );

  const table = useReactTable({
    data: traders,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex lg:items-center lg:justify-between w-full lg:flex-row flex-col gap-5">
        <div className="flex md:items-center md:justify-between md:flex-row flex-col md:gap-32 gap-5">
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-primary/20 rounded-full text-primary-foreground md:text-base text-xs">
              Traders
            </button>
            <button className="px-4 py-2 md:text-base text-xs">Groups</button>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-primary/20 rounded-full text-white md:text-base text-xs">
              Daily
            </button>
            <button className="px-4 py-2 text-gray-400 hover:text-white md:text-base text-xs">
              Weekly
            </button>
            <button className="px-4 py-2 text-gray-400 hover:text-white md:text-base text-xs">
              Monthly
            </button>
            <button className="px-4 py-2 text-gray-400 hover:text-white md:text-base text-xs">
              All-Time
            </button>
          </div>
        </div>
        <div className="flex gap-2 md:items-end">
          <div className="relative w-full lg:w-fit">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="search"
              placeholder="Search by trader name, address or X handle"
              value={globalFilter}
              onChange={(e) => table.setGlobalFilter(String(e.target.value))}
              className="w-full pl-9 bg-background border-gray-700 text-white placeholder:text-gray-500 rounded-full"
            />
          </div>
          <div className="relative">
            <FilterModal
              filters={filters}
              applyFilters={applyFilters}
              activeFiltersCount={activeFiltersCount}
            />
            {activeFiltersCount > 0 && (
              <span className="absolute -bottom-2 -right-2 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </div>
        </div>
      </div>
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading traders...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      {!loading && !error && (
        <>
          <div className="border border-gray-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-primary/20">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-gray-800/50"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-primary-foreground"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-gray-800/50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="mx-auto">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DataTablePagination table={table} />
        </>
      )}
    </div>
  );
}
