"use strict";

// Comment scanning
function javascriptComments(source) {
  const text = String(source);
  const comments = [];
  const stack = [{ mode: "code", depth: -1 }];
  let i = 0;
  let expression = true;
  const current = () => stack[stack.length - 1];
  while (i < text.length) {
    const state = current(), char = text[i], next = text[i + 1];
    if (state.mode === "quote" || state.mode === "template") {
      if (char === "\\") { i += 2; continue; }
      if (state.mode === "template" && char === "$" && next === "{") {
        stack.push({ mode: "code", depth: 0 }); expression = true; i += 2; continue;
      }
      if (char === state.quote) { stack.pop(); expression = false; }
      i++; continue;
    }
    if (state.mode === "regex") {
      if (char === "\\") { i += 2; continue; }
      if (char === "[") state.bracket = true;
      else if (char === "]") state.bracket = false;
      else if (char === "/" && !state.bracket) { stack.pop(); expression = false; }
      i++; continue;
    }
    if (char === "'" || char === '"' || char === "`") {
      stack.push({ mode: char === "`" ? "template" : "quote", quote: char });
      i++; continue;
    }
    if (char === "/" && (next === "/" || next === "*")) {
      const start = i;
      if (next === "/") {
        i = text.indexOf("\n", i + 2);
        if (i < 0) i = text.length;
      } else {
        const close = text.indexOf("*/", i + 2);
        i = close < 0 ? text.length : close + 2;
      }
      comments.push({ start, end: i, raw: text.slice(start, i) });
      continue;
    }
    if (char === "/") {
      if (expression) { stack.push({ mode: "regex", bracket: false }); i++; continue; }
      expression = true; i++; continue;
    }
    if (/\s/.test(char)) { i++; continue; }
    if (/[A-Za-z_$]/.test(char)) {
      const match = /^[A-Za-z_$][\w$]*/.exec(text.slice(i));
      const word = match[0];
      expression = /^(?:return|throw|case|delete|void|typeof|instanceof|new|in|of|yield|await)$/.test(word);
      i += word.length; continue;
    }
    if (/[0-9]/.test(char)) {
      const match = /^(?:0[xX][a-fA-F\d]+|[\d._eE]+)/.exec(text.slice(i));
      i += match ? match[0].length : 1; expression = false; continue;
    }
    if (char === "{" && state.depth >= 0) state.depth++;
    if (char === "}" && state.depth >= 0) {
      if (state.depth === 0) { stack.pop(); i++; expression = false; continue; }
      state.depth--;
    }
    expression = !/[)\]}]/.test(char);
    i++;
  }
  return comments;
}

// Python scanning
function pythonComments(source) {
  const text = String(source), comments = [];
  let quote = "", triple = false, i = 0;
  while (i < text.length) {
    const char = text[i];
    if (quote) {
      if (char === "\\") { i += 2; continue; }
      if (triple && text.slice(i, i + 3) === quote.repeat(3)) {
        i += 3; quote = ""; triple = false; continue;
      }
      if (!triple && char === quote) { quote = ""; i++; continue; }
      i++; continue;
    }
    if (char === "\"" || char === "'") {
      quote = char; triple = text.slice(i, i + 3) === char.repeat(3);
      i += triple ? 3 : 1; continue;
    }
    if (char === "#") {
      const start = i;
      i = text.indexOf("\n", i);
      if (i < 0) i = text.length;
      if (!(start === 0 && text[start + 1] === "!")) comments.push({ start, end: i, raw: text.slice(start, i) });
      continue;
    }
    i++;
  }
  return comments;
}

// Header validation
function validHeader(raw, before, after, kind) {
  if (before.trim() || after.trim()) return false;
  let content = raw;
  if (kind === "python") content = raw.slice(1);
  else if (raw.startsWith("//") || raw.startsWith("/*")) content = raw.slice(2, raw.startsWith("/*") ? -2 : undefined);
  else if (raw.startsWith("<!--")) content = raw.slice(4, -3);
  if (/\r|\n/.test(content)) return false;
  const words = content.trim().split(/\s+/);
  return words.length === 2 && words.every(word => /^[A-Za-z][A-Za-z0-9-]*$/.test(word));
}

// Source validation
function validate(source, extension, file = "source") {
  const text = String(source), comments = [];
  if (extension === ".js") comments.push(...javascriptComments(text).map(comment => ({ ...comment, kind: "js" })));
  if (extension === ".css") {
    for (const match of text.matchAll(/\/\*[\s\S]*?\*\//g)) comments.push({ start: match.index, end: match.index + match[0].length, raw: match[0], kind: "css" });
  }
  if (extension === ".html") {
    for (const match of text.matchAll(/<!--[\s\S]*?-->/g)) comments.push({ start: match.index, end: match.index + match[0].length, raw: match[0], kind: "html" });
    for (const match of text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
      const scriptStart = match.index + match[0].indexOf(match[1]);
      for (const comment of javascriptComments(match[1])) comments.push({ start: scriptStart + comment.start, end: scriptStart + comment.end, raw: comment.raw, kind: "js" });
    }
  }
  if (extension === ".py") comments.push(...pythonComments(text).map(comment => ({ ...comment, kind: "python" })));
  for (const comment of comments) {
    const first = text.lastIndexOf("\n", comment.start - 1) + 1;
    const lineEnd = text.indexOf("\n", comment.end);
    const before = text.slice(first, comment.start);
    const after = text.slice(comment.end, lineEnd < 0 ? text.length : lineEnd);
    if (!validHeader(comment.raw, before, after, comment.kind)) {
      const line = text.slice(0, comment.start).split("\n").length;
      throw new Error(`Comment policy failed for ${file}:${line}: only standalone two-word section headers are permitted`);
    }
  }
  return comments.length;
}

module.exports = { javascriptComments, pythonComments, validHeader, validate };
