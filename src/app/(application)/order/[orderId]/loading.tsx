import { Stack, Skeleton, Group } from "@mantine/core";

export default function Loading() {
  return (
    <Stack gap="md" p="md">
      <Group justify="space-between">
        <Skeleton height={32} width={250} radius="sm" />
        <Skeleton height={36} width={120} radius="sm" />
      </Group>
      <Skeleton height={200} radius="sm" />
      <Skeleton height={300} radius="sm" />
    </Stack>
  );
}
