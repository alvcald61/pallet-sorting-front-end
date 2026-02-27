"use client";
import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Text,
  Title,
  Breadcrumbs,
  Group,
  ThemeIcon,
  RingProgress,
  SimpleGrid,
  Card,
  Badge,
  Table,
  Skeleton,
  Stack,
  Center,
  ScrollArea,
  Progress,
} from "@mantine/core";
import {
  IconTrendingUp,
  IconPackage,
  IconTruck,
  IconUsers,
  IconAlertCircle,
  IconCheck,
  IconClock,
} from "@tabler/icons-react";
import {
  getDashboardStats,
  getPendingOrders,
  getOrdersByClient,
  getOrdersByDriver,
  getOrdersByTruck,
  getOrdersByStatus,
  getPerformanceMetrics,
} from "@/lib/api/dashboard/dashboardApi";
import { showNotification } from "@mantine/notifications";
import { useCanAccess } from "@/lib/utils/rbacUtils";

const Dashboard = () => {
  const isAdmin = useCanAccess(["ADMIN"]);
  const [stats, setStats] = useState<any>(null);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [ordersByClient, setOrdersByClient] = useState<any[]>([]);
  const [ordersByDriver, setOrdersByDriver] = useState<any[]>([]);
  const [ordersByTruck, setOrdersByTruck] = useState<any[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [
          statsData,
          pendingData,
          clientsData,
          driversData,
          trucksData,
          statusData,
          metricsData,
        ] = await Promise.all([
          getDashboardStats().catch(() => null),
          getPendingOrders().catch(() => []),
          getOrdersByClient().catch(() => []),
          getOrdersByDriver().catch(() => []),
          getOrdersByTruck().catch(() => []),
          getOrdersByStatus().catch(() => []),
          getPerformanceMetrics().catch(() => null),
        ]);

        setStats(statsData);
        setPendingOrders(pendingData || []);
        setOrdersByClient(clientsData || []);
        setOrdersByDriver(driversData || []);
        setOrdersByTruck(trucksData || []);
        setOrdersByStatus(statusData || []);
        setPerformanceMetrics(metricsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        showNotification({
          title: "Error",
          message: "No se pudo cargar los datos del dashboard",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
    loading: isLoading,
  }: any) => (
    <Paper p="md" radius="md" withBorder>
      <Group justify="space-between">
        <div>
          <Text size="sm" fw={500} c="dimmed">
            {label}
          </Text>
          {isLoading ? (
            <Skeleton height={32} mt="sm" width="50%" />
          ) : (
            <Text fw={700} size="lg">
              {value}
            </Text>
          )}
        </div>
        <ThemeIcon color={color} variant="light" size="lg" radius="md">
          <Icon size={20} />
        </ThemeIcon>
      </Group>
    </Paper>
  );

  // Calcular porcentajes para el gráfico de estado
  const totalOrders = ordersByStatus?.reduce(
    (sum: number, item: any) => sum + (item.count || item.total || 0),
    0
  );

  // Función auxiliar para obtener color según estado
  const getStatusColor = (status: string) => {
    const statusLower = (status || "").toLowerCase();
    if (
      statusLower.includes("delivered") ||
      statusLower.includes("entregado")
    )
      return "green";
    if (
      statusLower.includes("pending") ||
      statusLower.includes("pendiente")
    )
      return "orange";
    if (
      statusLower.includes("transit") ||
      statusLower.includes("en tránsito")
    )
      return "blue";
    if (statusLower.includes("cancelled")) return "red";
    return "gray";
  };

  if (!isAdmin) {
    return (
      <Center style={{ height: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <Text size="xl" fw={700} c="dimmed" mb="sm">
            Acceso restringido
          </Text>
          <Text size="sm" c="dimmed">
            No tienes permisos para ver el dashboard.
          </Text>
        </div>
      </Center>
    );
  }

  return (
    <div className="flex flex-col justify-start w-full grow p-10">
      <Breadcrumbs className="mb-4">
        <span>Dashboard</span>
      </Breadcrumbs>

      <Title order={2} mb="xl">
        Dashboard de Gestión
      </Title>

      {/* Cards de Estadísticas Principales */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="xl">
        <StatCard
          icon={IconPackage}
          label="Total de Órdenes"
          value={stats?.totalOrders || 0}
          color="blue"
          loading={loading}
        />
        <StatCard
          icon={IconAlertCircle}
          label="Órdenes Pendientes"
          value={stats?.pendingOrders || 0}
          color="orange"
          loading={loading}
        />
        <StatCard
          icon={IconCheck}
          label="Órdenes Entregadas"
          value={stats?.deliveredOrders || 0}
          color="green"
          loading={loading}
        />
        <StatCard
          icon={IconTrendingUp}
          label="Ingreso Total"
          value={`$${stats?.totalRevenue?.toLocaleString() || 0}`}
          color="grape"
          loading={loading}
        />
      </SimpleGrid>

      {/* Gráficas Principales */}
      <Grid mb="xl">
        {/* Distribución de Órdenes por Estado */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper p="md" radius="md" withBorder>
            <Title order={4} mb="md">
              Órdenes por Estado
            </Title>
            {loading ? (
              <Stack>
                <Skeleton height={40} />
                <Skeleton height={40} />
                <Skeleton height={40} />
              </Stack>
            ) : ordersByStatus && ordersByStatus.length > 0 ? (
              <Stack gap="md">
                {ordersByStatus.map((item: any) => {
                  const count = item.count || item.total || 0;
                  const percentage = totalOrders
                    ? ((count / totalOrders) * 100).toFixed(1)
                    : 0;
                  return (
                    <div key={item.status || item.orderStatus}>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm" fw={500}>
                          {item.status ||
                            item.orderStatus ||
                            "Sin especificar"}
                        </Text>
                        <Text size="sm" fw={700}>
                          {count} ({percentage}%)
                        </Text>
                      </Group>
                      <Progress
                        value={Number(percentage)}
                        color={getStatusColor(item.status || item.orderStatus)}
                        size="md"
                      />
                    </div>
                  );
                })}
              </Stack>
            ) : (
              <Center h={200}>
                <Text c="dimmed">Sin datos disponibles</Text>
              </Center>
            )}
          </Paper>
        </Grid.Col>

        {/* Top 5 Choferes */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper p="md" radius="md" withBorder>
            <Title order={4} mb="md">
              Top 5 Choferes
            </Title>
            {loading ? (
              <Stack>
                <Skeleton height={40} />
                <Skeleton height={40} />
                <Skeleton height={40} />
              </Stack>
            ) : ordersByDriver && ordersByDriver.length > 0 ? (
              <Stack gap="sm">
                {ordersByDriver.slice(0, 5).map((item: any, idx: number) => (
                  <div key={item.id || idx}>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm" fw={500}>
                        {idx + 1}. {item.driverName || item.name || "N/A"}
                      </Text>
                      <Badge color="blue" variant="light">
                        {item.count || item.total || 0} órdenes
                      </Badge>
                    </Group>
                    <Progress
                      value={
                        ordersByDriver[0]
                          ? ((item.count || item.total || 0) /
                              (ordersByDriver[0].count ||
                                ordersByDriver[0].total ||
                                1)) *
                            100
                          : 0
                      }
                      color="blue"
                      size="sm"
                    />
                  </div>
                ))}
              </Stack>
            ) : (
              <Center h={200}>
                <Text c="dimmed">Sin datos disponibles</Text>
              </Center>
            )}
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Segunda Fila de Datos */}
      <Grid mb="xl">
        {/* Top 5 Clientes */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper p="md" radius="md" withBorder>
            <Title order={4} mb="md">
              Top 5 Clientes
            </Title>
            {loading ? (
              <Stack>
                <Skeleton height={40} />
                <Skeleton height={40} />
                <Skeleton height={40} />
              </Stack>
            ) : ordersByClient && ordersByClient.length > 0 ? (
              <Stack gap="sm">
                {ordersByClient.slice(0, 5).map((item: any, idx: number) => (
                  <div key={item.id || idx}>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm" fw={500} truncate>
                        {idx + 1}.{" "}
                        {item.clientName ||
                          item.businessName ||
                          item.name ||
                          "N/A"}
                      </Text>
                      <Badge color="green" variant="light">
                        {item.count || item.total || 0}
                      </Badge>
                    </Group>
                    <Progress
                      value={
                        ordersByClient[0]
                          ? ((item.count || item.total || 0) /
                              (ordersByClient[0].count ||
                                ordersByClient[0].total ||
                                1)) *
                            100
                          : 0
                      }
                      color="green"
                      size="sm"
                    />
                  </div>
                ))}
              </Stack>
            ) : (
              <Center h={200}>
                <Text c="dimmed">Sin datos disponibles</Text>
              </Center>
            )}
          </Paper>
        </Grid.Col>

        {/* Top 5 Camiones */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper p="md" radius="md" withBorder>
            <Title order={4} mb="md">
              Top 5 Camiones
            </Title>
            {loading ? (
              <Stack>
                <Skeleton height={40} />
                <Skeleton height={40} />
                <Skeleton height={40} />
              </Stack>
            ) : ordersByTruck && ordersByTruck.length > 0 ? (
              <Stack gap="sm">
                {ordersByTruck.slice(0, 5).map((item: any, idx: number) => (
                  <div key={item.id || idx}>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm" fw={500}>
                        {idx + 1}. {item.truckPlate || item.plate || "N/A"}
                      </Text>
                      <Badge color="orange" variant="light">
                        {item.count || item.total || 0}
                      </Badge>
                    </Group>
                    <Progress
                      value={
                        ordersByTruck[0]
                          ? ((item.count || item.total || 0) /
                              (ordersByTruck[0].count ||
                                ordersByTruck[0].total ||
                                1)) *
                            100
                          : 0
                      }
                      color="orange"
                      size="sm"
                    />
                  </div>
                ))}
              </Stack>
            ) : (
              <Center h={200}>
                <Text c="dimmed">Sin datos disponibles</Text>
              </Center>
            )}
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Tabla de Órdenes Pendientes */}
      <Grid>
        <Grid.Col span={{ base: 12 }}>
          <Paper p="md" radius="md" withBorder>
            <Title order={4} mb="md">
              Últimas Órdenes Pendientes
            </Title>
            {loading ? (
              <Stack>
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={50} />
              </Stack>
            ) : pendingOrders && pendingOrders.length > 0 ? (
              <ScrollArea>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>ID</Table.Th>
                      <Table.Th>Cliente</Table.Th>
                      <Table.Th>Desde</Table.Th>
                      <Table.Th>Hacia</Table.Th>
                      <Table.Th>Fecha de Recojo</Table.Th>
                      <Table.Th>Estado</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {pendingOrders.map((order: any) => (
                      <Table.Tr key={order.id}>
                        <Table.Td>
                          <Text size="sm" fw={500}>
                            {order.id}
                          </Text>
                        </Table.Td>
                        <Table.Td>{order.clientName || "N/A"}</Table.Td>
                        <Table.Td>{order.fromAddress}</Table.Td>
                        <Table.Td>{order.toAddress}</Table.Td>
                        <Table.Td>{order.pickupDate}</Table.Td>
                        <Table.Td>
                          <Badge
                            color="orange"
                            variant="light"
                            size="sm"
                          >
                            {order.orderStatus || "Pendiente"}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            ) : (
              <Center py="xl">
                <Text c="dimmed">No hay órdenes pendientes</Text>
              </Center>
            )}
          </Paper>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default Dashboard;
