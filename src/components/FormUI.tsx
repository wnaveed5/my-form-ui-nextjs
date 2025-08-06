"use client";

import { useState, useCallback, useMemo } from "react";
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Field interface representing a form field with drag and drop capabilities
 */
interface Field {
  id: string;
  label: string;
}

/**
 * Props for the DraggableField component
 */
interface DraggableFieldProps {
  field: Field;
}

/**
 * DraggableField component that renders a single form field with drag and drop functionality
 * 
 * @param field - The field object containing id and label
 * @returns A draggable form field component
 */
function DraggableField({ field }: DraggableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }), [transform, transition, isDragging]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center space-x-2 p-2 border rounded-md bg-white shadow-sm hover:shadow-md transition-shadow"
      {...attributes}
      {...listeners}
      role="button"
      tabIndex={0}
      aria-label={`Drag to reorder ${field.label} field`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          // Trigger drag start programmatically if needed
        }
      }}
    >
      <div 
        className="cursor-move text-gray-400 hover:text-gray-600 transition-colors"
        aria-hidden="true"
      >
        ☰
      </div>
      <div className="flex-1">
        <Label htmlFor={field.id}>{field.label}</Label>
        <Input 
          id={field.id} 
          placeholder={`Enter ${field.label.toLowerCase()}`}
          aria-describedby={`${field.id}-description`}
        />
        <div id={`${field.id}-description`} className="sr-only">
          Input field for {field.label.toLowerCase()}
        </div>
      </div>
    </div>
  );
}

/**
 * FormUI component that renders a tabbed form with draggable fields
 * 
 * Features:
 * - Tabbed interface with General section
 * - Drag and drop field reordering
 * - Accessible form controls
 * - Error handling for drag operations
 * 
 * @returns A form component with drag and drop functionality
 */
export function FormUI() {
  const [fields, setFields] = useState<Field[]>([
    { id: "name", label: "Name" },
    { id: "username", label: "Username" },
  ]);

  const [error, setError] = useState<string | null>(null);

  // Memoize field IDs for performance
  const fieldIds = useMemo(() => fields.map(f => f.id), [fields]);

  /**
   * Handles the end of a drag operation
   * 
   * @param event - The drag end event from @dnd-kit
   */
  const onDragEnd = useCallback((event: DragEndEvent) => {
    try {
      const { active, over } = event;
      
      if (!over || active.id === over.id) return;

      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        if (oldIndex === -1 || newIndex === -1) {
          throw new Error('Invalid field index during reordering');
        }

        const newItems = [...items];
        const [movedItem] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, movedItem);

        return newItems;
      });

      setError(null);
    } catch (err) {
      console.error('Error during field reordering:', err);
      setError('Failed to reorder fields. Please try again.');
    }
  }, []);

  /**
   * Resets the form fields to their original order
   */
  const resetFields = useCallback(() => {
    setFields([
      { id: "name", label: "Name" },
      { id: "username", label: "Username" },
    ]);
    setError(null);
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-blue-900 text-white">
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="p-4 border rounded-md">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={resetFields}
                className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
              >
                Reset to original order
              </button>
            </div>
          )}
          
          <DndContext 
            collisionDetection={closestCenter} 
            onDragEnd={onDragEnd}
            accessibility={{
              announcements: {
                onDragStart({ active }) {
                  return `Picked up ${active.id} field`;
                },
                onDragOver({ active, over }) {
                  return `Moving ${active.id} field over ${over?.id || 'drop zone'}`;
                },
                onDragEnd({ active, over }) {
                  if (over && active.id !== over.id) {
                    return `Dropped ${active.id} field into new position`;
                  }
                  return `Dropped ${active.id} field`;
                },
                onDragCancel({ active }) {
                  return `Cancelled dragging ${active.id} field`;
                },
              },
            }}
          >
            <SortableContext items={fieldIds} strategy={verticalListSortingStrategy}>
              <div 
                className="space-y-4"
                role="region"
                aria-label="Draggable form fields"
              >
                {fields.map((field) => (
                  <DraggableField key={field.id} field={field} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>💡 Tip: Drag the ☰ handle to reorder fields</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 