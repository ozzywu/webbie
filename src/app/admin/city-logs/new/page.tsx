import { CityLogForm } from "@/components/admin/CityLogForm";

export default function NewCityLogPage() {
  return (
    <div>
      <h1
        className="text-xl mb-6"
        style={{
          color: "#1a1a1a",
          fontFamily: "var(--font-geist-sans)",
          fontWeight: 500,
        }}
      >
        New City Log
      </h1>
      <CityLogForm />
    </div>
  );
}
