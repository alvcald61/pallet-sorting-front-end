"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { IconCalendarStats, IconChevronRight } from "@tabler/icons-react";
import {
  Box,
  Collapse,
  Group,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import classes from "./NavbarLinksGroup.module.css";

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  link?: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
}

export function LinksGroup({
  icon: Icon,
  label,
  link,
  initiallyOpened,
  links,
}: LinksGroupProps) {
  const pathname = usePathname();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);

  // Determinar si el enlace está activo
  const isActive = link
    ? link === "/"
      ? pathname === "/" // Para home, debe ser exacto
      : pathname.startsWith(link) // Para otros, si empieza con el link
    : false;

  const items = (hasLinks ? links : []).map((link) => (
    <Text<"a">
      component="a"
      className={classes.link}
      href={link.link}
      key={link.label}
      onClick={(event) => event.preventDefault()}
    >
      {link.label}
    </Text>
  ));

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={`${classes.control} ${isActive ? classes.active : ""}`}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon
              variant={isActive ? "filled" : "light"}
              size={30}
              color={isActive ? "blue" : "gray"}
            >
              <Icon size={18} />
            </ThemeIcon>
            {!link ? (
              <Box ml="md">{label}</Box>
            ) : (
              <Box ml="md">
                <Text<"a">
                  component="a"
                  style={{
                    fontWeight: 500,
                    display: "block",
                    textDecoration: "none",
                    fontSize: "var(--mantine-font-size-sm)",
                  }}
                  href={link}
                  key={label}
                  // onClick={(event) => event.preventDefault()}
                >
                  {label}
                </Text>
              </Box>
            )}
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              size={16}
              style={{ transform: opened ? "rotate(-90deg)" : "none" }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}

// const mockdata = {
//   label: "Releases",
//   icon: IconCalendarStats,
//   links: [
//     { label: "Upcoming releases", link: "/" },
//     { label: "Previous releases", link: "/" },
//     { label: "Releases schedule", link: "/" },
//   ],
// };

// export function NavbarLinksGroup() {
//   return (
//     <Box mih={220} p="md">
//       <LinksGroup {...mockdata} />
//     </Box>
//   );
// }
