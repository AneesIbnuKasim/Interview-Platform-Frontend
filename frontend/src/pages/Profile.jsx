import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Avatar } from "@/components/common/Avatar";
import { useAppSelector } from "@/store/hooks";

export default function ProfilePage() {
  const user = useAppSelector(s => s.auth.user);
  const name = user?.name ?? "Guest User";
  const email = user?.email ?? "guest@pairloop.dev";

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Avatar name={name} size={64} />
          <div>
            <h1 className="text-2xl font-semibold">{name}</h1>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>

        <Card>
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">Update your personal information.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs text-muted-foreground">Full name</label>
              <Input defaultValue={name} className="mt-1"/>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <Input defaultValue={email} className="mt-1"/>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Role</label>
              <Input defaultValue="Interviewer" className="mt-1"/>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Timezone</label>
              <Input defaultValue="UTC+02:00" className="mt-1"/>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save changes</Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Preferences</h2>
          <ul className="mt-3 divide-y divide-border text-sm">
            {[
              { t: "Email notifications", d: "Get notified when a candidate joins your room." },
              { t: "Auto-record sessions", d: "Saves a transcript of each interview." },
              { t: "Default editor theme", d: "Used for all new rooms." },
            ].map(p => (
              <li key={p.t} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">{p.t}</div>
                  <div className="text-xs text-muted-foreground">{p.d}</div>
                </div>
                <Button size="sm" variant="outline">Configure</Button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}
