"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CircleDollarSign, Info, Check, X, Coins, MessageCircle } from "lucide-react";
import { WhatsAppNegotiateButton } from "@/components/whatsapp-negotiate-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatCurrency, formatGameValue } from "@/lib/formatters";



export function ClientTable({ accounts }: { accounts: any[] }) {
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  return (
    <>
      <div className="border rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 p-4 md:p-6 overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Título</TableHead>
              <TableHead>Pontos</TableHead>
              <TableHead>Loyalty</TableHead>
              <TableHead className="text-center">Endereço Seguro</TableHead>
              <TableHead className="text-center">Carta de RK</TableHead>
              <TableHead>Valor R$</TableHead>
              <TableHead>Valor TC</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account: any) => (
              <TableRow
                key={account.id}
                className="group cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedAccount(account)}
              >
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-primary">
                      {account.title}
                    </span>
                    {account.description && (
                      <span title={account.description} className="flex">
                        <Info className="w-4 h-4 text-muted-foreground cursor-help shrink-0" />
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold">{account.points}</span>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-foreground">
                    {account.percentage}%
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    {account.safeAddress ? (
                      <Check className="w-5 h-5 text-primary" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    {account.hasRecoveryKey ? (
                      <Check className="w-5 h-5 text-primary" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    {account.promotionalPrice ? (
                      <>
                        <span className="text-xs text-muted-foreground line-through">
                          {formatCurrency(account.price)}
                        </span>
                        <span className="font-bold text-primary">
                          {formatCurrency(account.promotionalPrice)}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-primary">
                        {formatCurrency(account.price)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-500 shrink-0" />
                    <div className="flex flex-col">
                      {account.promotionalPriceTibiaCoins ? (
                        <>
                          <span className="text-xs text-muted-foreground line-through">
                            {formatGameValue(account.priceTibiaCoins)}
                          </span>
                          <span className="font-bold text-foreground">
                            {formatGameValue(
                              account.promotionalPriceTibiaCoins,
                            )}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-foreground">
                          {formatGameValue(account.priceTibiaCoins)}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div onClick={(e) => e.stopPropagation()}>
                    <WhatsAppNegotiateButton
                      message={`Olá, tenho interesse na conta: ${account.title}`}
                      text="Entrar em contato"
                      size="sm"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!selectedAccount}
        onOpenChange={(isOpen) => !isOpen && setSelectedAccount(null)}
      >
        {selectedAccount && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {selectedAccount.title}
              </DialogTitle>
              {selectedAccount.description && (
                <DialogDescription className="text-base mt-2">
                  {selectedAccount.description}
                </DialogDescription>
              )}
            </DialogHeader>
            <div className="flex flex-col gap-4 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col border-b pb-3 border-border/50">
                  <span className="text-sm text-muted-foreground">
                    Valor R$
                  </span>
                  <div className="flex flex-col mt-1">
                    {selectedAccount.promotionalPrice ? (
                      <>
                        <span className="text-sm text-muted-foreground line-through">
                          {formatCurrency(selectedAccount.price)}
                        </span>
                        <span className="font-bold text-xl text-primary">
                          {formatCurrency(selectedAccount.promotionalPrice)}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-xl text-primary">
                        {formatCurrency(selectedAccount.price)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col border-b pb-3 border-border/50">
                  <span className="text-sm text-muted-foreground">
                    Valor TC
                  </span>
                  <div className="flex flex-col mt-1">
                    {selectedAccount.promotionalPriceTibiaCoins ? (
                      <>
                        <span className="text-sm text-muted-foreground line-through">
                          {formatGameValue(selectedAccount.priceTibiaCoins)}
                        </span>
                        <span className="font-bold text-xl text-foreground flex items-center gap-1.5">
                          <Coins className="w-5 h-5 text-amber-500" />
                          {formatGameValue(
                            selectedAccount.promotionalPriceTibiaCoins,
                          )}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-xl text-foreground flex items-center gap-1.5">
                        <Coins className="w-5 h-5 text-amber-500" />
                        {formatGameValue(selectedAccount.priceTibiaCoins)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col border-b pb-3 border-border/50">
                  <span className="text-sm text-muted-foreground">Pontos</span>
                  <span className="font-semibold text-lg">
                    {selectedAccount.points}
                  </span>
                </div>
                <div className="flex flex-col border-b pb-3 border-border/50">
                  <span className="text-sm text-muted-foreground">Loyalty</span>
                  <span className="font-semibold text-lg">
                    {selectedAccount.percentage}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col border-b pb-3 border-border/50">
                  <span className="text-sm text-muted-foreground">
                    Endereço Seguro
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedAccount.safeAddress ? (
                      <>
                        <Check className="w-5 h-5 text-primary" />
                        <span className="font-medium text-primary">
                          Sim
                        </span>
                      </>
                    ) : (
                      <>
                        <X className="w-5 h-5 text-red-500" />
                        <span className="font-medium text-red-600 dark:text-red-400">
                          Não
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col border-b pb-3 border-border/50">
                  <span className="text-sm text-muted-foreground">
                    Carta de RK
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedAccount.hasRecoveryKey ? (
                      <>
                        <Check className="w-5 h-5 text-primary" />
                        <span className="font-medium text-primary">
                          Sim
                        </span>
                      </>
                    ) : (
                      <>
                        <X className="w-5 h-5 text-red-500" />
                        <span className="font-medium text-red-600 dark:text-red-400">
                          Não
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {selectedAccount.metadata &&
              Object.keys(selectedAccount.metadata).length > 0 && (
                <div className="mt-6 border-t pt-6">
                  <h4 className="font-semibold text-lg mb-4 text-foreground/90">
                    Informações Adicionais
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-5 rounded-xl border border-border/50">
                    {Object.entries(selectedAccount.metadata).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex flex-col bg-background/50 p-3 rounded-lg border border-border/30"
                        >
                          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="font-semibold break-words">
                            {String(value)}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
