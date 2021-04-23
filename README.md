# linq4typescript

Overrides the base array type adding in Linq-style commands.

Current commands are:
 - Where
 - Join
 - Select
 - FirstOrDefault
 - LastOrDefault
 - Max
 - Min
 - Count
 - Sum
 - OrderBy
 - OrderByDescending
 - Skip
 - Take
 - IdenticalTo
 - Distinct
 - GroupBy

More commands to come soon!

Please note: There are some limitations to the number of parameters you can Order By or Group By, for example, the GroupBy method doesn't yet allow grouping by multiple parameters (unless you combine them into a string).  For the next major build I will be looking into deep comparisons of objects.

I hope you find this useful, whoever you are.

## Installation

Just install the package 

`npm install linq4typescript`

and use as:

`import 'linq4typescript';`

Angular tip!
If you use Angular (2+) just import into your base AppModule and the functions will be accessible throughout the module.


## Usage

Here is a set-up with some example data which we will use for the following demonstrations:

```typescript
class HumanName{
  public PersonID: number;
  public Name: string;
};

class BirthDate{
  public PersonID: number;
  public DOB: Date;
  public Candles: number;
};

const HumanNames: HumanName[] = [
  { PersonID: 1, Name: 'Daniel' },
  { PersonID: 2, Name: 'James' },
  { PersonID: 3, Name: 'Lee' }
];

const Birthdates: BirthDate[] = [
  { PersonID : 1, DOB : new Date(1991,1,1), Candles: 29 },
  { PersonID : 2, DOB : new Date(1996,1,1), Candles: 24 },
  { PersonID : 3, DOB : new Date(1999,2,1), Candles: 21 }
];
```

### Where, Join and Select Example

```typescript
function GetNamesBornAfter1995() : string[]
{
  return Birthdates
    .Join(HumanNames, (dob, name) => name.PersonID == dob.PersonID, (dob, name) => ({ Name: name, Dob: dob }))
    .Where(x => x.Dob.DOB > new Date(1995,1))
    .Select(x => x.Name.Name);
}
```

This returns ['James','Lee']

### Sum

Sums over a property defined by the selector 'fn'.

```typescript
function GetSumOfCandles() : number
{
    return Birthdates.Sum(bd => bd.Candles);
}
```

This returns 74.

If the array's type is numeric, you can pass in the selector `x => x` and it will sum over the values in the numeric array.

### Count

Counts the number of elements.  Does the same as the length property.

```typescript
function CountHumanNames() : number
{
    return HumanNames.Count();
}
```

This returns 3.

### Where

Takes a condition as a function parameter to filter the elements.

```typescript
function WhereCandlesLessThan25() : BirthDate[]
{
    return Birthdates.Where(bd => bd.Candles < 25);
}
```

### WhereIf

Same as `Where` but only applies the filter condition if the supplied check is correct.

```typescript
function ShouldIApplyTheCheck(yesorno: boolean) : BirthDate[]
{
    return Birthdates.WhereIf(yesorno, bd => bd.Candles < 25);
}
```

If `yesorno = true` it will return objects which have `Candles < 25` otherwise it will return the whole original array, unfiltered.

### Select

Allows the type to be changed such that, for example, a property of the original object type is selected.

```typescript
function GetFirstLetterOfNames() : string[]
{
    return HumanNames.Select(hn => hn.substring(0,1));
}
```

This returns ['D','J','L']

### Join

Performs an 'inner join' of two arrays.

A join between two arrays requires three parameters.
1) The array you want to join in with this array
2) The condition on which you want to join the two arrays, i.e. by using a shared ID.
3) The output object which will define the type of the new array.

```typescript
function GetNameAndBirthdateAsText() : string[]
{
    return Birthdates
        .Join(
            /* Array to join with Birthdates */
            HumanNames, 
            /* Condition on which to join them */
            (dob, name) => name.PersonID == dob.PersonID, 
            /* defines the result, i.e. 'Daniel 1991-01-01'  */
            (dob, name) => name.Name + ' ' + dob.DOB.toISOString()
        );
}
```

### FirstOrDefault (and LastOrDefault)

FirstOrDefault (and LastOrDefault) will return null if the array is empty, unless a different default value is specified.

```typescript
function GetLastBirthDate()
{
    return Birthdates
        .Select(bd => bd.DOB)
        .LastOrDefault(new Date());
}
```
The above should return the date '1999-01-01'.  If the Birthdates array were empty, it would return today's date.  

Beware that this example has no ordering!  That brings us on to...

### OrderBy (and OrderByDescending)

Using these two functions, we only need to pass in a selector function for the property or value which we want to sort by.

If we use OrderBy, it sorts ascending.  If we use OrderByDescending, it sorts descending.

```typescript
function OrderByDateOfBirth()
{
    return Birthdates
        .OrderBy(bd => bd.DOB);
}
```

### Max and Min

The Max (or Min) function will return the Maximum (or Minimum) value according to the selector function.

```typescript
function GetMaxBirthDate()
{
    /* should return 1999 */
    return Birthdates.Max(bd => bd.DOB);
}

function GetMinBirthDate()
{
    /* should return 1991 */
    return Birthdates.Min(bd => bd.DOB);
}
```

### Skip and Take

The Skip function removes the first n values from the array.
The Take function returns the first n values from the array.

This could be useful for paging.  
(please note, 'pagination' is not a real word, if you look it up 'paging' in the dictionary you'll have what you require)

```typescript
function GetPageData(pageIndex : number, pageSize: number)
{
    return MyData.Skip(pageSize * pageIndex).Take(pageSize);
}
```

### IdenticalTo

Compares the values in an array and returns true if both arrays have identical values in the same order.

### Distinct

The distinct function will find a set of distinct objects according to the values selected.  The return array will have the same return type as the selector.

```typescript
function GetDistinctDatesAsStrings() : any[]
{
    /* compares the ISO Strings of dates and gets distinct values */
    return Birthdates.Distinct(bd => bd.DOB.toISOString());
}
```

Warning!  This hasn't been tested yet comparing objects, only base types.  It is unlikely to properly compare objects by their properties, though I will look into this soon.

### GroupBy

Groups by the key function (parameter 1) and returns the keys with their related set 

```typescript
function GroupByMonth()
{
    return Birthdates.GroupBy(
        /* The first parameter is the key to group by */
        bd => bd.DOB.getMonth(), 
        /* The second parameter is the result we want in the return array, i.e. applying an aggregate function */
        (month, set)=> set.Sum(bd => bd.Candles));
}
```

This should return an array of two numbers, the first being the sum of (29 and 24), corresponding to the month 1, the second being 21, corresponding to the month 2.


