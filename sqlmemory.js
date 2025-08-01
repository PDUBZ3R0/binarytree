                        

import { DisArray } from './disarray.js';

const promise = (() => {
	const p = new Promise(resolve=>{
		let runtime = (typeof Bun !== "undefined") ? "bun" : "node";
		
		import(`./runtimes/${runtime}/sqlmemory.js`).then(async ({ fromArray, datasource })=>{
			datasource().then(db=>{
				resolve({ fromArray, db });
			})
		})
	})

	return function(){ return p };
})()


function wrapper(staticaccess) {

	return class {
		constructor() {
			let ready = new Promise(async resolve=>{
				const { db, fromArray } = await promise();

				if (staticaccess) staticaccess({ fromArray, db });

				db.exec("CREATE TABLE xclu (data TEXT, excluded INTEGER)")
				resolve(db);
			})
		
			let withdupes = 0;

			let stats = {
				size: 0,
				duplicates: 0,
				removed: 0,
				total(){
					return this.size+this.removed+this.duplicates
				}
			}

			let tasks = [ready];

			this.push = data => {
				if (typeof data === "object" && data instanceof Array) {
					for (const i of data) {
						this.push(i);
					}
					return
				}

				ready.then(db=>{
					Promise.all(tasks).then(()=>{
						tasks.push(new Promise(resolve=>{

							function excluded(){
								let stmt = db.prepare("SELECT excluded FROM xclu WHERE data = :data")
								let entry = stmt.all({ data })
								if (entry.length === 0) {
									return false;
								} else {
									if (entry.excluded === 1) stats.removed++
									else stats.duplicates++;
									return true;
								}
							}

							function insert(){
								let stmt = db.prepare("INSERT INTO xclu (data, excluded) VALUES (:data, 0)")
								stmt.run({ data })
								stats.size++
							}

							withdupes++;
							if (!excluded()){
								insert()
							}

							resolve();
						}))
					})
				})
			};

			this.remove = data => {
				if (typeof data === "object" && data instanceof Array) {
					for (const i of data) {
						this.push(i);
					}
					return
				}
				
				ready.then(db=>{
					Promise.all(tasks).then(()=>{
						tasks.push(new Promise(resolve=>{
							function excluded(){
								let stmt = db.prepare("UPDATE xclu SET excluded = 1 WHERE data = $data AND excluded = 0")
								const info = stmt.run({ data })
								stats.removed += info.changes
								return info.changes > 0
							}

							function insert(){
								let stmt = db.prepare("INSERT INTO xclu (data, excluded) VALUES (:data,1)")
								stmt.run({ data })
							}

							if (!excluded()){
								insert()
							}

							resolve();
						}))
					})
				})
			};

			function exporter(sort){
				return function(){
					return new Promise(resolve=>{
						ready.then(db=>{
							Promise.all(tasks).then(()=>{
								let stmt = db.prepare("SELECT DISTINCT(data) as data FROM xclu WHERE excluded = 0" + (sort ? " ORDER BY data":""))
								let rows = stmt.all()
								stats.size = rows.length;
								stats.duplicates = withdupes - stats.size
								let str = (sort ? [] : new DisArray());
								for (const r of rows) {
									str.push(r.data)
								}
								resolve(str);
							})
						})
					})
				}
			};

			this.export = exporter(true);
			this.disarray = exporter(false);


			this.stats = function(){
				return new Promise(resolve=>{
					Promise.all(tasks).then(()=>{
						resolve(stats);
					})
				})
			}
		}
	}
}

export const ExclusionList = wrapper();

ExclusionList.fromArray = exclude => {
	return new Promise(async resolve=>{
		const ArrayFilledExclusionList = wrapper(({ da, fromArray }) => {
			fromArray(db, exclude);
			resolve (tree);
		});
		const tree = new ArrayFilledExclusionList();
	})
}