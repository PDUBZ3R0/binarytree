

import { DisArray } from './disarray.js'
import { mkdirSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { v4 } from 'uuid'

import factory from '@sqlite.org/sqlite-wasm'

const verbose = process.argv.includes("--verbose");

const DB = await (async ()=>{
	const noop = ()=>{};

	const print = verbose ? console.log : noop;
	const printErr = verbose ? console.error : noop;

	const sqlite3 = await factory({ print, printErr });
	return sqlite3.oo1.DB;
})()

export class ExclusionList {

	constructor(exclude) {
	
		let db = new DB()

		let stats = {
			size: 0,
			duplicates: 0,
			removed: 0,
			total(){
				return this.size+this.removed+this.duplicates
			}
		}
		
		db.exec("CREATE TABLE xclu (data TEXT, excluded INTEGER)")
		db.transaction(() => {
			for (const x of exclude) {
				db.exec({ sql: "INSERT INTO xclu (data, excluded) VALUES (?, ?)", bind: [ x, 1 ]});
			}
		});

		function exporter(sort){
			return function(close){
				return new Promise(resolve=>{
					let values = db.selectValues("SELECT DISTINCT(data) as data FROM xclu WHERE excluded = 0" + (sort ? " ORDER BY data":""))
					resolve(values);

					if (close !== false) {
						db.close();
					}
				})
			}
		}

		const API = {
			stats() {
				return stats
			},

			push(item) {
				if (typeof item === 'object'){
					if (item instanceof Array) {
						for (let i of item) {
							API.push(i);
						}
					} else {
						API.push(JSON.stringify(item));
					}
				} else {
					function excluded(){
						let excluded = db.selectValue("SELECT excluded FROM xclu WHERE data = ?", [ item ])
						if (verbose) console.log("push, excluded:", excluded);
						
						if (excluded === 0) {
							stats.duplicates++;
							return true;
						} else if (excluded === 1) {
							stats.removed++
							return true;
						} else {
							return false;
						}
					}
					function insert(){
						db.exec({ sql: "INSERT INTO xclu (data, excluded) VALUES ($data,0)", bind: [ item ] })
						if (verbose) console.log("push, (insert)");
						stats.size++
					}
					if (!excluded()){
						insert()
					}
				}
			},
			remove(item){
				if (typeof item === 'object' && item instanceof Array) {
					for (let i of item) {
						API.remove(i);
					}
				} else {
					function excluded(){
						let excluded = db.selectValue("SELECT excluded FROM xclu WHERE data = ?", [ item ])
						if (verbose) console.log("remove, excluded:", excluded);
						
						if (excluded === 0) {
							if (verbose) console.log("remove, (update)");
							db.exec({ sql: "UPDATE xclu SET excluded = 1 WHERE data = ? AND excluded = 0", bind: [ item ] })
							stats.removed++
							return true
						} else {
							return (excluded !== 1)
						}
					}
					function insert(){
						if (verbose) console.log("remove, (insert)");
						db.exec({ sql: "INSERT INTO xclu (data, excluded) VALUES ($data,1)", bind: [ item ] })
					}
					if (!excluded()){
						insert()
					}
				}
			},
			export: exporter(true),
			disarray: exporter(false)
		}
		Object.assign(this, API);
	}
}

ExclusionList.fromArray = function(exclude) {
	return new ExclusionList(exclude);
}