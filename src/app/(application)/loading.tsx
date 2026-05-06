import { Stack, Skeleton } from "@mantine/core";

export default function Loading() {
  return (
    <Stack gap="md" p="md">
      <Skeleton height={36} width={300} radius="sm" />
      <Skeleton height={40} radius="sm" />
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} height={50} radius="sm" />
      ))}
      <Skeleton height={40} radius="sm" />
    </Stack>
  );
}
