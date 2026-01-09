import {
  IconNotes,
  IconTruck,
  IconUser,
  IconPalette,
  IconDashboard,
  IconSteeringWheel,
} from "@tabler/icons-react";
import { Code, Group, ScrollArea } from "@mantine/core";
import { LinksGroup } from "./NavbarLinksGroup";
import classes from "./NavbarNested.module.css";
import { ROLES } from "@/lib/const/rbac";
import { ProtectedElement } from "@/lib/utils/rbacUtils";

const mockdata = [
  // { label: "Dashboard", icon: IconGauge },
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
  {
    label: "Dashboard",
    icon: IconDashboard,
    link: "/",
    roles: [ROLES.ADMIN, ROLES.CLIENT, ROLES.DRIVER],
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

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group justify="space-between">
          <Code fw={700}>v3.1.2</Code>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>
    </nav>
  );
}
