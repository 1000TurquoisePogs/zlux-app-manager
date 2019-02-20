import { Entity } from './entity.model';

export class SearchResult {
  public entities: Entity[];
  public query: string;

  public deserialize(input:any, query:string): SearchResult {
    this.query = query;
    this.entities = input.map((instance:any)=>new Entity().deserialize(instance))
    return this;
  }
}
