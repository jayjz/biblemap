#!/usr/bin/env node
/**
 * Acquire a museum file into a review-only staging directory.
 * Usage: node scripts/acquire-jonah-art.mjs <candidate-id> <museum-direct-image-url>
 * Does NOT approve or attach the asset to the reader.
 * Requires an explicit direct URL checked against the object's reuse rights.
 */
import { readFile, mkdir, writeFile, rename, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
const [id, url] = process.argv.slice(2);
if (!id || !url) { console.error("Usage: node scripts/acquire-jonah-art.mjs <candidate-id> <direct-https-image-url>"); process.exit(2); }
const catalog=JSON.parse(await readFile("docs/research/jonah-asset-candidates.json","utf8"));
const candidate=catalog.assets.find(a=>a.id===id);
if (!candidate) throw new Error("Unknown candidate ID");
const parsed=new URL(url);
if(parsed.protocol!=="https:") throw new Error("HTTPS direct-image URL required");
if(parsed.username || parsed.password) throw new Error("Credentials in URL forbidden");
const approvedHosts=["images.metmuseum.org","collectionapi.metmuseum.org","openaccess-api.clevelandart.org","clevelandart.org","www.clevelandart.org","api.nga.gov","www.nga.gov","iiif.micr.io","www.rijksmuseum.nl","iiif.rijksmuseum.nl"];
if(!approvedHosts.some(host=>parsed.hostname===host)) throw new Error("Image host not on review allowlist; verify source and update script explicitly");
const response=await fetch(url,{redirect:"follow",signal:AbortSignal.timeout(30000)});
if(!response.ok) throw new Error(`Download failed: HTTP ${response.status}`);
const final=new URL(response.url);
if(final.protocol!=="https:" || !approvedHosts.includes(final.hostname)) throw new Error("Unexpected redirect host: "+final.hostname);
const bytes=Buffer.from(await response.arrayBuffer());
if(bytes.length<1024 || bytes.length>30_000_000) throw new Error("Image size outside allowed bounds");
const jpeg=bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff;
const png=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
if(!jpeg&&!png) throw new Error("File is not a JPEG or PNG; review format before acceptance");
const ext=jpeg?"jpg":"png";
const hash=createHash("sha256").update(bytes).digest("hex");
const root=path.join("artifacts","jonah-image-review");
await mkdir(root,{recursive:true});
const target=path.join(root,id+"."+ext);
const tmp=target+".part";
try { await writeFile(tmp,bytes,{flag:"wx"}); await rename(tmp,target); }catch(e){await rm(tmp,{force:true});throw e;}
await writeFile(path.join(root,id+".receipt.json"),JSON.stringify({id,recordUrl:candidate.sourceRecordUrl,originalAssetUrl:response.url,sha256:hash,bytes:bytes.length,format:ext,downloadedAt:new Date().toISOString(),reviewStatus:"candidate-not-approved"},null,2)+"\n");
console.log(JSON.stringify({file:target,sha256:hash,bytes:bytes.length,receipt:path.join(root,id+".receipt.json"),status:"staged-not-approved"},null,2));
