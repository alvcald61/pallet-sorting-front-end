import { Stack, Skeleton } from '@mantine/core';

interface TableSkeletonProps {
  /** Number of rows to display (default: 5) */
  rows?: number;

  /** Number of columns to display (default: 4) */
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <Stack gap="xs">
      {/* Header skeleton */}
      <Skeleton height={40} radius="sm" />

      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Stack key={rowIndex} gap={4}>
          <Skeleton height={50} radius="sm" />
        </Stack>
      ))}

      {/* Pagination skeleton */}
      <Skeleton height={40} radius="sm" mt="md" />
    </Stack>
  );
}
