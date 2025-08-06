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
 * FormUI component that renders separate tabbed forms with independent drag and drop areas
 * 
 * Features:
 * - Independent tabs with separate drag and drop areas
 * - Each tab maintains its own state and field order
 * - Accessible form controls
 * - Error handling for drag operations
 * 
 * @returns A form component with independent tabbed drag and drop functionality
 */
export function FormUI() {
  // Separate state for each tab
  const [generalFields, setGeneralFields] = useState<Field[]>([
    { id: "name", label: "Name" },
    { id: "username", label: "Username" },
  ]);

  const [settingsFields, setSettingsFields] = useState<Field[]>([
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone" },
    { id: "location", label: "Location" },
  ]);

  // Separate error states for each tab
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // Memoize field IDs for performance
  const generalFieldIds = useMemo(() => generalFields.map(f => f.id), [generalFields]);
  const settingsFieldIds = useMemo(() => settingsFields.map(f => f.id), [settingsFields]);

  /**
   * Handles the end of a drag operation for General tab
   */
  const onGeneralDragEnd = useCallback((event: DragEndEvent) => {
    try {
      const { active, over } = event;
      
      if (!over || active.id === over.id) return;

      setGeneralFields((items) => {
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

      setGeneralError(null);
    } catch (err) {
      console.error('Error during general field reordering:', err);
      setGeneralError('Failed to reorder general fields. Please try again.');
    }
  }, []);

  /**
   * Handles the end of a drag operation for Settings tab
   */
  const onSettingsDragEnd = useCallback((event: DragEndEvent) => {
    try {
      const { active, over } = event;
      
      if (!over || active.id === over.id) return;

      setSettingsFields((items) => {
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

      setSettingsError(null);
    } catch (err) {
      console.error('Error during settings field reordering:', err);
      setSettingsError('Failed to reorder settings fields. Please try again.');
    }
  }, []);

  /**
   * Resets the general fields to their original order
   */
  const resetGeneralFields = useCallback(() => {
    setGeneralFields([
      { id: "name", label: "Name" },
      { id: "username", label: "Username" },
    ]);
    setGeneralError(null);
  }, []);

  /**
   * Resets the settings fields to their original order
   */
  const resetSettingsFields = useCallback(() => {
    setSettingsFields([
      { id: "email", label: "Email" },
      { id: "phone", label: "Phone" },
      { id: "location", label: "Location" },
    ]);
    setSettingsError(null);
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-blue-900 text-white">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        {/* General Tab - Independent Drag and Drop Area */}
        <TabsContent value="general" className="p-4 border rounded-md">
          {generalError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{generalError}</p>
              <button
                onClick={resetGeneralFields}
                className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
              >
                Reset general fields to original order
              </button>
            </div>
          )}
          
          <DndContext 
            collisionDetection={closestCenter} 
            onDragEnd={onGeneralDragEnd}
            accessibility={{
              announcements: {
                onDragStart({ active }) {
                  return `Picked up ${active.id} field in general tab`;
                },
                onDragOver({ active, over }) {
                  return `Moving ${active.id} field over ${over?.id || 'drop zone'} in general tab`;
                },
                onDragEnd({ active, over }) {
                  if (over && active.id !== over.id) {
                    return `Dropped ${active.id} field into new position in general tab`;
                  }
                  return `Dropped ${active.id} field in general tab`;
                },
                onDragCancel({ active }) {
                  return `Cancelled dragging ${active.id} field in general tab`;
                },
              },
            }}
          >
            <SortableContext items={generalFieldIds} strategy={verticalListSortingStrategy}>
              <div 
                className="space-y-4"
                role="region"
                aria-label="Draggable general form fields"
              >
                {generalFields.map((field) => (
                  <DraggableField key={field.id} field={field} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>💡 Tip: Drag the ☰ handle to reorder general fields</p>
          </div>
        </TabsContent>

        {/* Settings Tab - Independent Drag and Drop Area */}
        <TabsContent value="settings" className="p-4 border rounded-md">
          {settingsError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{settingsError}</p>
              <button
                onClick={resetSettingsFields}
                className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
              >
                Reset settings fields to original order
              </button>
            </div>
          )}
          
          <DndContext 
            collisionDetection={closestCenter} 
            onDragEnd={onSettingsDragEnd}
            accessibility={{
              announcements: {
                onDragStart({ active }) {
                  return `Picked up ${active.id} field in settings tab`;
                },
                onDragOver({ active, over }) {
                  return `Moving ${active.id} field over ${over?.id || 'drop zone'} in settings tab`;
                },
                onDragEnd({ active, over }) {
                  if (over && active.id !== over.id) {
                    return `Dropped ${active.id} field into new position in settings tab`;
                  }
                  return `Dropped ${active.id} field in settings tab`;
                },
                onDragCancel({ active }) {
                  return `Cancelled dragging ${active.id} field in settings tab`;
                },
              },
            }}
          >
            <SortableContext items={settingsFieldIds} strategy={verticalListSortingStrategy}>
              <div 
                className="space-y-4"
                role="region"
                aria-label="Draggable settings form fields"
              >
                {settingsFields.map((field) => (
                  <DraggableField key={field.id} field={field} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>💡 Tip: Drag the ☰ handle to reorder settings fields</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 