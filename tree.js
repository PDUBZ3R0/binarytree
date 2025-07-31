
import { DisArray } from './disarray.js'

function factory(tree,exmode=false) {
	return function (obj) {
		let current = tree._top;
		let added = false;
		let previous;

		while(!added) {

			if (obj === current.obj) {
				if (exmode) {
					if (!current.excluded) {
						current.excluded = true;
						tree.stats.size--;
					}
				} else {
					if (!current.excluded) tree.stats.duplicates++;
					else tree.stats.removed++;
				}
				
				added = true;
				
			} else if (obj < current.obj) {
				if (current.left !== null && current.left !== previous) {
					previous = current
					current = current.left
				} else {
					let n = node(tree, obj, current.left, current, exmode)
					if (current.left === previous) {
						previous.right = n;
					}
					current.left = n;
					if (!exmode) tree.stats.size++;
					added = true;
				}

			} else if (obj > current.obj) {
				if (current.right !== null && current.right !== previous) {
					previous = current
					current = current.right
				} else {
					let n = node(tree, obj, current, current.right, exmode)
					if (current.right === previous) {
						previous.left = n;
					}
					current.right = n;
					if (!exmode) tree.stats.size++;
					added = true;
				}
			}
		}
	}
}

function node(tree,obj,left,right,excluded=false) {
	return {
		obj,
		right,
		left,
		excluded,
		add: factory(tree,false),
		remove: factory(tree, true)
	}
}

export class BinaryTree {
	constructor(){
		this.stats = {
			size: 0,
			removed: 0,
			duplicates: 0,
			total(){
				return this.size+this.removed+this.duplicates
			}
		}

		this.push = async function(obj) {
			if (typeof obj === "object" && obj instanceof Array) {
				return new Promise(async resolve=>{
					let colo = this;
					setTimeout(async function(){
						for (let item of obj) {
							await colo.push(item);
						}
						resolve()
					},10);
				})
			} else {
				return new Promise(async resolve=>{
					if (!this._top) {
						this._top = node(this, obj, null, null, false)
					} else {
						this._top.add(obj)
					}
					setTimeout(resolve,1)
				})
			}
		}

		this.remove = async function(obj) {
			if (typeof obj === "object" && obj instanceof Array) {
				return new Promise(async resolve=>{
					let colo = this;
					setTimeout(async function(){
						for (let item of obj) {
							await colo.remove(item);
						}
						resolve()
					},10);
				})
			} else {
				return new Promise(async resolve=>{
					if (!this._top) {
						this._top = node(this, obj, null, null, true)
					} else {
						this._top.remove(obj)
					}
					setTimeout(resolve,1)
				})
			}
		}

		this.export = function(){
			let output = [];
			if (this._top) {
				let current = this._top;
				if (!current.excluded) output.push(this._top.obj)
				while (current.left !== null) {
					current = current.left
					if (!current.excluded) output = [current.obj, ...output]
				}
				current = this._top;
				while (current.right !== null) {
					current = current.right
					if (!current.excluded) output.push(current.obj)
				}
			}
			return (output);
		}

		this.disarray = function(){
			let output = new DisArray();
			if (this._top) {
				let current = this._top;
				if (!current.excluded) output.displace(this._top.obj)
				while (current.left !== null) {
					current = current.left
					if (!current.excluded) output.displace(current.obj)
				}
				current = this._top;
				while (current.right !== null) {
					current = current.right
					if (!current.excluded) output.displace(current.obj)
				}
			}
			return (output);
		}
	}
}