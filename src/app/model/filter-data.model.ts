export interface Constraint {
    type: string,
    operator: string,
    operands: string[] | number[]
}

export interface Filter {
    property: string,
    constraint: Constraint
}

export interface FilterStep {
    name: string,
    type: string,
    filter: Filter[]
}