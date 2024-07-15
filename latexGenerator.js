const fs = require("fs");
const yaml = require("js-yaml");
const { exec } = require("child_process");

function loadYaml(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    return yaml.load(fileContents);
  } catch (e) {
    console.error(e);
  }
}

function generateLatex(data) {
  return `
  \\documentclass[a4paper,10pt]{article}
  \\usepackage[utf8]{inputenc}
  \\usepackage{geometry}
  \\geometry{left=1cm, right=1cm, top=1cm, bottom=1cm}
  \\usepackage{xcolor}
  \\usepackage{hyperref}
  \\usepackage{enumitem}
  \\usepackage{fancyhdr}
  \\usepackage{titlesec}
  \\usepackage{multicol}
  
  % Define color for name
  \\definecolor{mycolor}{HTML}{D9534F}
  
  % Define sections formatting
  \\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]
  \\titlespacing*{\\section}{0pt}{1ex}{1ex}
  
  % Configure header
  \\pagestyle{fancy}
  \\fancyhf{}
  \\fancyhead[C]{
      \\begin{tabular}{c}
          {\\Huge \\textbf{\\textcolor{mycolor}{${data.name}}}} \\\\
          \\href{mailto:${data.contact.email}}{${data.contact.email}} | ${
    data.contact.phone
  } | \\href{${data.contact.linkedin}}{${data.contact.linkedin}} | \\href{${
    data.contact.github
  }}{${data.contact.github}}
      \\end{tabular}
  }
  
  \\begin{document}
  
  \\section*{SUMMARY}
  ${data.summary}
  
  \\vspace{5mm}
  
  \\section*{EDUCATION}
  \\begin{itemize}[leftmargin=0.5cm]
      ${data.education
        .map(
          (edu) => `
      \\item \\textbf{${edu.institution}}, ${edu.location} \\\\
      \\textit{${edu.degree}}, GPA: ${edu.gpa} \\\\
      Coursework: ${edu.coursework.join(", ")} \\\\
      \\textit{${edu.year}}
      `
        )
        .join("")}
  \\end{itemize}
  
  \\vspace{5mm}
  
  \\section*{SKILLS}
  \\begin{multicols}{2}
  \\begin{itemize}[leftmargin=0.5cm]
      ${data.skills
        .map(
          (skill) => `
      \\item ${skill}
      `
        )
        .join("")}
  \\end{itemize}
  \\end{multicols}
  
  \\vspace{5mm}
  
  \\section*{EXPERIENCE}
  \\begin{itemize}[leftmargin=0.5cm]
      ${data.experience
        .map(
          (exp) => `
      \\item \\textbf{${exp.company}}, ${exp.title}, ${exp.location} \\\\
      ${exp.dates} \\\\
      \\textit{${exp.description}}
      `
        )
        .join("")}
  \\end{itemize}
  
  \\vspace{5mm}
  
  \\section*{PROJECTS}
  \\begin{itemize}[leftmargin=0.5cm]
      ${data.projects
        .map(
          (project) => `
      \\item \\textbf{${project.title}} \\\\
      \\textit{${project.description}}
      `
        )
        .join("")}
  \\end{itemize}
  
  \\vspace{5mm}
  
  \\section*{ACHIEVEMENTS}
  \\begin{itemize}[leftmargin=0.5cm]
      ${data.achievements
        .map(
          (achievement) => `
      \\item ${achievement}
      `
        )
        .join("")}
  \\end{itemize}
  
  \\end{document}
    `;
}

function latexGenerator(yamlPath, texOutputPath) {
  const data = loadYaml(yamlPath);
  const latexCode = generateLatex(data);
  fs.writeFileSync(texOutputPath, latexCode);
}

function compileLatexToPdf(texFilePath, pdfOutputPath, callback) {
  const command = `pdflatex -output-directory ${pdfOutputPath} ${texFilePath}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error compiling LaTeX: ${stderr}`);
      callback(error);
      return;
    }
    console.log(stdout);
    callback(null);
  });
}

module.exports = { latexGenerator, compileLatexToPdf };
