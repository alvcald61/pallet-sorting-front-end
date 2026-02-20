"use client";

import { Anchor, Breadcrumbs, Tabs, Title, Alert } from "@mantine/core";
import {
  IconCurrencyDollar,
  IconMapPin,
  IconRuler,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useCanAccess } from "@/lib/utils/rbacUtils";
import { PricesTab } from "./components/PricesTab";
import { ZonesTab } from "./components/ZonesTab";
import { ConditionsTab } from "./components/ConditionsTab";

export default function PricingPage() {
  const isAdmin = useCanAccess(["ADMIN"]);

  if (!isAdmin) {
    return (
      <div className="flex flex-col w-full p-10">
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
    <div className="flex flex-col w-full grow p-10">
      <Breadcrumbs className="mb-4">
        <Anchor href="/">Dashboard</Anchor>
        <span>Precios</span>
      </Breadcrumbs>

      <Title order={2} mb="lg">
        Gestión de Precios
      </Title>

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
          <PricesTab />
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
