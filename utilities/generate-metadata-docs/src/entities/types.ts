export interface JSONSchema {
  $schema?: string;
  title: string;
  anyOf?: Ref[];
  definitions: { [key: string]: Definition };
}

export interface Ref {
  $ref: string;
}

export interface Definition {
  anyOf?: Ref[];
  oneOf?: RefOrDefinition[];
  $id?: string;
  title: string;
  description: string;
  type: string;
  required?: string[];
  properties?: { [key: string]: Property };
  additionalProperties?: boolean;
  format?: string;
  enum?: string[];
  examples?: any[];
}

export type RefOrDefinition = Ref | Definition;

export interface Property {
  type: string;
  description?: string;
  enum?: string[];
  allOf?: Ref[];
  $ref?: string;
  anyOf?: RefOrDefinition[];
  oneOf?: RefOrDefinition[];
}
