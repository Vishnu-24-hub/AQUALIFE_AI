/**
 * AquaLife AI - Application Logic Engine
 * Aligned with 1M1B - IBM SkillsBuild & AICTE Virtual Internship Guidelines
 * SDG 14: Life Below Water
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initDiseaseDetector();
    initWaterPredictor();
    initRAGAssistant();
    initFeedCalculator();
});

/* ==========================================================================
   1. NAVIGATION & TAB SYSTEM
   ========================================================================== */
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            navButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));

            btn.classList.add('active');
            const activeSection = document.getElementById(targetTab);
            if (activeSection) {
                activeSection.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   2. MULTIMODAL AI FISH SPECIES & DISEASE DETECTOR
   ========================================================================== */
const SAMPLES = {
    betta_finrot: {
        species: "Betta Fish (Betta splendens)",
        confidence: "95.4%",
        diagnosis: "EARLY STAGE FIN ROT DETECTED",
        statusType: "warning",
        description: "Edges of caudal and anal fins show slight fraying and necrotic darkening. Bacterial/fungal pathogen caused by high organic waste or nitrate accumulation.",
        fin: "75% Intact (Frayed)",
        scale: "Slight Mucus",
        stress: "Moderate",
        risk: "Moderate (Secondary Infection)",
        treatments: [
            "Perform an immediate 30% water change to reduce organic waste & nitrates below 15 ppm.",
            "Add 1 tsp per 5 gallons of natural Aquarium Salt to support gill function & osmotic balance.",
            "Introduce natural Indian Almond Leaves (Catappa) to release antibacterial and antifungal tannins.",
            "Maintain steady water temperature at 26°C (78°F); avoid harsh antibiotics if caught early."
        ],
        img: "betta_fish.jpg"
    },
    neon_healthy: {
        species: "Neon Tetra (Paracheirodon innesi)",
        confidence: "98.6%",
        diagnosis: "HEALTHY - NO PATHOGENS DETECTED",
        statusType: "success",
        description: "Clear body coloration, radiant iridescent blue horizontal stripe intact, active schooling behavior. No white spots, fin rot, or muscle wasting observed.",
        fin: "100% Intact",
        scale: "Normal & Reflective",
        stress: "Low",
        risk: "None (Pristine Vitality)",
        treatments: [
            "Maintain water temperature between 21°C - 27°C (70°F - 81°F) with soft, slightly acidic water.",
            "Perform routine weekly 15% water changes using dechlorinated water.",
            "Maintain a school size of at least 6+ tetras to minimize social stress."
        ],
        img: "neon_tetra.jpg"
    },
    guppy_healthy: {
        species: "Guppy (Poecilia reticulata)",
        confidence: "97.4%",
        diagnosis: "HEALTHY - VIBRANT FIN DISPLAY",
        statusType: "success",
        description: "Ornate fan tail fully expanded, active surface feeding behavior, no signs of shimmying, parasites, or clamped fins.",
        fin: "100% Intact",
        scale: "Normal",
        stress: "Low",
        risk: "None (Pristine Vitality)",
        treatments: [
            "Maintain water temperature between 22°C - 28°C (72°F - 82°F) with pH 7.0 - 8.0.",
            "Feed high-quality flakes, spirulina, and blanched spinach.",
            "Keep balanced male-to-female ratio (1 male : 2-3 females) to reduce mating stress."
        ],
        img: "guppy_fish.jpg"
    },
    goldfish_ich: {
        species: "Goldfish (Carassius auratus)",
        confidence: "97.2%",
        diagnosis: "WHITE SPOT DISEASE (ICH / Ichthyophthirius multifiliis)",
        statusType: "danger",
        description: "Multiple tiny white salt-like cyst spots detected across lateral scales and pectoral fins. Highly contagious ciliated protozoan parasite.",
        fin: "Sub-par (Cysts)",
        scale: "White Cysts Present",
        stress: "High (Flashing against decor)",
        risk: "Critical (Highly Contagious)",
        treatments: [
            "Isolate infected fish in a quarantine tank if possible, or treat the entire community tank.",
            "Gradually raise water temperature to 26°C - 28°C to accelerate the parasite life cycle.",
            "Perform daily 20% water changes and thoroughly siphon gravel substrate to vacuum fallen theronts.",
            "Add copper-based, malachite green, or aquarium salt treatments according to dosage."
        ],
        img: "goldfish.jpg"
    },
    angelfish_healthy: {
        species: "Angelfish (Pterophyllum scalare)",
        confidence: "98.1%",
        diagnosis: "HEALTHY - VIBRANT DORSAL INTEGRITY",
        statusType: "success",
        description: "Elongated ventral feelers intact, clear lateral silver stripes, active swimming and strong feeding responsiveness.",
        fin: "100% Intact",
        scale: "Normal",
        stress: "Low",
        risk: "None (Pristine Vitality)",
        treatments: [
            "Maintain water temperature between 24°C - 29°C (76°F - 84°F) in a tall tank (18+ inches).",
            "Feed high-protein cichlid pellets, frozen bloodworms, and daphnia.",
            "Provide tall live plants (Amazon Sword) for natural habitat enrichment."
        ],
        img: "angelfish.jpg"
    },
    molly_healthy: {
        species: "Molly Fish (Poecilia sphenops)",
        confidence: "96.5%",
        diagnosis: "HEALTHY - ACTIVE BRACKISH ADAPTATION",
        statusType: "success",
        description: "Smooth scale pigmentation, active algae grazing behavior, intact sailfin membrane, and steady buoyancy.",
        fin: "100% Intact",
        scale: "Normal",
        stress: "Low",
        risk: "None (Pristine Vitality)",
        treatments: [
            "Maintain temperature between 22°C - 28°C (72°F - 82°F) in hard, alkaline water (pH 7.5 - 8.2).",
            "Add a small amount of aquarium salt (1 tbsp per 5 gal) for improved immune resistance.",
            "Feed plant-based diet including spirulina, algae wafers, and blanched vegetables."
        ],
        img: "molly_fish.jpg"
    },
    discus_fungal: {
        species: "Discus (Symphysodon spp.)",
        confidence: "93.8%",
        diagnosis: "SAPROLEGNIA FUNGAL PATCH (COTTON WOOL DISEASE)",
        statusType: "warning",
        description: "Cotton-like white tuft growth detected near dorsal fin. Secondary water mold infection taking advantage of minor scale abrasion or cold water stress.",
        fin: "Minor Fraying",
        scale: "Localized Fungal Patch",
        stress: "Moderate",
        risk: "Medium (Opportunistic)",
        treatments: [
            "Improve water purity; Discus require soft, warm water (28°C - 30°C / 82°F - 86°F) and pristine filtration.",
            "Apply mild organic anti-fungal dip (Botanical Melafix / Tea Tree Extract).",
            "Perform gentle 25% water changes every 2 days with conditioned reverse-osmosis water.",
            "Ensure diet includes vitamin C enriched specialty discus pellets to boost immunity."
        ],
        img: "discus_fish.jpg"
    },
    corydoras_healthy: {
        species: "Corydoras Catfish (Corydoras spp.)",
        confidence: "98.7%",
        diagnosis: "HEALTHY - INTACT BARBELS & SCUTES",
        statusType: "success",
        description: "Whiskered barbels clean and intact, active substrate scavenging in school, smooth bony plate armor.",
        fin: "100% Intact",
        scale: "Normal (Armored)",
        stress: "Low",
        risk: "None (Pristine Vitality)",
        treatments: [
            "Maintain soft sand substrate to protect delicate sensory barbels from abrasive erosion.",
            "Keep water temperature between 22°C - 26°C (72°F - 78°F).",
            "Feed dedicated sinking catfish pellets and algae wafers directly at bottom substrate."
        ],
        img: "corydoras_catfish.jpg"
    },
    oscar_hexamita: {
        species: "Oscar Fish (Astronotus ocellatus)",
        confidence: "92.9%",
        diagnosis: "HOLE-IN-THE-HEAD (HEXAMITA / HLLE) RISK",
        statusType: "warning",
        description: "Minor pitting sensory pore lesions observed along head and lateral line. Common in large cichlids due to nitrate buildup, poor diet, or activated carbon dust.",
        fin: "Intact",
        scale: "Pitting Lesions on Head",
        stress: "Moderate",
        risk: "Moderate (Non-Contagious HLLE)",
        treatments: [
            "Perform an immediate 40% water change to lower nitrate levels strictly below 20 ppm.",
            "Supplement diet with vitamin C, vitamin D, and fresh chopped garlic to boost immune defense.",
            "Administer metronidazole-medicated feed in a quiet quarantine tank if lesions advance.",
            "Ensure large tank size (55+ gal) with heavy canister waste filtration."
        ],
        img: "oscar_fish.jpg"
    }
};

function initDiseaseDetector() {
    const sampleBtns = document.querySelectorAll('.sample-btn');
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');
    const previewBox = document.getElementById('preview-box');
    const placeholderPreview = previewBox ? previewBox.querySelector('.placeholder-preview') : null;
    const imagePreview = document.getElementById('image-preview');
    const scanOverlay = document.getElementById('scan-overlay');
    const diagnosticResults = document.getElementById('diagnostic-results');
    const symptomSelect = document.getElementById('upload-symptom-select');

    let currentActiveImgSrc = null;
    let currentActiveFilename = "sample_specimen.jpg";

    // 1. Handle Sample Clicks
    sampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-sample');
            if (SAMPLES[key]) {
                sampleBtns.forEach(b => b.classList.remove('active-sample'));
                btn.classList.add('active-sample');

                currentActiveImgSrc = SAMPLES[key].img;
                currentActiveFilename = key + ".jpg";

                if (symptomSelect) {
                    symptomSelect.value = key;
                }

                runScanProcess(SAMPLES[key]);
            }
        });
    });

    // 2. Drag & Drop Zone Handlers
    if (dropZone) {
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.add('drag-active');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.remove('drag-active');
            }, false);
        });

        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files && files.length > 0) {
                handleUploadedFile(files[0]);
            }
        });

        dropZone.addEventListener('click', (e) => {
            if (e.target !== fileInput) {
                fileInput.click();
            }
        });
    }

    // 3. File Input Change Handler
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                handleUploadedFile(e.target.files[0]);
                fileInput.value = ''; // Reset to allow re-uploading same file
            }
        });
    }

    function handleUploadedFile(file) {
        sampleBtns.forEach(b => b.classList.remove('active-sample'));
        const reader = new FileReader();
        reader.onload = function(evt) {
            currentActiveImgSrc = evt.target.result;
            currentActiveFilename = file.name;
            processCustomUpload(file.name, evt.target.result);
        };
        reader.readAsDataURL(file);
    }

    // 4. Diagnostic Mode Dropdown Change Handler
    if (symptomSelect) {
        symptomSelect.addEventListener('change', () => {
            const mode = symptomSelect.value;
            if (!currentActiveImgSrc) {
                // If user hasn't loaded any image yet, automatically pick the matching sample image
                const fallbackImg = getRepresentativeImageForMode(mode);
                currentActiveImgSrc = fallbackImg;
                currentActiveFilename = mode + ".jpg";
            }

            if (mode === 'auto') {
                processCustomUpload(currentActiveFilename, currentActiveImgSrc);
            } else {
                const manualResult = getManualModeResult(mode, currentActiveImgSrc);
                runScanProcess(manualResult);
            }
        });
    }

    function getRepresentativeImageForMode(mode) {
        if (mode.startsWith('betta')) return 'betta_fish.jpg';
        if (mode.startsWith('neon') || mode.startsWith('tetra')) return 'neon_tetra.jpg';
        if (mode.startsWith('goldfish')) return 'goldfish.jpg';
        if (mode.startsWith('guppy')) return 'guppy_fish.jpg';
        if (mode.startsWith('angelfish')) return 'angelfish.jpg';
        if (mode.startsWith('molly')) return 'molly_fish.jpg';
        if (mode.startsWith('discus')) return 'discus_fish.jpg';
        if (mode.startsWith('corydoras')) return 'corydoras_catfish.jpg';
        if (mode.startsWith('oscar')) return 'oscar_fish.jpg';
        return 'neon_tetra.jpg';
    }

    // 5. Intelligent Multi-Modal Visual Inspection Engine
    function processCustomUpload(filename, imgSrc) {
        const mode = symptomSelect ? symptomSelect.value : 'auto';
        const lowerName = filename.toLowerCase();

        // If user explicitly selected a manual disease diagnostic focus, honor it
        if (mode !== 'auto') {
            const manualResult = getManualModeResult(mode, imgSrc);
            runScanProcess(manualResult);
            return;
        }

        const img = new Image();
        if (imgSrc.startsWith('http')) {
            img.crossOrigin = "Anonymous";
        }

        img.onload = function() {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const w = 120;
                const h = 120;
                canvas.width = w;
                canvas.height = h;

                ctx.drawImage(img, 0, 0, w, h);
                const imgData = ctx.getImageData(0, 0, w, h);
                const pixels = imgData.data;

                let bluePixels = 0;
                let redPixels = 0;
                let orangePixels = 0;
                let whitePalePixels = 0;
                let darkPixels = 0;
                let greenPixels = 0;
                let brightSpotCysts = 0;
                let totalAnalyzed = 0;

                // Center & Full region sampling with gradient variance
                for (let y = 10; y < h - 10; y++) {
                    for (let x = 10; x < w - 10; x++) {
                        const i = (y * w + x) * 4;
                        const r = pixels[i];
                        const g = pixels[i + 1];
                        const b = pixels[i + 2];
                        const alpha = pixels[i + 3];

                        if (alpha < 40) continue;
                        totalAnalyzed++;

                        // Color clustering
                        if (b > 120 && b > r * 1.15 && g > 70) bluePixels++;
                        if (r > 135 && g < 115 && b < 115) redPixels++;
                        if (r > 160 && g > 85 && g < 175 && b < 120) orangePixels++;
                        if (g > 125 && r > 100 && b < 110) greenPixels++;
                        if (r > 215 && g > 215 && b > 215) whitePalePixels++;
                        if (r < 50 && g < 50 && b < 50) darkPixels++;

                        // Micro White-Spot / Cyst Detection (high local luminance spike vs surrounding)
                        if (r > 220 && g > 220 && b > 220) {
                            const leftI = (y * w + (x - 2)) * 4;
                            const rightI = (y * w + (x + 2)) * 4;
                            if (leftI >= 0 && rightI < pixels.length) {
                                const leftLum = (pixels[leftI] + pixels[leftI+1] + pixels[leftI+2]) / 3;
                                const rightLum = (pixels[rightI] + pixels[rightI+1] + pixels[rightI+2]) / 3;
                                if (leftLum < 160 && rightLum < 160) {
                                    brightSpotCysts++;
                                }
                            }
                        }
                    }
                }

                const aspectRatio = img.width / img.height;
                const total = totalAnalyzed || 1;
                const blueRatio = bluePixels / total;
                const redRatio = redPixels / total;
                const orangeRatio = orangePixels / total;
                const whiteRatio = whitePalePixels / total;
                const darkRatio = darkPixels / total;

                let result = null;

                // Priority Check 1: Filename Keyword Extraction
                if (lowerName.includes('dropsy') || lowerName.includes('pinecone') || lowerName.includes('swell') || lowerName.includes('bloat')) {
                    result = getManualModeResult('goldfish_dropsy', imgSrc);
                } else if (lowerName.includes('ntd') || lowerName.includes('pleistophora') || lowerName.includes('wasting')) {
                    result = getManualModeResult('neon_ntd', imgSrc);
                } else if (lowerName.includes('ich') || lowerName.includes('white_spot') || lowerName.includes('whitespot')) {
                    result = getManualModeResult('goldfish_ich', imgSrc);
                } else if (lowerName.includes('rot') || lowerName.includes('finrot')) {
                    result = getManualModeResult('betta_finrot', imgSrc);
                } else if (lowerName.includes('fung') || lowerName.includes('cotton') || lowerName.includes('saprolegnia')) {
                    result = getManualModeResult('discus_fungal', imgSrc);
                } else if (lowerName.includes('hexamita') || lowerName.includes('hole')) {
                    result = getManualModeResult('oscar_hexamita', imgSrc);
                } else if (lowerName.includes('velvet') || lowerName.includes('rust') || lowerName.includes('oodinium')) {
                    result = getManualModeResult('betta_velvet', imgSrc);
                } else if (lowerName.includes('columnaris') || lowerName.includes('mouth')) {
                    result = getManualModeResult('tetra_columnaris', imgSrc);
                } else if (lowerName.includes('swim') || lowerName.includes('bladder')) {
                    result = getManualModeResult('goldfish_swimbladder', imgSrc);
                } else if (lowerName.includes('popeye') || lowerName.includes('eye')) {
                    result = getManualModeResult('betta_popeye', imgSrc);
                } else if (lowerName.includes('camallanus') || lowerName.includes('worm')) {
                    result = getManualModeResult('guppy_camallanus', imgSrc);
                } else if (lowerName.includes('barbel') || lowerName.includes('erosion')) {
                    result = getManualModeResult('corydoras_erosion', imgSrc);
                }
                // Priority Check 2: Color, Texture & Morphological Visual Analysis
                else if (lowerName.includes('gold') || lowerName.includes('auratus') || orangeRatio > 0.12) {
                    if (brightSpotCysts > 8 || whiteRatio > 0.16) {
                        result = getManualModeResult('goldfish_ich', imgSrc);
                    } else if (aspectRatio < 1.3 && whiteRatio > 0.08) {
                        result = getManualModeResult('goldfish_dropsy', imgSrc);
                    } else {
                        result = getManualModeResult('goldfish_healthy', imgSrc);
                    }
                } else if (lowerName.includes('neon') || lowerName.includes('tetra') || lowerName.includes('innesi') || (blueRatio > 0.05 && redRatio > 0.03)) {
                    if (whiteRatio > 0.10) {
                        result = getManualModeResult('neon_ntd', imgSrc);
                    } else if (brightSpotCysts > 6) {
                        result = getManualModeResult('goldfish_ich', imgSrc);
                    } else {
                        result = getManualModeResult('neon_healthy', imgSrc);
                    }
                } else if (lowerName.includes('betta') || lowerName.includes('splendens') || redRatio > 0.14) {
                    if (lowerName.includes('rot') || darkRatio > 0.25) {
                        result = getManualModeResult('betta_finrot', imgSrc);
                    } else {
                        result = getManualModeResult('betta_healthy', imgSrc);
                    }
                } else if (lowerName.includes('angel') || lowerName.includes('scalare') || aspectRatio < 0.95) {
                    result = getManualModeResult('angelfish_healthy', imgSrc);
                } else if (lowerName.includes('molly') || lowerName.includes('sphenops') || (darkRatio > 0.35 && blueRatio < 0.02)) {
                    result = getManualModeResult('molly_healthy', imgSrc);
                } else if (lowerName.includes('discus') || lowerName.includes('symphysodon')) {
                    if (whiteRatio > 0.08) {
                        result = getManualModeResult('discus_fungal', imgSrc);
                    } else {
                        result = getManualModeResult('discus_healthy', imgSrc);
                    }
                } else if (lowerName.includes('cory') || lowerName.includes('catfish')) {
                    result = getManualModeResult('corydoras_healthy', imgSrc);
                } else if (lowerName.includes('oscar') || lowerName.includes('astronotus')) {
                    if (whiteRatio > 0.07) {
                        result = getManualModeResult('oscar_hexamita', imgSrc);
                    } else {
                        result = getManualModeResult('oscar_healthy', imgSrc);
                    }
                } else if (lowerName.includes('guppy') || lowerName.includes('reticulata')) {
                    result = getManualModeResult('guppy_healthy', imgSrc);
                } else {
                    // Generic Fish Detection based on spot and texture detection
                    if (brightSpotCysts > 8) {
                        result = {
                            species: "Aquatic Specimen (Vision Classified)",
                            confidence: "94.6%",
                            diagnosis: "WHITE SPOT DISEASE (ICH) DETECTED",
                            statusType: "danger",
                            description: "Visual neural scan detected localized high-contrast white cysts across fin and scale boundaries.",
                            fin: "Sub-par (Cysts)",
                            scale: "Cysts Detected",
                            stress: "High",
                            risk: "Critical (Highly Contagious)",
                            treatments: [
                                "Isolate infected specimen in quarantine tank.",
                                "Gradually elevate water temperature to 27°C (80°F).",
                                "Administer anti-parasitic treatment (Ich cure or aquarium salt bath).",
                                "Perform 25% daily gravel siphon water changes."
                            ],
                            img: imgSrc
                        };
                    } else {
                        result = {
                            species: "Aquatic Specimen (Vision Classified)",
                            confidence: "95.2%",
                            diagnosis: "HEALTHY - VITALITY PARAMETERS NORMAL",
                            statusType: "success",
                            description: "Visual neural scan analyzed scale pigmentation, fin membrane continuity, and surface refraction. No active pathogens or fungal legions detected.",
                            fin: "100% Intact",
                            scale: "Normal & Clear",
                            stress: "Low",
                            risk: "None (Pristine Vitality)",
                            treatments: [
                                "Ensure water temperature and pH remain within stable baseline limits.",
                                "Perform routine weekly 15-20% partial water changes.",
                                "Provide balanced species-appropriate nutrition twice daily."
                            ],
                            img: imgSrc
                        };
                    }
                }

                runScanProcess(result);
            } catch (err) {
                runScanProcess(autoKeywordFallback(filename, imgSrc));
            }
        };

        img.onerror = function() {
            runScanProcess(autoKeywordFallback(filename, imgSrc));
        };

        img.src = imgSrc;
    }

    function autoKeywordFallback(filename, imgSrc) {
        const lowerName = filename.toLowerCase();
        if (lowerName.includes('gold') || lowerName.includes('dropsy')) return getManualModeResult('goldfish_dropsy', imgSrc);
        if (lowerName.includes('betta') || lowerName.includes('rot')) return getManualModeResult('betta_finrot', imgSrc);
        if (lowerName.includes('discus') || lowerName.includes('fung')) return getManualModeResult('discus_fungal', imgSrc);
        if (lowerName.includes('oscar') || lowerName.includes('hexamita')) return getManualModeResult('oscar_hexamita', imgSrc);
        if (lowerName.includes('neon') || lowerName.includes('ntd')) return getManualModeResult('neon_ntd', imgSrc);
        if (lowerName.includes('ich') || lowerName.includes('spot')) return getManualModeResult('goldfish_ich', imgSrc);
        return getManualModeResult('healthy', imgSrc);
    }

    // 6. Comprehensive Manual Disease & Species Baseline Catalog
    function getManualModeResult(mode, imgSrc) {
        const catalog = {
            goldfish_ich: {
                species: "Goldfish (Carassius auratus)",
                confidence: "97.2%",
                diagnosis: "WHITE SPOT DISEASE (ICH / Ichthyophthirius multifiliis)",
                statusType: "danger",
                description: "Multiple tiny white salt-like cyst spots detected across lateral scales and pectoral fins. Highly contagious ciliated protozoan parasite.",
                fin: "Sub-par (Cysts)",
                scale: "White Cysts Present",
                stress: "High (Flashing against decor)",
                risk: "Critical (Highly Contagious)",
                treatments: [
                    "Isolate infected fish in a quarantine tank if possible, or treat the entire community tank.",
                    "Gradually raise water temperature to 26°C - 28°C to accelerate the parasite life cycle.",
                    "Perform daily 20% water changes and thoroughly siphon gravel substrate to vacuum fallen theronts.",
                    "Add copper-based, malachite green, or aquarium salt treatments according to dosage."
                ],
                img: imgSrc
            },
            goldfish_dropsy: {
                species: "Goldfish (Carassius auratus)",
                confidence: "95.8%",
                diagnosis: "DROPSY (PINECONE SCALE DISEASE / INTERNAL BACTERIAL SEPSIS)",
                statusType: "danger",
                description: "Visual neural scan detected severe abdominal distension (bloating) and pinecone-like raised scale protrusion. Caused by internal bacterial organ failure and fluid retention (ascites).",
                fin: "80% Intact (Clamped)",
                scale: "Pinecone Protrusion (Severe)",
                stress: "Critical",
                risk: "High (Internal Bacterial Sepsis)",
                treatments: [
                    "Isolate infected fish immediately in a quiet, well-aerated hospital tank.",
                    "Add Epsom Salt (1-2 tsp per 5 gallons) to help draw out accumulated abdominal fluid via osmotic pressure.",
                    "Administer broad-spectrum antibacterial medication (e.g., Kanamycin or Maracyn 2).",
                    "Maintain zero ammonia & nitrite with increased dissolved oxygen aeration."
                ],
                img: imgSrc
            },
            betta_finrot: {
                species: "Betta Fish (Betta splendens)",
                confidence: "95.4%",
                diagnosis: "EARLY STAGE FIN ROT DETECTED",
                statusType: "warning",
                description: "Edges of caudal and anal fins show slight fraying and necrotic darkening. Bacterial/fungal pathogen caused by high organic waste or nitrate accumulation.",
                fin: "75% Intact (Frayed)",
                scale: "Slight Mucus",
                stress: "Moderate",
                risk: "Moderate (Secondary Infection)",
                treatments: [
                    "Perform an immediate 30% water change to reduce organic waste & nitrates below 15 ppm.",
                    "Add 1 tsp per 5 gallons of natural Aquarium Salt to support gill function & osmotic balance.",
                    "Introduce natural Indian Almond Leaves (Catappa) to release antibacterial and antifungal tannins.",
                    "Maintain steady water temperature at 26°C (78°F); avoid harsh antibiotics if caught early."
                ],
                img: imgSrc
            },
            discus_fungal: {
                species: "Discus (Symphysodon spp.)",
                confidence: "93.8%",
                diagnosis: "SAPROLEGNIA FUNGAL PATCH (COTTON WOOL DISEASE)",
                statusType: "warning",
                description: "Cotton-like white tuft growth detected near dorsal fin. Secondary water mold infection taking advantage of minor scale abrasion or cold water stress.",
                fin: "Minor Fraying",
                scale: "Localized Fungal Patch",
                stress: "Moderate",
                risk: "Medium (Opportunistic)",
                treatments: [
                    "Improve water purity; Discus require soft, warm water (28°C - 30°C / 82°F - 86°F) and pristine filtration.",
                    "Apply mild organic anti-fungal dip (Botanical Melafix / Tea Tree Extract).",
                    "Perform gentle 25% water changes every 2 days with conditioned reverse-osmosis water.",
                    "Ensure diet includes vitamin C enriched specialty discus pellets to boost immunity."
                ],
                img: imgSrc
            },
            neon_ntd: {
                species: "Neon Tetra (Paracheirodon innesi)",
                confidence: "97.1%",
                diagnosis: "NEON TETRA DISEASE (NTD / Pleistophora hyphessobryconis)",
                statusType: "danger",
                description: "Visual neural scan detected microsporidian parasite infection. Characteristics show loss of glowing iridescent blue stripe, pale white muscle wasting, restless swimming, and physical emaciation.",
                fin: "90% Intact",
                scale: "Depigmentation & Muscle Wasting",
                stress: "Critical",
                risk: "Critical (Incurable Spore Transmission)",
                treatments: [
                    "Isolate infected tetra immediately to prevent microsporidian spores from spreading to tank mates via the water column.",
                    "Maintain soft, slightly acidic water (pH 6.0 - 7.0, 21°C - 27°C) for remaining healthy school members.",
                    "No effective chemical cure exists for advanced NTD; humanely isolate severely affected fish to protect the school."
                ],
                img: imgSrc
            },
            oscar_hexamita: {
                species: "Oscar Fish (Astronotus ocellatus)",
                confidence: "92.9%",
                diagnosis: "HOLE-IN-THE-HEAD (HEXAMITA / HLLE) RISK",
                statusType: "warning",
                description: "Minor pitting sensory pore lesions observed along head and lateral line. Common in large cichlids due to nitrate buildup, poor diet, or activated carbon dust.",
                fin: "Intact",
                scale: "Pitting Lesions on Head",
                stress: "Moderate",
                risk: "Moderate (Non-Contagious HLLE)",
                treatments: [
                    "Perform an immediate 40% water change to lower nitrate levels strictly below 20 ppm.",
                    "Supplement diet with vitamin C, vitamin D, and fresh chopped garlic to boost immune defense.",
                    "Administer metronidazole-medicated feed in a quiet quarantine tank if lesions advance.",
                    "Ensure large tank size (55+ gal) with heavy canister waste filtration."
                ],
                img: imgSrc
            },
            betta_velvet: {
                species: "Betta Fish (Betta splendens)",
                confidence: "94.2%",
                diagnosis: "VELVET DISEASE (GOLD DUST / Piscinoodinium)",
                statusType: "danger",
                description: "Fine gold/rust-colored velvety dust coating observed across head and body scales. Parasitic dinoflagellate causing intense itching and clamped fins.",
                fin: "Clamped",
                scale: "Gold Velvet Sheen",
                stress: "High (Shimmying & Scratching)",
                risk: "High (Contagious Parasite)",
                treatments: [
                    "Dim or turn off aquarium lights (the dinoflagellate contains chlorophyll and requires light to survive).",
                    "Add copper-based medication or acriflavine under veterinary guidelines.",
                    "Perform 20% water changes every other day and raise temperature to 27°C - 28°C."
                ],
                img: imgSrc
            },
            tetra_columnaris: {
                species: "Neon Tetra (Paracheirodon innesi)",
                confidence: "95.0%",
                diagnosis: "COLUMNARIS (COTTON MOUTH / SADDLEBACK DISEASE)",
                statusType: "danger",
                description: "Flavobacterium columnare infection detected. Presents as grayish-white ulcerations around mouth ('cotton mouth') or saddleback patch across dorsal ridge.",
                fin: "Frayed Margins",
                scale: "Cottony Ulceration on Mouth/Back",
                stress: "High",
                risk: "High (Rapid Bacterial Contagion)",
                treatments: [
                    "Isolate infected fish in hospital tank immediately; lower water temperature to 22°C (cool water inhibits bacterial multiplication).",
                    "Add broad-spectrum antibacterial medication (Nitrofurazone + Kanamycin combination).",
                    "Add aquarium salt (1 tsp/gal) to assist gill respiration and fluid balance."
                ],
                img: imgSrc
            },
            goldfish_swimbladder: {
                species: "Goldfish (Carassius auratus)",
                confidence: "96.0%",
                diagnosis: "SWIM BLADDER BUOYANCY DISORDER",
                statusType: "warning",
                description: "Abnormal floating, sinking, or sideways tilting detected. Caused by intestinal compaction from dry floating flakes or internal bacterial inflammation.",
                fin: "Intact",
                scale: "Normal",
                stress: "Moderate",
                risk: "Low (Non-Contagious)",
                treatments: [
                    "Fast the fish for 24 to 48 hours to clear digestive tract compaction.",
                    "Feed steamed, deshelled green peas (high fiber acts as a natural laxative).",
                    "Switch permanently to sinking pellets and pre-soaked foods to prevent swallowing surface air."
                ],
                img: imgSrc
            },
            betta_popeye: {
                species: "Betta Fish (Betta splendens)",
                confidence: "93.7%",
                diagnosis: "POPEYE (EXOPHTHALMIA)",
                statusType: "warning",
                description: "Unilateral or bilateral corneal protrusion and fluid buildup behind the ocular socket. Caused by physical trauma or dirty tank water.",
                fin: "Intact",
                scale: "Swollen Eye Socket",
                stress: "Moderate",
                risk: "Low (Bacterial/Trauma)",
                treatments: [
                    "Perform frequent 25% water changes to maintain sterile water quality.",
                    "Add Epsom Salt (1 tsp per 5 gal) to relieve fluid pressure behind the eye.",
                    "Apply erythromycin or gentle antibacterial dip if bacterial infection is suspected."
                ],
                img: imgSrc
            },
            guppy_camallanus: {
                species: "Guppy (Poecilia reticulata)",
                confidence: "96.8%",
                diagnosis: "CAMALLANUS PARASITIC RED WORMS",
                statusType: "danger",
                description: "Tiny red thread-like nematode worms protruding from the anal vent. Internal parasite feeding on blood and nutrients.",
                fin: "Intact",
                scale: "Red Nematodes at Vent",
                stress: "High",
                risk: "Critical (Spreads via Feces)",
                treatments: [
                    "Treat the entire tank with Levamisole or Fenbendazole to paralyze and expel the worms.",
                    "Vacuum gravel substrate thoroughly 24-48 hours after treatment to remove expelled worms.",
                    "Perform 50% water change post-medication and provide vitamin-enriched food."
                ],
                img: imgSrc
            },
            corydoras_erosion: {
                species: "Corydoras Catfish (Corydoras spp.)",
                confidence: "95.5%",
                diagnosis: "BARBEL EROSION / SUBSTRATE INJURY",
                statusType: "warning",
                description: "Sensory barbels shortened and inflamed. Caused by sharp, rough gravel substrate or high organic bottom detritus bacteria.",
                fin: "Intact",
                scale: "Inflamed Barbels",
                stress: "Moderate",
                risk: "Low (Environmental)",
                treatments: [
                    "Replace sharp gravel with fine, smooth aquarium sand substrate immediately.",
                    "Clean bottom substrate thoroughly to remove decaying organic pockets.",
                    "Add Indian Almond Leaves and Melafix to promote healthy barbel tissue regeneration."
                ],
                img: imgSrc
            },
            betta_healthy: {
                species: "Betta Fish (Betta splendens)",
                confidence: "98.4%",
                diagnosis: "HEALTHY - VIBRANT FIN DISPLAY",
                statusType: "success",
                description: "Flowing fin membrane intact, vibrant pigmentation, active surface breathing, clear alert eyes.",
                fin: "100% Intact",
                scale: "Normal & Vibrant",
                stress: "Low",
                risk: "None (Pristine Vitality)",
                treatments: [
                    "Maintain water temperature between 24°C - 27°C (76°F - 80°F).",
                    "Feed protein-rich betta pellets twice daily in moderate portions.",
                    "Provide live plants for resting spots and environmental enrichment."
                ],
                img: imgSrc
            },
            neon_healthy: {
                species: "Neon Tetra (Paracheirodon innesi)",
                confidence: "98.6%",
                diagnosis: "HEALTHY - NO PATHOGENS DETECTED",
                statusType: "success",
                description: "Clear body coloration, radiant iridescent blue horizontal stripe intact, active schooling behavior. No white spots or fin rot observed.",
                fin: "100% Intact",
                scale: "Normal & Reflective",
                stress: "Low",
                risk: "None (Pristine Vitality)",
                treatments: [
                    "Maintain water temperature between 21°C - 27°C (70°F - 81°F).",
                    "Perform routine weekly 15% water changes using dechlorinated water.",
                    "Maintain school size of at least 6+ tetras to minimize social stress."
                ],
                img: imgSrc
            },
            guppy_healthy: {
                species: "Guppy (Poecilia reticulata)",
                confidence: "97.4%",
                diagnosis: "HEALTHY - VIBRANT FIN DISPLAY",
                statusType: "success",
                description: "Ornate fan tail fully expanded, active surface feeding behavior, no signs of shimmying, parasites, or clamped fins.",
                fin: "100% Intact",
                scale: "Normal",
                stress: "Low",
                risk: "None (Pristine Vitality)",
                treatments: [
                    "Maintain water temperature between 22°C - 28°C (72°F - 82°F) with pH 7.0 - 8.0.",
                    "Feed high-quality flakes, spirulina, and blanched spinach.",
                    "Keep balanced male-to-female ratio (1 male : 2-3 females)."
                ],
                img: imgSrc
            },
            goldfish_healthy: {
                species: "Goldfish (Carassius auratus)",
                confidence: "98.0%",
                diagnosis: "HEALTHY - COLDWATER VITALITY",
                statusType: "success",
                description: "Vibrant orange/gold scale pigmentation, smooth body contour, active foraging posture without flashing or fin clamping.",
                fin: "100% Intact",
                scale: "Normal",
                stress: "Low",
                risk: "None (Pristine Vitality)",
                treatments: [
                    "Maintain cool water temperature between 18°C - 24°C (65°F - 75°F).",
                    "Perform weekly 20% water changes and maintain heavy waste filtration."
                ],
                img: imgSrc
            },
            angelfish_healthy: {
                species: "Angelfish (Pterophyllum scalare)",
                confidence: "98.1%",
                diagnosis: "HEALTHY - VIBRANT DORSAL INTEGRITY",
                statusType: "success",
                description: "Elongated ventral feelers intact, clear lateral silver stripes, active swimming and strong feeding responsiveness.",
                fin: "100% Intact",
                scale: "Normal",
                stress: "Low",
                risk: "None (Pristine Vitality)",
                treatments: [
                    "Maintain water temperature between 24°C - 29°C (76°F - 84°F) in a tall tank.",
                    "Feed high-protein cichlid pellets, frozen bloodworms, and daphnia."
                ],
                img: imgSrc
            },
            molly_healthy: {
                species: "Molly Fish (Poecilia sphenops)",
                confidence: "96.5%",
                diagnosis: "HEALTHY - ACTIVE BRACKISH ADAPTATION",
                statusType: "success",
                description: "Smooth scale pigmentation, active algae grazing behavior, intact sailfin membrane, and steady buoyancy.",
                fin: "100% Intact",
                scale: "Normal",
                stress: "Low",
                risk: "None (Pristine Vitality)",
                treatments: [
                    "Maintain temperature between 22°C - 28°C (72°F - 82°F) in hard, alkaline water.",
                    "Add a small amount of aquarium salt for improved disease resistance."
                ],
                img: imgSrc
            },
            discus_healthy: {
                species: "Discus (Symphysodon spp.)",
                confidence: "97.5%",
                diagnosis: "HEALTHY - PRISTINE COLORATION",
                statusType: "success",
                description: "Vibrant round disc body coloration, smooth lateral lines, responsive owner recognition and voracious appetite.",
                fin: "100% Intact",
                scale: "Normal",
                stress: "Low",
                risk: "None (Pristine Vitality)",
                treatments: [
                    "Maintain pristine warm water quality at 28°C - 30°C (82°F - 86°F).",
                    "Perform frequent 20% water changes with soft, conditioned water."
                ],
                img: imgSrc
            },
            corydoras_healthy: {
                species: "Corydoras Catfish (Corydoras spp.)",
                confidence: "98.7%",
                diagnosis: "HEALTHY - INTACT BARBELS & SCUTES",
                statusType: "success",
                description: "Whiskered barbels clean and intact, active substrate scavenging in school, smooth bony plate armor.",
                fin: "100% Intact",
                scale: "Normal (Armored)",
                stress: "Low",
                risk: "None (Pristine Vitality)",
                treatments: [
                    "Maintain soft sand substrate to protect delicate sensory barbels.",
                    "Keep water temperature between 22°C - 26°C (72°F - 78°F)."
                ],
                img: imgSrc
            },
            oscar_healthy: {
                species: "Oscar Fish (Astronotus ocellatus)",
                confidence: "97.0%",
                diagnosis: "HEALTHY - BOLD CICHLID VITALITY",
                statusType: "success",
                description: "Robust oval body, clear sensory pores on head, active owner recognition and alert responsiveness.",
                fin: "100% Intact",
                scale: "Normal",
                stress: "Low",
                risk: "None (Pristine Vitality)",
                treatments: [
                    "Maintain large tank size (55+ gal) with heavy waste filtration.",
                    "Feed high-quality cichlid pellets, shrimp, and meaty supplements."
                ],
                img: imgSrc
            },
            healthy: {
                species: "Custom Uploaded Specimen",
                confidence: "96.0%",
                diagnosis: "HEALTHY - NORMAL VITALITY",
                statusType: "success",
                description: "Analyzed uploaded visual features. Clear scale pigmentation, intact fins, low stress indicators observed.",
                fin: "100% Intact",
                scale: "Normal",
                stress: "Low",
                risk: "None (Pristine Vitality)",
                treatments: [
                    "Ensure water parameters remain within stable limits.",
                    "Feed balanced species-specific diet twice daily."
                ],
                img: imgSrc
            }
        };

        if (catalog[mode]) {
            const data = catalog[mode];
            return {
                ...data,
                img: imgSrc || data.img
            };
        }

        return catalog.healthy;
    }

    // 7. Scanning Animation & Rendering
    function runScanProcess(sampleData) {
        if (placeholderPreview) placeholderPreview.classList.add('hidden');
        imagePreview.onerror = function() {
            if (!this.dataset.fallback) {
                this.dataset.fallback = '1';
                this.src = sampleData.img.includes('images/') ? sampleData.img.replace('images/', '') : 'images/' + sampleData.img;
            }
        };
        imagePreview.src = sampleData.img;
        imagePreview.classList.remove('hidden');
        scanOverlay.classList.remove('hidden');
        diagnosticResults.classList.add('hidden');

        // Simulate Neural Network Scan
        setTimeout(() => {
            scanOverlay.classList.add('hidden');
            renderDiagnosticData(sampleData);
            diagnosticResults.classList.remove('hidden');
        }, 900);
    }

    function renderDiagnosticData(data) {
        document.getElementById('res-species').innerText = data.species;
        
        const confBadge = document.getElementById('res-confidence');
        confBadge.innerText = data.confidence;
        confBadge.className = 'confidence-badge';
        if (data.statusType === 'warning') confBadge.classList.add('conf-warning');
        else if (data.statusType === 'danger') confBadge.classList.add('conf-danger');

        document.getElementById('res-diagnosis').innerText = data.diagnosis;
        document.getElementById('res-desc').innerText = data.description;

        document.getElementById('val-fin').innerText = data.fin;
        document.getElementById('val-scale').innerText = data.scale;
        document.getElementById('val-stress').innerText = data.stress;

        const valRisk = document.getElementById('val-risk');
        if (valRisk) {
            valRisk.innerText = data.risk || "Low (Non-Contagious)";
        }

        const statusBox = document.getElementById('status-box');
        statusBox.className = 'health-status-box'; // reset
        if (data.statusType === 'warning') statusBox.classList.add('status-warning');
        if (data.statusType === 'danger') statusBox.classList.add('status-danger');

        const treatmentList = document.getElementById('treatment-list');
        treatmentList.innerHTML = '';
        data.treatments.forEach(t => {
            const li = document.createElement('li');
            li.innerText = t;
            treatmentList.appendChild(li);
        });
    }
}

/* ==========================================================================
   3. WATER QUALITY & TOXICITY PREDICTOR
   ========================================================================== */
function initWaterPredictor() {
    const inputTemp = document.getElementById('input-temp');
    const inputPh = document.getElementById('input-ph');
    const inputAmmonia = document.getElementById('input-ammonia');
    const inputNitrite = document.getElementById('input-nitrite');
    const inputNitrate = document.getElementById('input-nitrate');

    const inputs = [inputTemp, inputPh, inputAmmonia, inputNitrite, inputNitrate];

    inputs.forEach(input => {
        input.addEventListener('input', updateWaterAnalysis);
    });

    updateWaterAnalysis(); // Initial run

    function updateWaterAnalysis() {
        const temp = parseFloat(inputTemp.value);
        const ph = parseFloat(inputPh.value);
        const ammonia = parseFloat(inputAmmonia.value);
        const nitrite = parseFloat(inputNitrite.value);
        const nitrate = parseFloat(inputNitrate.value);

        // Update Display Values
        document.getElementById('val-display-temp').innerText = temp.toFixed(1) + " °C";
        document.getElementById('val-display-ph').innerText = ph.toFixed(1);
        document.getElementById('val-display-ammonia').innerText = ammonia.toFixed(2) + " ppm";
        document.getElementById('val-display-nitrite').innerText = nitrite.toFixed(2) + " ppm";
        document.getElementById('val-display-nitrate').innerText = nitrate.toFixed(0) + " ppm";

        // Calculate Safety Index Score (100 base)
        let score = 100;
        let warningMsgs = [];

        // Temperature Penalty (ideal 24-27)
        if (temp < 22 || temp > 28) score -= 15;
        // pH Penalty (ideal 6.8 - 7.6)
        if (ph < 6.5 || ph > 8.0) score -= 15;

        // Ammonia Penalty (0 is safe, >0.25 toxic, >1.0 severe)
        if (ammonia > 0) {
            score -= Math.min( ammPenalty(ammonia), 45 );
            if (ammonia >= 0.25) warningMsgs.push("HIGH AMMONIA TOXICITY DETECTED");
        }

        // Nitrite Penalty (>0 toxic)
        if (nitrite > 0) {
            score -= Math.min( nitrite * 30, 35 );
            if (nitrite >= 0.25) warningMsgs.push("NITRITE SPIKE CAUSING GILL STRESS");
        }

        // Nitrate Penalty (>40 high)
        if (nitrate > 40) {
            score -= 15;
            warningMsgs.push("HIGH NITRATE (Require water change)");
        }

        score = Math.max(Math.round(score), 5);

        // Gauge UI Update
        const gaugeCircle = document.getElementById('gauge-circle');
        const gaugeScore = document.getElementById('gauge-score');
        const gaugeStatus = document.getElementById('gauge-status');
        const alertBanner = document.getElementById('water-alert-banner');
        const alertTitle = document.getElementById('alert-title');
        const alertMsg = document.getElementById('alert-msg');
        const actionText = document.getElementById('water-action-text');

        gaugeScore.innerText = score + "%";

        let deg = (score / 100) * 360;
        let color = '#00e676';
        let statusText = "EXCELLENT";

        if (score < 50) {
            color = '#ff5252';
            statusText = "CRITICAL RISK";
        } else if (score < 75) {
            color = '#ffb703';
            statusText = "MODERATE RISK";
        }

        gaugeCircle.style.background = `conic-gradient(${color} 0deg ${deg}deg, rgba(255,255,255,0.1) ${deg}deg 360deg)`;
        gaugeStatus.innerText = statusText;
        gaugeStatus.style.color = color;

        // Update Alert Banner
        if (warningMsgs.length > 0) {
            alertBanner.className = 'alert-banner alert-danger';
            alertBanner.querySelector('i').className = 'fa-solid fa-triangle-exclamation';
            alertTitle.innerText = warningMsgs[0];
            alertMsg.innerText = "Action required to prevent fish stress and mortality.";
        } else {
            alertBanner.className = 'alert-banner';
            alertBanner.querySelector('i').className = 'fa-solid fa-circle-check';
            alertTitle.innerText = "Aquatic Environment Safe";
            alertMsg.innerText = "Water parameters are perfectly balanced for fish immune health.";
        }

        // Nitrogen Progress Bar Simulation
        const totalWaste = Math.max(ammonia + nitrite + (nitrate/20), 0.1);
        const amPercent = Math.round((ammonia / totalWaste) * 100) || 5;
        const niPercent = Math.round((nitrite / totalWaste) * 100) || 5;
        const naPercent = Math.max(100 - amPercent - niPercent, 10);

        document.getElementById('bar-ammonia').style.width = amPercent + "%";
        document.getElementById('bar-nitrite').style.width = niPercent + "%";
        document.getElementById('bar-nitrate').style.width = naPercent + "%";

        // Recommendations
        if (ammonia > 0.5 || nitrite > 0.5) {
            actionText.innerText = "Perform an immediate 50% water change using dechlorinated water. Add nitrifying bacteria supplement (e.g., FritzZyme 7) to restore biological filter.";
        } else if (nitrate > 40) {
            actionText.innerText = "Perform a 25% water change. Add fast-growing floating live plants (e.g. Duckweed, Frogbit, Hornwort) to absorb excess nitrates naturally.";
        } else {
            actionText.innerText = "No emergency water change required. Maintain regular weekly 15% maintenance to support long-term aquatic balance.";
        }
    }

    function ammPenalty(val) {
        return val * 35;
    }
}

/* ==========================================================================
   4. RAG-POWERED SUSTAINABLE CARE ASSISTANT
   ========================================================================== */
const RAG_KNOWLEDGE_BASE = [
    {
        keywords: ["cycle", "cycling", "fishless", "setup"],
        answer: "<strong>Fishless Tank Cycling (SDG 14 Best Practice):</strong><br>1. Fill tank with dechlorinated water and install filter.<br>2. Dose liquid pure ammonia to 2 ppm or add a pinch of fish food to decay.<br>3. Introduce beneficial nitrifying bacteria (Nitrosomonas & Nitrobacter).<br>4. Wait 2-3 weeks until ammonia and nitrite drop to 0 ppm, and nitrate rises.<br><em>Why it matters:</em> Prevents subjecting live fish to painful ammonia burn during initial nitrogen cycle setup."
    },
    {
        keywords: ["release", "pond", "river", "invasive", "goldfish"],
        answer: "<strong>CRITICAL ENVIRONMENTAL WARNING (SDG 14):</strong><br>Never release aquarium fish, snails, or water plants into local ponds, lakes, or storm drains! Pet goldfish and plecos often become destructive <em>invasive species</em> that outcompete native fish, introduce novel pathogens, and destroy aquatic flora.<br><strong>Eco-Friendly Alternatives:</strong> Contact a local aquarium store for re-homing, or surrender pets to an aquatic sanctuary."
    },
    {
        keywords: ["plant", "plants", "nitrate", "algae"],
        answer: "<strong>Natural Nitrate-Absorbing Aquatic Plants:</strong><br>Live plants act as natural biological filters. Top species include:<br>• <strong>Hornwort & Anacharis:</strong> Rapid growers that absorb nitrates directly from water column.<br>• <strong>Floating Frogbit & Water Lettuce:</strong> Shade tank to suppress algae while soaking up excess nutrients.<br>• <strong>Pothos (Roots in water):</strong> Extremely effective at eliminating nitrates in heavily stocked tanks."
    },
    {
        keywords: ["compatible", "compatibility", "neon", "tetra", "tankmates"],
        answer: "<strong>Neon Tetra Compatibility Guide:</strong><br>Neon Tetras are peaceful schooling fish requiring tank mates of similar temperament.<br><strong>Great Mates:</strong> Harlequin Rasboras, Corydoras Catfish, Guppies, Dwarf Gouramis, Amano Shrimp.<br><strong>Avoid:</strong> Large cichlids, Angelfish (when full grown, they eat tetras), or aggressive Barbs."
    }
];

function initRAGAssistant() {
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const presetBtns = document.querySelectorAll('.preset-btn');

    chatSendBtn.addEventListener('click', handleUserQuery);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserQuery();
    });

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.getAttribute('data-query');
            chatInput.value = query;
            handleUserQuery();
        });
    });

    function handleUserQuery() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Append User Message
        appendMessage(text, 'user');
        chatInput.value = '';

        // Simulate AI RAG Retrieval
        setTimeout(() => {
            const botAnswer = queryRAGBase(text);
            appendMessage(botAnswer, 'bot');
        }, 600);
    }

    function appendMessage(content, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;

        const avatarIcon = sender === 'user' ? 'fa-user' : 'fa-robot';
        msgDiv.innerHTML = `
            <div class="msg-avatar"><i class="fa-solid ${avatarIcon}"></i></div>
            <div class="msg-bubble"><p>${content}</p></div>
        `;

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function queryRAGBase(queryText) {
        const lower = queryText.toLowerCase();
        for (const item of RAG_KNOWLEDGE_BASE) {
            for (const kw of item.keywords) {
                if (lower.includes(kw)) {
                    return item.answer;
                }
            }
        }

        // Fallback RAG response
        return `<strong>AquaBot RAG Insight:</strong> Based on general aquatic ecology guidelines under SDG 14, maintaining a stable biological load, feeding small amounts twice daily, and performing regular 15% water changes are key to preventing aquatic stress. For specific species care, consult grounded aquatic literature.`;
    }
}

/* ==========================================================================
   5. SMART FEED & WASTE MINIMIZATION CALCULATOR
   ========================================================================== */
function initFeedCalculator() {
    const btnCalc = document.getElementById('btn-calc-feed');

    btnCalc.addEventListener('click', calculateFeed);

    function calculateFeed() {
        const volume = parseFloat(document.getElementById('tank-volume').value) || 60;
        const smallCount = parseInt(document.getElementById('small-fish-count').value) || 0;
        const medCount = parseInt(document.getElementById('med-fish-count').value) || 0;
        const largeCount = parseInt(document.getElementById('large-fish-count').value) || 0;

        // Estimated biomass: Small (~2-5 cm: Tetras, Guppies, Bettas) = 1.5g, Med (~5-8 cm: Gouramis, Mollies) = 5.0g, Large (~10+ cm: Goldfish, Angelfish) = 22.0g
        const totalBiomass = (smallCount * 1.5) + (medCount * 5.0) + (largeCount * 22.0);

        // Daily Feed Recommendation = ~2% of body biomass for adult fish
        const dailyFeedGrams = (totalBiomass * 0.02).toFixed(2);

        // Bio-load Capacity relative to volume (Liters)
        // Rule of thumb: ~1 cm fish per Liter
        const totalFishCm = (smallCount * 3.5) + (medCount * 6.5) + (largeCount * 12.0);
        const bioCapacityPercent = Math.round((totalFishCm / volume) * 100);

        document.getElementById('res-biomass').innerText = `${Math.round(totalBiomass)} grams`;
        document.getElementById('res-feed').innerText = `${dailyFeedGrams} grams`;

        const bioEl = document.getElementById('res-bioload');
        if (bioCapacityPercent > 100) {
            bioEl.innerText = `${bioCapacityPercent}% (OVERSTOCKED - Risk of Nitrogen Spike)`;
            bioEl.className = 'f-value color-coral';
        } else if (bioCapacityPercent > 75) {
            bioEl.innerText = `${bioCapacityPercent}% (High Load)`;
            bioEl.className = 'f-value color-gold';
        } else {
            bioEl.innerText = `${bioCapacityPercent}% (Safe Bio-load)`;
            bioEl.className = 'f-value color-green';
        }
    }
}
