import { string, array } from "@hapi/joi";
import { ValueObject } from "@crensoft/ddd";

interface ISchemaFields {
  readonly fields: any;
}

export class SchemaFields extends ValueObject<ISchemaFields> {
  private constructor(props: ISchemaFields) {
    super(props);
  }

  toValue() {
    return this.parsedFields().join("\n");
  }

  toRequired() {
    return this.parsedFields().join("!\n").replace(/\!$/i, "");
  }

  toInput(fields?: any) {
    return this.parsedFields(true, fields).join("\n");
  }

  private parsedFields(useInput?: boolean, fields?: any) {
    const key = useInput ? "inputName" : "name";
    const parsedFields: string[] = [];

    this.props.fields.forEach((field: any) => {
      if (typeof field === "string") {
        const filteredField = this.filterField(field, fields);
        filteredField && parsedFields.push(filteredField);
      } else {
        const fieldName = field[0];
        const fieldType = field[1];
        const useArray = field[2];
        parsedFields.push(
          `${fieldName}: ${useArray ? `[${fieldType[key]}]` : fieldType[key]}`
        );
      }
    });
    return parsedFields;
  }

  /**
   * Removes fields not included in fields. Sets field set to 1 as required.
   * @param field
   * @param fields optional object of { fieldName: 1, fieldName2: 0 }
   */
  private filterField(field: string, fields?: any) {
    const fieldName = field.split(":")[0];
    if (fields) {
      if (fields[fieldName] === 1 || fields[fieldName] === 0) {
        return fields[fieldName] ? `${field}!` : field;
      }
      return false;
    }
    return field;
  }

  public static create(fields: any): SchemaFields {
    return new SchemaFields({ fields });
  }

  public static schema = array().items(string().required());
}
