const axios = require('axios');
const {exec} = require('child_process');
const fs = require('fs');


class LicenseMaker {
  generate() {
    // generate licenses file using yarn
    exec('rm -f scripts/temp.json');
    exec('yarn licenses list --json >> scripts/temp.json');

    const rawdata = fs.readFileSync('scripts/temp.json').toString();

    let jsonData = '';

    rawdata.split(/\r?\n/).forEach((line) => {
      if (line.startsWith('{"type":"table"')) {
        jsonData = line;
      }
    });

    const all_licenseJson = JSON.parse(jsonData);

    const packageJsonStr = fs.readFileSync('package.json').toString();

    const packageJson = JSON.parse(packageJsonStr);

    const allDependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };


    const result = [];

    for (const lib in allDependencies) {
      for (const license in all_licenseJson.data.body) {
        if (lib == all_licenseJson.data.body[license][0]) {
          result.push(all_licenseJson.data.body[license]);
        }
      }
    }

    fs.writeFile('scripts/output.json', JSON.stringify(result),
        (err)=> {
          console.log(err);
        });
  }
}


const licenseMaker = new LicenseMaker();
process.chdir('..');
licenseMaker.generate();
