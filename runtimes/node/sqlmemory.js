                                                                                                                                                                           
export function datasource(){
	return new Promise(async resolve=>{
		const { default: Database } = await import("better-sqlite3");
		const db = new Database();
		db.pragma('journal_mode = WAL');
		resolve(db);
	})
}

export function fromArray(db, exclude) {
	const rows = function* () {
		for (const data of exclude) {
			yield { data, excluded: 1 };
		}
	}
	db.table('xclustate', { columns: ['data', 'excluded'], rows }); 
	db.exec("INSERT INTO xclu SELECT data, excluded FROM xclustate");
}