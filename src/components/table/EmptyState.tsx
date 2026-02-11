import { Stack, Text, Button } from '@mantine/core';
import { IconDatabaseOff } from '@tabler/icons-react';

interface EmptyStateProps {
  /** Title text (default: "No hay registros") */
  title?: string;

  /** Description text */
  description?: string;

  /** Icon to display */
  icon?: React.ReactNode;

  /** Call to action button */
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  title = 'No hay registros',
  description,
  icon,
  action
}: EmptyStateProps) {
  return (
    <Stack align="center" justify="center" py={60} gap="md">
      {icon || <IconDatabaseOff size={64} stroke={1.5} style={{ opacity: 0.3 }} />}

      <Stack align="center" gap="xs">
        <Text size="lg" fw={600} c="dimmed">
          {title}
        </Text>

        {description && (
          <Text size="sm" c="dimmed" ta="center" maw={400}>
            {description}
          </Text>
        )}
      </Stack>

      {action && (
        <Button
          onClick={action.onClick}
          variant="light"
          mt="md"
        >
          {action.label}
        </Button>
      )}
    </Stack>
  );
}
