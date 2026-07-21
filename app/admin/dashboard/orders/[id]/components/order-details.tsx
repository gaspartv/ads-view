"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, DollarSign, Package } from "lucide-react";

export function OrderDetails({ order }: { order: any }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(order.status);

  const handleUpdateStatus = () => {
    startTransition(async () => {
      const res = await updateOrderStatus(order.id, status);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  const getStatusBadge = (s: string) => {
    switch(s) {
      case "WAITING_PAYMENT": return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Aguardando Pagamento</Badge>;
      case "PROCESSING": return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Processando</Badge>;
      case "COMPLETED": return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Concluído</Badge>;
      case "CANCELED": return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Cancelado</Badge>;
      case "REFUNDED": return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Reembolsado</Badge>;
      default: return <Badge variant="outline">{s}</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-muted-foreground" />
              Itens da Venda
            </CardTitle>
          </CardHeader>
          <CardContent>
            {order.Items?.map((item: any) => (
              <div key={item.id} className="flex justify-between items-start py-4 border-b last:border-0">
                <div>
                  <p className="font-semibold">{item.productType}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Snapshot: {JSON.stringify(item.productSnapshot)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {order.currency === 'BRL' ? 
                      new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.unitPrice / 100) : 
                      `${item.unitPriceCoins} TC`}
                  </p>
                  <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico e Datas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm border-b pb-2">
              <span className="text-muted-foreground">Criado em:</span>
              <span className="font-medium">{new Date(order.createdAt).toLocaleString("pt-BR")}</span>
            </div>
            {order.paidAt && (
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span className="text-muted-foreground">Pago em:</span>
                <span className="font-medium">{new Date(order.paidAt).toLocaleString("pt-BR")}</span>
              </div>
            )}
            {order.completedAt && (
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span className="text-muted-foreground">Concluído em:</span>
                <span className="font-medium">{new Date(order.completedAt).toLocaleString("pt-BR")}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-full">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{order.Customer?.name}</p>
                <p className="text-xs text-muted-foreground">{order.Customer?.whatsappNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-full">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total da Venda</p>
                <p className="font-medium text-lg text-primary">
                  {order.currency === 'BRL' ? 
                    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(order.totalAmount / 100) : 
                    `${order.totalTibiaCoins} TC`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gestão de Status</CardTitle>
            <CardDescription>Status atual: {getStatusBadge(order.status)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <select 
              className="w-full h-9 rounded-md border px-3"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="WAITING_PAYMENT">Aguardando Pagamento</option>
              <option value="PROCESSING">Processando</option>
              <option value="COMPLETED">Concluído</option>
              <option value="CANCELED">Cancelado</option>
              <option value="REFUNDED">Reembolsado</option>
            </select>
            
            <Button 
              className="w-full" 
              onClick={handleUpdateStatus} 
              disabled={isPending || status === order.status}
            >
              {isPending ? "Atualizando..." : "Atualizar Status"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
