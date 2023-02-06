export default class CachedEntity<T> {
  public entity: T;
  public lastUpdated: number;
  public expires: number;

  constructor(entity: T, expireTime: number = 1000 * 60 * 5) {
    this.entity = entity;
    this.lastUpdated = Date.now();

    this.expires = this.lastUpdated + expireTime;
  }

  public update(entity: T) {
    this.entity = entity;
    this.lastUpdated = Date.now();
  }

  public isExpired(): boolean {
    return Date.now() > this.expires;
  }

  public get(): T {
    return this.entity;
  }
}
