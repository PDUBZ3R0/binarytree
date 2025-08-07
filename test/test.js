
import { ExclusionList } from "../sqlmemory.js"
import { BinaryTree } from "../tree.js"

import assert from 'node:assert'

async function test(tree, classname) {

		tree.remove(["Jesus","Allah","Mohammed","God"]);
		tree.push("John");
		tree.push("Eve");
		tree.push("Eve");
		tree.push("Satan");
		tree.push(["Mary","Joseph","Jesus","God"]);
		tree.push("Paul");
		tree.push("Mohammed");
		tree.push("Allah");
		tree.push("Adam");
		tree.push(["Adam", "Eve", "Lucifer","Lilith","Satan"]);
		tree.remove("Satan");
		tree.remove("Joseph");
		tree.push("Eve");

		console.log("Testing:", classname);

		const stats = await tree.stats();
		console.log(stats.total(), 11)
		//assert (stats.total() === 11)
		console.log(stats.removed, 4)
		//assert (stats.removed === 4)
		console.log(stats.duplicates, 5)
		//assert (stats.duplicates === 5)

		let data = await tree.export();
		console.log("Data:", data);
/*		assert (data === [
		  'Adam',    'Eve',
		  'John',    'Lilith',
		  'Lucifer', 'Mary',
		  'Paul'
		]);*/

}

//await test (new BinaryTree(), "BinaryTree");

//await test (new ExclusionList(), "ExclusionList");

await test (ExclusionList.fromArray([]));