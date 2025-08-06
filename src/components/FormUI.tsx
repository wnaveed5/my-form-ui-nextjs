"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Field interface representing a form field with drag and drop capabilities
 */
interface Field {
  id: string;
  label: string;
  tabId: string; // Track which tab the field belongs to
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
 * @param field - The field object containing id, label, and tabId
 * @returns A draggable form field component
 */
function DraggableField({ field }: DraggableFieldProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only render drag-and-drop functionality on client side
  if (!isClient) {
    return (
      <div className="flex items-center space-x-2 p-2 border rounded-md bg-white shadow-sm hover:shadow-md transition-shadow">
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

  // Dynamic import for client-side only
  const { useSortable } = require('@dnd-kit/sortable');
  const { CSS } = require('@dnd-kit/utilities');

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
 * FormUI component that renders separate tabbed forms with cross-tab drag and drop functionality
 * 
 * Features:
 * - Independent tabs with cross-tab drag and drop areas
 * - Fields can be moved between tabs
 * - Each tab maintains its own state and field order
 * - Accessible form controls
 * - Error handling for drag operations
 * 
 * @returns A form component with cross-tab drag and drop functionality
 */
export function FormUI() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Combined state for all fields with tab tracking
  const [allFields, setAllFields] = useState<Field[]>([
    // General tab fields
    { id: "name", label: "Name", tabId: "general" },
    { id: "username", label: "Username", tabId: "general" },
    // Settings tab fields
    { id: "email", label: "Email", tabId: "settings" },
    { id: "phone", label: "Phone", tabId: "settings" },
    { id: "location", label: "Location", tabId: "settings" },
  ]);

  // Error state for drag operations
  const [error, setError] = useState<string | null>(null);

  // Memoize field IDs for performance
  const allFieldIds = useMemo(() => allFields.map(f => f.id), [allFields]);

  // Get fields for each tab
  const generalFields = useMemo(() => 
    allFields.filter(field => field.tabId === "general"), [allFields]);
  const settingsFields = useMemo(() => 
    allFields.filter(field => field.tabId === "settings"), [allFields]);

  /**
   * Handles the end of a drag operation across all tabs
   */
  const onDragEnd = useCallback((event: any) => {
    try {
      const { active, over } = event;
      
      if (!over || active.id === over.id) return;

      setAllFields((items) => {
        const activeField = items.find(item => item.id === active.id);
        const overField = items.find(item => item.id === over.id);
        
        if (!activeField || !overField) {
          throw new Error('Invalid field during reordering');
        }

        const newItems = [...items];
        
        // Remove the active field from its current position
        const activeIndex = newItems.findIndex(item => item.id === active.id);
        if (activeIndex === -1) {
          throw new Error('Active field not found');
        }
        
        const [movedField] = newItems.splice(activeIndex, 1);
        
        // Find the target position
        const overIndex = newItems.findIndex(item => item.id === over.id);
        if (overIndex === -1) {
          throw new Error('Target field not found');
        }
        
        // Update the tabId if moving to a different tab
        const targetTabId = overField.tabId;
        movedField.tabId = targetTabId;
        
        // Insert at the new position
        newItems.splice(overIndex, 0, movedField);
        
        return newItems;
      });

      setError(null);
    } catch (err) {
      console.error('Error during cross-tab field reordering:', err);
      setError('Failed to reorder fields. Please try again.');
    }
  }, []);

  /**
   * Resets all fields to their original positions
   */
  const resetAllFields = useCallback(() => {
    setAllFields([
      // General tab fields
      { id: "name", label: "Name", tabId: "general" },
      { id: "username", label: "Username", tabId: "general" },
      // Settings tab fields
      { id: "email", label: "Email", tabId: "settings" },
      { id: "phone", label: "Phone", tabId: "settings" },
      { id: "location", label: "Location", tabId: "settings" },
    ]);
    setError(null);
  }, []);

  // Render without drag-and-drop on server side
  if (!isClient) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="bg-blue-900 text-white">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          {/* General Tab */}
          <TabsContent value="general" className="p-4 border rounded-md">
            <div className="space-y-4">
              {generalFields.map((field) => (
                <div key={field.id} className="flex items-center space-x-2 p-2 border rounded-md bg-white shadow-sm">
                  <div className="text-gray-400">☰</div>
                  <div className="flex-1">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <Input 
                      id={field.id} 
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>💡 Tip: Drag fields between tabs or reorder within this tab</p>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="p-4 border rounded-md">
            <div className="space-y-4">
              {settingsFields.map((field) => (
                <div key={field.id} className="flex items-center space-x-2 p-2 border rounded-md bg-white shadow-sm">
                  <div className="text-gray-400">☰</div>
                  <div className="flex-1">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <Input 
                      id={field.id} 
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>💡 Tip: Drag fields between tabs or reorder within this tab</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Dynamic imports for client-side only
  const { DndContext, closestCenter } = require('@dnd-kit/core');
  const { SortableContext, verticalListSortingStrategy } = require('@dnd-kit/sortable');

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-blue-900 text-white">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        {/* Shared Drag Context for Cross-Tab Functionality */}
        <DndContext 
          collisionDetection={closestCenter} 
          onDragEnd={onDragEnd}
          accessibility={{
            announcements: {
              onDragStart({ active }: any) {
                const field = allFields.find(f => f.id === active.id);
                const tabName = field?.tabId === "general" ? "general" : "settings";
                return `Picked up ${active.id} field from ${tabName} tab`;
              },
              onDragOver({ active, over }: any) {
                const activeField = allFields.find(f => f.id === active.id);
                const overField = allFields.find(f => f.id === over?.id);
                const activeTab = activeField?.tabId === "general" ? "general" : "settings";
                const overTab = overField?.tabId === "general" ? "general" : "settings";
                
                if (activeTab !== overTab) {
                  return `Moving ${active.id} field from ${activeTab} tab to ${overTab} tab`;
                }
                return `Moving ${active.id} field over ${over?.id || 'drop zone'} in ${activeTab} tab`;
              },
              onDragEnd({ active, over }: any) {
                const activeField = allFields.find(f => f.id === active.id);
                const overField = allFields.find(f => f.id === over?.id);
                const activeTab = activeField?.tabId === "general" ? "general" : "settings";
                const overTab = overField?.tabId === "general" ? "general" : "settings";
                
                if (over && active.id !== over.id) {
                  if (activeTab !== overTab) {
                    return `Moved ${active.id} field from ${activeTab} tab to ${overTab} tab`;
                  }
                  return `Dropped ${active.id} field into new position in ${activeTab} tab`;
                }
                return `Dropped ${active.id} field`;
              },
              onDragCancel({ active }: any) {
                const field = allFields.find(f => f.id === active.id);
                const tabName = field?.tabId === "general" ? "general" : "settings";
                return `Cancelled dragging ${active.id} field from ${tabName} tab`;
              },
            },
          }}
        >
          <SortableContext items={allFieldIds} strategy={verticalListSortingStrategy}>
            {/* General Tab */}
            <TabsContent value="general" className="p-4 border rounded-md">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-sm">{error}</p>
                  <button
                    onClick={resetAllFields}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
                  >
                    Reset all fields to original order
                  </button>
                </div>
              )}
              
              <div 
                className="space-y-4"
                role="region"
                aria-label="Draggable general form fields - can be moved to settings tab"
              >
                {generalFields.map((field) => (
                  <DraggableField key={field.id} field={field} />
                ))}
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p>💡 Tip: Drag fields between tabs or reorder within this tab</p>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="p-4 border rounded-md">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-sm">{error}</p>
                  <button
                    onClick={resetAllFields}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
                  >
                    Reset all fields to original order
                  </button>
                </div>
              )}
              
              <div 
                className="space-y-4"
                role="region"
                aria-label="Draggable settings form fields - can be moved to general tab"
              >
                {settingsFields.map((field) => (
                  <DraggableField key={field.id} field={field} />
                ))}
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p>💡 Tip: Drag fields between tabs or reorder within this tab</p>
              </div>
            </TabsContent>
          </SortableContext>
        </DndContext>
      </Tabs>
    </div>
  );
} 