
import { DisArray } from './disarray.js'

const verbose = process.argv.includes("--verbose");

export class BinaryTree {
	constructor(){
		let stats = {
			size: 0,
			removed: 0,
			duplicates: 0,

			total(){
				return this.size+this.removed+this.duplicates
			}
		}


		function factory(tree,exmode=false) {
			return function (obj) {
				let current = tree._top;
				let added = false;
				let previous;

				while(!added) {
					if (obj === current.obj) {
						if (verbose) console.log("match");
						if (exmode) {
							if (!current.excluded) {
								current.excluded = true;
								stats.size--;
								stats.removed++;
							}
						} else {
							if (!current.excluded) stats.duplicates++;
							else stats.removed++;
						}
						
						added = true;
						
					} else if (obj < current.obj) {
						if (current.left !== null) {
							previous = current
							current = current.left
						} else {
							if (verbose) console.log("left", obj);
							current.left = node(tree, obj, current, exmode);
							if (!exmode) stats.size++;
							added = true;
						}

					} else if (obj > current.obj) {
						if (current.right !== null) {
							previous = current
							current = current.right
						} else {
							if (verbose) console.log("right", obj);
							current.right = node(tree, obj, current, exmode);
							if (!exmode) stats.size++;
							added = true;
						}
					}
				}
			}
		}

		function node(tree,obj,parent,excluded=false) {
			return {
				obj,
				excluded,
				parent,
				left: null,
				right: null,
				add: factory(tree,false),
				remove: factory(tree, true)
			}
		}



		let tasks = [];

		this.push = async function(obj) {
			if (typeof obj === "object" && obj instanceof Array) {
				let colo = this;
				for (let item of obj) {
					await colo.push(item);
				}

			} else {
				Promise.all(tasks).then(()=>{
					tasks.push(new Promise(resolve=>{
						if (!this._top) {
							this._top = node(this, obj, null, false)
							if (verbose) console.log("_top", obj)
						} else {
							this._top.add(obj)
						}
						setTimeout(resolve,0);
					}))
				})
			}
		}

		this.remove = async function(obj) {
			if (typeof obj === "object" && obj instanceof Array) {
				let colo = this;
				for (let item of obj) {
					await colo.remove(item);
				}

			} else {
				Promise.all(tasks).then(()=>{
					tasks.push(new Promise(resolve=>{
						if (!this._top) {
							this._top = node(this, obj, null, true)
							if (verbose) console.log("_top", obj)
						} else {
							this._top.remove(obj)
						}
						setTimeout(resolve,0);
					}))
				})
			}
		}

		this.export = function(){
			return new Promise(resolve=>{
				Promise.all(tasks).then(()=>{
					console.log(this._top);
					let output = [];
					if (this._top) {
						function node(current) {
							let list = [];
							if (current.left) list = [ ...node(current.left)];
							if (!current.excluded) list.push(current.obj)
							if (current.right) list = [...list, ...node(current.right)];
							return list;
						}
/*						let current = this._top;
						if (!current.excluded) output.push(this._top.obj)
						while (current.left !== null) {
							current = current.left
							if (!current.excluded) output = [current.obj, ...output]
						}
						current = this._top;
						while (current.right !== null) {
							current = current.right
							if (!current.excluded) output.push(current.obj)
						}*/
						output = node(this._top);

					}
					resolve(output);
				})
			})
		}

		this.disarray = function(){
			return new Promise(resolve=>{
				Promise.all(tasks).then(()=>{
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
					resolve(output);
				})
			})
		}

		this.stats = function(){
			return new Promise(resolve=>{
				Promise.all(tasks).then(()=>{
					resolve(stats);
				})
			})
		}
	}
}