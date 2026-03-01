"use client";

import { useState } from "react";
import { Anchor, Breadcrumbs, Tabs, Title, Alert, Select } from "@mantine/core";
import {
  IconCurrencyDollar,
  IconMapPin,
  IconRuler,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useCanAccess } from "@/lib/utils/rbacUtils";
import { getClients } from "@/lib/api/client/clientApi";
import { PricesTab } from "./components/PricesTab";
import { ZonesTab } from "./components/ZonesTab";
import { ConditionsTab } from "./components/ConditionsTab";

export default function PricingPage() {
  const isAdmin = useCanAccess(["ADMIN"]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const { data: clientsData } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  if (!isAdmin) {
    return (
      <div className="flex flex-col w-full p-4 sm:p-10">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Acceso denegado"
          color="red"
        >
          No tienes permisos para acceder a la gestión de precios.
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full grow p-4 sm:p-10">
      <Breadcrumbs className="mb-4">
        <Anchor href="/">Dashboard</Anchor>
        <span>Precios</span>
      </Breadcrumbs>

      <Title order={2} mb="lg">
        Gestión de Precios
      </Title>

      <Select
        label="Cliente"
        placeholder="Todos los clientes"
        data={(clientsData?.data ?? []).map((c) => ({
          value: String(c.id),
          label: c.businessName,
        }))}
        value={selectedClientId}
        onChange={setSelectedClientId}
        clearable
        searchable
        mb="md"
        className="w-full sm:w-[350px]"
      />

      <Tabs defaultValue="prices" keepMounted={false}>
        <Tabs.List mb="md">
          <Tabs.Tab
            value="prices"
            leftSection={<IconCurrencyDollar size={16} />}
          >
            Tarifas
          </Tabs.Tab>
          <Tabs.Tab value="zones" leftSection={<IconMapPin size={16} />}>
            Zonas
          </Tabs.Tab>
          <Tabs.Tab value="conditions" leftSection={<IconRuler size={16} />}>
            Condiciones de Precio
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="prices">
          <PricesTab clientId={selectedClientId ? Number(selectedClientId) : null} />
        </Tabs.Panel>

        <Tabs.Panel value="zones">
          <ZonesTab />
        </Tabs.Panel>

        <Tabs.Panel value="conditions">
          <ConditionsTab />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
