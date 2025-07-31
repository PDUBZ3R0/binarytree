
import Database from 'better-sqlite3';
import DisArray from './disarray.js';

const db = new Database();

export class ExclusionList {
	constructor() {

		let withdupes = 0;

		this.stats = {
			size: 0,
			duplicates: 0,
			removed: 0,
				total(){
					return this.size+this.removed+this.duplicates
				}
		}

		db.pragma('journal_mode = WAL');
		db.exec("CREATE TABLE xclu (data TEXT, excluded INTEGER)")

		this.push = item => {
			if (typeof item === 'object' && item instanceof Array) {
				db.table('inclustate', {
					columns: ['data', 'excluded'],
					rows: function* () {
						for (const data of item) {
							yield { data, excluded: 0 };
						}
					},
				});

				let stmt = db.prepare("INSERT INTO xclu SELECT data, excluded FROM inclustate WHERE data NOT IN (SELECT data FROM xclu WHERE excluded = 1)")
				let info = stmt.run()
				withdupes = info.changes
				stats.removed = item.length - stats.size
			} else {
				function excluded(){
					let stmt = db.prepare("SELECT excluded FROM xclu WHERE data = :data")
					let entry = stmt.all({ data: item })
					if (entry.length === 0) {
						return false;
					} else {
						if (entry.excluded === 1) stats.removed++
						else stats.duplicates++;
						return true;
					}
				}
				function insert(){
					let stmt = db.prepare("INSERT INTO xclu (data, excluded) VALUES (:data,0)")
					stmt.run({ data: item, })
					stats.size++
				}
				if (!excluded()){
					insert()
				}
			}
		};

		this.remove = item => {
			function excluded(){
				let stmt = db.prepare("UPDATE xclu SET excluded = 1 WHERE data = :data AND excluded = 0")
				const info = stmt.run({ data: item })
				stats.removed += info.changes
				return info.changes > 0
			}
			function insert(){
				let stmt = db.prepare("INSERT INTO xclu (data, excluded) VALUES (:data,1)")
				stmt.run({ data: item, })
			}
			if (!excluded()){
				insert()
			}
		};

		function exporter(sort){
			return function(){
				let stmt = db.prepare("SELECT DISTINCT(data) as data FROM xclu WHERE excluded = 0" + (sort ? " ORDER BY data":""))
				let rows = stmt.all()
				stats.size = rows.length;
				stats.duplicates = withdupes - stats.size
				let str = (sort ? [] : new DisArray());
				for (const r of rows) {
					str.push(r.data)
				}
				return str;
			}
		};

		this.export = exporter(true);

		this.disarray = exporter(false);
		
	}

}

ExclusionList.fromArray = exclude => {
	let tree = new ExclusionList();

	db.table('xclustate', {
		columns: ['data', 'excluded'],
		rows: function* () {
			for (const item of exclude) {
				yield { data:item, excluded: 1 };
			}
		},
	});

	db.exec("INSERT INTO xclu SELECT data, excluded FROM xclustate")

	return tree;
}