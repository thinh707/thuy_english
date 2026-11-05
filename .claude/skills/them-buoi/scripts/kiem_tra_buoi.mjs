#!/usr/bin/env node
// Kiểm tra một file buổi học trước khi commit.
//   node .claude/skills/them-buoi/scripts/kiem_tra_buoi.mjs So_hoc_tieng_Anh/du-lieu/buoi-02.js
// Thoát mã 1 nếu có LỖI. CẢNH BÁO thì vẫn qua nhưng nên xem lại.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const file = process.argv[2];
if (!file) { console.error("Cách dùng: node kiem_tra_buoi.mjs So_hoc_tieng_Anh/du-lieu/buoi-NN.js"); process.exit(2); }
const dataDir = path.dirname(path.resolve(file));
const site = path.dirname(dataDir);
const errs = [], warns = [];
const E = m => errs.push(m), W = m => warns.push(m);

function load(f) {
  const g = {COURSE: []}; g.window = g;
  vm.runInNewContext(fs.readFileSync(f, "utf8"), g, {filename: f});
  return g.COURSE;
}

// Nạp mọi buổi để bắt trùng id buổi
const all = [];
for (const f of fs.readdirSync(dataDir).filter(f => /^buoi-\d+\.js$/.test(f)).sort()) {
  try { for (const s of load(path.join(dataDir, f))) all.push({f, s}); }
  catch (e) { if (path.join(dataDir, f) === path.resolve(file)) { console.error("LỖI cú pháp: " + e.message); process.exit(1); } }
}
const mine = all.filter(x => x.f === path.basename(file)).map(x => x.s);
if (mine.length !== 1) { console.error(`LỖI: file phải push đúng 1 buổi vào window.COURSE (đang có ${mine.length}).`); process.exit(1); }
const s = mine[0];
const nn = path.basename(file).match(/^buoi-(\d+)\.js$/)?.[1];
if (s.id !== "b" + nn) E(`id buổi phải là "b${nn}" (đang là "${s.id}")`);
if (s.no !== +nn) E(`no phải là ${+nn}`);
if (all.filter(x => x.s.id === s.id).length > 1) E(`id buổi "${s.id}" bị trùng với file khác`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(s.date || "")) E(`date phải dạng YYYY-MM-DD`);
for (const k of ["title", "summary", "homeworkNote"]) if (!s[k]) E(`thiếu ${k}`);

const exists = rel => fs.existsSync(path.join(site, rel));
const html = fs.readFileSync(path.join(site, "Mo_trang_hoc.html"), "utf8");
if (!html.includes(`<script src="du-lieu/${path.basename(file)}"></script>`)) E(`chưa thêm <script src="du-lieu/${path.basename(file)}"></script> vào Mo_trang_hoc.html`);

// Thẻ
const decks = new Map((s.decks || []).map(d => [d.id, 0]));
if (!decks.size) E("decks rỗng");
const cardIds = new Set();
for (const c of s.cards || []) {
  const at = `thẻ ${c.id}`;
  if (!c.id) { E("có thẻ thiếu id"); continue; }
  if (cardIds.has(c.id)) E(`${at}: trùng id`); cardIds.add(c.id);
  if (!decks.has(c.deck)) E(`${at}: deck "${c.deck}" không có trong decks`); else decks.set(c.deck, decks.get(c.deck) + 1);
  if (!c.front || !c.back) E(`${at}: thiếu front/back`);
  if (c.type === "vocab") { if (!c.ipa) W(`${at}: thiếu ipa`); if (!c.example) W(`${at}: thiếu example`); }
  else if (c.type === "ipa") { if (!c.w || !c.wi) E(`${at}: thẻ ipa cần w và wi`); }
  else if (c.type === "pick") { if (!Array.isArray(c.opts) || !(c.a >= 0 && c.a < c.opts.length)) E(`${at}: opts/a sai`); }
  else if (c.type !== "note") E(`${at}: type "${c.type}" không hợp lệ (vocab|note|ipa|pick)`);
}
for (const [d, n] of decks) if (!n) W(`bộ thẻ "${d}" chưa có thẻ nào`);

// Câu hỏi
function checkQs(qs, where, audio) {
  const ids = new Set();
  for (const q of qs) {
    const at = `${where} câu ${q.id}`;
    if (!q.id) { E(`${where}: có câu thiếu id`); continue; }
    if (ids.has(q.id)) E(`${at}: trùng id`); ids.add(q.id);
    if (!q.q) E(`${at}: thiếu nội dung câu hỏi (q)`);
    const kind = q.kind || "mc";
    if (kind === "mc") { if (!Array.isArray(q.opts) || q.opts.length < 2 || !Number.isInteger(q.a) || q.a < 0 || q.a >= q.opts.length) E(`${at}: opts/a sai`); }
    else if (kind === "gap") { if (!Array.isArray(q.a) || !q.a.length || q.a.some(x => typeof x !== "string")) E(`${at}: câu gap cần a là mảng chuỗi`); }
    else if (kind === "tf") { if (typeof q.a !== "boolean") E(`${at}: câu tf cần a là true/false`); }
    else E(`${at}: kind "${kind}" không hợp lệ`);
    const au = q.audio || audio;
    if (q.t != null && !au) E(`${at}: có t nhưng không có audio`);
    if (q.clip && (q.t == null || !q.audio)) E(`${at}: clip:true cần cả audio và t`);
    if (q.audio && !exists(q.audio)) E(`${at}: không thấy file ${q.audio}`);
    if (!q.ex) W(`${at}: thiếu giải thích (ex)`);
  }
  return qs.length;
}

let exQ = 0;
const exIds = new Set();
for (const ex of s.exercises || []) {
  const at = `bài ${ex.id}`;
  if (!ex.id || ex.id === "test") { E(`bài tập thiếu id hoặc dùng id "test"`); continue; }
  if (exIds.has(ex.id)) E(`${at}: trùng id`); exIds.add(ex.id);
  if (!ex.title) E(`${at}: thiếu title`);
  if (ex.type === "listening") {
    if (!ex.audio || !exists(ex.audio)) E(`${at}: không thấy file nghe ${ex.audio}`);
    if (!ex.gist) W(`${at}: nên có câu gist (ý chính)`);
    if (!Array.isArray(ex.transcript) || !ex.transcript.length) E(`${at}: thiếu transcript [[giây, "câu"], ...]`);
    exQ += checkQs([...(ex.gist ? [ex.gist] : []), ...(ex.qs || [])], at, ex.audio);
  } else if (ex.type === "quiz") { if (!ex.qs?.length) E(`${at}: quiz chưa có câu`); exQ += checkQs(ex.qs || [], at); }
  else if (ex.type === "shadowing") { if (!ex.sentences?.length) E(`${at}: thiếu sentences`); if (!ex.videos?.length) W(`${at}: chưa có link video`); }
  else if (ex.type === "speaking") { for (const k of ["prompt", "outline", "phrases", "checklist", "sample"]) if (!ex[k]) W(`${at}: thiếu ${k}`); }
  else E(`${at}: type "${ex.type}" không hợp lệ (listening|quiz|shadowing|speaking)`);
}
if (!s.exercises?.length) E("chưa có bài tập");

const tq = s.test?.qs || [];
checkQs(tq, "kiểm tra", null);
if (tq.length < 15 || tq.length > 20) W(`bài kiểm tra có ${tq.length} câu (chuẩn 15–20)`);
for (const q of tq) if (!q.tag) W(`kiểm tra câu ${q.id}: thiếu tag`);

const lt = (s.learn || []).map(b => b.type);
if (!lt.length) E("learn rỗng");
for (const t of lt) if (!["html", "ipa", "cards"].includes(t)) E(`khối learn type "${t}" không hợp lệ`);
if (lt.at(-1) !== "cards") W(`khối learn cuối nên là {type:"cards"}`);

const nCards = s.cards?.length || 0;
console.log(`Buổi ${s.no} · ${s.title}`);
console.log(`  Thẻ: ${nCards} (${[...decks].map(([d, n]) => `${d} ${n}`).join(", ")})`);
console.log(`  Bài tập: ${s.exercises?.length || 0} bài, ${exQ} câu chấm điểm · Kiểm tra: ${tq.length} câu · Ôn toàn bộ: ${nCards + exQ + tq.length} mục`);
for (const w of warns) console.log("  CẢNH BÁO: " + w);
for (const e of errs) console.log("  LỖI: " + e);
console.log(errs.length ? `\n${errs.length} lỗi, cần sửa.` : "\nOK");
process.exit(errs.length ? 1 : 0);
