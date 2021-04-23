declare global {
    interface Array<T> {
        Where(fn: (n: T) => boolean): T[];
        WhereIf(check: boolean, fn: (n: T) => boolean): T[];
        DeleteWhere(fn: (n: T) => boolean): T[];
        Select(fn: (n: T) => any): any[];
        Join<Y, Z>(away: Y[], joinCondition: (home: T, away: Y) => boolean, output: (home: T, away: Y) => Z): Z[];
        FirstOrDefault(def4ult?: T): T;
        LastOrDefault(def4ult?: T): T;
        Max(fn?: (n: T) => any): T;
        Min(fn?: (n: T) => any): T;
        Count(): number;
        Any(): boolean;
        Sum(fn: (n: T) => number): number;
        Average(fn: (n: T) => number): number;
        Skip(n: number): T[];
        Take(n: number): T[];
        OrderBy(fn: (n: T) => any): T[];
        OrderByDescending(fn: (n: T) => any): T[];
        IdenticalTo<T>(other: T[]): boolean;
        Distinct<Y>(fn: (n: T) => Y): Y[];
        GroupBy<Y, Z>(key: (n: T) => Z, output: (key: Z, set: T[]) => Y): Y[];
    }
}
export {};
