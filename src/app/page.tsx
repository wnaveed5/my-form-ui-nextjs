import { FormUI } from "@/components/FormUI";

/**
 * Home page component that displays the Form UI with drag and drop functionality
 * 
 * Features:
 * - Responsive layout with proper semantic HTML
 * - Accessible heading structure
 * - Clean, modern design with proper spacing
 * 
 * @returns The main page component
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Form UI
          </h1>
        </header>
        
        <section aria-labelledby="form-heading">
          <div id="form-heading" className="sr-only">
            Interactive Form with Draggable Fields
          </div>
          <FormUI />
        </section>
      </div>
    </main>
  );
}
