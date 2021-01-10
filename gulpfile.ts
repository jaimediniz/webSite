const { bundler, dest, src, task, watch } = require('gulp');
const replace = require('gulp-replace');
const ts = require('gulp-typescript');
const environment = require('./src/api/environments/environment').environment;
const environmentProd = require('./src/api/environments/environment.prod')
  .environment;
const argv = require('yargs').argv;

const tsFunctions = ts.createProject('tsconfig.functions.json');

exports.default = () => {
  let stream = tsFunctions.src();
  let env;
  if (argv.production) {
    env = environmentProd;
  } else {
    env = environment;
  }
  Object.keys(environment).forEach((key, index) => {
    stream = stream.pipe(replace(`%${key}%`, (environment as any)[key]));
  });
  return stream.pipe(tsFunctions()).pipe(dest('./api'));
};
