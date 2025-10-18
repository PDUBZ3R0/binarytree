
export class DisArray extends Array {

    constructor() {
        super();

        const __sort__ = DisArray.prototype.sort;

        DisArray.fromArray = function (a){

            Object.assign(a, {
                displace(item) {
                    let pos = this.length < 2 ? 0 : Math.floor(Math.random() * this.length);

                    if (!this.includes(item)) {
                        this.splice(pos, 0, item);
                        return true;
                    }
                    return false;
                },

                disarrange(times=1) {
                    while(times-- > 0) {
                        sort((a, b) => {
                            return Math.random() > 0.5 ? 1 : -1;
                        })
                    }
                    return this;
                },

                concat(...arr){
                    let out = [...this]
                    for (let a of arr){
                        let out = [...out,...a]
                    }
                    return fromArray(out)
                }
            });

            a.push = this.displace;
            
            return a;
        };

        DisArray.fromArray(this);
    }
}