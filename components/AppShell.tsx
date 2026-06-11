import { BottomNav } from "@/components/BottomNav";
import { Navbar } from "@/components/Navbar";
import { theme } from "@/lib/theme";
import type { User } from "@/lib/types";

interface AppShellProps {
  user: User;
  children: React.ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
  return (
    <div className={theme.shell}>
      <Navbar user={user} />
      <div
        className="flex-1"
        style={{
          paddingBottom:
            "calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px) + 0.5rem)",
        }}
      >
        {children}
      </div>
      <BottomNav user={user} />
    </div>
  );
}
