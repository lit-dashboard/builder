#!/usr/bin/env node
const download = require('download-git-repo');

const [
  ,, 
  ...[path = './']
] = process.argv;


download('lit-dashboard/template', path, function (err) {
  console.log(err ? 'Error' : 'Success')
})
