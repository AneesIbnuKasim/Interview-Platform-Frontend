import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Avatar } from "@/components/common/Avatar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateCurrentUser } from "@/features/auth/authSlice";

const timezones = [
  "UTC",
  "Asia/Kolkata",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Singapore",
  "Australia/Sydney",
];

const defaultPreferences = {
  emailNotifications: true,
  autoRecordSessions: false,
  defaultEditorTheme: "dark",
};

function buildForm(user) {
  return {
    name: user?.name ?? "",
    email: user?.email ?? "",
    timezone: user?.timezone ?? "UTC",
    preferences: {
      ...defaultPreferences,
      ...(user?.preferences ?? {}),
    },
  };
}

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState(() => buildForm(user));
  const [saved, setSaved] = useState(false);
  const saving = status === "loading";

  useEffect(() => {
    setForm(buildForm(user));
  }, [user]);

  const isDirty = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(buildForm(user));
  }, [form, user]);

  function updateField(field, value) {
    setSaved(false);
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updatePreference(field, value) {
    setSaved(false);
    setForm((current) => ({
      ...current,
      preferences: {
        ...current.preferences,
        [field]: value,
      },
    }));
  }

  function resetForm() {
    setSaved(false);
    setForm(buildForm(user));
  }

  async function submit(event) {
    event.preventDefault();
    setSaved(false);

    try {
      await dispatch(updateCurrentUser(form)).unwrap();
      setSaved(true);
    } catch {
      // Redux renders the error state.
    }
  }

  const displayName = user?.name || "Guest User";
  const displayEmail = user?.email || "guest@pairloop.dev";

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Avatar name={displayName} size={64} />
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold">{displayName}</h1>
            <p className="truncate text-sm text-muted-foreground">
              {displayEmail}
            </p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={submit}>
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Profile</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Update your account details and interview defaults.
                </p>
              </div>
              {saved && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-success/10 px-2.5 py-1 text-xs text-success">
                  <CheckCircle2 size={13} />
                  Saved
                </span>
              )}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-xs text-muted-foreground" htmlFor="name">
                  Full name
                </label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="mt-1"
                  required
                  minLength={2}
                  maxLength={80}
                />
              </div>
              <div>
                <label
                  className="text-xs text-muted-foreground"
                  htmlFor="email"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground" htmlFor="role">
                  Account role
                </label>
                <Input
                  id="role"
                  value={user?.role ?? "user"}
                  className="mt-1 capitalize opacity-70"
                  disabled
                />
              </div>
              <div>
                <label
                  className="text-xs text-muted-foreground"
                  htmlFor="timezone"
                >
                  Timezone
                </label>
                <select
                  id="timezone"
                  value={form.timezone}
                  onChange={(event) =>
                    updateField("timezone", event.target.value)
                  }
                  className="mt-1 h-11 w-full rounded-xl border border-border bg-background/40 px-4 text-sm text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {timezones.map((timezone) => (
                    <option key={timezone} value={timezone}>
                      {timezone}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={!isDirty || saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!isDirty || saving}>
                {saving && <Loader2 size={15} className="animate-spin" />}
                Save changes
              </Button>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold">Preferences</h2>
            <div className="mt-4 divide-y divide-border text-sm">
              <PreferenceToggle
                title="Email notifications"
                description="Get notified when a candidate joins your room."
                checked={form.preferences.emailNotifications}
                onChange={(value) =>
                  updatePreference("emailNotifications", value)
                }
              />
              <PreferenceToggle
                title="Auto-record sessions"
                description="Save a transcript of each interview."
                checked={form.preferences.autoRecordSessions}
                onChange={(value) =>
                  updatePreference("autoRecordSessions", value)
                }
              />
              <div className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <div className="font-medium">Default editor theme</div>
                  <div className="text-xs text-muted-foreground">
                    Used for new interview rooms.
                  </div>
                </div>
                <select
                  value={form.preferences.defaultEditorTheme}
                  onChange={(event) =>
                    updatePreference("defaultEditorTheme", event.target.value)
                  }
                  className="h-9 rounded-lg border border-border bg-background/40 px-3 text-xs text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </AppShell>
  );
}

function PreferenceToggle({ title, description, checked, onChange }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={
          "flex h-6 w-11 items-center rounded-full px-0.5 transition " +
          (checked ? "bg-primary" : "bg-secondary")
        }
      >
        <span
          className={
            "h-5 w-5 rounded-full bg-white shadow transition " +
            (checked ? "translate-x-5" : "translate-x-0")
          }
        />
      </button>
    </div>
  );
}
