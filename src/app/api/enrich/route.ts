import { NextResponse } from 'next/server';
import { RawProductRow, enrichProductRow, evaluateCatalogEnrichment } from '@/utils/pipeline';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rows = body.rows as RawProductRow[];
    
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "No product rows provided" }, { status: 400 });
    }
    
    const startTime = Date.now();
    const processedRows = [];
    
    // Process rows batch by batch
    for (const row of rows) {
      const processed = await enrichProductRow(row);
      processedRows.push(processed);
    }
    
    const totalTimeMs = Date.now() - startTime;
    const metrics = evaluateCatalogEnrichment(rows, processedRows);
    
    return NextResponse.json({
      success: true,
      processedRows,
      metrics,
      throughput: {
        totalTimeMs,
        avgTimePerRowMs: Math.round(totalTimeMs / rows.length),
        rowsProcessed: rows.length
      }
    });
  } catch (err: any) {
    console.error("API Enrichment Pipeline Error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
