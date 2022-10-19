const DELIMITER_PATH = '/';
const DELIMITER_URL_PARTS = '?';
const DELIMITER_SEARCH_PARAMS = '&';
const DELIMITER_SEARCH_VALUES = '=';
const trimRegex = /^\/|\/$/g;
const trimPath = (path = '') => path.replace(trimRegex, '');
const trimPathNotFirst = (path: string = '', index?: number) =>
  index === 0 ? path : path.replace(trimRegex, '');

export class UrlJoin {
  private params: object | null = null;

  constructor(
    private readonly baseUrl: string | undefined,
    private readonly paths: string[]
  ) {}

  public toString(): string {
    const hasBaseUrl = this.baseUrl !== null && this.baseUrl !== undefined;
    let resultUrl = [this.baseUrl, ...this.paths]
      .filter(Boolean)
      .map(hasBaseUrl ? trimPath : trimPathNotFirst)
      .join(DELIMITER_PATH);

    if (this.hasParams()) {
      const queryParams = Object.keys(this.params!)
        .map((key) => {
          return (
            encodeURIComponent(key) +
            DELIMITER_SEARCH_VALUES +
            encodeURIComponent(this.params![key])
          );
        })
        .join(DELIMITER_SEARCH_PARAMS);
      resultUrl += DELIMITER_URL_PARTS + queryParams;
    }

    return resultUrl;
  }

  public queryParams(params: object): UrlJoin {
    this.params = params;
    return this;
  }

  private hasParams(): boolean {
    return !!this.params && Object.keys(this.params).length > 0;
  }
}

export function urlJoin(
  baseUrl: string | undefined,
  ...paths: Array<string>
): string {
  return new UrlJoin(baseUrl, paths).toString();
}

export function relativeUrl(path: string) {
  return urlJoin(import.meta.env.BASE_URL, path);
}

export function parseUrl(url: string) {
  return url.replace(/http(s?):\/\//, '');
}
