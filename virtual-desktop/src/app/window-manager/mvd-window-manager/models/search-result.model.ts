import { Entity } from './entity.model';

export class SearchResult {
  public entities: Entity[];
  public query: string;
  public type: string;

  public deserialize(input:any, query:string, type:string): SearchResult {
    this.query = query;
    this.type = type;
    this.entities = input.map((instance:any)=>new Entity().deserialize(instance))
    return this;
  }
}
