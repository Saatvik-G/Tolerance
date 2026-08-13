# Tolerance - Demo Video Script

* **Estimated Total Runtime**: ~2 minutes 30 seconds
* **Feature Status**: All features referenced below (descriptions, validation warning boxes, AI-inferred badges, and metrics) are **100% live and fully operational** in the codebase and live Vercel deployment. No stubs are used.

---

## ⏱️ Timed Beat Sheet

### Beat 1: The Problem Hook (0:00 - 0:20)
* **Duration**: 20 seconds
* **Visual on Screen**: Browser displaying the default/loaded state of the Tolerance UI. Hovering the cursor over the **RAW DESCRIPTION PREVIEW** box which shows the messy string for `DISH-001` (`PDSH4816AF Dishwasher SS - Display Only`).
* **Narrator Action**: Speak clearly and naturally. Keep a professional engineering-focused tone.
* **Narration**:
> "Industrial distributors manage millions of SKUs, but their raw catalog data is almost completely unusable. Cryptic descriptions like this raw dishwasher string make items unsearchable and force manual cataloger research. This is where **Tolerance** converges messy data back to spec."

---

### Beat 2: Pipeline Overview (0:20 - 0:45)
* **Duration**: 25 seconds
* **Visual on Screen**: Scroll down slightly or hover over the header showing `T O L E R A N C E | Product Intelligence` and point to the **Pipeline Live Status Steps** grid (Input Profiling through Title Builder).
* **Narration**:
> "**Tolerance** is an AI-powered pipeline built to solve this problem across four key judging criteria. We profile the schema, run fuzzy name de-duplication to resolve manufacturer typos, classify items into a 3-level deep parts taxonomy, extract attributes, run active sanity validation, and auto-build commerce-ready titles and descriptions."

---

### Beat 3: Live Demo - Single SKU Transformation (0:45 - 1:30)
* **Duration**: 45 seconds
* **Visual on Screen**: 
  1. Click **RUN SINGLE SKU** on the interface. 
  2. Watch the horizontal cyan scanner bar sweep down the **VIEWPORT: ANNOTATED SCHEMATIC** blueprint card.
  3. Point to the middle **STRUCTURED ATTRIBUTE PARAMETERS** parameters grid.
  4. Point to the bottom **STANDARDIZED SEARCH-READY RECORD** showing the generated titles and descriptions.
* **Narration**:
> "(Click RUN SINGLE SKU) Let's run a single SKU pass on this Frigidaire dishwasher. (As scan bar sweeps) During extraction, we achieve **Structured Data Generation**. 
> 
> Look at the parameters card: clear dimensions and materials are parsed instantly via regex rules, while complex specs are extracted using Gemini. We establish **AI Validation & Enrichment** here—missing specs like voltage and amps are defaulted, and tagged as *AI-Inferred (Not Verified)* with dashed amber borders so catalogers can audit them. 
> 
> At the bottom, the pipeline automatically compiles search-ready titles, mobile-compliant summaries, and a CAPS invoice description under 40 characters."

---

### Beat 4: Batch Processing & Scalability (1:30 - 1:55)
* **Duration**: 25 seconds
* **Visual on Screen**:
  1. Click **ENRICH BATCH (15 SKUs)**.
  2. Observe the **BATCH REPORT** table populate instantly with all 15 resolved rows.
  3. Scroll down and hover over the **Scalable Catalog Engine** metrics card showing throughput rates in milliseconds.
* **Narration**:
> "(Click ENRICH BATCH) Next, we scale up. Running our 15-SKU batch demonstrates our **Scalable Catalog Engine** outcome. 
> 
> The run completes instantaneously because repeat manufacturer lookups are cached locally to prevent Vercel serverless timeouts and Gemini free-tier rate limits. In production, this architecture handles 50,000+ SKUs by mapping directly into an asynchronous Redis queue with decoupled worker threads."

---

### Beat 5: Business ROI & Evidence (1:55 - 2:20)
* **Duration**: 25 seconds
* **Visual on Screen**: Zoom in / highlight the **Business ROI Metrics** card. Point to the before/after fill rates (50% vs 91%), the hours saved, and the indexability increase (+100%).
* **Narration**:
> "Here is our quantified business evidence. For this 15-SKU demo batch, Tolerance increased catalog fill rate from **50% to 91%**, and made **100%** of these cryptic products search-indexable. 
> 
> Assuming a standard 5-minute manual cataloger research baseline per SKU, at a distributor scale of **50,000 SKUs**, Tolerance saves **4,166 hours** of manual labor—representing over **520 analyst workdays** saved."

---

### Beat 6: Close & Scoped Roadmap (2:20 - 2:35)
* **Duration**: 15 seconds
* **Visual on Screen**: Highlight the GitHub button or Vercel URL, then hover over the stenciled Tolerance wordmark.
* **Narration**:
> "To keep this MVP robust and demo-stable, we intentionally scoped out live external web-scraping and image generation. Next up is building direct connectors into distributor ERPs like Epicor Prophet 21. Tolerance is ready to search-optimize your catalog. Thank you."
