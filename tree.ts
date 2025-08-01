
import { DisArray } from './disarray.js'
import { Iterable } from 'node'

const btclass = (function(){
	return class BinaryTree<T> extends Iterable<T> {
		constructor(){
			this.stats = {
				size: 0,
				removed: 0,
				duplicates: 0,

				total(){
					return this.size+this.removed+this.duplicates
				}
			}

			this.push = async function(item:T): void {
				return new Promise<void>(async resolve=>{
					if (typeof item === "object" && item instanceof Array) {
						let colo = this;
						setTimeout(async function(){
							let i; while (typeof (i = item.pop()) !== 'undefined') {
								await colo.push(i);
							}
							resolve()
						},1);
					} else {
						if (!this._top) {
							this._top = treenode(this, item, null, null, false);
						} else {
							this._top.add(item)
						}
						setTimeout(resolve,1)
					}
				})
			}

			this.remove = async function(item): void {
				return new Promise<void>(async resolve=>{
					if (typeof item === "object" && item instanceof Array) {
						let colo = this;
						setTimeout(async function(){
							let i; while (typeof (i = item.pop()) !== 'undefined') {
								await colo.remove(i);
							}
							resolve()
						},1);
					} else {
						if (!this._top) {
							this._top = treenode(this, item, null, null, true);
						} else {
							this._top.remove(item)
						}
						setTimeout(resolve,1)
					}
				})
			}

			this.next = function():T {
				if (!current){
					if (!this._top) return null;
					current = this._top;

					while (current.left !== null) {
						current = current.left
					}nm 
				}
				
				while (current.excluded && current.right !== null) {
					current = current.right;
				}
				
				let out = (!current.excluded) ? current.item : null;
				if (current.right) {
					current = current.right
				} else {
					current = null
				}

				return out;
			}

			this.random = function(shuffle=2):Array<T> {
				let n:T, output = new DisArray<T>();
				current = null;

				while ((n = next()) !== null) {
					output.displace(n);
				}

				output.disarrange(shuffle-1);
				return output;
			}
		}
	}

	function treenode(tree,item,left,right,excluded=false) {
		function factory(tree,exmode=false) {
			return function (item) {
				let current = tree._top;
				let added = false;
				let previous;

				while(!added) {

					if (item === current.item) {
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
						
					} else if (item < current.item) {
						if (current.left !== null && current.left !== previous) {
							previous = current
							current = current.left
						} else {
							let n = treenode(tree, item, current.left, current, exmode)
							if (current.left === previous) {
								previous.right = n;
							}
							current.left = n;
							if (!exmode) tree.stats.size++;
							added = true;
						}

					} else if (item > current.item) {
						if (current.right !== null && current.right !== previous) {
							previous = current
							current = current.right
						} else {
							let n = treenode(tree, item, current, current.right, exmode)
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
		
		return {
			item,
			right,
			left,
			excluded,
			add: factory(tree,false),
			remove: factory(tree, true)
		}
	}
})()