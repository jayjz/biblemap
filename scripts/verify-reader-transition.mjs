// Sequential pre-push evidence. Does not commit, push, deploy or approve editorial material.
import { spawn } from 'node:child_process';
import { createWriteStream, readFileSync, writeFileSync, existsSync, mkdirSync, renameSync, copyFileSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { tmpdir } from 'node:os';
const directory='artifacts/immersive-reader';
if (existsSync(`${directory}/verification-results.json`) && !existsSync(`${directory}/verification-previous.json`)) copyFileSync(`${directory}/verification-results.json`,`${directory}/verification-previous.json`);
if (existsSync(`${directory}/verification-results.json`)) {
  const prior=JSON.parse(readFileSync(`${directory}/verification-results.json`,'utf8'));
  const stamp=prior.results[0].startedAt.replace(/[^0-9]/g,'');
  copyFileSync(`${directory}/verification-results.json`,`${directory}/verification-attempt-${stamp}.json`);
}
const results=[];
const archive=join(tmpdir(),'biblemap-reader-reports',String(Date.now()));
function archiveReports() {
  for (const name of ['playwright-report-nineveh','test-results-nineveh']) {
    const source=resolve(name);
    if (relative(process.cwd(),source).startsWith('..')) throw new Error('Report source outside checkout');
    if (existsSync(source)) { mkdirSync(archive,{recursive:true}); renameSync(source,join(archive,name)); }
  }
}
archiveReports();
let server;
const port=process.env.PLAYWRIGHT_PORT??'4203';
const defaults={ CHROME_PATH:process.env.CHROME_PATH??'C:/Program Files/Google/Chrome/Application/chrome.exe', PLAYWRIGHT_PORT:port, EXPERIMENT_PORT:port, NEXT_TELEMETRY_DISABLED:'1', BIBLEMAP_READER_TRANSITION_REVIEW:'', BIBLEMAP_NINEVEH_REVIEW:'', PLAYWRIGHT_REVIEW_SERVER:'' };
async function run(id,command,args=[],extra={}) {
  const log=createWriteStream(`${directory}/${id}.log`);
  const startedAt=new Date().toISOString(); let output='';
  console.log(`Starting ${id}: ${command} ${args.join(' ')}`);
  const exitCode=await new Promise((resolveRun,reject)=>{
    const child=process.platform==='win32' && command==='npm'
      ? spawn(process.env.ComSpec??'cmd.exe',['/d','/s','/c',`npm.cmd ${args.join(' ')}`],{env:{...process.env,...defaults,...extra}})
      : spawn(command,args,{env:{...process.env,...defaults,...extra}});
    for (const stream of [child.stdout,child.stderr]) stream.on('data',data=>{log.write(data);output+=data.toString();});
    child.on('error',reject); child.on('close',resolveRun);
  });
  log.end();
  results.push({id,command:`${command==='npm'&&process.platform==='win32'?'npm.cmd':command} ${args.join(' ')}`.trim(),env:extra,startedAt,completedAt:new Date().toISOString(),exitCode,summary:output.split(/\r?\n/).filter(line=>/passed|failed|skipped|^ℹ|warning|vulnerabilit|^✖|^✓|^Four-beat/.test(line))});
  writeFileSync(`${directory}/verification-results.json`,JSON.stringify({runtime:process.version,platform:process.platform,defaults,reportArchive:archive,results},null,2)+'\n');
  console.log(`Finished ${id}: ${exitCode}`);
  if(exitCode!==0) throw new Error(`${id} failed; inspect ${directory}/${id}.log. No push authorized by this runner.`);
}
async function startServer(extra={}) {
  server=spawn(process.execPath,['scripts/review-irreplaceable.mjs'],{env:{...process.env,...defaults,...extra},stdio:['ignore','pipe','pipe']});
  const log=createWriteStream(`${directory}/server.log`,{flags:'a'});
  server.stdout.pipe(log,{end:false}); server.stderr.pipe(log,{end:false});
  for(let attempt=0;attempt<80;attempt++) {
    if(server.exitCode!==null) throw new Error('Review server exited');
    try { const response=await fetch(`http://127.0.0.1:${port}/jonah/`); if(response.ok) return; } catch(error) { if(!(error instanceof TypeError)) throw error; }
    await new Promise(resolveWait=>setTimeout(resolveWait,250));
  }
  throw new Error('Local server did not become ready');
}
async function stopServer(){if(server){server.kill();await new Promise(resolveStop=>server.once('exit',resolveStop));server=undefined;}}
try {
  await run('dependencies','npm',['ci']);
  await run('lockfile','git',['diff','--exit-code','--','package-lock.json']);
  await run('story','npm',['run','validate:story']);
  await run('media','npm',['run','validate:media']);
  await run('unit','npm',['test']);
  await run('lint','npm',['run','lint']);
  await run('types','npm',['run','typecheck']);
  await run('ordinary-build','npm',['run','build']);
  await run('ordinary-export','node',['scripts/validate-nineveh-depth.mjs','--production-export']);
  await run('prototype-export-gate','node',['scripts/validate-reader-transition.mjs']);
  await startServer();
  await run('normal-browsers','npm',['run','test:e2e']);
  await stopServer();
  await run('review-build','npm',['run','build'],{BIBLEMAP_NINEVEH_REVIEW:'1',BIBLEMAP_READER_TRANSITION_REVIEW:'1'});
  // Exact documented CI fixture, never used as visual evidence for this prototype.
  copyFileSync('artifacts/nineveh-depth/media/flood-tablet.webp','artifacts/nineveh-review/landscape.webp');
  await startServer({BIBLEMAP_READER_TRANSITION_REVIEW:'1'});
  await run('review-browsers','npm',['run','test:e2e'],{PLAYWRIGHT_REVIEW_SERVER:'1'});
  await run('reader-browsers','node',['node_modules/@playwright/test/cli.js','test','-c','playwright.reader.config.ts']);
  await run('final-captures','node',['scripts/capture-immersive-reader.mjs','after']);
  await run('whitespace','git',['diff','--check']);
} finally { await stopServer(); }
