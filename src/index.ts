declare global{
    interface Array<T> {
        Where(fn : (n : T) => boolean) : T[];
        WhereIf(check: boolean, fn: (n: T) => boolean) : T[];
        DeleteWhere(fn : (n : T) => boolean) : T[];
        Select(fn : (n : T) => any) : any[];
        Join<Y,Z>(away : Y[], joinCondition : (home: T, away: Y) => boolean, output : (home : T, away: Y) => Z) : Z[];
        FirstOrDefault(def4ult?: T) : T;
        LastOrDefault(def4ult?: T) : T;
        Max(fn? : (n : T) => any) : T;
        Min(fn? : (n : T) => any) : T;
        Count() : number;
        Any() : boolean;
        Sum(fn : (n : T) => number) : number;
        Average(fn : (n : T) => number) : number;
        Skip(n : number) : T[];
        Take(n : number) : T[];
        OrderBy(fn : (n : T) => any) : T[];
        OrderByDescending(fn: (n : T) => any) : T[];
        //to do -- require comparison operations
        IdenticalTo<T>(other: T[]) : boolean;
        Distinct<Y>(fn : (n : T) => Y) : Y[]
        GroupBy<Y, Z>(key : (n : T) => Z, output : (key: Z, set : T[]) => Y) : Y[]
    }

}

Array.prototype.Where = function<T>(this: T[], fn: (n : T) => boolean) : T[]
{
    let ret = new Array<T>();
    this.forEach(element => {
      if(fn(element))
      ret.push(element);
    });
    return ret;
}

Array.prototype.WhereIf = function<T>(this:T[],check: boolean, fn: (n: T) => boolean) : T[]
{
  if(check)
    return this.Where(fn);
  return this;
}

Array.prototype.DeleteWhere = function<T>(this: T[], fn : (n : T) => boolean) : T[]
{
  let ret : T[] = this;
  ret.forEach((element, j) => {
    if(fn(element))
      ret.splice(j,1);
  });
  return ret;
}

Array.prototype.Select = function<T>(this: T[], fn : (n : any) => any) : any[]
{
    let ret : any[] = [];
    this.forEach(element => {
      ret.push(fn(element));
    });
    return ret;
}

Array.prototype.Join = function<T, Y, Z>(this : T[], away: Y[], joinCondition : (home: T, away: Y) => boolean, output : (home: T, away: Y) => Z) : Z[] 
{
  let ret : Z[] = [];
  this.forEach(a => {
    away.forEach(b => {
    if(joinCondition(a, b))
        ret.push(output(a, b));
    });
  });
  return ret;
}
  
Array.prototype.FirstOrDefault = function<T>(this : T[], def4ult?: T)
{
  if(this.length > 0)
    return this[0];
  return def4ult;
}

Array.prototype.LastOrDefault = function<T>(this : T[], def4ult?: T)
{
  if(this.length > 0)
    return this[this.length - 1];
  return def4ult;
}

Array.prototype.Max = function<T>(this : T[], fn?: (n : T) => any) : T
{
  let ret : T;
  ret = this[0];
  if(fn)
  {
    this.forEach(element => {
      if(fn(element) > fn(ret))
        ret = element;
    });
  }
  else
  {
    this.forEach(element => {
      if(element > ret)
        ret = element;
    });
  }
  return ret;
}

Array.prototype.Min = function<T>(this : T[], fn?: (n : T) => any) : T
{
  let ret : T;
  ret = this[0];
  if(fn)
  {
    this.forEach(element => {
      if(fn(element) < fn(ret))
        ret = element;
    });
  }
  else
  {
    this.forEach(element => {
      if(element < ret)
        ret = element;
    });
  }
  return ret;
}

Array.prototype.Count = function<T>(this : T[]) : number {
  return this.length;
}

Array.prototype.Any = function<T>(this : T[]) : boolean {
  return (this.Count() > 0);
}

Array.prototype.Sum = function<T>(this : T[], fn: (n : T) => number) : number
{
  let ret : number = 0;
  this.forEach(element => {
    ret += fn(element);
  });
  return ret;
}

Array.prototype.Average = function<T>(this : T[], fn : (n : T) => number) : number
{
  return this.Sum(fn) / this.Count();
}

Array.prototype.OrderBy = function<T>(fn : (n : T) => any) : T[]
{
  return this.sort((a, b) => {
    if(fn(a) > fn(b))
      return 1;
    else
      return -1;
  });
}

Array.prototype.OrderByDescending = function<T>(fn : (n : T) => any) : T[]
{
  return this.sort((a, b) => {
    if(fn(a) < fn(b))
      return 1;
    else
      return -1;
  });
}

Array.prototype.Skip = function<T>(this : T[], n : number) : T[]
{
  return this.splice(0, n);
}

Array.prototype.Take = function<T>(this: T[], n : number) : T[]
{
  return this.slice(0, n);
}

Array.prototype.IdenticalTo = function<T>(this: T[], other: T[]) : boolean
{
  if(this.Count() !== other.Count())
    return false;
  for(let cc = 0; cc < this.Count(); cc++)
  {
    if(!EqualByValue(this[cc], other[cc]))
      return false;
  }
  return true;
}

Array.prototype.Distinct = function<T,Y>(this : T[], fn: (n : T) => Y) : Y[]
{
  let ret: Y[] = [];
  this.forEach(element => {
    if(!ret.Where(y => y == fn(element)).Any())
      ret.push(fn(element));
  });
  return ret;
}

Array.prototype.GroupBy = function<T, Y, Z>(key : (n : T) => Z, output : (key: Z, set : T[]) => Y) : Y[]
{
  let ret: Y[] = [];
  let temp: {Key:Z, Set:T[]}[] = [];
  this.forEach(element => {
    let k = key(element);
    if(!temp.Where(n => n.Key == k).Any())
      temp.push(({Key: k, Set: this.Where(n => key(n) == k)}));
  });
  temp.forEach(element => {
    ret.push(output(element.Key, element.Set));
  });
  return ret;
}


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

function EqualByValue(x : any, y: any)
{
  if(y === x) return true;

  if(typeof x !== typeof y)
    return false;

  if(x instanceof Date && y instanceof Date)
  {
    if(x.valueOf() !== y.valueOf())
      return false;
  }

  if(x instanceof Array)
  {
    if(y instanceof Array)
    {
      if(!x.IdenticalTo(y))
        return false;
    }
    else
      return false;
  }

  //Check values
  for(let key in x)
  {
    if(y.hasOwnProperty(key))
    {
      if(x[key] !== Object(x[key])) //primitive check
      {
        if(x[key] != y[key])
          return false;
      }
      else if(typeof x[key] != 'function')
      {
        console.log(x[key] + ' = ' + y[key]);
        if(!EqualByValue(x[key],y[key]) )
          return false;
      }
    }
    else
      return false;
  }
  //Check array values
  return true;
}

export {};