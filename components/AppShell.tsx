import { BottomNav } from "@/components/BottomNav";
import { Navbar } from "@/components/Navbar";
import { userNeedsProfile } from "@/lib/auth";
import { theme } from "@/lib/theme";
import type { User } from "@/lib/types";

interface AppShellProps {
  user: User;
  children: React.ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
  const needsProfile = userNeedsProfile(user);

  return (
    <div className={theme.shell}>
      <Navbar user={user} needsProfile={needsProfile} />
      <div
        className="flex-1"
        style={{
          paddingBottom: needsProfile
            ? "max(env(safe-area-inset-bottom, 0px), 0.5rem)"
            : "calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px) + 0.5rem)",
        }}
      >
        {children}
      </div>
      {!needsProfile && <BottomNav user={user} />}
    </div>
  );
}
