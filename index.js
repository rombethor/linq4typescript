"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Array.prototype.Where = function (fn) {
    var ret = new Array();
    this.forEach(function (element) {
        if (fn(element))
            ret.push(element);
    });
    return ret;
};
Array.prototype.WhereIf = function (check, fn) {
    if (check)
        return this.Where(fn);
    return this;
};
Array.prototype.DeleteWhere = function (fn) {
    var ret = this;
    ret.forEach(function (element, j) {
        if (fn(element))
            ret.splice(j, 1);
    });
    return ret;
};
Array.prototype.Select = function (fn) {
    var ret = [];
    this.forEach(function (element) {
        ret.push(fn(element));
    });
    return ret;
};
Array.prototype.Join = function (away, joinCondition, output) {
    var ret = [];
    this.forEach(function (a) {
        away.forEach(function (b) {
            if (joinCondition(a, b))
                ret.push(output(a, b));
        });
    });
    return ret;
};
Array.prototype.FirstOrDefault = function (def4ult) {
    if (this.length > 0)
        return this[0];
    return def4ult;
};
Array.prototype.LastOrDefault = function (def4ult) {
    if (this.length > 0)
        return this[this.length - 1];
    return def4ult;
};
Array.prototype.Max = function (fn) {
    var ret;
    ret = this[0];
    if (fn) {
        this.forEach(function (element) {
            if (fn(element) > fn(ret))
                ret = element;
        });
    }
    else {
        this.forEach(function (element) {
            if (element > ret)
                ret = element;
        });
    }
    return ret;
};
Array.prototype.Min = function (fn) {
    var ret;
    ret = this[0];
    if (fn) {
        this.forEach(function (element) {
            if (fn(element) < fn(ret))
                ret = element;
        });
    }
    else {
        this.forEach(function (element) {
            if (element < ret)
                ret = element;
        });
    }
    return ret;
};
Array.prototype.Count = function () {
    return this.length;
};
Array.prototype.Any = function () {
    return (this.Count() > 0);
};
Array.prototype.Sum = function (fn) {
    var ret = 0;
    this.forEach(function (element) {
        ret += fn(element);
    });
    return ret;
};
Array.prototype.Average = function (fn) {
    return this.Sum(fn) / this.Count();
};
Array.prototype.OrderBy = function (fn) {
    return this.sort(function (a, b) {
        if (fn(a) > fn(b))
            return 1;
        else
            return -1;
    });
};
Array.prototype.OrderByDescending = function (fn) {
    return this.sort(function (a, b) {
        if (fn(a) < fn(b))
            return 1;
        else
            return -1;
    });
};
Array.prototype.Skip = function (n) {
    return this.splice(0, n);
};
Array.prototype.Take = function (n) {
    return this.slice(0, n);
};
Array.prototype.IdenticalTo = function (other) {
    if (this.Count() !== other.Count())
        return false;
    for (var cc = 0; cc < this.Count(); cc++) {
        if (!EqualByValue(this[cc], other[cc]))
            return false;
    }
    return true;
};
Array.prototype.Distinct = function (fn) {
    var ret = [];
    this.forEach(function (element) {
        if (!ret.Where(function (y) { return y == fn(element); }).Any())
            ret.push(fn(element));
    });
    return ret;
};
Array.prototype.GroupBy = function (key, output) {
    var _this = this;
    var ret = [];
    var temp = [];
    this.forEach(function (element) {
        var k = key(element);
        if (!temp.Where(function (n) { return n.Key == k; }).Any())
            temp.push(({ Key: k, Set: _this.Where(function (n) { return key(n) == k; }) }));
    });
    temp.forEach(function (element) {
        ret.push(output(element.Key, element.Set));
    });
    return ret;
};
// Object.prototype.Equals = function(this: {[k:string]:any}, x : any)
// {
//   if(this == x) return true;
//   //Check values
//   for(let key in x)
//   {
//     if(this.hasOwnProperty(key))
//     {
//       if(x[key] !== Object(x[key])) //primitive check
//       {
//         if(x[key] != this[key])
//           return false;
//       }
//       else if(typeof x[key] != 'function')
//       {
//         console.log(x[key] + ' = ' + this[key]);
//         if(!x[key].Equals(this[key]))
//           return false;
//       }
//     }
//   }
//   //Check array values
//   return true;
// }
function EqualByValue(x, y) {
    if (y === x)
        return true;
    if (typeof x !== typeof y)
        return false;
    if (x instanceof Date && y instanceof Date) {
        if (x.valueOf() !== y.valueOf())
            return false;
    }
    if (x instanceof Array) {
        if (y instanceof Array) {
            if (!x.IdenticalTo(y))
                return false;
        }
        else
            return false;
    }
    //Check values
    for (var key in x) {
        if (y.hasOwnProperty(key)) {
            if (x[key] !== Object(x[key])) //primitive check
             {
                if (x[key] != y[key])
                    return false;
            }
            else if (typeof x[key] != 'function') {
                console.log(x[key] + ' = ' + y[key]);
                if (!EqualByValue(x[key], y[key]))
                    return false;
            }
        }
        else
            return false;
    }
    //Check array values
    return true;
}
//# sourceMappingURL=index.js.map