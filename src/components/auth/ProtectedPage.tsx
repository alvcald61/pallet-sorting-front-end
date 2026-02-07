"use client";

import { ReactNode } from "react";
import { useRBAC } from "@/lib/contexts/RBACContext";
import { Title, Text, Button, Stack, Card, Skeleton } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import Link from "next/link";

interface ProtectedPageProps {
  children: ReactNode;
  requiredRoles: string[];
  requireAll?: boolean;
}

export function ProtectedPage({
  children,
  requiredRoles,
  requireAll = false,
}: ProtectedPageProps) {
  const { hasRole, loading, user } = useRBAC();

  if (loading) {
    return (
      <div className="flex flex-col w-full grow p-10 gap-4">
        <Skeleton height={30} width="30%" radius="sm" />
        <Skeleton height={20} width="50%" radius="sm" />
        <Skeleton height={400} radius="sm" mt="md" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const hasAccess = requireAll
    ? requiredRoles.every((role) => hasRole(role))
    : requiredRoles.some((role) => hasRole(role));

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center w-full grow p-10">
        <Card
          shadow="sm"
          padding="xl"
          radius="md"
          withBorder
          maw={500}
          w="100%"
        >
          <Stack align="center" gap="lg">
            <IconLock size={64} color="var(--mantine-color-gray-5)" />
            <Title order={2} ta="center">
              Acceso denegado
            </Title>
            <Text c="dimmed" ta="center">
              No tienes los permisos necesarios para acceder a esta sección.
            </Text>
            <Button component={Link} href="/" variant="filled">
              Volver al inicio
            </Button>
          </Stack>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
