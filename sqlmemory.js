

import { DisArray } from './disarray.js'
import { mkdirSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { v4 } from 'uuid'
import { md5 } from './md5.js'

const verbose = process.argv.includes("--verbose");
const tmpfile = process.argv.includes("--tmp");

const init = await (async function(){
	if (process.versions.bun) {
		if (verbose) console.log ("Detected bun runtime, using: 'bun:sqlite'");
		const { Database } = await import("bun:sqlite");
		return function(...opts) {
			opts.push({ strict: true });
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
	
		let db = (function(){
			if (tmpfile) {
				let tmpdbdir = join(tmpdir(), "sqlmem");
				mkdirSync(tmpdbdir, { recursive: true });
				let tmpdb = join(tmpdbdir, v4()+".sqlite");
				return init(tmpdb);
			} else {
				return init(":memory:");
			}
		})()

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
			db.exec("PRAGMA synchronous = normal");
			db.exec("PRAGMA journal_size_limit = 6144000");
		} else {
			db.pragma("journal_mode = WAL");
			db.pragma("synchronous = normal");
			db.pragma("journal_size_limit = 6144000");
		}

		db.exec("CREATE TABLE xclu (data TEXT, md5 TEXT, excluded INTEGER)");

		const statements = {
			insert: db.prepare("INSERT INTO xclu (data, md5, excluded) VALUES ($data, $md5, $excluded)"),
			update: db.prepare("UPDATE xclu SET excluded = 1 WHERE excluded = 0 AND md5 = $md5"),
			query: db.prepare("SELECT excluded FROM xclu WHERE md5 = ?")
		}

		function transact(items) {
			
			let tx = db.transaction(xclu=>{
				for (const x of xclu) {
					if (x.update) {
						statements.update.run(x);
					} else {
						statements.insert.run(x);
					}
				}
			})
			tx(items);
		}

		let initial = [];
		for (let i of exclude) {
			initial.push({ data: i, md5: md5(i), excluded: 1 });
		}
		transact(initial);

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

		function pushover(item) {			
			let q = statements.query.get( md5(item) );
			
			if (!q) {
				stats.size++;
				return { data: item, md5: md5(item), excluded: 0 };
			} else {
				if (q.excluded === 0) {
					stats.duplicates++;
				} else {
					stats.removed++
				}
			}
		}

		function remover(item){
			let q = statements.query.get( md5(item) );
			
			if (!q) {
				return { data: item, md5: md5(item), excluded: 1 };

			} else if (q.excluded === 0) {	
				stats.removed++
				return { md5: md5(item), update: true };
			}
		}
		
		function enqueue(mode) {
			return function(item) {
				if (item instanceof Array) {
					let queue = [];
					for (let i of item) {
						let task = mode(i);
						if (task) {
							queue.push(task)
						}
					}
					if (queue.length > 0) {
						transact(queue);
					}
				} else {
					let task = mode((typeof item === 'object') ? JSON.stringify(item) : item);
					if (task) transact([task]);
				}
			}
		}

		Object.assign(this, {
			stats() {
				return stats
			},

			push: enqueue(pushover),
			remove: enqueue(remover),

			export: exporter(true),
			disarray: exporter(false),
		});
	}
}

ExclusionList.fromArray = function(exclude) {
	return new ExclusionList(exclude);
}