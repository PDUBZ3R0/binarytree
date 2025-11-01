

import { DisArray } from './disarray.js'
import { mkdirSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { v4 } from 'uuid'
import { md5 } from './md5.js'

const verbose = process.argv.includes("--verbose");

const init = await (async function(){
	if (process.versions.bun) {
		if (verbose) console.log ("Detected bun runtime, using: 'bun:sqlite'");
		const { Database } = await import("bun:sqlite");
		return function(...opts) {
			return new Database(...opts);
		}
	} else {
		if (verbose) console.log ("Detected node runtime, using: 'better-sqlite3'");
		const { default: Database } = await import("better-sqlite3");
		return Database;
	}
})()

export class ExclusionList {

	constructor(exclude) {
	
		let tmpdbdir = join(tmpdir(), "sqlmem");
		mkdirSync(tmpdbdir, { recursive: true });
		let tmpdb = join(tmpdbdir, v4()+".sqlite");
		let db = init(tmpdb);

		let stats = {
			size: 0,
			duplicates: 0,
			removed: 0,
			total(){
				return this.size+this.removed+this.duplicates
			}
		}

		if (process.versions.bun) {
			db.exec("PRAGMA journal_mode = WAL");
		} else {
			db.pragma(" journal_mode = WAL");
		}

		db.exec("CREATE TABLE xclu (data TEXT, md5 TEXT, excluded INTEGER)");

		for (const x of exclude) {
			let stmt = db.prepare("INSERT INTO xclu (data, md5, excluded) VALUES (?, ?, ?)")
			stmt.run( x, md5(x), 1 );
		}

		function exporter(sort){
			return function(close){
				return new Promise(resolve=>{
					let query = db.prepare("SELECT DISTINCT(data) as data FROM xclu WHERE excluded = 0 ORDER BY " + (sort ? "data":"md5"));
					let values = query.all();
					let output = [];
					for (let obj of values) {
						output.push(obj.data);
					}
					resolve(output);

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
						let query = db.prepare("SELECT excluded FROM xclu WHERE md5 = ?");
						let q = query.get( md5(item) );
						
						if (!q) {
							return false
						} else {
							if (q.excluded === 0) {
								stats.duplicates++;
							} else {
								stats.removed++
							}
							return true;
						}
					}
					function insert(){
						let stmt = db.prepare("INSERT INTO xclu (data, md5, excluded) VALUES (?,?,?)");
						stmt.run( item, md5(item), 0 );
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
						let query = db.prepare("SELECT excluded FROM xclu WHERE md5 = ?");
						let q = query.get( md5(item) );
						
						if (!q) {
							return false
						} else {
							if (q.excluded === 0) {
								let stmt = db.prepare("UPDATE xclu SET excluded = 1 WHERE excluded = 0 AND md5 = ?");
								stmt.run( md5(item) );
								stats.removed++
							}
							return true;
						}
					}
					function insert(){
						let stmt = db.prepare("INSERT INTO xclu (data, md5, excluded) VALUES (?,?,?)");
						stmt.run( item, md5(item), 1 );
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