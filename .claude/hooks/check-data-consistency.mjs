#!/usr/bin/env node
// PostToolUse hook: validates character references in category data
import { CHARACTERS } from '../../src/data/characters.js';
import { CATEGORIES } from '../../src/data/categories.js';

const ids = Object.keys(CHARACTERS);
const keys = Object.keys(CATEGORIES);
const charRefs = new Set();

for (const k of keys) {
  for (const l of CATEGORIES[k].lines) {
    charRefs.add(l.character);
  }
}

const orphans = [...charRefs].filter(r => !ids.includes(r));
if (orphans.length) {
  console.log('WARNING: Category lines reference unknown characters: ' + orphans.join(', '));
} else {
  console.log('OK: All character references valid (' + charRefs.size + ' unique across ' + keys.length + ' categories)');
}
