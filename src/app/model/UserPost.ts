export class UserPost {
  public userId: number;
  public id: number;
  public title: string;
  public body: string;

  constructor() {
    this.userId = 0;
    this.id = 0;
    this.body = '';
    this.title = '';
  }
}
