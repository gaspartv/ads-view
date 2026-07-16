"use client";

import React, { useState } from "react";
import { Trash2, RotateCcw, Edit2, Check } from "lucide-react";

interface TransactionRow {
  data: string;
  documento: string;
  historico: string;
  loteSaida: number | null;
  loteEntrada: number | null;
  valorSaida: number | null;
  valorEntrada: number | null;
  precoLote: number | null;
  observacao: string;
  isDeleted?: boolean;
}

export default function ReportsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [minSalePrice, setMinSalePrice] = useState("47");
  const [maxSalePrice, setMaxSalePrice] = useState("50");
  const [minBuyPrice, setMinBuyPrice] = useState("45");
  const [maxBuyPrice, setMaxBuyPrice] = useState("48");

  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rows, setRows] = useState<TransactionRow[] | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Por favor, selecione um arquivo PDF.");

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("minSalePrice", minSalePrice);
    formData.append("maxSalePrice", maxSalePrice);
    formData.append("minBuyPrice", minBuyPrice);
    formData.append("maxBuyPrice", maxBuyPrice);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      console.log({ apiUrl });
      const res = await fetch(apiUrl + "/api/reports/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erro ao processar o PDF");
      }

      const data = await res.json();
      setRows(data.rows);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowChange = (
    index: number,
    field: keyof TransactionRow,
    value: string,
  ) => {
    if (!rows) return;
    const newRows = [...rows];

    // Parse value depending on the field
    if (
      field === "loteSaida" ||
      field === "loteEntrada" ||
      field === "precoLote"
    ) {
      newRows[index][field] = value === "" ? null : parseFloat(value);
    } else {
      (newRows[index][field] as string) = value;
    }

    // Auto calculate precoLote
    const row = newRows[index];
    if (field === "loteSaida") {
      if (row.loteSaida && row.valorEntrada) {
        row.precoLote = (row.valorEntrada / row.loteSaida) * 250;
      } else {
        row.precoLote = null;
      }
    } else if (field === "loteEntrada") {
      if (row.loteEntrada && row.valorSaida) {
        row.precoLote = (row.valorSaida / row.loteEntrada) * 250;
      } else {
        row.precoLote = null;
      }
    }

    setRows(newRows);
  };

  const markAsResolved = (index: number) => {
    if (!rows) return;
    const newRows = [...rows];
    newRows[index].observacao = ""; // Remove a "Verificação manual"
    setRows(newRows);
  };

  const markAsEditing = (index: number) => {
    if (!rows) return;
    const newRows = [...rows];
    newRows[index].observacao = "Verificação manual";
    setRows(newRows);
  };

  const toggleDeleteRow = (index: number) => {
    if (!rows) return;
    const newRows = [...rows];
    newRows[index].isDeleted = !newRows[index].isDeleted;
    setRows(newRows);
  };

  const handleGenerateExcel = async () => {
    if (!rows) return;

    setIsGenerating(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(
        apiUrl + "/api/reports/generate-excel-from-json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rows: rows.filter((r) => !r.isDeleted) }),
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erro ao gerar o Excel");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "transferencias.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Relatório de Tibia Coins
      </h1>

      {!rows ? (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg">
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Arquivo PDF (Extrato)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                required
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Venda Mínima (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={minSalePrice}
                  onChange={(e) => setMinSalePrice(e.target.value)}
                  required
                  className="text-zinc-600 mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Venda Máxima (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={maxSalePrice}
                  onChange={(e) => setMaxSalePrice(e.target.value)}
                  required
                  className="text-zinc-600 mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Compra Mínima (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={minBuyPrice}
                  onChange={(e) => setMinBuyPrice(e.target.value)}
                  required
                  className="text-zinc-600 mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Compra Máxima (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={maxBuyPrice}
                  onChange={(e) => setMaxBuyPrice(e.target.value)}
                  required
                  className="text-zinc-600 mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isLoading ? "Processando PDF..." : "Analisar Extrato"}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Revisão de Dados
              </h2>
              <p className="text-sm text-gray-500">
                Existem{" "}
                {
                  rows.filter(
                    (r) =>
                      r.observacao === "Verificação manual" && !r.isDeleted,
                  ).length
                }{" "}
                transações aguardando verificação manual.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setRows(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleGenerateExcel}
                disabled={isGenerating}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300"
              >
                {isGenerating ? "Gerando..." : "Confirmar e Gerar Excel"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto max-h-[65vh] overflow-y-auto relative">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                    >
                      Data
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 w-full"
                    >
                      Histórico
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                    >
                      Valor Saída (R$)
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                    >
                      Valor Entrada (R$)
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                    >
                      Vendas Tibia Coins
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                    >
                      Compras Tibia Coins
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                    >
                      Preço 250 Tibia Coins
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rows.map((row, index) => {
                    const isManual = row.observacao === "Verificação manual";
                    return (
                      <tr
                        key={index}
                        className={`${isManual && !row.isDeleted ? "bg-red-50" : ""} ${row.isDeleted ? "opacity-50 bg-gray-100" : ""}`}
                      >
                        <td
                          className={`px-3 py-4 whitespace-nowrap text-sm text-gray-500 ${row.isDeleted ? "line-through" : ""}`}
                        >
                          {row.data}
                        </td>
                        <td
                          className={`px-3 py-4 text-sm text-gray-900 w-full whitespace-normal ${row.isDeleted ? "line-through" : ""}`}
                        >
                          {row.historico}
                        </td>
                        <td
                          className={`px-3 py-4 whitespace-nowrap text-sm text-gray-500 ${row.isDeleted ? "line-through" : ""}`}
                        >
                          {row.valorSaida !== null
                            ? `R$ ${row.valorSaida.toFixed(2)}`
                            : "-"}
                        </td>
                        <td
                          className={`px-3 py-4 whitespace-nowrap text-sm text-gray-500 ${row.isDeleted ? "line-through" : ""}`}
                        >
                          {row.valorEntrada !== null
                            ? `R$ ${row.valorEntrada.toFixed(2)}`
                            : "-"}
                        </td>

                        <td className="px-3 py-4 whitespace-nowrap text-sm">
                          {row.valorEntrada !== null ? (
                            <input
                              type="number"
                              disabled={row.isDeleted || !isManual}
                              className={`w-20 p-1 border rounded focus:ring-blue-500 focus:border-blue-500 text-gray-800 ${isManual ? "border-red-300" : "border-gray-300"} ${row.isDeleted || !isManual ? "bg-gray-200 cursor-not-allowed" : ""}`}
                              value={row.loteSaida ?? ""}
                              onChange={(e) =>
                                handleRowChange(
                                  index,
                                  "loteSaida",
                                  e.target.value,
                                )
                              }
                              placeholder="Qtd"
                            />
                          ) : (
                            <span className="text-gray-900">
                              {row.loteSaida || "-"}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm">
                          {row.valorSaida !== null ? (
                            <input
                              type="number"
                              disabled={row.isDeleted || !isManual}
                              className={`w-20 p-1 border rounded focus:ring-blue-500 focus:border-blue-500 text-gray-800 ${isManual ? "border-red-300" : "border-gray-300"} ${row.isDeleted || !isManual ? "bg-gray-200 cursor-not-allowed" : ""}`}
                              value={row.loteEntrada ?? ""}
                              onChange={(e) =>
                                handleRowChange(
                                  index,
                                  "loteEntrada",
                                  e.target.value,
                                )
                              }
                              placeholder="Qtd"
                            />
                          ) : (
                            <span className="text-gray-900">
                              {row.loteEntrada || "-"}
                            </span>
                          )}
                        </td>

                        <td
                          className={`px-3 py-4 whitespace-nowrap text-sm font-medium ${row.isDeleted ? "text-gray-500 line-through" : "text-blue-600"}`}
                        >
                          {row.precoLote !== null
                            ? `R$ ${row.precoLote.toFixed(2)}`
                            : "-"}
                        </td>

                        <td className="px-3 py-4 whitespace-nowrap text-sm">
                          {isManual && !row.isDeleted ? (
                            <span className="text-red-600 font-semibold text-xs">
                              Verificação Manual
                            </span>
                          ) : (
                            <span
                              className={`font-semibold text-xs ${row.isDeleted ? "text-gray-500" : "text-green-600"}`}
                            >
                              {row.isDeleted ? "Excluído" : "OK"}
                            </span>
                          )}
                        </td>

                        <td className="px-3 py-4 whitespace-nowrap text-sm flex items-center space-x-2">
                          {isManual && !row.isDeleted ? (
                            <button
                              onClick={() => markAsResolved(index)}
                              className="text-xs bg-green-100 text-green-700 p-1.5 rounded hover:bg-green-200 transition-colors"
                              title="Marcar Resolvido"
                            >
                              <Check size={16} />
                            </button>
                          ) : (
                            !row.isDeleted && (
                              <button
                                onClick={() => markAsEditing(index)}
                                className="text-xs bg-gray-100 text-gray-700 p-1.5 rounded hover:bg-gray-200 transition-colors"
                                title="Editar Lotes"
                              >
                                <Edit2 size={16} />
                              </button>
                            )
                          )}
                          <button
                            onClick={() => toggleDeleteRow(index)}
                            className={`text-xs p-1.5 rounded transition-colors ${row.isDeleted ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`}
                            title={row.isDeleted ? "Restaurar" : "Excluir"}
                          >
                            {row.isDeleted ? (
                              <RotateCcw size={16} />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
