"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { TraderProfile } from ".";
import { useRouter } from "next/navigation";

interface TraderModalProps {
  address: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TraderModal({ address, open, onOpenChange }: TraderModalProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-semibold">Trader Profile</h2>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              onOpenChange(false);
              router.push(`/traders/${address}`);
            }}
          >
            <ExternalLink className="h-4 w-4" />
            Open in full page
          </Button>
        </DialogHeader>
        {address && <TraderProfile address={address} modal={true}/>}
      </DialogContent>
    </Dialog>
  );
}
