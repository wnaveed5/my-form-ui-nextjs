"use client";

import { useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Field {
  id: string;
  label: string;
}

function DraggableField({ field }: { field: Field }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center space-x-2 p-2 border rounded-md bg-white"
      {...attributes}
      {...listeners}
    >
      <div className="cursor-move text-gray-400 hover:text-gray-600">☰</div>
      <div className="flex-1">
        <Label htmlFor={field.id}>{field.label}</Label>
        <Input id={field.id} placeholder={`Enter ${field.label.toLowerCase()}`} />
      </div>
    </div>
  );
}

export function FormUI() {
  const [fields, setFields] = useState<Field[]>([
    { id: "name", label: "Name" },
    { id: "username", label: "Username" },
  ]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    setFields((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = [...items];
      const [movedItem] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, movedItem);

      return newItems;
    });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-blue-900 text-white">
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="p-4 border rounded-md">
          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {fields.map((field) => (
                  <DraggableField key={field.id} field={field} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </TabsContent>
      </Tabs>
    </div>
  );
} 