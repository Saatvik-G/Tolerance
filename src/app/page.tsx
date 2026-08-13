"use client";

import React, { useState, useEffect } from "react";
import { 
  Upload, 
  Cpu, 
  TrendingUp, 
  Layers, 
  CheckCircle, 
  AlertTriangle, 
  Hourglass, 
  Play, 
  FileSpreadsheet, 
  Database,
  ArrowRight,
  HelpCircle,
  Code
} from "lucide-react";
import { RawProductRow, ProcessedProductRow } from "@/utils/pipeline";

export default function ToleranceDashboard() {
  const [seedCatalog, setSeedCatalog] = useState<RawProductRow[]>([]);
  const [selectedSku, setSelectedSku] = useState<string>("DISH-001");
  const [customFile, setCustomFile] = useState<File | null>(null);
  
  // Pipeline state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedItems, setProcessedItems] = useState<ProcessedProductRow[]>([]);
  const [selectedResult, setSelectedResult] = useState<ProcessedProductRow | null>(null);
  
  // Metrics state
  const [metrics, setMetrics] = useState<any>(null);
  const [throughput, setThroughput] = useState<any>(null);
  
  // Simulation speed
  const [activeStep, setActiveStep] = useState<number>(0);
  const [showBlueprintScan, setShowBlueprintScan] = useState<boolean>(false);

  // Load Seed Catalog on mount
  useEffect(() => {
    fetch("/api/enrich", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: [] }) // simple wake up call
    }).catch(() => {});
    
    // Seed list
    const fetchSeeds = async () => {
      try {
        const res = await fetch("/data/seed_catalog.json");
        const data = await res.json();
        setSeedCatalog(data);
      } catch (err) {
        console.error("Failed to load seed catalog:", err);
      }
    };
    fetchSeeds();
  }, []);

  // Run pipeline for selected item or full batch
  const handleProcess = async (batch: boolean) => {
    setIsProcessing(true);
    setActiveStep(1); // 1 = Analyzing
    setShowBlueprintScan(true);
    
    const rowsToProcess = batch 
      ? seedCatalog 
      : seedCatalog.filter(item => item.SKU === selectedSku);

    if (rowsToProcess.length === 0) {
      setIsProcessing(false);
      return;
    }

    // Step animations
    const steps = [
      { step: 1, delay: 400 }, // Analyzing
      { step: 2, delay: 800 }, // De-duplicating
      { step: 3, delay: 1200 }, // Classification
      { step: 4, delay: 1600 }, // Extracting Attributes
      { step: 5, delay: 2000 }, // Normalization & Cleansing
      { step: 6, delay: 2400 }  // Done
    ];

    steps.forEach(({ step, delay }) => {
      setTimeout(() => {
        setActiveStep(step);
      }, delay);
    });

    try {
      const response = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: rowsToProcess })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setTimeout(() => {
          setProcessedItems(result.processedRows);
          setMetrics(result.metrics);
          setThroughput(result.throughput);
          
          // Set selection
          const primaryResult = result.processedRows.find((r: any) => r.SKU === selectedSku) || result.processedRows[0];
          setSelectedResult(primaryResult);
          
          setIsProcessing(false);
          setShowBlueprintScan(false);
        }, 2500);
      } else {
        setIsProcessing(false);
        setShowBlueprintScan(false);
      }
    } catch (error) {
      console.error("Pipeline run failed:", error);
      setIsProcessing(false);
      setShowBlueprintScan(false);
    }
  };

  // Switch display item in blueprint view
  const handleItemSelect = (sku: string) => {
    setSelectedSku(sku);
    const found = processedItems.find(p => p.SKU === sku);
    if (found) {
      setSelectedResult(found);
    }
  };

  // Find currently selected raw item details
  const selectedRaw = seedCatalog.find(item => item.SKU === selectedSku) || null;

  return (
    <main className="blueprint-grid min-h-screen p-6 md:p-8 flex flex-col gap-6 text-foreground">
      
      {/* HEADER SECTION */}
      <header className="border-b border-border-grid pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-technical text-brand-cyan text-sm tracking-wider">PROJECT: TOLERANCE</span>
            <span className="px-2 py-0.5 bg-brand-muted/20 border border-brand-muted/50 rounded text-xs text-brand-cyan font-technical">V1.0.0-MVP</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight font-grotesk mt-1 text-white">
            Tolerance <span className="text-brand-cyan">Product Intelligence</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Standardization, taxonomy classification, and high-fidelity attribute extraction pipeline.
          </p>
        </div>
        
        {/* API STATUS / CONSOLE */}
        <div className="flex gap-4 items-center">
          <div className="font-technical text-xs flex items-center gap-2 bg-bg-surface border border-border-grid px-3 py-2 rounded">
            <span className="h-2 w-2 rounded-full bg-brand-cyan animate-pulse"></span>
            <span>API SERVER: ONLINE</span>
          </div>
          <a
            href="https://github.com/Saatvik-G/Tolerance.git"
            target="_blank"
            className="flex items-center gap-2 bg-brand-muted/20 hover:bg-brand-muted/40 border border-brand-cyan/30 hover:border-brand-cyan text-xs font-technical px-3 py-2 rounded text-brand-cyan transition-all"
          >
            <Code className="h-4.5 w-4.5" />
            <span>GITHUB</span>
          </a>
        </div>
      </header>

      {/* PIPELINE CONTROL BAR */}
      <section className="bg-bg-surface border border-border-grid p-4 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-technical text-gray-400 mb-1">SELECT DEMO SKU</label>
            <select
              className="bg-bg-base border border-border-grid text-sm font-technical text-brand-cyan rounded p-2 focus:outline-none focus:border-brand-cyan"
              value={selectedSku}
              onChange={(e) => handleItemSelect(e.target.value)}
              disabled={isProcessing}
            >
              {seedCatalog.map(item => (
                <option key={item.SKU} value={item.SKU}>
                  {item.SKU} ({item.Mfg_Part_Num})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-technical text-gray-400 mb-1">RAW DESCRIPTION PREVIEW</label>
            <span className="text-sm font-technical text-white truncate max-w-xs md:max-w-md bg-bg-base px-3 py-2 border border-border-grid rounded">
              {selectedRaw ? selectedRaw.Part_Desc : "Select an item..."}
            </span>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => handleProcess(false)}
            disabled={isProcessing || !selectedSku}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan text-brand-cyan font-technical text-sm px-4 py-2.5 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="h-4 w-4" />
            <span>RUN SINGLE SKU</span>
          </button>
          
          <button
            onClick={() => handleProcess(true)}
            disabled={isProcessing || seedCatalog.length === 0}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-brand-cyan hover:bg-brand-cyan/80 text-black font-semibold font-technical text-sm px-5 py-2.5 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Cpu className="h-4 w-4" />
            <span>ENRICH BATCH (15 SKUs)</span>
          </button>
        </div>
      </section>

      {/* PIPELINE LIVE STATUS STEPS */}
      {isProcessing && (
        <section className="bg-bg-surface border border-brand-cyan/30 p-4 rounded grid grid-cols-2 md:grid-cols-6 gap-4 animate-pulse">
          {[
            { id: 1, label: "Input Profiling" },
            { id: 2, label: "Manufacturer De-dup" },
            { id: 3, label: "Taxonomy Mapping" },
            { id: 4, label: "Attribute Extraction" },
            { id: 5, label: "Sanity Checks" },
            { id: 6, label: "Title & Desc Builder" }
          ].map(step => {
            const isCompleted = activeStep > step.id;
            const isActive = activeStep === step.id;
            return (
              <div 
                key={step.id} 
                className={`flex flex-col gap-1 items-center justify-center text-center p-2 border rounded transition-all ${
                  isCompleted 
                    ? "border-brand-muted bg-brand-muted/10 text-brand-cyan" 
                    : isActive 
                    ? "border-brand-cyan bg-brand-cyan/10 text-white font-bold" 
                    : "border-border-grid text-gray-500"
                }`}
              >
                <span className="font-technical text-xs">STEP 0{step.id}</span>
                <span className="text-xs uppercase font-technical">{step.label}</span>
                {isCompleted ? (
                  <span className="text-[10px] text-brand-cyan font-technical">COMPLETED</span>
                ) : isActive ? (
                  <span className="text-[10px] text-brand-cyan animate-pulse font-technical">RUNNING...</span>
                ) : (
                  <span className="text-[10px] text-gray-600 font-technical">PENDING</span>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* DUAL WORKSPACE LAYOUT (BLUEPRINT VIEW + ROI METRICS) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SIGNATURE ELEMENT: BLUEPRINT TRANSFORMATION VIEW */}
        <div className="lg:col-span-8 bg-bg-surface border border-border-grid rounded overflow-hidden flex flex-col">
          <div className="border-b border-border-grid p-4 flex justify-between items-center bg-bg-base">
            <div className="flex items-center gap-2">
              <span className="font-technical text-brand-cyan text-xs">VIEWPORT: ANNOTATED SCHEMATIC</span>
            </div>
            <div className="font-technical text-xs text-gray-400">
              CONFIDENCE LEVEL: {selectedResult ? `${Math.round(selectedResult.overallConfidence * 100)}%` : "N/A"}
            </div>
          </div>
          
          <div className="relative flex-1 p-6 flex flex-col justify-between min-h-[450px] bg-grid-overlay blueprint-grid overflow-hidden">
            {showBlueprintScan && <div className="scanner-line"></div>}

            {/* Top schematic block (Raw Input) */}
            <div className="border border-brand-cyan/20 bg-bg-base/80 p-4 rounded z-10">
              <span className="block text-[10px] font-technical text-brand-cyan mb-1">RAW CATALOG INPUT RECORD</span>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-technical">
                <div>
                  <span className="text-gray-400 block">MFG PART NUMBER</span>
                  <span className="text-white text-sm font-bold">{selectedRaw ? selectedRaw.Mfg_Part_Num : "--"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">RAW MANUFACTURER</span>
                  <span className="text-white text-sm">{selectedRaw ? selectedRaw.Part_Manuf : "--"}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-400 block">RAW DISTRIBUTOR DESCRIPTION</span>
                  <span className="text-white text-sm truncate block">{selectedRaw ? selectedRaw.Part_Desc : "--"}</span>
                </div>
              </div>
            </div>

            {/* Middle schematic block (Transforming diagram) */}
            <div className="my-6 flex flex-col items-center justify-center relative min-h-[150px]">
              {selectedResult ? (
                <div className="w-full flex flex-col md:flex-row gap-6 justify-between items-center z-10">
                  
                  {/* Transformation Callouts */}
                  <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Bounding box 1 */}
                    <div className="border border-brand-cyan bg-bg-base/90 p-3 rounded relative">
                      <div className="absolute top-0 right-0 px-2 py-0.5 bg-brand-cyan text-black text-[9px] font-technical uppercase font-bold rounded-bl">
                        Resolved
                      </div>
                      <span className="block text-[9px] font-technical text-brand-cyan">Taxonomy Mapping</span>
                      <span className="block text-xs font-technical font-bold text-white truncate" title={selectedResult.Classpath}>
                        {selectedResult.Classpath.split(">").pop()}
                      </span>
                      <span className="block text-[9px] font-technical text-gray-400 mt-1">
                        CONF: {Math.round(selectedResult.overallConfidence * 100)}% ± 1%
                      </span>
                    </div>

                    {/* Bounding box 2 */}
                    <div className="border border-brand-cyan bg-bg-base/90 p-3 rounded relative">
                      <div className="absolute top-0 right-0 px-2 py-0.5 bg-brand-cyan text-black text-[9px] font-technical uppercase font-bold rounded-bl">
                        Normalized
                      </div>
                      <span className="block text-[9px] font-technical text-brand-cyan">MFR & Brand Normalization</span>
                      <span className="block text-xs font-technical font-bold text-white truncate">
                        {selectedResult.MANUFACTURER_NAME} ({selectedResult.BRAND_NAME})
                      </span>
                      <span className="block text-[9px] font-technical text-gray-400 mt-1">
                        PROV: Fuzzy Lookup Match
                      </span>
                    </div>

                    {/* Bounding box 3 */}
                    <div className="border border-brand-cyan bg-bg-base/90 p-3 rounded relative">
                      <div className="absolute top-0 right-0 px-2.5 py-0.5 bg-brand-cyan text-black text-[9px] font-technical uppercase font-bold rounded-bl">
                        Cleaned
                      </div>
                      <span className="block text-[9px] font-technical text-brand-cyan">Structured Specs</span>
                      <span className="block text-xs font-technical font-bold text-white truncate">
                        {selectedResult.attributes.length} attributes resolved
                      </span>
                      <span className="block text-[9px] font-technical text-gray-400 mt-1">
                        ERRORS RESOLVED: {selectedResult.validationIssuesCount}
                      </span>
                    </div>

                  </div>

                </div>
              ) : (
                <div className="text-center text-gray-500 font-technical flex flex-col items-center gap-3">
                  <Database className="h-12 w-12 text-border-grid animate-pulse" />
                  <p>Click "Run Single SKU" or "Enrich Batch" to visualize pipeline mapping.</p>
                </div>
              )}
            </div>

            {/* Bottom schematic block (Standardized Output) */}
            {selectedResult && (
              <div className="border border-brand-cyan bg-bg-base/90 p-4 rounded z-10">
                <span className="block text-[10px] font-technical text-brand-cyan mb-1">STANDARDIZED SEARCH-READY RECORD</span>
                <div className="flex flex-col gap-3 font-technical text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400 block text-[9px]">INVOICE DESC (CAPS, ≤40 CHARS)</span>
                      <span className="text-white text-sm font-bold bg-bg-surface px-2 py-1 rounded block">{selectedResult.INVOICE_DESC}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9px]">MOBILE DESC (60-80 CHARS)</span>
                      <span className="text-white text-sm bg-bg-surface px-2 py-1 rounded block truncate" title={selectedResult.MOBILE_DESC}>{selectedResult.MOBILE_DESC}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px]">PRODUCT TITLE</span>
                    <span className="text-brand-cyan text-sm font-bold">{selectedResult.SHORT_DESC}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px]">LONG DESCRIPTION</span>
                    <p className="text-gray-300 text-xs mt-0.5 line-clamp-2">{selectedResult.LONG_DESC}</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* METRICS & ROI ANALYTICS DASHBOARD */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* BUSINESS RELEVANCE ROI PANEL */}
          <div className="bg-bg-surface border border-border-grid p-6 rounded flex flex-col gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-cyan" />
              <span>Business ROI Metrics</span>
            </h2>
            <p className="text-xs text-gray-400">
              Direct outcomes calculated on the current dataset compared against cataloger baseline.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-bg-base border border-border-grid p-4 rounded text-center">
                <span className="text-2xl font-bold text-white font-technical block">
                  {metrics ? `${metrics.fillRateBefore}%` : "0%"}
                </span>
                <span className="text-[10px] text-gray-400 font-technical uppercase">Fill Rate Before</span>
              </div>
              <div className="bg-bg-base border border-brand-cyan/30 p-4 rounded text-center">
                <span className="text-2xl font-bold text-brand-cyan font-technical block">
                  {metrics ? `${metrics.fillRateAfter}%` : "0%"}
                </span>
                <span className="text-[10px] text-brand-cyan font-technical uppercase">Fill Rate After</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-2 border-t border-border-grid pt-4">
              <div className="flex justify-between items-center text-xs font-technical">
                <span className="text-gray-400 uppercase">ANALYST TIME SAVED:</span>
                <span className="text-brand-cyan font-bold">
                  {metrics ? `${metrics.businessROI.hoursSaved} Hrs` : "0.0 Hrs"}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-xs font-technical">
                <span className="text-gray-400 uppercase">SEARCHABILITY INCREASE:</span>
                <span className="text-brand-cyan font-bold">
                  {metrics ? `+${metrics.businessROI.searchIndexableAfter}%` : "0%"}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs font-technical">
                <span className="text-gray-400 uppercase">MFR NAME RECONCILIATION:</span>
                <span className="text-brand-cyan font-bold">
                  {metrics ? `${metrics.rawMfrCount} → ${metrics.cleanMfrCount} (${metrics.mfrReductionPercent}% reduction)` : "0 → 0"}
                </span>
              </div>
            </div>

            {/* Extrapolation section */}
            {metrics && (
              <div className="bg-brand-cyan/5 border border-brand-cyan/20 p-4 rounded text-xs font-technical text-gray-300 mt-2">
                <span className="block font-bold text-brand-cyan mb-1">PROJECTIONS AT DISTRIBUTOR SCALE:</span>
                For a standard catalog size of <span className="text-white font-bold">{metrics.businessROI.scaleSKUs.toLocaleString()} SKUs</span>, Tolerance saves <span className="text-white font-bold">{metrics.businessROI.scaleHoursSaved.toLocaleString()} hours</span> of manual cataloger research, equivalent to <span className="text-brand-cyan font-bold font-semibold">{metrics.businessROI.scaleDaysSaved} workdays</span>.
              </div>
            )}
          </div>

          {/* ENGINE THROUGHPUT & PERFORMANCE */}
          <div className="bg-bg-surface border border-border-grid p-6 rounded flex flex-col gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-brand-cyan" />
              <span>Scalable Catalog Engine</span>
            </h2>
            
            <div className="flex flex-col gap-3 text-xs font-technical">
              <div className="flex justify-between items-center border-b border-border-grid pb-2">
                <span className="text-gray-400 uppercase">BATCH CONCURRENCY:</span>
                <span className="text-white font-bold">Asynchronous Chunked</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-border-grid pb-2">
                <span className="text-gray-400 uppercase">TOTAL PROCESSING TIME:</span>
                <span className="text-white font-bold">
                  {throughput ? `${throughput.totalTimeMs} ms` : "0 ms"}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-border-grid pb-2">
                <span className="text-gray-400 uppercase">THROUGHPUT RATE:</span>
                <span className="text-white font-bold">
                  {throughput ? `${throughput.avgTimePerRowMs} ms / SKU` : "0 ms / SKU"}
                </span>
              </div>
            </div>

            {/* Conceptual Scaling architecture note */}
            <div className="text-[11px] text-gray-400 font-technical mt-2 bg-bg-base/50 p-3 border border-border-grid rounded">
              <span className="block font-bold text-gray-300 mb-1 text-xs">Scaling to 50K+ SKUs:</span>
              The architecture employs sequential chunked workers feeding into a persistent job queue (e.g. BullMQ). 
              Repeated manufacturer name mappings are cached locally to save LLM calls. Bounded attributes map 
              directly to static reference guidelines to reduce parsing latency.
            </div>
          </div>

        </div>

      </section>

      {/* DETAILED ATTRIBUTES GRID AND AUDIT TRAIL */}
      {selectedResult && (
        <section className="bg-bg-surface border border-border-grid rounded overflow-hidden">
          <div className="border-b border-border-grid p-4 bg-bg-base flex justify-between items-center">
            <h3 className="text-sm font-bold font-technical text-brand-cyan">
              SPECIFICATION AUDIT TRAIL: SKU {selectedResult.SKU}
            </h3>
            <span className="text-xs text-gray-400 font-technical">
              PROVENANCE KEY: Rule-Based (Deterministic) / LLM-Inferred (AI Parser) / AI-Inferred (Sanity Fill)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-technical text-xs border-collapse">
              <thead>
                <tr className="bg-bg-base/50 border-b border-border-grid text-gray-400">
                  <th className="p-3 font-semibold">ATTRIBUTE SPEC</th>
                  <th className="p-3 font-semibold">RESOLVED VALUE</th>
                  <th className="p-3 font-semibold">UOM</th>
                  <th className="p-3 font-semibold">CONFIDENCE SCORE</th>
                  <th className="p-3 font-semibold">PROVENANCE</th>
                  <th className="p-3 font-semibold">VALIDATION STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-grid text-white">
                {selectedResult.attributes.map((attr, idx) => (
                  <tr key={idx} className="hover:bg-bg-base/30 transition-all">
                    <td className="p-3 font-bold">{attr.label}</td>
                    <td className="p-3">{attr.value}</td>
                    <td className="p-3 text-brand-cyan">{attr.uom || "--"}</td>
                    <td className="p-3">{Math.round(attr.confidence * 100)}%</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        attr.provenance === "Rule-Based" 
                          ? "bg-green-500/10 text-green-400 border border-green-500/30" 
                          : attr.provenance === "LLM-Inferred"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                      }`}>
                        {attr.provenance}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        {attr.validationStatus === "Passed" && (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-green-400 text-[10px]">PASSED</span>
                          </>
                        )}
                        {attr.validationStatus === "Warning" && (
                          <>
                            <AlertTriangle className="h-4 w-4 text-amber-400" />
                            <span className="text-amber-400 text-[10px]">{attr.validationMessage || "WARNING"}</span>
                          </>
                        )}
                        {attr.validationStatus === "Contradiction" && (
                          <>
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                            <span className="text-red-400 text-[10px] font-bold">{attr.validationMessage || "CONTRADICTION"}</span>
                          </>
                        )}
                        {attr.validationStatus === "Inferred" && (
                          <>
                            <Hourglass className="h-4 w-4 text-brand-cyan" />
                            <span className="text-brand-cyan text-[10px]">{attr.validationMessage || "AI FILLED"}</span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* COMPARATIVE BATCH GRID TABLE */}
      {processedItems.length > 0 && (
        <section className="bg-bg-surface border border-border-grid rounded overflow-hidden">
          <div className="border-b border-border-grid p-4 bg-bg-base">
            <h3 className="text-sm font-bold font-technical text-brand-cyan">
              BATCH REPORT: RAW INPUT vs RESOLVED OUTPUT
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-technical text-xs border-collapse">
              <thead>
                <tr className="bg-bg-base/50 border-b border-border-grid text-gray-400">
                  <th className="p-3 font-semibold">SKU</th>
                  <th className="p-3 font-semibold">RAW MANUFACTURER</th>
                  <th className="p-3 font-semibold">RESOLVED BRAND</th>
                  <th className="p-3 font-semibold">RAW DESCRIPTION</th>
                  <th className="p-3 font-semibold">RESOLVED TITLE</th>
                  <th className="p-3 font-semibold">CONFIDENCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-grid text-white">
                {processedItems.map((item, idx) => (
                  <tr 
                    key={idx} 
                    onClick={() => setSelectedResult(item)}
                    className={`hover:bg-bg-base/30 transition-all cursor-pointer ${
                      selectedResult?.SKU === item.SKU ? "bg-brand-cyan/5 border-l-2 border-l-brand-cyan" : ""
                    }`}
                  >
                    <td className="p-3 font-bold text-brand-cyan">{item.SKU}</td>
                    <td className="p-3 text-gray-400">{item.Part_Manuf}</td>
                    <td className="p-3 font-bold">{item.BRAND_NAME}</td>
                    <td className="p-3 truncate max-w-xs text-gray-400" title={item.Part_Desc}>{item.Part_Desc}</td>
                    <td className="p-3 truncate max-w-sm" title={item.SHORT_DESC}>{item.SHORT_DESC}</td>
                    <td className="p-3">{Math.round(item.overallConfidence * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

    </main>
  );
}
