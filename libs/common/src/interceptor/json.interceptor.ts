import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

type Checker<T> = (t: any) => t is T
type Converter<T> = (t: T) => any
type CheckAndConverter<T> = {
  check: Checker<T>
  convert: Converter<T>
}

const converter: CheckAndConverter<any>[] = [
  {
    check: (t: any) => typeof t === 'bigint',
    convert: (t: bigint) => t.toString(),
  },
  {
    check: (t: any) => t instanceof Date,
    convert: (t: Date) => t.getTime(),
  },
];

@Injectable()
export class JsonInterceptor implements NestInterceptor {
  readonly SEARCH_DEPTH = 8;

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return next
      .handle()
      .pipe(
        map(
          (value) => convert(value, this.SEARCH_DEPTH),
        ),
      );
  }
}

const convert = (
  data: any,
  depth: number,
): any => {
  if (data == null) {
    return null;
  }

  if (depth <= 0) {
    return data;
  }

  for (const convertItem of converter) {
    if (!convertItem.check(data)) {
      continue;
    }

    return convertItem.convert(data);
  }

  if (Array.isArray(data)) {
    return data.map((t) => convert(t, depth - 1));
  }

  if (typeof data === 'object') {
    return Object.keys(data).reduce((
      acc: Record<string, any>,
      key,
    ) => {
      acc[key] = convert(data[key], depth - 1);
      return acc;
    }, {});
  }

  return data;
};

