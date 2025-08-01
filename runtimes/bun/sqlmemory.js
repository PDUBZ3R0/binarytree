
export function datasource(){
	return new Promise(async resolve=>{
		const { default: Database } = await import("bun:sqlite");
		const db = new Database(":memory:");
		db.exec('pragma journal_mode = WAL');
		resolve(db);
	})
}

export function fromArray(db, exclude){
	const insert = db.prepare("INSERT INTO xclu (data, excluded) VALUES ($data, $excluded)");
	const tx = db.transaction(xclu => {
		for (const x of xclu) insert.run(x);
	});
}
