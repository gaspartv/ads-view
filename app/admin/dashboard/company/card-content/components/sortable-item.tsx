import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface SortableItemProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckChange: (id: string, checked: boolean) => void;
}

export function SortableItem({
  id,
  label,
  checked,
  onCheckChange,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 p-3 bg-card border rounded-md mb-2 shadow-sm",
        isDragging && "opacity-50 border-primary",
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
      >
        <GripVertical size={20} />
      </div>
      <Checkbox
        checked={checked}
        onCheckedChange={(c) => onCheckChange(id, c === true)}
        id={id}
      />
      <label
        htmlFor={id}
        className="flex-1 cursor-pointer font-medium select-none"
      >
        {label}
      </label>
    </div>
  );
}
