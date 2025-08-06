"use client";

import { useState, useCallback, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Field interface representing a form field
 */
interface Field {
  id: string;
  label: string;
  tabId: string; // Track which tab the field belongs to
}

/**
 * Props for the Field component
 */
interface FieldProps {
  field: Field;
}

/**
 * Field component that renders a single form field
 * 
 * @param field - The field object containing id, label, and tabId
 * @returns A form field component
 */
function Field({ field }: FieldProps) {
  return (
    <div className="flex items-center space-x-2 p-2 border rounded-md bg-white shadow-sm hover:shadow-md transition-shadow">
      <div 
        className="text-gray-400"
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
 * FormUI component that renders separate tabbed forms
 * 
 * Features:
 * - Independent tabs with form fields
 * - Each tab maintains its own state
 * - Accessible form controls
 * - Clean, modern UI
 * 
 * @returns A form component with tabbed interface
 */
export function FormUI() {
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

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Get fields for each tab
  const generalFields = useMemo(() => 
    allFields.filter(field => field.tabId === "general"), [allFields]);
  const settingsFields = useMemo(() => 
    allFields.filter(field => field.tabId === "settings"), [allFields]);

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

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-blue-900 text-white">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
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
            aria-label="General form fields"
          >
            {generalFields.map((field) => (
              <Field key={field.id} field={field} />
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>💡 Tip: Form fields are organized by category</p>
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
            aria-label="Settings form fields"
          >
            {settingsFields.map((field) => (
              <Field key={field.id} field={field} />
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>💡 Tip: Form fields are organized by category</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 