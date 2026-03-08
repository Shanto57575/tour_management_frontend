const fs = require("fs");
const path = require("path");

function refactorFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");

  // Add import if not present
  if (!content.includes("import { Container }")) {
    content = content.replace(
      /(import[\s\S]*?from ["']lucide-react["'];)/,
      '$1\nimport { Container } from "@/components/shared/Container";',
    );
  }

  // Replace <section className="..."> with <Container className="...">
  // For sections without ref
  content = content.replace(
    /<section\s+className="([^"]+px-4[^"]*)"\s*>/g,
    (match, classes) => {
      let newClasses = classes.replace(/\s*px-4\s*/g, " ").trim(); // Container handles px-4 natively
      return `<Container className="${newClasses}">`;
    },
  );

  // For sections with ref, we have to keep section or just change to Container and push ref into first div
  // Let's do a manual pass for the specific ones we know:
  // About.tsx:
  // <section\n        ref={heroRef}\n        className="relative min-h-[88vh] flex flex-col items-center justify-center px-4 py-24 overflow-hidden"\n      >
  const aboutHeroMatch = `<section\n        ref={heroRef}\n        className="relative min-h-[88vh] flex flex-col items-center justify-center px-4 py-24 overflow-hidden"\n      >`;
  if (content.includes(aboutHeroMatch)) {
    content = content.replace(
      aboutHeroMatch,
      `<Container className="relative min-h-[88vh] overflow-hidden">\n        <div ref={heroRef} className="flex flex-col items-center justify-center py-24 w-full h-full">`,
    );
    // Add a closing </div> before </Container> for hero
    content = content.replace(
      /<\/section>(\s*\{\/\*\s*── MISSION)/,
      "  </div>\n      </Container>$1",
    );
  }

  // <section className="relative py-24 px-4">
  const classRegex =
    /className="([^"]*(?:max-w-4xl|max-w-5xl|max-w-6xl|max-w-7xl) mx-auto[^"]*)"/g;
  content = content.replace(classRegex, (match, classes) => {
    let newClasses = classes.replace(/\bmax-w-[1-9]xl mx-auto\b/g, "").trim();
    return `className="${newClasses}"`;
  });

  content = content.replace(
    /<section className="([^"]+)"/g,
    (match, classes) => {
      let newClasses = classes
        .replace(/\s*px-4\s*/g, " ")
        .replace(/\s{2,}/g, " ")
        .trim();
      return `<Container className="${newClasses}"`;
    },
  );
  content = content.replace(/<\/section>/g, "</Container>");

  // Contact.tsx
  if (filePath.includes("Contact.tsx")) {
    content = content.replace(
      `<div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center px-4">`,
      `<Container className="bg-white dark:bg-zinc-950" innerClassName="min-h-screen flex flex-col items-center justify-center py-12">`,
    );
    content = content.replace(
      // The last closing div of Contact component
      /<\/div>\n    \);\n}\s*$/,
      `</Container>\n    );\n}\n`,
    );
  }

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Refactored: ${filePath}`);
}

const files = [
  "d:/ph_next_level/TreckOn/frontend/src/pages/About.tsx",
  "d:/ph_next_level/TreckOn/frontend/src/pages/Contact.tsx",
];

files.forEach(refactorFile);
