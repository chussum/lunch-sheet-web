interface SearchParams {}

export interface MySQLRepository {
  findAll(params: SearchParams);
  findById(id: number);
  remove(id: number);
}
