
import { DisArray } from './disarray.js'


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
						if (current.left !== null && current.left !== previous) {
							previous = current
							current = current.left
						} else {
							let n = node(tree, obj, current.left, current, exmode)
							if (current.left === previous) {
								previous.right = n;
							}
							current.left = n;
							if (!exmode) stats.size++;
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
							if (!exmode) stats.size++;
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
							this._top = node(this, obj, null, null, false)
						} else {
							this._top.add(obj)
						}
						setTimeout(resolve,2);
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
							this._top = node(this, obj, null, null, true)
						} else {
							this._top.remove(obj)
						}
						setTimeout(resolve,2);
					}))
				})
			}
		}

		this.export = function(){
			return new Promise(resolve=>{
				Promise.all(tasks).then(()=>{
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