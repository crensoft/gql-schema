import { string, assert } from "@hapi/joi";
import { ValueObject } from "@crensoft/ddd";
import { SchemaFields } from "./schema-fields";

interface ISchemaType {
  readonly name: string;
  readonly fields: SchemaFields;
  readonly inputFields?: { [name: string]: 1 | 0 };
}

export class SchemaType extends ValueObject<ISchemaType> {
  private constructor(props: ISchemaType) {
    super(props);
  }

  get name() {
    return this.props.name;
  }

  get fields() {
    return this.props.fields;
  }

  get inputName() {
    return `${this.name}Input`;
  }

  toValue() {
    return {
      name: this.name,
      fields: this.fields.toValue(),
    };
  }

  toSchema() {
    return `type ${this.name} {
${this.fields.toValue()} 
}`;
  }

  toInput({ required }: { required?: boolean } = {}) {
    return `input ${this.inputName} {
  ${
    required
      ? this.fields.toRequired()
      : this.fields.toInput(this.props.inputFields)
  } 
  }`;
  }

  public static create(
    name: string,
    fields: SchemaFields,
    inputFields?: ISchemaType["inputFields"]
  ): SchemaType {
    assert(name, string());
    return new SchemaType({ name, fields, inputFields });
  }
}
