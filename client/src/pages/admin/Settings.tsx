import { useEffect, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { fetchSettings, updateSettings } from "@/services/auth";

export default function Settings() {
  const [businessName, setBusinessName] = useState("");
  const [whatsappAdminNumber, setWhatsappAdminNumber] = useState("");
  const [shippingFee, setShippingFee] = useState("0");
  const [currency, setCurrency] = useState("KES");
  const [mpesaTillNumber, setMpesaTillNumber] = useState("");
  const [mpesaTillName, setMpesaTillName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings()
      .then((settings) => {
        if (!settings) return;
        setBusinessName(settings.businessName);
        setWhatsappAdminNumber(settings.whatsappAdminNumber);
        setShippingFee(String(settings.shippingFee));
        setCurrency(settings.currency);
        setMpesaTillNumber(settings.mpesaTillNumber);
        setMpesaTillName(settings.mpesaTillName);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await updateSettings({
        businessName,
        whatsappAdminNumber,
        shippingFee: Number(shippingFee),
        currency,
        mpesaTillNumber,
        mpesaTillName,
      });
      setMessage("Settings saved");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-brand-muted">Loading...</p>;
  }

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-3xl text-white">Settings</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-xs text-brand-muted">Business Name</label>
          <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
        </div>

        <div>
          <label className="mb-1 block text-xs text-brand-muted">WhatsApp Admin Number</label>
          <Input value={whatsappAdminNumber} onChange={(e) => setWhatsappAdminNumber(e.target.value)} />
        </div>

        <div>
          <label className="mb-1 block text-xs text-brand-muted">Shipping Fee (KES)</label>
          <Input type="number" value={shippingFee} onChange={(e) => setShippingFee(e.target.value)} />
        </div>

        <div>
          <label className="mb-1 block text-xs text-brand-muted">Currency</label>
          <Input value={currency} onChange={(e) => setCurrency(e.target.value)} />
        </div>

        <div className="border-t border-brand-border pt-4">
          <p className="mb-3 text-sm font-medium text-white">M-Pesa Buy Goods Till</p>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-brand-muted">Till Number</label>
              <Input
                value={mpesaTillNumber}
                onChange={(e) => setMpesaTillNumber(e.target.value)}
                placeholder="e.g. 123456"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-brand-muted">Till Name</label>
              <Input
                value={mpesaTillName}
                onChange={(e) => setMpesaTillName(e.target.value)}
                placeholder="Business name shown on the till"
              />
            </div>
          </div>
        </div>

        {message && <p className="text-sm text-white">{message}</p>}

        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
