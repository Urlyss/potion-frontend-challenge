import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { CopyIcon, ExternalLink, Settings2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import {
  cn,
  formatMoney,
  formatSolanaAddress,
  fuzzyFilter,
  SOL_PRICE,
} from "@/lib/utils";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { FilterModal } from "../filter-modal";
import type { FilterValues } from "../filter-form";
import { DataTablePagination } from "../DataTablePagination";
import { useRouter } from "next/navigation";

interface Trade {
  token: {
    name: string;
    address: string;
    avatar: string;
  };
  lastTrade: string;
  marketCap: number;
  invested: number;
  realizedPNL: {
    value: number;
    percentage: number;
  };
  roi: number;
  trades: {
    won: number;
    total: number;
  };
  holding: number;
  avgBuy: number;
  avgSell: number;
  held: string;
}

interface TradeListProps {
  trades: Trade[];
  loading: boolean;
  error: string | null;
  modal: boolean;
  applyFilters: (filters: FilterValues) => void;
  filters: FilterValues;
  address?:string
}

export function TradeList({
  trades,
  loading,
  error,
  modal = false,
  applyFilters,
  filters,
  address
}: TradeListProps) {
  const [sorting, setSorting] = useState<
    {
      id: string;
      desc: boolean;
    }[]
  >([]);

  const [globalFilter, setGlobalFilter] = useState("");
  const router = useRouter();

  const activeFiltersCount = Object.values(filters).reduce(
    (count, filter) => count + (filter.min ? 1 : 0) + (filter.max ? 1 : 0),
    0
  );

  const columns = useMemo<ColumnDef<Trade>[]>(
    () => [
      {
        accessorKey: "name",
        accessorFn: (row) => `${row.token.name} ${row.token.address}`,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Token" />
        ),
        cell: ({ row }) => {
          const token = row.original.token;
          return (
            <div className="flex items-center gap-2 w-52">
              <img
                src={token.avatar || "/placeholder.svg"}
                alt={token.name}
                className="h-8 w-8 rounded-full"
              />
              <div>
                <div className="font-medium">{token.name}</div>
                <div className="flex gap-2 items-center md:text-sm text-gray-500 text-xs">
                  {formatSolanaAddress(token.address, 6, 6)}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:w-6 md:h-6 h-4 w-4"
                    onClick={() => {
                      navigator.clipboard
                        .writeText(token.address)
                        .then(() => {
                          toast({
                            description: "Address copied to clipboard",
                          });
                        })
                        .catch((err) => {
                          console.error("Failed to copy text: ", err);
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
        accessorKey: "lastTrade",
        enableGlobalFilter: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Last trade" />
        ),
        cell: ({ row }) => row.original.lastTrade,
      },
      {
        accessorKey: "marketCap",
        enableGlobalFilter: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Market Cap" />
        ),
        cell: ({ row }) => (
          <div>${row.original.marketCap.toLocaleString()}</div>
        ),
      },
      {
        accessorKey: "invested",
        enableGlobalFilter: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Invested" />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col items-end w-20">
            <div className="flex gap-1 items-center">
              <div>{row.original.invested.toLocaleString()}</div>
              <div className="relative w-3 h-3 flex items-end">
                <Image
                  src={"https://cryptologos.cc/logos/solana-sol-logo.png?v=040"}
                  alt="solana logo"
                  fill
                />
              </div>
            </div>
            <div>
              {formatMoney(Math.round(row.original.invested * SOL_PRICE))}
            </div>
          </div>
        ),
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
            <div
              className={cn(
                "flex flex-col items-end w-20",
                pnl.value >= 0 ? "text-green-500" : "text-red-500"
              )}
            >
              <div className="flex gap-1 items-center">
                {pnl.value >= 0 ? "+" : ""}
                <div>{pnl.value.toLocaleString()}</div>
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
              <div>{formatMoney(Math.round(pnl.value * SOL_PRICE))}</div>
            </div>
          );
        },
      },
      {
        accessorKey: "roi",
        enableGlobalFilter: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="ROI" />
        ),
        cell: ({ row }) => (
          <div
            className={
              row.original.roi >= 0 ? "text-green-500" : "text-red-500"
            }
          >
            {row.original.roi}%
          </div>
        ),
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
        accessorKey: "holding",
        enableGlobalFilter: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Holding" />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col items-end w-20">
            <div className="flex gap-1 items-center">
              <div>{row.original.holding.toLocaleString()}</div>
              <div className="relative w-3 h-3 flex items-end">
                <Image
                  src={"https://cryptologos.cc/logos/solana-sol-logo.png?v=040"}
                  alt="solana logo"
                  fill
                />
              </div>
            </div>
            <div>
              {formatMoney(Math.round(row.original.holding * SOL_PRICE))}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "avgBuy",
        enableGlobalFilter: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="AVG Buy" />
        ),
        cell: ({ row }) => <div>${row.original.avgBuy.toLocaleString()}</div>,
      },
      {
        accessorKey: "avgSell",
        enableGlobalFilter: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="AVG Sell" />
        ),
        cell: ({ row }) => <div>${row.original.avgSell.toLocaleString()}</div>,
      },
      {
        accessorKey: "held",
        enableGlobalFilter: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Held" />
        ),
        cell: ({ row }) => <div>{row.original.held}</div>,
      },
      {
        id: "actions",
        enableGlobalFilter: false,
        header: "Share",
        cell: () => (
          <button className="p-2 hover:bg-gray-700 rounded-full">
            <ExternalLink className="h-4 w-4 text-purple-500" />
          </button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: trades,
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
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });


  return (
    <div className="space-y-4 w-full">
      <div className="flex lg:flex-row flex-col gap-2 lg:items-center justify-between">
        <div className="flex lg:gap-4 gap-1 *:lg:px-4 *:lg:py-2 *:px-2 *:py-1 *:lg:text-sm *:text-xs *:text-gray-400 *:hover:text-white">
          <button className=" bg-gray-800 rounded-full text-white">
            Trades
          </button>
          <button>Tokens</button>
          <button>Groups</button>
        </div>
        <div className="flex gap-2 md:items-end mx-3">
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
          {modal ? (
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  description: "Open in full page for advanced filters",
                  action: (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => {
                        router.push(`/traders/${address}`);
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open 
                    </Button>
                  ),
                });
              }}
            >
              <Settings2Icon />
            </Button>
          ) : (
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
          )}
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading trades...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="border border-gray-800 overflow-hidden ">
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
