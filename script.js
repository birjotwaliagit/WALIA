// Utility functions for parsing case study text and injecting data into the template
function parseRawInput(rawText) {
    rawText = rawText.replace(/\r\n/g, "\n");
    let lines = rawText.split(/\n/).map(l => l.trim()).filter(Boolean);
    if (!lines.length) throw new Error("Raw input is empty or invalid.");

    let result = {
        client_name: "",
        service: "",
        industry: "",
        website: "",
        sections: {
            overview: "",
            challenge: {},
            approach: [],
            highlights: [],
            timeline: [],
            tools: [],
            testimonial: {}
        }
    };

    // Extract client name from first line or line starting with "Client:"
    let firstLine = lines.shift();
    if (/^client\s*:/i.test(firstLine)) {
        result.client_name = firstLine.split(":")[1].trim();
    } else {
        result.client_name = firstLine.trim();
    }
    if (!result.client_name) throw new Error("Client name is required in the first line.");

    // Service/industry/website detection on early lines
    if (lines.length) {
        if (/^service\s*:/i.test(lines[0])) {
            result.service = lines.shift().split(":")[1].trim();
            if (lines[0] && /^industry\s*:/i.test(lines[0])) {
                result.industry = lines.shift().split(":")[1].trim();
            }
            if (lines[0] && /^website\s*:/i.test(lines[0])) {
                result.website = lines.shift().split(":")[1].trim();
            }
        } else if (/^industry\s*:/i.test(lines[0])) {
            result.industry = lines.shift().split(":")[1].trim();
            if (lines[0] && /^website\s*:/i.test(lines[0])) {
                result.website = lines.shift().split(":")[1].trim();
            }
        } else if (/^website\s*:/i.test(lines[0])) {
            result.website = lines.shift().split(":")[1].trim();
        } else {
            let second = lines.shift();
            let sep = ["•", "|", "–", "—", "-", "/"].find(s => second.includes(s));
            if (sep) {
                let parts = second.split(sep);
                result.service = parts[0].trim();
                result.industry = (parts[1] || "").trim();
            } else {
                result.service = second.trim();
            }
            if (lines[0] && /^website\s*:/i.test(lines[0])) {
                result.website = lines.shift().split(":")[1].trim();
            }
        }
    }

    if (!result.website) {
        let m = rawText.match(/(?:website|url)\s*:\s*([^\s]+)/i);
        if (m) result.website = m[1];
        else if ((m = rawText.match(/(https?:\/\/[^\s]+)/i))) result.website = m[1];
        else if ((m = rawText.match(/www\.[^\s]+/i))) result.website = m[0];
    }
    if (result.website && !/^https?:\/\//i.test(result.website)) result.website = "https://" + result.website;

    const sectionPatterns = {
        overview: ["overview", "introduction"],
        challenge: ["the challenge", "challenge"],
        approach: ["pixelbee's approach", "our approach", "approach", "solution", "strategy"],
        highlights: ["campaign highlights", "highlights", "results"],
        timeline: ["timeline", "deliverables"],
        tools: ["tools & technologies", "tools", "technologies"],
        testimonial: ["testimonial", "client testimonial", "review"]
    };

    let current = "";
    let bucket = [];
    for (let line of lines) {
        let lower = line.toLowerCase();
        let header = null;
        for (let [key, arr] of Object.entries(sectionPatterns)) {
            if (arr.some(p => lower.startsWith(p))) {
                header = key;
                break;
            }
        }
        if (header) {
            if (current) result.sections[current] = processSection(current, bucket);
            current = header;
            bucket = [];
        } else {
            if (!current) current = "overview";
            bucket.push(line);
        }
    }
    if (current) result.sections[current] = processSection(current, bucket);

    let hasContent = Object.values(result.sections).some(sec => {
        if (Array.isArray(sec)) return sec.length;
        if (typeof sec === "object") return Object.keys(sec).length && JSON.stringify(sec) !== "{}";
        return sec && sec.trim();
    });
    if (!hasContent) throw new Error("No content sections were found in the input.");

    return result;
}

function processSection(key, lines) {
    switch (key) {
        case "overview":
            return lines.join(" ");
        case "challenge":
            return parseChallenges(lines);
        case "approach":
            return parseApproach(lines);
        case "highlights":
            return parseHighlights(lines);
        case "timeline":
            return parseTimeline(lines);
        case "tools":
            return parseTools(lines);
        case "testimonial":
            return parseTestimonial(lines);
        default:
            return lines.join(" ");
    }
}

function parseChallenges(lines) {
    let out = { intro: "", points: [] };
    let intro = [];
    for (let line of lines) {
        let m;
        if (m = line.match(/^[-•*]?\s*([^:]+):\s*(.+)$/)) {
            out.points.push({ title: m[1].trim(), description: m[2].trim() });
        } else if (m = line.match(/^[-•*]\s*(.+)$/)) {
            out.points.push({ title: "", description: m[1].trim() });
        } else {
            intro.push(line);
        }
    }
    out.intro = intro.join(" ");
    return out;
}

function parseApproach(lines) {
    let sections = [];
    let title = null;
    let items = [];
    for (let line of lines) {
        if (!/^[-•*]/.test(line)) {
            if (title) sections.push({ title, items });
            title = line.replace(/:+$/, "").trim();
            items = [];
        } else {
            let item = line.replace(/^[-•*]\s*/, "");
            if (item.includes(":")) {
                let [label, ...rest] = item.split(":");
                items.push({ label: label.trim(), value: rest.join(":").trim() });
            } else if (item.trim()) items.push({ value: item.trim() });
        }
    }
    if (title) sections.push({ title, items });
    return sections;
}

function parseHighlights(lines) {
    let metrics = [];
    for (let line of lines) {
        line = line.replace(/^[-•*]\s*/, "");
        if (/metric/i.test(line) && /result/i.test(line)) continue;
        let m;
        if (m = line.match(/^([\d.+%,]+)\s+(.+)$/)) {
            metrics.push({ metric: m[2].trim(), result: m[1].trim() });
        } else if (m = line.match(/^(.+?)\s{2,}(.+)$/)) {
            metrics.push({ metric: m[1].trim(), result: m[2].trim() });
        } else if (line.includes("\t")) {
            let parts = line.split(/\t+/);
            if (parts.length >= 2) metrics.push({ metric: parts[0].trim(), result: parts[1].trim() });
        } else if (m = line.match(/^(.+?)\s+(\S+)$/)) {
            metrics.push({ metric: m[1].trim(), result: m[2].trim() });
        } else if (m = line.match(/^(.+?):\s*(.+)$/)) {
            metrics.push({ metric: m[1].trim(), result: m[2].trim() });
        }
    }
    if (!metrics.length) metrics.push({ metric: "Results", result: "Achieved" });
    return metrics;
}

function parseTimeline(lines) {
    let out = [];
    for (let line of lines) {
        line = line.replace(/^[-•*]\s*/, "");
        if (!line) continue;
        let m = line.match(/^([^:]+):\s*(.+)$/);
        if (m) out.push({ period: m[1].trim(), description: m[2].trim() });
        else out.push({ period: "", description: line.trim() });
    }
    return out;
}

function parseTools(lines) {
    let out = [];
    for (let line of lines) {
        line = line.replace(/^[-•*]\s*/, "");
        if (!line) continue;
        if (line.includes(":")) {
            let [cat, ...rest] = line.split(":");
            out.push({ category: cat.trim(), items: rest.join(":").trim() });
        } else out.push({ category: "Tools", items: line.trim() });
    }
    return out;
}

function parseTestimonial(lines) {
    let test = { quote: "", author: "", title: "", company: "" };
    let quoteLines = [];
    for (let line of lines) {
        let m = line.match(/^[-—–]?\s*([A-Za-z\s\.]+?),\s*(.+)$/);
        if (m) {
            test.author = m[1].trim();
            let rest = m[2].trim();
            let m2 = rest.match(/(.+?)\s+(?:at|@|\|)\s+(.+)/);
            if (m2) {
                test.title = m2[1].trim();
                test.company = m2[2].trim();
            } else if (rest.includes(",")) {
                let idx = rest.lastIndexOf(",");
                test.title = rest.substring(0, idx).trim();
                test.company = rest.substring(idx + 1).trim();
            } else test.title = rest;
        } else {
            quoteLines.push(line);
        }
    }
    let quote = quoteLines.join(" ").replace(/^['"“”]+|['"“”]+$/g, "").trim();
    test.quote = quote;
    return test;
}

function injectDataIntoTemplate(template, data) {
    // Resolve a dotted path from the parsed data object
    function getValue(path) {
        const parts = path.split('.');
        let val = data;
        for (let i = 0; i < parts.length; i++) {
            const p = parts[i];
            if (Array.isArray(val)) {
                const idx = parseInt(p, 10);
                if (isNaN(idx) || !(idx in val)) {
                    return '';
                }
                val = val[idx];
            } else if (val && typeof val === 'object' && p in val) {
                val = val[p];
            } else if (val === data && data.sections && p in data.sections) {
                // allow shorthand tokens that omit the "sections." prefix
                val = data.sections[p];
            } else {
                return '';
            }
        }

        if (val === undefined || val === null) return '';
        if (typeof val === 'object') return JSON.stringify(val);
        return val.toString();
    }

    function replacePlaceholders(str) {
        return str.replace(/\{\{\s*(.+?)\s*\}\}/g, (_, token) => getValue(token));
    }

    function traverse(obj) {
        if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                if (typeof obj[i] === 'string') obj[i] = replacePlaceholders(obj[i]);
                else traverse(obj[i]);
            }
        } else if (obj && typeof obj === 'object') {
            for (let key of Object.keys(obj)) {
                if (typeof obj[key] === 'string') obj[key] = replacePlaceholders(obj[key]);
                else traverse(obj[key]);
            }
        }
    }

    traverse(template);
    return template;
}

const sampleData = `Client: Example Client
Industry: Example Industry
Website: example.com

Overview
Short overview goes here.

The Challenge
First challenge point

Pixelbee's Approach
Approach step one

Campaign Highlights
Metric\tResult
Impressions\t10,000
Sales\t+50%

Timeline & Deliverables
Week 1: Kickoff

Tools & Technologies
Example Tool

Client Testimonial
"Great work!" — Jane Doe`;

document.getElementById("generateBtn").addEventListener("click", () => {
    const fileInput = document.getElementById("jsonFile");
    const rawArea = document.getElementById("rawInput");
    const output = document.getElementById("outputJson");
    const errorDiv = document.getElementById("error");
    const warningsDiv = document.getElementById("warnings");
    const downloadBtn = document.getElementById("downloadBtn");

    errorDiv.textContent = "";
    warningsDiv.textContent = "";
    output.value = "";
    downloadBtn.disabled = true;

    if (!fileInput.files || !fileInput.files.length) {
        errorDiv.textContent = "Please upload a base JSON template file.";
        return;
    }
    if (!rawArea.value.trim()) {
        errorDiv.textContent = "Please paste the raw case study text.";
        return;
    }

    const reader = new FileReader();
    reader.onerror = () => errorDiv.textContent = "Could not read the template file.";
    reader.onload = () => {
        try {
            const templateObj = JSON.parse(reader.result);
            const parsed = parseRawInput(rawArea.value);
            const resultObj = injectDataIntoTemplate(JSON.parse(JSON.stringify(templateObj)), parsed);
            const outStr = JSON.stringify(resultObj, null, 4);
            output.value = outStr;

            let slug = parsed.client_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
            if (!slug) slug = "output";
            const fileName = `elementor-${slug}.json`;
            downloadBtn.onclick = () => {
                const blob = new Blob([outStr], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = fileName;
                document.body.appendChild(a); a.click(); document.body.removeChild(a);
                URL.revokeObjectURL(url);
            };
            downloadBtn.disabled = false;

            const warns = [];
            if (!parsed.service) warns.push("Service not provided (using only industry if available).");
            if (!parsed.industry) warns.push("Industry not provided.");
            if (!parsed.sections.overview) warns.push("Overview section is missing or empty.");
            const ch = parsed.sections.challenge;
            if (ch && !(ch.intro || (ch.points && ch.points.length))) warns.push("Challenge section is missing.");
            if (parsed.sections.approach && !parsed.sections.approach.length) warns.push("Approach section is missing.");
            if (parsed.sections.highlights && parsed.sections.highlights.length === 1 && parsed.sections.highlights[0].metric === "Results") warns.push("Highlights section not provided; inserted a placeholder result.");
            if (parsed.sections.timeline && !parsed.sections.timeline.length) warns.push("Timeline section is missing.");
            if (parsed.sections.tools && !parsed.sections.tools.length) warns.push("Tools section is missing.");
            const t = parsed.sections.testimonial;
            if (t && !(t.quote || t.author || t.title || t.company)) warns.push("Testimonial section is missing.");
            else if (t.quote && !t.author) warns.push("Testimonial author name is missing.");
            if (warns.length) {
                const ul = document.createElement("ul");
                warns.forEach(w => { const li = document.createElement("li"); li.textContent = w; ul.appendChild(li); });
                warningsDiv.textContent = "Warnings:"; warningsDiv.appendChild(ul);
            }
        } catch (e) {
            console.error(e);
            errorDiv.textContent = "Error: " + e.message;
        }
    };
reader.readAsText(fileInput.files[0]);
});

document.getElementById("exampleBtn").addEventListener("click", () => {
    document.getElementById("rawInput").value = sampleData;
});

document.getElementById("themeBtn").addEventListener("click", () => {
    const body = document.body;
    if (body.getAttribute("data-theme") === "dark") body.removeAttribute("data-theme");
    else body.setAttribute("data-theme", "dark");
});
