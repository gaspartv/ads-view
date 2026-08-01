"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Clock, Edit2, Save, Loader2, X } from "lucide-react";
import { updateBusinessHours } from "@/app/actions/company";

const DAYS = [
  { key: "monday", label: "Segunda-feira" },
  { key: "tuesday", label: "Terça-feira" },
  { key: "wednesday", label: "Quarta-feira" },
  { key: "thursday", label: "Quinta-feira" },
  { key: "friday", label: "Sexta-feira" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
];

export function CompanyBusinessHoursForm({ businessHours }: { businessHours: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const defaultHours = {
    monday: { isOpen: true, open: "08:00", close: "18:00" },
    tuesday: { isOpen: true, open: "08:00", close: "18:00" },
    wednesday: { isOpen: true, open: "08:00", close: "18:00" },
    thursday: { isOpen: true, open: "08:00", close: "18:00" },
    friday: { isOpen: true, open: "08:00", close: "18:00" },
    saturday: { isOpen: false, open: "08:00", close: "12:00" },
    sunday: { isOpen: false, open: "", close: "" },
  };

  const [formData, setFormData] = useState(
    businessHours && Object.keys(businessHours).length > 0 ? businessHours : defaultHours
  );

  const handleToggleDay = (dayKey: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        isOpen: !prev[dayKey]?.isOpen,
      },
    }));
  };

  const handleTimeChange = (dayKey: string, field: "open" | "close", value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    const res = await updateBusinessHours(formData);
    setIsLoading(false);

    if (res.success) {
      toast.success("Horários atualizados com sucesso!");
      setIsEditing(false);
    } else {
      toast.error(res.message || "Erro ao atualizar horários.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(businessHours && Object.keys(businessHours).length > 0 ? businessHours : defaultHours);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> Horários de Funcionamento
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && (
            <Button
              onClick={handleCancel}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          )}
          <Button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={isLoading}
            variant={isEditing ? "default" : "outline"}
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : isEditing ? (
              <Save className="w-4 h-4 mr-2" />
            ) : (
              <Edit2 className="w-4 h-4 mr-2" />
            )}
            {isEditing ? "Salvar" : "Editar"}
          </Button>
        </div>
      </div>

      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="divide-y divide-border">
          {DAYS.map(({ key, label }) => {
            const dayData = formData[key] || { isOpen: false, open: "", close: "" };
            return (
              <div key={key} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-[200px]">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={dayData.isOpen || false}
                      onChange={() => isEditing && handleToggleDay(key)}
                      disabled={!isEditing}
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary disabled:opacity-50"></div>
                  </label>
                  <span className={`font-medium ${!dayData.isOpen ? "text-muted-foreground" : "text-foreground"}`}>
                    {label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    disabled={!isEditing || !dayData.isOpen}
                    value={dayData.open || ""}
                    onChange={(e) => handleTimeChange(key, "open", e.target.value)}
                    className="w-[120px]"
                  />
                  <span className="text-muted-foreground">até</span>
                  <Input
                    type="time"
                    disabled={!isEditing || !dayData.isOpen}
                    value={dayData.close || ""}
                    onChange={(e) => handleTimeChange(key, "close", e.target.value)}
                    className="w-[120px]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
