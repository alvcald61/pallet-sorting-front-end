import { Title, Text, Button, Stack } from "@mantine/core";
import { IconError404 } from "@tabler/icons-react";
import Link from "next/link";

export default function ApplicationNotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-full grow p-10">
      <Stack align="center" gap="lg">
        <IconError404 size={120} color="var(--mantine-color-gray-5)" />
        <Title order={2}>Página no encontrada</Title>
        <Text c="dimmed" ta="center">
          La página que buscas no existe o fue movida.
        </Text>
        <Button component={Link} href="/" variant="filled">
          Volver al inicio
        </Button>
      </Stack>
    </div>
  );
}
