document.addEventListener('DOMContentLoaded', () => {
    const jsonFileElement = document.getElementById('jsonFile');
    const rawCaseStudyTextElement = document.getElementById('rawCaseStudyText');
    const generateJsonBtnElement = document.getElementById('generateJsonBtn');
    const outputJsonElement = document.getElementById('outputJson');
    const downloadJsonBtnElement = document.getElementById('downloadJsonBtn');
    const errorMessagesElement = document.getElementById('errorMessages');
    const warningMessagesElement = document.getElementById('warningMessages');

    let generatedJson = null;
    let clientNameForFile = 'elementor_case_study';

    generateJsonBtnElement.addEventListener('click', async () => {
        clearMessages();
        outputJsonElement.value = '';
        downloadJsonBtnElement.disabled = true;
        generatedJson = null;

        const baseJsonFile = jsonFileElement.files[0];
        const rawText = rawCaseStudyTextElement.value;

        if (!baseJsonFile) {
            showError('Please upload a base Elementor JSON file.');
            return;
        }
        if (!rawText.trim()) {
            showError('Please paste the raw case study text.');
            return;
        }

        try {
            const baseJsonString = await readFileAsText(baseJsonFile);
            let baseJson;
            try {
                baseJson = JSON.parse(baseJsonString);
            } catch (e) {
                showError(`Invalid base JSON file: ${e.message}`);
                return;
            }

            // Deep clone the base JSON to avoid modifying the original object in memory
            // if the user generates multiple times with the same template.
            const templateClone = JSON.parse(JSON.stringify(baseJson));

            const parsedData = parseRawInput(rawText);
            clientNameForFile = parsedData.client_name || 'elementor_case_study'; // Update for download filename

            generatedJson = injectDataIntoTemplate(templateClone, parsedData);

            outputJsonElement.value = JSON.stringify(generatedJson, null, 2); // Pretty print
            downloadJsonBtnElement.disabled = false;

            // Display warnings if any
            if (parsedData.warnings && parsedData.warnings.length > 0) {
                showWarnings(parsedData.warnings);
            }

        } catch (error) {
            showError(error.message);
            console.error('Error during JSON generation:', error);
        }
    });

    downloadJsonBtnElement.addEventListener('click', () => {
        if (!generatedJson) {
            showError('No JSON generated to download.');
            return;
        }
        const blob = new Blob([JSON.stringify(generatedJson, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const sanitizedClientName = clientNameForFile.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
        a.download = `${sanitizedClientName}_elementor.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    function showError(message) {
        errorMessagesElement.textContent = message;
        errorMessagesElement.style.display = 'block';
    }

    function showWarnings(warnings) {
        warningMessagesElement.innerHTML = '<strong>Warnings:</strong><ul>' +
            warnings.map(w => `<li>${escapeHtml(w)}</li>`).join('') +
            '</ul>';
        warningMessagesElement.style.display = 'block';
    }

    function clearMessages() {
        errorMessagesElement.textContent = '';
        errorMessagesElement.style.display = 'none';
        warningMessagesElement.innerHTML = '';
        warningMessagesElement.style.display = 'none';
    }

    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    // Placeholder for parseRawInput - will be implemented next
    function parseRawInput(rawText) {
        console.log("Parsing raw input (to be implemented):", rawText.substring(0,100) + "...");
        const warnings = [];
        let data = {
            client_name: "Default Client",
            industry: "Default Industry",
            service: "",
            website: "",
            overview: "Default overview text.",
            key_achievements: [],
            challenge: { intro: "Default challenge intro.", points: [] },
            approach: [{ title: "Default Approach Step", items: [{value: "Default item"}] }],
            highlights: [{ metric: "Metric 1", result: "Result 1" }],
            timeline: [{ period: "Week 1", description: "Default timeline description." }],
            tools: [{ category: "Category", items: "Default tools used." }],
            testimonial: { quote: "No testimonial available", author: "", title: "", company: "" },
            warnings: warnings
        };

        // Normalize newlines and smart quotes
        rawText = rawText.replace(/\r\n/g, '\n').replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
        const lines = rawText.split('\n').map(line => line.trim());

        // --- Section Definitions ---
        const sectionStarters = {
            overview: /^Overview$/i,
            key_achievements: /^Key Achievements:?$/i,
            challenge: /^The Challenge$/i,
            approach: /^(?:Pixelbee’s|Our|The) Approach|Solution|Strategy$/i,
            highlights: /^Campaign Highlights$/i,
            timeline: /^Timeline & Deliverables$/i,
            tools: /^Tools & Technologies$/i,
            testimonial: /^Client Testimonial$/i,
        };

        let currentSection = null;
        let contentBuffer = {}; // Store lines for each section

        // Initialize buffers
        Object.keys(sectionStarters).forEach(key => contentBuffer[key] = []);
        contentBuffer.metadata = []; // For Client, Industry, Website

        // First pass: identify metadata and section content blocks
        let lineIndex = 0;
        while(lineIndex < lines.length) {
            const line = lines[lineIndex];
            if (line.startsWith('Client:')) {
                data.client_name = line.substring('Client:'.length).trim();
                lineIndex++;
                continue;
            }
            if (line.startsWith('Industry:')) {
                data.industry = line.substring('Industry:'.length).trim();
                // Attempt to split service/industry if combined in industry line
                const industryParts = data.industry.split(/\s*•\s*|\s*-\s*|\s*\/\s*/);
                if (industryParts.length > 1 && data.industry.toLowerCase().includes('service')) { // Heuristic
                     data.service = industryParts.find(part => part.toLowerCase().includes('service')) || industryParts[0].trim();
                     data.industry = industryParts.find(part => !part.toLowerCase().includes('service')) || industryParts[1].trim();
                } else if (industryParts.length > 1) {
                    // Default to first as service if no "service" keyword, common in "Service • Industry"
                    // This might need refinement based on actual data patterns.
                    // For now, if "Industry:" is the label, assume it's primarily industry.
                }
                lineIndex++;
                continue;
            }
             if (line.startsWith('Service:')) { // Explicit Service line
                data.service = line.substring('Service:'.length).trim();
                lineIndex++;
                continue;
            }
            if (line.startsWith('Website:')) {
                data.website = line.substring('Website:'.length).trim();
                lineIndex++;
                continue;
            }
            // Fallback for website if not explicitly labeled but contains .com (early lines)
            if (!data.website && line.includes('.com') && lineIndex < 5 && !Object.values(sectionStarters).some(regex => regex.test(line))) {
                 // Avoid matching .com in section titles or early content
                if (!line.toLowerCase().includes('overview') && !line.toLowerCase().includes('challenge')) { // Basic check
                    data.website = line.trim();
                    lineIndex++;
                    continue;
                }
            }

            let matchedSection = false;
            for (const key in sectionStarters) {
                if (sectionStarters[key].test(line)) {
                    currentSection = key;
                    matchedSection = true;
                    lineIndex++;
                    // If the section title line itself has content after a colon, capture it
                    const titleParts = line.split(':');
                    if (titleParts.length > 1 && titleParts[1].trim() !== "") {
                        contentBuffer[currentSection].push(titleParts.slice(1).join(':').trim());
                    }
                    break;
                }
            }

            if (matchedSection) continue;

            if (currentSection && line.trim() !== "") {
                contentBuffer[currentSection].push(line.trim());
            } else if (!currentSection && line.trim() !== "" && lineIndex > 2) { // Assume pre-section content is overview if not metadata
                if (!contentBuffer.overview) contentBuffer.overview = [];
                contentBuffer.overview.push(line.trim());
            }
            lineIndex++;
        }

        // --- Process collected content for each section ---

        // Overview
        if (contentBuffer.overview && contentBuffer.overview.length > 0) {
            data.overview = contentBuffer.overview.join('\n');
        } else {
            warnings.push("Overview section is missing or empty.");
            data.overview = "Overview not provided.";
        }

        // Key Achievements
        if (contentBuffer.key_achievements && contentBuffer.key_achievements.length > 0) {
            data.key_achievements = contentBuffer.key_achievements.map(ach => ach.replace(/^[-•*]\s*/, '').trim()).filter(ach => ach);
        } else {
             // Fallback: Try to find percentage stats or impressive numbers in overview if key achievements section is empty
            const overviewStats = data.overview.match(/(\d+% increase|\d{3,}(?:,\d{3})* impressions|\d+ hours\/week saved|\d{2,}% growth)/g);
            if (overviewStats && overviewStats.length > 0) {
                data.key_achievements = overviewStats;
                warnings.push("Key Achievements section was missing, but relevant stats were inferred from the overview.");
            } else {
                warnings.push("Key Achievements section is missing.");
            }
        }


        // Challenge
        if (contentBuffer.challenge && contentBuffer.challenge.length > 0) {
            const challengeText = contentBuffer.challenge.join('\n');
            const challengePoints = [];
            let challengeIntro = '';
            const challengeLines = challengeText.split('\n');
            let firstListItemFound = false;

            for(const cline of challengeLines) {
                const listItemMatch = cline.match(/^[-•*]\s*(.*?)(?:\s*:\s*(.*))?$/);
                if (listItemMatch) {
                    firstListItemFound = true;
                    challengePoints.push({
                        title: listItemMatch[1] ? listItemMatch[1].trim() : '',
                        description: listItemMatch[2] ? listItemMatch[2].trim() : (listItemMatch[1] && !listItemMatch[2] ? listItemMatch[1].trim() : '')
                    });
                } else if (!firstListItemFound && cline.trim()) {
                    challengeIntro += (challengeIntro ? '\n' : '') + cline.trim();
                } else if (firstListItemFound && cline.trim()) { // Content after list items, append to last item's description or as new point
                    if(challengePoints.length > 0) challengePoints[challengePoints.length-1].description += '\n' + cline.trim();
                    else challengePoints.push({ title: '', description: cline.trim()});
                }
            }
            data.challenge = { intro: challengeIntro.trim(), points: challengePoints };
            if (!challengeIntro && challengePoints.length === 0) {
                 data.challenge = { intro: challengeText, points: [] }; // Treat all as intro if no bullets
            }

        } else {
            warnings.push("The Challenge section is missing.");
            data.challenge = { intro: "Challenge not specified.", points: [] };
        }


        // Approach
        if (contentBuffer.approach && contentBuffer.approach.length > 0) {
            data.approach = parseApproach(contentBuffer.approach, warnings);
        } else {
            // Fuzzy search for approach-like content if section is missing
            const approachKeywords = ['strategy', 'solution', 'execution', 'methodology', 'how we did it', 'our process'];
            let foundFuzzyApproach = false;
            for (const line of lines) {
                if (approachKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
                    // Try to grab a few lines around this keyword as a fallback
                    const keywordIndex = lines.indexOf(line);
                    const fuzzyApproachLines = lines.slice(Math.max(0, keywordIndex -1), Math.min(lines.length, keywordIndex + 4));
                    data.approach = parseApproach(fuzzyApproachLines, warnings);
                    warnings.push("Approach section was missing or not clearly identified; content was inferred based on keywords.");
                    foundFuzzyApproach = true;
                    break;
                }
            }
            if (!foundFuzzyApproach) {
                warnings.push("Approach section is missing.");
                data.approach = [{ title: "Approach not specified.", items: [] }];
            }
        }

        // Highlights
        if (contentBuffer.highlights && contentBuffer.highlights.length > 0) {
            data.highlights = parseHighlights(contentBuffer.highlights, warnings);
        } else {
            warnings.push("Campaign Highlights section is missing.");
            data.highlights = [{ metric: "Highlights", result: "Not specified" }];
        }

        // Timeline
        if (contentBuffer.timeline && contentBuffer.timeline.length > 0) {
            data.timeline = parseTimeline(contentBuffer.timeline, warnings);
        } else {
            // Fuzzy search for timeline
            const timelineKeywords = ['week ', 'month ', 'phase ', 'day ', 'schedule', 'deliverable'];
            let foundFuzzyTimeline = false;
            const fuzzyTimelineLines = [];
            for(const line of lines) {
                if(timelineKeywords.some(kw => line.toLowerCase().startsWith(kw) || line.toLowerCase().includes(kw+':'))) {
                    fuzzyTimelineLines.push(line);
                    foundFuzzyTimeline = true;
                }
            }
            if(foundFuzzyTimeline){
                data.timeline = parseTimeline(fuzzyTimelineLines, warnings);
                 warnings.push("Timeline & Deliverables section was missing or not clearly identified; content was inferred based on keywords.");
            } else {
                warnings.push("Timeline & Deliverables section is missing.");
                data.timeline = [{ period: "Timeline", description: "Not specified" }];
            }
        }

        // Tools
        if (contentBuffer.tools && contentBuffer.tools.length > 0) {
            data.tools = parseTools(contentBuffer.tools, warnings);
        } else {
            warnings.push("Tools & Technologies section is missing.");
            data.tools = [{ category: "Tools", items: "Not specified" }];
        }

        // Testimonial
        if (contentBuffer.testimonial && contentBuffer.testimonial.length > 0) {
            data.testimonial = parseTestimonial(contentBuffer.testimonial.join('\n'), warnings);
        } else {
            // Fallback: search whole text for quote pattern if section missing
            const fullText = lines.join('\n');
            const quoteMatch = fullText.match(/"([^"]+)"\s*[-—–]\s*([^,]+)(?:,\s*(.+))?/);
            if (quoteMatch) {
                data.testimonial = {
                    quote: quoteMatch[1].trim(),
                    author: quoteMatch[2].trim(),
                    title: quoteMatch[3] ? quoteMatch[3].trim() : "",
                    company: "" // Company might be part of title here, or need more specific regex
                };
                warnings.push("Client Testimonial section was missing, but a testimonial was inferred from the text.");
            } else {
                warnings.push("Client Testimonial section is missing.");
                data.testimonial = { quote: "No testimonial available.", author: "", title: "", company:"" };
            }
        }

        // Fallback for service/industry if not found explicitly
        if (!data.service && data.industry) {
            // If industry has a separator, try to split
            const parts = data.industry.split(/\s*•\s*|\s*-\s*|\s*\/\s*/);
            if (parts.length > 1) {
                data.service = parts[0].trim();
                data.industry = parts.slice(1).join(' / ').trim();
                 warnings.push("Service was inferred from the Industry field.");
            }
        } else if (data.service && !data.industry) {
            // If service has a separator, try to split
             const parts = data.service.split(/\s*•\s*|\s*-\s*|\s*\/\s*/);
            if (parts.length > 1) {
                data.industry = parts.slice(1).join(' / ').trim();
                data.service = parts[0].trim();
                warnings.push("Industry was inferred from the Service field.");
            }
        }
        if (!data.service && !data.industry) {
            warnings.push("Service and Industry are both missing.");
        } else if (!data.service) {
            warnings.push("Service is missing.");
        } else if (!data.industry) {
            warnings.push("Industry is missing.");
        }


        // Final check for client name (e.g. if not prefixed with "Client:")
        if (!data.client_name && lines.length > 0 && lines[0].trim().length < 50 && !Object.values(sectionStarters).some(regex => regex.test(lines[0]))) { // Assume first line is client name if not too long and not a section header
            data.client_name = lines[0].trim();
             warnings.push("Client name was inferred from the first line of text.");
        }
        if (!data.client_name) {
            data.client_name = "Unknown Client";
            warnings.push("Client name could not be determined.");
        }


        data.warnings = warnings;
        console.log("Parsed data:", data);
        return data;
    }

    function parseApproach(approachLines, warnings) {
        const approachSections = [];
        let currentApproach = null;

        for (const line of approachLines) {
            const trimmedLine = line.replace(/^[-•*]\s*/, '');
            // Regex to check if the line is likely a title (e.g., ends with colon, or is all caps, or Title Case and short)
            // This is a heuristic. A more robust way might involve checking for bullet points following it.
            const isTitleLine = /:\s*$/.test(line) || (trimmedLine.length < 50 && trimmedLine === trimmedLine.toUpperCase()) || /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$/.test(trimmedLine);

            if (!line.startsWith('-') && !line.startsWith('•') && !line.startsWith('*') && isTitleLine && trimmedLine.length > 0) {
                if (currentApproach) {
                    approachSections.push(currentApproach);
                }
                currentApproach = { title: trimmedLine.replace(/:$/, '').trim(), items: [] };
            } else if (currentApproach && trimmedLine.length > 0) {
                const itemParts = trimmedLine.split(/:\s*(.*)/s); // Split on first colon
                if (itemParts.length > 1 && itemParts[0].trim().length < 60) { // Heuristic for label: value
                    currentApproach.items.push({ label: itemParts[0].trim(), value: itemParts[1].trim() });
                } else {
                    currentApproach.items.push({ value: trimmedLine });
                }
            } else if (!currentApproach && trimmedLine.length > 0) { // Content before any explicit title
                 currentApproach = { title: "Details", items: [{value: trimmedLine}] };
            }
        }
        if (currentApproach) {
            approachSections.push(currentApproach);
        }
        if(approachSections.length === 0 && approachLines.length > 0) { // If no titles detected, treat all lines as items under a generic title
            const items = approachLines.map(l => ({value: l.replace(/^[-•*]\s*/, '').trim()})).filter(item => item.value);
            if(items.length > 0) approachSections.push({title: "Our Process", items: items});
        }
        return approachSections;
    }

    function parseHighlights(highlightLines, warnings) {
        const highlights = [];
        // Skip header "Metric Result" if present
        const contentLines = highlightLines.filter(line => !/metric\s+result/i.test(line));

        for (const line of contentLines) {
            const parts = line.split(/\t|\s{2,}/); // Split by tab or multiple spaces
            if (parts.length >= 2) {
                highlights.push({ metric: parts[0].trim(), result: parts.slice(1).join(' ').trim() });
            } else {
                // Fallback: try to split by last word if it looks like a value (+108%, 66,000, 8 hours/week)
                const lastSpaceIndex = line.lastIndexOf(' ');
                if (lastSpaceIndex > 0) {
                    const potentialResult = line.substring(lastSpaceIndex + 1).trim();
                    const potentialMetric = line.substring(0, lastSpaceIndex).trim();
                    if (potentialResult && potentialMetric && /(\d|%|\+|\/)/.test(potentialResult)) { // Basic check if result looks like a value
                         highlights.push({ metric: potentialMetric, result: potentialResult });
                         continue;
                    }
                }
                 // Fallback for lines like "Some achievement text" without clear separator
                if(line.trim()) highlights.push({ metric: line.trim(), result: "Achieved" });
            }
        }
        if (highlights.length === 0 && contentLines.length > 0) {
            warnings.push("Could not parse highlights into metric/result pairs. Using raw lines.");
            return contentLines.map(line => ({metric: line, result: "Details in description"}));
        }
        if (highlights.length === 0) {
             highlights.push({ metric: "Results", result: "Achieved" }); // Default placeholder if completely empty
        }
        return highlights;
    }

    function parseTimeline(timelineLines, warnings) {
        const timeline = [];
        for (const line of timelineLines) {
            const cleanedLine = line.replace(/^[-•*]\s*/, '');
            const parts = cleanedLine.split(/:\s*(.*)/s); // Split on first colon
            if (parts.length > 1 && parts[0].trim().length < 50) { // Heuristic: "Week 1:", "Days 8-14:"
                timeline.push({ period: parts[0].trim(), description: parts[1].trim() });
            } else if (cleanedLine.trim()){
                timeline.push({ period: "", description: cleanedLine.trim() });
            }
        }
        return timeline;
    }

    function parseTools(toolLines, warnings) {
        const tools = [];
        for (const line of toolLines) {
            const cleanedLine = line.replace(/^[-•*]\s*/, '');
            const parts = cleanedLine.split(/:\s*(.*)/s); // Split on first colon
            if (parts.length > 1 && parts[0].trim().length < 50) { // Heuristic: "Category:"
                tools.push({ category: parts[0].trim(), items: parts[1].trim() });
            } else if (cleanedLine.trim()) {
                tools.push({ category: "General Tools", items: cleanedLine.trim() });
            }
        }
        return tools;
    }

    function parseTestimonial(testimonialText, warnings) {
        let quote = testimonialText;
        let author = "";
        let title = "";
        let company = "";

        // Try to find attribution line (e.g., "— Chloe B., Co-Founder, Luna Intimates")
        const attributionMatch = testimonialText.match(/\n\s*[-—–]\s*([^,\n]+)(?:,\s*([^,\n]+))?(?:,\s*([^,\n]+))?$/);

        if (attributionMatch) {
            quote = testimonialText.substring(0, attributionMatch.index).trim();
            author = attributionMatch[1] ? attributionMatch[1].trim() : "";

            // Handle title and company from the remaining parts
            // This logic assumes "Author, Title, Company" or "Author, Title/Company"
            const part2 = attributionMatch[2] ? attributionMatch[2].trim() : "";
            const part3 = attributionMatch[3] ? attributionMatch[3].trim() : "";

            if (part3) { // Author, Title, Company
                title = part2;
                company = part3;
            } else if (part2) { // Author, TitleOrCompany
                // Try to guess if part2 is a title or company based on common keywords
                const companyKeywords = ['founder', 'ceo', 'manager', 'director', 'president', 'llc', 'inc', 'ltd', 'group'];
                const titleKeywords = ['co-founder', 'owner', 'head of', 'lead'];

                let isLikelyCompanySecond = companyKeywords.some(kw => part2.toLowerCase().includes(kw));
                let isLikelyTitleSecond = titleKeywords.some(kw => part2.toLowerCase().includes(kw));

                if (isLikelyCompanySecond && !isLikelyTitleSecond) { // More likely company
                    company = part2;
                } else { // Default to title, or if both, it's ambiguous
                    title = part2;
                }
            }
        }

        // Remove wrapping quotes from the quote itself
        quote = quote.replace(/^["“]|["”]$/g, '').trim();

        if (!quote && !author) {
             warnings.push("Testimonial content seems empty or could not be parsed.");
            return { quote: "No testimonial available.", author: "", title: "", company:"" };
        }
        if (quote && !author) {
            warnings.push("Testimonial quote found, but author attribution might be missing or misformatted.");
        }

        return { quote, author, title, company };
    }


    // Placeholder for injectDataIntoTemplate - will be implemented next
    function injectDataIntoTemplate(template, data) {
        console.log("Injecting data into template (to be implemented). Client:", data.client_name);
        // This is where the detailed Elementor JSON traversal and replacement will happen.
        // For now, just return the template to allow testing the parsing part.

        // Function to recursively find and replace placeholders
        function traverseAndReplace(obj) {
            for (const key in obj) {
                if (typeof obj[key] === 'string') {
                    // Simple placeholder replacement for now, e.g. {{client_name}}
                    // This needs to be much more sophisticated for Elementor structure
                    if (obj[key].includes('{{client_name}}')) {
                        obj[key] = obj[key].replace(/{{client_name}}/g, data.client_name || "");
                    }
                    if (obj[key].includes('{{industry}}')) {
                        obj[key] = obj[key].replace(/{{industry}}/g, data.industry || "");
                    }
                    if (obj[key].includes('{{service}}')) {
                        obj[key] = obj[key].replace(/{{service}}/g, data.service || "");
                    }
                    if (obj[key].includes('{{website}}')) {
                        obj[key] = obj[key].replace(/{{website}}/g, data.website || "");
                    }
                    if (obj[key].includes('{{overview}}')) {
                         obj[key] = obj[key].replace(/{{overview}}/g, data.overview || "");
                    }
                    if (obj[key].includes('{{testimonial_quote}}')) {
                        obj[key] = obj[key].replace(/{{testimonial_quote}}/g, data.testimonial.quote || "No testimonial available.");
                    }
                     if (obj[key].includes('{{testimonial_author}}')) {
                        obj[key] = obj[key].replace(/{{testimonial_author}}/g, data.testimonial.author || "");
                    }
                    if (obj[key].includes('{{testimonial_title}}')) {
                        obj[key] = obj[key].replace(/{{testimonial_title}}/g, data.testimonial.title || "");
                    }
                     if (obj[key].includes('{{testimonial_company}}')) {
                        obj[key] = obj[key].replace(/{{testimonial_company}}/g, data.testimonial.company || "");
                    }
                    // Add more simple placeholders as needed for other direct fields
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    traverseAndReplace(obj[key]); // Recurse for nested objects/arrays
                }
            }
        }

        // Specific Elementor widget targeting based on provided JSON structure
        function updateElementorContent(elements) {
            if (!elements || !Array.isArray(elements)) return;

            elements.forEach(el => {
                if (el.elType === 'widget' && el.settings) {
                    // --- Client Name (Main Title) ---
                    if (el.widgetType === 'heading' && el.id === '4bf2d607') { // Main title heading
                        el.settings.title = data.client_name || "Client Name";
                    }

                    // --- Description Block (Website, Service, Industry) ---
                    if (el.widgetType === 'heading' && el.id === '7865a7a8') { // Description heading
                        let projectDetails = "Project Details<br><br>";
                        if (data.website) {
                            projectDetails += `Website: <a href="${escapeHtml(data.website)}" target="_blank">${escapeHtml(data.website)}</a><br><br>`;
                        }
                        let serviceIndustry = "";
                        if(data.service) serviceIndustry += escapeHtml(data.service);
                        if(data.service && data.industry) serviceIndustry += " &bull; "; // HTML entity for bullet
                        if(data.industry) serviceIndustry += escapeHtml(data.industry);

                        projectDetails += serviceIndustry || "Service & Industry Not Specified";
                        el.settings.title = projectDetails;
                    }

                    // --- Overview Text ---
                    if (el.widgetType === 'text-editor' && el.id === '412a6231') { // Overview text editor
                        el.settings.editor = `<p><strong>Overview</strong><br/>${escapeHtml(data.overview).replace(/\n/g, '<br/>')}</p>`;
                        // Add key achievements if available and not too many
                        if (data.key_achievements && data.key_achievements.length > 0 && data.key_achievements.length < 5) {
                            el.settings.editor += `<br/><p><strong>Key Achievements:</strong></p><ul>${data.key_achievements.map(ach => `<li>${escapeHtml(ach)}</li>`).join('')}</ul>`;
                        }
                    }

                    // --- Challenge Title ---
                    if (el.widgetType === 'heading' && el.id === '3972f1fa') {
                        el.settings.title = "The Challenge";
                    }
                    // --- Challenge Text ---
                    if (el.widgetType === 'text-editor' && el.id === '64b52713') { // Challenge text editor
                        let challengeHtml = "";
                        if (data.challenge.intro) {
                            challengeHtml += `<p>${escapeHtml(data.challenge.intro).replace(/\n/g, '<br/>')}</p>`;
                        }
                        if (data.challenge.points && data.challenge.points.length > 0) {
                            challengeHtml += "<ul>";
                            data.challenge.points.forEach(point => {
                                challengeHtml += `<li><p>`;
                                if (point.title) {
                                    challengeHtml += `<strong>${escapeHtml(point.title)}:</strong> `;
                                }
                                challengeHtml += `${escapeHtml(point.description).replace(/\n/g, '<br/>')}</p></li>`;
                            });
                            challengeHtml += "</ul>";
                        }
                        el.settings.editor = challengeHtml || "<p>Challenge details not provided.</p>";
                    }

                    // --- Approach Title ---
                    if (el.widgetType === 'heading' && el.id === '40f0e3aa') { // Approach heading
                        el.settings.title = data.client_name ? `${data.client_name}'s Approach` : "Our Approach";
                         // Try to use "Pixelbee's Approach" if that was the parsed section title
                        const approachSectionTitle = contentBuffer.approach && contentBuffer.approach.length > 0 && sectionStarters.approach.test(contentBuffer.approach[0]) ? contentBuffer.approach[0] : null;
                        if(approachSectionTitle && approachSectionTitle.toLowerCase().includes("pixelbee")) {
                            el.settings.title = "Pixelbee’s Approach";
                        } else if (data.client_name) {
                             el.settings.title = `${data.client_name}'s Approach`;
                        } else {
                            el.settings.title = "Our Approach";
                        }
                    }
                    // --- Approach Text ---
                    if (el.widgetType === 'text-editor' && el.id === '368fbd4d') { // Approach text editor
                        let approachHtml = "";
                        if (data.approach && data.approach.length > 0) {
                            approachHtml += "<ul>";
                            data.approach.forEach(section => {
                                approachHtml += `<li><p><strong>${escapeHtml(section.title)}</strong></p>`;
                                if (section.items && section.items.length > 0) {
                                    approachHtml += "<ul>";
                                    section.items.forEach(item => {
                                        approachHtml += `<li><p>`;
                                        if (item.label) {
                                            approachHtml += `<strong>${escapeHtml(item.label)}:</strong> `;
                                        }
                                        approachHtml += `${escapeHtml(item.value).replace(/\n/g, '<br/>')}</p></li>`;
                                    });
                                    approachHtml += "</ul>";
                                }
                                approachHtml += "</li>";
                            });
                            approachHtml += "</ul>";
                        }
                        el.settings.editor = approachHtml || "<p>Approach details not provided.</p>";
                    }

                    // --- Campaign Highlights Title ---
                    if (el.widgetType === 'heading' && el.id === '2c114fbf') {
                        el.settings.title = "Campaign Highlights";
                    }
                    // --- Campaign Highlights Table ---
                    if (el.widgetType === 'text-editor' && el.id === '7c3a4b70') { // Highlights text editor (table)
                        let highlightsHtml = "<table><thead><tr><th>Metric</th><th>Result</th></tr></thead><tbody>";
                        if (data.highlights && data.highlights.length > 0) {
                            data.highlights.forEach(h => {
                                highlightsHtml += `<tr><td>${escapeHtml(h.metric)}</td><td>${escapeHtml(h.result)}</td></tr>`;
                            });
                        } else {
                            highlightsHtml += `<tr><td>No highlights</td><td>N/A</td></tr>`;
                        }
                        highlightsHtml += "</tbody></table>";
                        el.settings.editor = highlightsHtml;
                    }

                    // --- Timeline Title ---
                    if (el.widgetType === 'heading' && el.id === '781efd11') {
                        el.settings.title = "Timeline & Deliverables";
                    }
                    // --- Timeline Text ---
                    if (el.widgetType === 'text-editor' && el.id === '3eb5d547') { // Timeline text editor
                        let timelineHtml = "<ul>";
                        if (data.timeline && data.timeline.length > 0) {
                            data.timeline.forEach(item => {
                                timelineHtml += `<li><p>`;
                                if (item.period) {
                                    timelineHtml += `<strong>${escapeHtml(item.period)}:</strong> `;
                                }
                                timelineHtml += `${escapeHtml(item.description).replace(/\n/g, '<br/>')}</p></li>`;
                            });
                        } else {
                            timelineHtml += "<li><p>Timeline not specified.</p></li>";
                        }
                        timelineHtml += "</ul>";
                        el.settings.editor = timelineHtml;
                    }

                    // --- Tools Title ---
                    if (el.widgetType === 'heading' && el.id === '70dff119') {
                        el.settings.title = "Tools & Technologies";
                    }
                    // --- Tools Text ---
                    if (el.widgetType === 'text-editor' && el.id === '27ff1e84') { // Tools text editor
                        let toolsHtml = "<ul>";
                        if (data.tools && data.tools.length > 0) {
                            data.tools.forEach(tool => {
                                toolsHtml += `<li><p>`;
                                if (tool.category && tool.category.toLowerCase() !== "general tools") { // Don't show "General Tools" if it was a fallback
                                    toolsHtml += `<strong>${escapeHtml(tool.category)}:</strong> `;
                                }
                                toolsHtml += `${escapeHtml(tool.items).replace(/\n/g, '<br/>')}</p></li>`;
                            });
                        } else {
                            toolsHtml += "<li><p>Tools not specified.</p></li>";
                        }
                        toolsHtml += "</ul>";
                        el.settings.editor = toolsHtml;
                    }

                    // --- Testimonial Title ---
                     if (el.widgetType === 'heading' && el.id === '15f4562c') {
                        el.settings.title = "Client Testimonial";
                    }
                    // --- Testimonial Widget ---
                    if (el.widgetType === 'testimonial' && el.id === '34ea2c16') {
                        el.settings.testimonial_content = data.testimonial.quote ? `“${escapeHtml(data.testimonial.quote)}”` : "No testimonial available.";
                        el.settings.testimonial_name = escapeHtml(data.testimonial.author) || "";
                        let jobTitle = escapeHtml(data.testimonial.title) || "";
                        if (data.testimonial.company) {
                            jobTitle += (jobTitle ? ", " : "") + escapeHtml(data.testimonial.company);
                        }
                        el.settings.testimonial_job = jobTitle;
                        // Note: testimonial_image is not handled by text parsing. It would remain from template or be cleared.
                        // For this task, we assume image is not part of the dynamic content from text.
                    }
                }

                // Recursively process child elements (for sections, columns, inner sections)
                if (el.elements) {
                    updateElementorContent(el.elements);
                }
            });
        }

        // Start traversal from the top-level 'content' array
        if (template.content) {
            updateElementorContent(template.content);
        } else {
            // Fallback to generic placeholder replacement if 'content' array is not found
            // This is less ideal for Elementor but provides some basic functionality.
            data.warnings.push("Warning: Elementor 'content' array not found in template. Performing basic placeholder replacement. Results may be incomplete.");
            traverseAndReplace(template);
        }

        return template;
    }

});

// Helper function (can be moved or made part of a class later if needed)
function normalizeSmartQuotes(text) {
    return text
        .replace(/[\u2018\u2019\u0060\u00B4]/g, "'") // smart single quotes, backticks, acute accents
        .replace(/[\u201C\u201D\u201E\u201F\u00AB\u00BB]/g, '"'); // smart double quotes, guillemets
}
console.log("script.js loaded");
