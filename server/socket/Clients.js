class Clients {
  constructor() {
    this.Turn = null;
    this.List = {};
  }

  add(id) {
    const max = this.getMax();
    if (this.find(id)) this.remove(id);
    // const num = `#${max}.`;
    // const joinedAt = time;

    // this.List[max] = { id, num, joinedAt };
    this.List[max] = { id };
  }

  getNum(targetProp) {
    const targetClient = this.find(targetProp);
    if (targetClient) {
      return targetClient.num;
    }
    return null;
  }

  getMax() {
    let max = 0;
    while (this.List[max]) {
      max += 1;
    }
    return max;
  }

  size() {
    return Object.keys(this.List).length;
  }

  remove(targetProp) {
    this.find(targetProp, true);
  }

  find(targetPropValue, remove) {
    let result = false;
    const list = this.List;
    Object.entries(list).forEach(([n, currClient]) => {
      Object.values(currClient).forEach((value) => {
        if (value === targetPropValue) {
          if (remove) {
            delete list[n];
          }
          result = currClient;
        }
      });
    });
    return result;
  }
}

function cut() { return `"${this.slice(0, 2)}.."`; }
String.prototype.cut = cut;

const clientList = new Clients();

module.exports = clientList;
