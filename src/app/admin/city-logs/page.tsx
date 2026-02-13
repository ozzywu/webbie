import { getAllCityLogs } from "@/lib/city-logs";
import { destinations } from "@/lib/destinations";
import { destinationCountryToCode, getNativeCityName } from "@/lib/countries";
import { CountryFlag } from "@/components/CountryFlag";
import Link from "next/link";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminCitiesPage() {
  const cityLogs = await getAllCityLogs();

  // Build a quick lookup: city name → log
  const logsByCity = new Map(cityLogs.map((log) => [log.city, log]));

  // Merge destinations + any city logs that aren't in destinations
  const destinationCities = destinations.map((d) => ({
    city: d.city,
    country: d.country,
    countryCode: destinationCountryToCode(d.country),
    log: logsByCity.get(d.city) ?? null,
    isDestination: true,
  }));

  // City logs not matching any destination (user-added cities)
  const extraLogs = cityLogs
    .filter((log) => !destinations.some((d) => d.city === log.city))
    .map((log) => ({
      city: log.city,
      country: log.country_code ? undefined : undefined,
      countryCode: log.country_code || "",
      log,
      isDestination: false,
    }));

  const allCities = [...destinationCities, ...extraLogs];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-xl"
          style={{
            color: "#1a1a1a",
            fontFamily: "var(--font-geist-sans)",
            fontWeight: 500,
          }}
        >
          Cities
        </h1>
        <Link
          href="/admin/city-logs/new"
          className="px-4 py-2 rounded text-sm hover:opacity-80 transition-opacity"
          style={{
            background: "#670000",
            color: "#fff",
            fontFamily: "var(--font-geist-sans)",
          }}
        >
          Add New City
        </Link>
      </div>

      <div
        className="border rounded-lg overflow-hidden"
        style={{ borderColor: "#e5e5e5" }}
      >
        <table className="w-full">
          <thead>
            <tr
              className="border-b text-left text-sm"
              style={{
                borderColor: "#e5e5e5",
                color: "#666",
                fontFamily: "var(--font-geist-sans)",
              }}
            >
              <th className="px-4 py-3 font-medium w-10"></th>
              <th className="px-4 py-3 font-medium">City</th>
              <th className="px-4 py-3 font-medium">Country</th>
              <th className="px-4 py-3 font-medium">Log</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allCities.map((item) => {
              const hasLog = !!item.log;
              const flagCode = item.log?.country_code || item.countryCode;

              return (
                <tr
                  key={item.city}
                  className="border-b last:border-b-0"
                  style={{ borderColor: "#e5e5e5" }}
                >
                  {/* Flag */}
                  <td className="px-4 py-3">
                    {flagCode ? (
                      <CountryFlag
                        code={flagCode}
                        className="w-7 h-5 rounded-[1px]"
                      />
                    ) : (
                      <div
                        className="w-7 h-5 rounded-[1px]"
                        style={{ background: "#f3f4f6" }}
                      />
                    )}
                  </td>

                  {/* City */}
                  <td className="px-4 py-3">
                    <span
                      className="text-sm"
                      style={{
                        color: "#1a1a1a",
                        fontFamily: "var(--font-geist-sans)",
                        fontWeight: hasLog ? 500 : 400,
                      }}
                    >
                      {item.city}
                    </span>
                    {getNativeCityName(item.city) !== item.city && (
                      <span
                        className="text-xs ml-2"
                        style={{
                          color: "#999",
                          fontFamily: "var(--font-geist-sans)",
                        }}
                      >
                        {getNativeCityName(item.city)}
                      </span>
                    )}
                  </td>

                  {/* Country */}
                  <td className="px-4 py-3">
                    <span
                      className="text-sm"
                      style={{
                        color: "#666",
                        fontFamily: "var(--font-geist-sans)",
                      }}
                    >
                      {item.country || "—"}
                    </span>
                  </td>

                  {/* Log status */}
                  <td className="px-4 py-3">
                    {hasLog ? (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: "#dcfce7",
                          color: "#166534",
                          fontFamily: "var(--font-geist-sans)",
                        }}
                      >
                        {item.log!.images.length} photo
                        {item.log!.images.length !== 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: "#f3f4f6",
                          color: "#9ca3af",
                          fontFamily: "var(--font-geist-sans)",
                        }}
                      >
                        No log
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {hasLog ? (
                        <>
                          <Link
                            href={`/admin/city-logs/${item.log!.id}/edit`}
                            className="text-sm hover:opacity-70"
                            style={{
                              color: "#670000",
                              fontFamily: "var(--font-geist-sans)",
                            }}
                          >
                            Edit
                          </Link>
                          <DeleteButton id={item.log!.id} action="cityLog" />
                        </>
                      ) : (
                        <Link
                          href={`/admin/city-logs/new?city=${encodeURIComponent(item.city)}&country=${encodeURIComponent(item.countryCode)}`}
                          className="text-sm hover:opacity-70"
                          style={{
                            color: "#670000",
                            fontFamily: "var(--font-geist-sans)",
                          }}
                        >
                          Add Log
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
