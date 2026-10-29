import { useState } from "react";
import { Banknote, Landmark, Lock, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { banksForState, citiesForState, indiaStates } from "@/lib/india-locations";
import { inr } from "@/lib/mock-data";
import { useSession, type BankDetails } from "@/lib/session";

function maskAccount(acc: string) {
  const tail = acc.slice(-4);
  return `${"•".repeat(Math.max(acc.length - 4, 4))}${tail}`;
}

export function BankDetailsCard() {
  const { bank, saveBank, bookings, user } = useSession();
  const [editing, setEditing] = useState(false);
  const [bankState, setBankState] = useState(bank?.bankState ?? "");
  const [branchCity, setBranchCity] = useState(bank?.branchCity ?? "");
  const [bankName, setBankName] = useState(bank?.bankName ?? "");

  const released = bookings.filter((b) => b.paymentReleased);
  const inEscrow = bookings.filter((b) => !b.paymentReleased);
  const paid = released.reduce((s, b) => s + b.amount, 0);
  const pending = inEscrow.reduce((s, b) => s + b.amount, 0);

  const showForm = editing || !bank;
  const cities = citiesForState(bankState);
  const banks = banksForState(bankState);

  const startEditing = () => {
    setBankState(bank?.bankState ?? "");
    setBranchCity(bank?.branchCity ?? "");
    setBankName(bank?.bankName ?? "");
    setEditing(true);
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Landmark className="size-4 text-accent" /> Bank details & load payment balance
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Used to settle truck loading payments. Account number stays masked for counterparties.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-secondary/60 p-3">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Wallet className="size-3.5" /> Settled balance
            </p>
            <p className="font-display mt-1 text-xl font-bold">{inr(paid)}</p>
            <p className="text-xs text-muted-foreground">{released.length} payouts</p>
          </div>
          <div className="rounded-xl bg-secondary/60 p-3">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="size-3.5" /> Held in escrow
            </p>
            <p className="font-display mt-1 text-xl font-bold">{inr(pending)}</p>
            <p className="text-xs text-muted-foreground">{inEscrow.length} active loads</p>
          </div>
          <div className="rounded-xl bg-secondary/60 p-3">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Banknote className="size-3.5" /> Payout account
            </p>
            <p className="mt-1 text-sm font-semibold">
              {bank ? `${bank.bankName} · ${maskAccount(bank.accountNumber)}` : "Not added yet"}
            </p>
            {bank ? <Badge variant="secondary" className="mt-1">Active</Badge> : null}
          </div>
        </div>

        {showForm ? (
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              if (!bankState || !branchCity || !bankName) {
                toast.error("Select bank branch", {
                  description: "Choose the state, branch city and bank name.",
                });
                return;
              }
              const details: BankDetails = {
                accountHolder: String(fd.get("accountHolder") ?? "").trim(),
                bankState,
                branchCity,
                bankName,
                accountNumber: String(fd.get("accountNumber") ?? "").trim(),
                ifsc: String(fd.get("ifsc") ?? "").trim().toUpperCase(),
                ...(String(fd.get("upi") ?? "").trim()
                  ? { upi: String(fd.get("upi")).trim() }
                  : {}),
              };
              if (details.accountNumber.length < 8 || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(details.ifsc)) {
                toast.error("Check bank details", {
                  description: "Enter a valid account number and IFSC (e.g. HDFC0001234).",
                });
                return;
              }
              saveBank(details);
              setEditing(false);
              toast.success("Bank details saved", {
                description: "Load payments will be settled to this account.",
              });
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="accountHolder">Account Holder Name</Label>
              <Input
                id="accountHolder"
                name="accountHolder"
                defaultValue={bank?.accountHolder ?? user?.company ?? ""}
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Bank State</Label>
              <Select
                value={bankState}
                onValueChange={(v) => {
                  setBankState(v);
                  setBranchCity("");
                  setBankName("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {indiaStates.map((s) => (
                    <SelectItem key={s.name} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Branch City</Label>
              <Select
                value={branchCity}
                onValueChange={setBranchCity}
                disabled={!bankState}
              >
                <SelectTrigger>
                  <SelectValue placeholder={bankState ? "Select city" : "Select state first"} />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Bank Name</Label>
              <Select
                value={bankName}
                onValueChange={setBankName}
                disabled={!branchCity}
              >
                <SelectTrigger>
                  <SelectValue placeholder={branchCity ? "Select bank" : "Select branch city first"} />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                defaultValue={bank?.accountNumber ?? ""}
                inputMode="numeric"
                maxLength={18}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ifsc">IFSC Code</Label>
              <Input
                id="ifsc"
                name="ifsc"
                defaultValue={bank?.ifsc ?? ""}
                placeholder="HDFC0001234"
                maxLength={11}
                required
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="upi">UPI ID (optional)</Label>
              <Input id="upi" name="upi" defaultValue={bank?.upi ?? ""} placeholder="name@okhdfc" maxLength={60} />
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit">Save bank details</Button>
              {bank ? (
                <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              ["Account holder", bank.accountHolder],
              ["Bank", bank.bankName],
              ["Branch", `${bank.branchCity}, ${bank.bankState}`],
              ["Account number", maskAccount(bank.accountNumber)],
              ["IFSC", bank.ifsc],
              ...(bank.upi ? [["UPI", bank.upi]] : []),
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-border p-2.5 text-sm">
                <p className="text-xs text-muted-foreground">{k}</p>
                <p className="font-semibold">{v}</p>
              </div>
            ))}
            <div className="sm:col-span-2">
              <Button variant="outline" size="sm" onClick={startEditing}>
                Edit bank details
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
