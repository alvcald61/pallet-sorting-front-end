import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_HOST || "http://localhost:5000";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const params = new URLSearchParams();
  const dateFrom = searchParams.get("dateFrom");
  const dateTo   = searchParams.get("dateTo");
  if (dateFrom) params.append("dateFrom", dateFrom);
  if (dateTo)   params.append("dateTo",   dateTo);

  const query = params.toString();
  const backendUrl = `${BACKEND_URL}/api/invoice/report/export${query ? `?${query}` : ""}`;

  const response = await fetch(backendUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Report generation failed" }, { status: response.status });
  }

  const blob = await response.blob();
  return new NextResponse(blob, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="reporte-facturas.xlsx"',
    },
  });
}
