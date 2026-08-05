'use client';

import { useState, useTransition } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './sortable-item';
import { Button } from '@/components/ui/button';
import { saveCardContent } from '../actions';
import { toast } from 'sonner';

const ALL_FIELDS = [
  { id: 'level', label: 'Level' },
  { id: 'vocation', label: 'Vocação' },
  { id: 'price', label: 'Preço' },
  { id: 'promotionalPrice', label: 'Preço Promocional' },
  { id: 'priceTibiaCoins', label: 'Preço Tibia Coins' },
  { id: 'promotionalPriceTibiaCoins', label: 'Preço Promocional TC' },
  { id: 'gender', label: 'Gênero' },
  { id: 'loyalty', label: 'Loyalty Points' },
  { id: 'worldId', label: 'Mundo' },
  { id: 'magicLevel', label: 'Magic Level' },
  { id: 'fistFighting', label: 'Fist Fighting' },
  { id: 'swordFighting', label: 'Sword Fighting' },
  { id: 'axeFighting', label: 'Axe Fighting' },
  { id: 'clubFighting', label: 'Club Fighting' },
  { id: 'distanceFighting', label: 'Distance Fighting' },
  { id: 'shielding', label: 'Shielding' },
  { id: 'fishing', label: 'Fishing' },
  { id: 'charmPoints', label: 'Charm Points' },
  { id: 'charmExpansion', label: 'Charm Expansion' },
  { id: 'inventoryValue', label: 'Valor do Inventário' },
  { id: 'transferable', label: 'Transferível' },
  { id: 'transferAvailableAt', label: 'Data de Liberação de Transferência' },
  { id: 'premiumEndsAt', label: 'Fim da Premium Account' },
  { id: 'hasRecoveryKey', label: 'Possui Recovery Key / Não Registrada' },
  { id: 'safeAddress', label: 'Endereço Seguro' },
  { id: 'Charms', label: 'Charms' },
  { id: 'Outfits', label: 'Outfits' },
  { id: 'Mounts', label: 'Montarias' },
];

export default function CardContentClient({ initialConfig }: { initialConfig: string[] }) {
  const [isPending, startTransition] = useTransition();

  // Combine initial config with remaining fields
  const [fields, setFields] = useState(() => {
    const selectedIds = new Set(initialConfig);
    const orderedSelectedFields = initialConfig
      .map((id) => ALL_FIELDS.find((f) => f.id === id))
      .filter(Boolean) as typeof ALL_FIELDS;
    
    const unselectedFields = ALL_FIELDS.filter((f) => !selectedIds.has(f.id));
    
    return [
      ...orderedSelectedFields.map((f) => ({ ...f, checked: true })),
      ...unselectedFields.map((f) => ({ ...f, checked: false })),
    ];
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleCheckChange = (id: string, checked: boolean) => {
    setFields((items) =>
      items.map((item) => (item.id === id ? { ...item, checked } : item))
    );
  };

  const handleSave = () => {
    startTransition(async () => {
      const selectedFields = fields.filter((f) => f.checked).map((f) => f.id);
      const res = await saveCardContent(selectedFields);
      if (res.success) {
        toast.success('Configuração salva com sucesso!');
      } else {
        toast.error(res.error || 'Falha ao salvar configuração');
      }
    });
  };

  return (
    <div className="max-w-2xl mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Ordem e Visibilidade dos Campos</h3>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {fields.map((field) => (
              <SortableItem
                key={field.id}
                id={field.id}
                label={field.label}
                checked={field.checked}
                onCheckChange={handleCheckChange}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
