export interface NumberConstraint {
    type: 'number',
    operator: string,
    operandsCount: number,
}

export interface StringConstraint {
    type: 'string',
    operator: string,
    operandsCount: number
}

export interface ConstraintDefinition {
    numberConstraints: NumberConstraint[],
    stringConstraints: StringConstraint[]
}

export interface FilterProperty {
    name: string,
    constraints: ConstraintDefinition
}

export interface FilterEvent {
    type: string,
    properties: FilterProperty[]
}

export interface FilterConfig {
    events: FilterEvent[]
}

