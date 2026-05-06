"use client";

import { Anchor, Card, Group, Stack, Text, Title } from "@mantine/core";
import { IconFile, IconPaperclip } from "@tabler/icons-react";
import { PaymentEvidence } from "@/lib/types/invoiceTypes";

interface Props {
  evidence: PaymentEvidence[];
}

export default function PaymentEvidenceList({ evidence }: Props) {
  if (!evidence.length) return null;
  return (
    <Card withBorder radius="md" p="lg" mb="lg">
      <Title order={5} mb="sm">
        <Group gap="xs">
          <IconPaperclip size={16} />
          Evidencias de Pago
        </Group>
      </Title>
      <Stack gap="xs">
        {evidence.map((e) => (
          <Group key={e.id} gap="sm">
            <IconFile size={16} />
            <Anchor href={e.fileUrl} target="_blank" size="sm">
              {e.fileName}
            </Anchor>
            <Text size="xs" c="dimmed">
              por {e.uploadedBy}
            </Text>
          </Group>
        ))}
      </Stack>
    </Card>
  );
}
