"use client";

import { useEffect } from "react";
import { Title, Text, Button, Stack, Alert, Card, Group } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function ApplicationError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center w-full grow p-10">
      <Card shadow="sm" padding="xl" radius="md" withBorder maw={500} w="100%">
        <Stack align="center" gap="lg">
          <IconAlertTriangle size={64} color="var(--mantine-color-red-6)" />
          <Title order={2} ta="center">
            Algo salió mal
          </Title>
          <Text c="dimmed" ta="center">
            Ocurrió un error inesperado. Por favor, intenta de nuevo.
          </Text>

          {process.env.NODE_ENV === "development" && (
            <Alert
              color="red"
              title="Detalles del error"
              w="100%"
              variant="light"
            >
              <Text size="sm" style={{ wordBreak: "break-word" }}>
                {error.message}
              </Text>
              {error.digest && (
                <Text size="xs" c="dimmed" mt="xs">
                  Digest: {error.digest}
                </Text>
              )}
            </Alert>
          )}

          <Group>
            <Button variant="filled" onClick={reset}>
              Reintentar
            </Button>
            <Button variant="light" onClick={() => router.push("/")}>
              Ir al inicio
            </Button>
          </Group>
        </Stack>
      </Card>
    </div>
  );
}
