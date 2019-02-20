export class EntityData {
  public data: any;

  constructor();
  constructor(obj: any);
  constructor(obj?: any) {
    this.data = obj && obj.data || '';
  }

  public deserialize(input:any): EntityData {
    this.data = input.data;
    return this;
  }

  public serialize(): any {
     const json = {
      data: this.data,
    };
    return json;
  }
}
