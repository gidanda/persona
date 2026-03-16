import { ScanSwitcher } from "@/features/exchange/components/scan-switcher";
import { buildProfileShareValue } from "@/features/qr/utils/qr";
import { requireCompletedAppUser } from "@/lib/session";

export default async function ScanPage() {
  const user = await requireCompletedAppUser();
  const qrValue = buildProfileShareValue(user.userId);

  return <ScanSwitcher qrValue={qrValue} />;
}
