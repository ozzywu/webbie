import { getCityLogById } from "@/lib/city-logs";
import { CityLogForm } from "@/components/admin/CityLogForm";
import { notFound } from "next/navigation";

export default async function EditCityLogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cityLog = await getCityLogById(id);

  if (!cityLog) {
    notFound();
  }

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
        Edit City Log — {cityLog.city}
      </h1>
      <CityLogForm cityLog={cityLog} />
    </div>
  );
}
