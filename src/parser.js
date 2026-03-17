const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

const parseInfrastructure = (args) => {
  const config = yargs(args)
    .option('config', {
      alias: 'c',
      demandOption: true,
      describe: 'Path to the Terraform configuration file',
      type: 'string',
    })
    .option('output', {
      alias: 'o',
      demandOption: true,
      describe: 'Directory to store generated files',
      type: 'string',
    })
    .option('template', {
      alias: 't',
      demandOption: true,
      describe: 'Path to the template directory',
      type: 'string',
    })
    .option('skip', {
      alias: 's',
      default: false,
      describe: 'Skip existing files',
      type: 'boolean',
    })
    .parse();

  const configPath = config.config;
  const outputPath = config.output;
  const templatePath = config.template;
  const skipExisting = config.skip;

  if (!fs.existsSync(configPath)) {
    throw new Error('Configuration file does not exist');
  }

  if (!fs.existsSync(templatePath)) {
    throw new Error('Template directory does not exist');
  }

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  const files = fs.readdirSync(configPath);
  files.forEach((file) => {
    const filePath = path.join(configPath, file);
    const stats = fs.lstatSync(filePath);

    if (!stats.isDirectory()) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const templateFile = path.join(templatePath, file);
      const templateContent = fs.readFileSync(templateFile, 'utf8');
      const renderedContent = templateContent.replace(/{{ (.*?) }}/g, (match, group) => fileContent.match(new RegExp(group))?.[0] ?? '');

      if (!fs.existsSync(path.join(outputPath, file)) || skipExisting) {
        fs.writeFileSync(path.join(outputPath, file), renderedContent);
      }
    }
  });
};

parseInfrastructure(process.argv.slice(2));