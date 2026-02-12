import { getCityLogs } from "@/lib/city-logs";
import TravelClient from "./TravelClient";

export default async function TravelPage() {
  const cityLogs = await getCityLogs();
  return <TravelClient cityLogs={cityLogs} />;
}
