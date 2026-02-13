import { CityLogForm } from "@/components/admin/CityLogForm";

export default async function NewCityLogPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; country?: string }>;
}) {
  const { city, country } = await searchParams;

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
        {city ? `Add Log — ${city}` : "New City Log"}
      </h1>
      <CityLogForm defaultCity={city} defaultCountryCode={country} />
    </div>
  );
}
