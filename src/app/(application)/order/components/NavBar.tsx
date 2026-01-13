"use client";

import {
  IconNotes,
  IconTruck,
  IconUser,
  IconPalette,
  IconDashboard,
  IconSteeringWheel,
  IconBell,
  IconLogout,
} from "@tabler/icons-react";
import {
  Group,
  ScrollArea,
  Avatar,
  Stack,
  Button,
  Badge,
  Menu,
} from "@mantine/core";
import { LinksGroup } from "./NavbarLinksGroup";
import classes from "./NavbarNested.module.css";
import { ROLES } from "@/lib/const/rbac";
import { ProtectedElement } from "@/lib/utils/rbacUtils";
import { useRBAC } from "@/lib/contexts/RBACContext";
import { logout } from "@/app/(login)/login/action";
import { useRouter } from "next/navigation";

const mockdata = [
  // { label: "Dashboard", icon: IconGauge },
  {
    label: "Dashboard",
    icon: IconDashboard,
    link: "/",
    roles: [ROLES.ADMIN, ROLES.CLIENT, ROLES.DRIVER],
  },
  {
    label: "Orden",
    icon: IconNotes,
    link: "/order",
    roles: [ROLES.ADMIN, ROLES.CLIENT, ROLES.DRIVER],
  },
  {
    label: "Camiones",
    icon: IconTruck,
    link: "/truck",
    roles: [ROLES.ADMIN],
  },
  {
    label: "Choferes",
    icon: IconSteeringWheel,
    link: "/driver",
    roles: [ROLES.ADMIN],
  },
  {
    label: "Clientes",
    icon: IconUser,
    link: "/client",
    roles: [ROLES.ADMIN],
  },
  {
    label: "Pallets",
    icon: IconPalette,
    link: "/pallet",
    roles: [ROLES.ADMIN],
  },
  {
    label: "Almacenes",
    icon: IconPalette,
    link: "/warehouse",
    roles: [ROLES.ADMIN],
  },

  // {
  //   label: "Releases",
  //   icon: IconCalendarStats,
  //   links: [
  //     { label: "Upcoming releases", link: "/" },
  //     { label: "Previous releases", link: "/" },
  //     { label: "Releases schedule", link: "/" },
  //   ],
  // },
  // { label: "Analytics", icon: IconPresentationAnalytics },
  // { label: "Contracts", icon: IconFileAnalytics },
  // { label: "Settings", icon: IconAdjustments },
  // {
  //   label: "Security",
  //   icon: IconLock,
  //   links: [
  //     { label: "Enable 2FA", link: "/" },
  //     { label: "Change password", link: "/" },
  //     { label: "Recovery codes", link: "/" },
  //   ],
  // },
];

export function NavbarNested() {
  const { user } = useRBAC();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const links = mockdata.map((item) => (
    <ProtectedElement
      requiredRoles={item.roles}
      key={item.label}
      requireAll={false}

      // fallback={<p>No tienes permisos</p>}
    >
      <LinksGroup {...item} key={item.label} />
    </ProtectedElement>
  ));

  const userInitials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : "U";

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Stack gap="md" style={{ width: "100%" }}>
          {user && (
            <Group justify="space-between" align="flex-start">
              <Group gap="sm" align="center" style={{ flex: 1 }}>
                <Avatar
                  name={userInitials}
                  color="blue"
                  radius="md"
                  size="lg"
                />
                <Stack gap={0} style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: 600 }}>
                    {user.firstName} {user.lastName}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--mantine-color-gray-6)",
                    }}
                  >
                    {user.email}
                  </div>
                </Stack>
              </Group>

              <Menu position="bottom-end" shadow="md">
                <Menu.Target>
                  <Button
                    variant="subtle"
                    size="xs"
                    p="4px"
                    style={{ minWidth: "auto" }}
                  >
                    <IconBell size={18} />
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item disabled>
                    <Group gap="xs">
                      <Badge size="sm" variant="light" color="orange">
                        0 nuevas
                      </Badge>
                      <span style={{ fontSize: "12px" }}>Notificaciones</span>
                    </Group>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          )}
        </Stack>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      {user && (
        <div className={classes.footer}>
          <Button
            fullWidth
            variant="light"
            color="red"
            leftSection={<IconLogout size={16} />}
            onClick={handleLogout}
            size="sm"
          >
            Cerrar sesión
          </Button>
        </div>
      )}
    </nav>
  );
}
