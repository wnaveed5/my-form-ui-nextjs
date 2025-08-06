import { FormUI } from "@/components/FormUI";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Form UI with Drag & Drop
        </h1>
        <FormUI />
      </div>
    </main>
  );
}
