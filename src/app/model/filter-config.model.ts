export type ConstraintString = 'string';
export type ConstraintNumber = 'number';

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

export interface EventProperty {
    name: string,
    constraints: ConstraintDefinition
}

export interface FilterEvent {
    type: string,
    properties: EventProperty[]
}

export interface FilterConfig {
    events: FilterEvent[]
}

