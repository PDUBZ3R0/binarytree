import {BinaryTree} from "../tree.js"
import assert from 'node:assert'

(async ()=>{
	
	let tree = new BinaryTree();
	await tree.remove(["Jesus","Allah","Mohammed","God"]);
	await tree.push("John");
	await tree.push("Eve");
	await tree.push("Eve");
	await tree.push("Satan");
	await tree.push(["Mary","Joseph","Jesus","God"]);
	await tree.push("Paul");
	await tree.push("Mohammed");
	await tree.push("Allah");
	await tree.push("Adam");
	await tree.push(["Adam", "Eve", "Lucifer","Lilith","Satan"]);
	await tree.remove("Satan");
	await tree.remove("Joseph");
	await tree.push("Eve");

	console.log(tree.stats.total(), 16)
	assert (tree.stats.total() === 16)
	console.log(tree.stats.removed, 4)
	assert (tree.stats.removed === 4)
	console.log(tree.stats.duplicates, 5)
	assert (tree.stats.duplicates === 5)
	let data = tree.export();
	console.log(data);
	assert (data === [
	  'Adam',    'Eve',
	  'John',    'Lilith',
	  'Lucifer', 'Mary',
	  'Paul'
	]);
})()