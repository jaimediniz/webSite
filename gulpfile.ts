const { bundler, dest, src, task, watch } = require('gulp'),
  replace = require('gulp-replace'),
  ts = require('gulp-typescript'),
  environment = require('./src/api/environments/environment').environment,
  environmentProd = require('./src/api/environments/environment.prod')
    .environment,
  argv = require('yargs').argv;

const tsFunctions = ts.createProject('tsconfig.functions.json');

exports.default = () => {
  let stream = tsFunctions.src();
  let env;
  if (argv.production) {
    env = environmentProd;
  } else {
    env = environment;
  }
  Object.keys(environment).forEach(function (key, index) {
    stream = stream.pipe(replace(`%${key}%`, (environment as any)[key]));
  });
  return stream.pipe(tsFunctions()).pipe(dest('./api'));
};
