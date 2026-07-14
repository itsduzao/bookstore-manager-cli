export interface Repository<T> {
  list(): Promise<Array<T>>
  create(entity: T): Promise<T>
  findByName(name: string): Promise<T | null>
  findById(id: string): Promise<T | null>
}