import {
  IconNotes,
  IconTruck,
  IconUser,
  IconPalette,
  IconSteeringWheel,
} from "@tabler/icons-react";
import { Code, Group, ScrollArea } from "@mantine/core";
import { LinksGroup } from "./NavbarLinksGroup";
import classes from "./NavbarNested.module.css";

const mockdata = [
  // { label: "Dashboard", icon: IconGauge },
  {
    label: "Orden",
    icon: IconNotes,
    link: "/order",
  },
  {
    label: "Camiones",
    icon: IconTruck,
    link: "/truck",
  },
  {
    label: "Choferes",
    icon: IconSteeringWheel,
    link: "/driver",
  },
  {
    label: "Clientes",
    icon: IconUser,
    link: "/client",
  },
  {
    label: "Pallets",
    icon: IconPalette,
    link: "/pallet",
  },
  {
    label: "Almacenes",
    icon: IconPalette,
    link: "/almacen",
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
    <LinksGroup {...item} key={item.label} />
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
