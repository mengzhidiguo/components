import { Expose, plainToClass } from 'class-transformer';
import { v4 } from 'uuid';

const noop = () => {};

export type DeepPartial<T> = T extends (infer U)[] ? DeepPartial<U>[] : { [P in keyof T]?: DeepPartial<T[P]> };

export interface SortParam {
  field: string;
  order: number;
}

export interface PageParam {
  // offset
  first: number;
  // limit
  rows: number;
}

export class TableOptions {
  @Expose()
  paginator = true;
  @Expose()
  lazy = true;
  @Expose()
  alwaysShowPaginator = true;
  @Expose()
  responsive = true;
  @Expose()
  autoLayout = true;
  @Expose()
  resetPageOnSort = true;
  @Expose()
  rowsPerPageOptions: number[] = null;
  @Expose()
  query = {
    searchParam: null,
    sortParam: null,
    rows: 10,
    first: 0,
    total: 100,
  };
  static createTableOptions(options?: DeepPartial<TableOptions>): TableOptions {
    const tableOptions = new TableOptions();
    return plainToClass(
      TableOptions,
      { ...tableOptions, ...options, query: { ...tableOptions.query, ...options?.query } },
      { excludeExtraneousValues: true },
    );
  }
}

export abstract class BaseTableDataModel<T> {
  private _data: T[];
  get data(): T[] {
    return this._data;
  }
  protected abstract header: { name: string; field?: string }[];
  private _loading: boolean;
  get loading(): boolean {
    return this._loading;
  }
  private _waitingTaskQueue: string[] = [];
  private _currentTask: Promise<unknown>;
  protected $options: TableOptions;
  get options(): TableOptions {
    return this.$options;
  }
  protected abstract $setPage(pageParam: PageParam): void;
  protected abstract $onSort(sortParam: SortParam): void;
  protected abstract async $getData(): Promise<T[]>;
  protected abstract $search(data): void;
  protected abstract $reset(): void;
  constructor(options: TableOptions = new TableOptions()) {
    this.$options = options;
  }
  public setPage(pageParam: PageParam): void {
    this.options.query.first = pageParam.first;
    this.options.query.rows = pageParam.rows;
    this.$setPage(pageParam);
    this.loadData();
  }
  public onSort(sortParam: SortParam): void {
    this.options.query.first = 0;
    this.$onSort(sortParam);
    this.loadData();
  }
  /**
   * true: 等到机会运行下去
   * false: 没有机会运行
   *
   * @private
   * @param {string} taskId
   * @returns {Promise<boolean>}
   * @memberof BaseTableModel
   */
  private async _waitingTaskToRun(taskId: string): Promise<boolean> {
    await this._currentTask;
    const index = this._waitingTaskQueue.findIndex((id) => id === taskId);
    if (index == -1) {
      return false;
    }
    if (index === this._waitingTaskQueue.length - 1) {
      this._waitingTaskQueue = [];
      return true;
    }
    return this._waitingTaskToRun(taskId);
  }
  public async loadData(): Promise<void> {
    if (this.loading) {
      const taskId = v4();
      this._waitingTaskQueue.push(taskId);
      const result = await this._waitingTaskToRun(taskId);
      if (!result) {
        return;
      }
    }
    this._loading = true;
    const task = this.$getData();
    this._currentTask = task.catch(noop);
    this._data = await task.finally(() => (this._loading = false));
  }
  public search(data): void {
    this.options.query.first = 0;
    this.$search(data);
    this.loadData();
  }
  public async reset(): Promise<void> {
    this.options.query.first = 0;
    this.options.query.sortParam = null;
    this.options.query.searchParam = null;
    this.$reset();
    this.loadData();
  }
}
