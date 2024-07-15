const path = require("path");
const { latexGenerator, compileLatexToPdf } = require("./latexGenerator");

function main() {
  const yamlPath = "mithsRes.yaml";
  const texOutputPath = "MadhuLatex.tex";
  const pdfOutputPath = "./MadhuRes.pdf";

  latexGenerator(yamlPath, texOutputPath);
  console.log(`LaTeX resume generated at ${texOutputPath}`);

  compileLatexToPdf(texOutputPath, pdfOutputPath, (error) => {
    if (error) {
      console.error("Failed to compile LaTeX to PDF.");
      return;
    }
    console.log("PDF resume generated successfully.");
  });
}

main();
