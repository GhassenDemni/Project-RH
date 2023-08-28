type MetricKey = 'sum' | 'count' | 'avg' | 'low' | 'max';

interface DateObject {
  year: number;
  month: number;
  day?: number;
}

interface Metrics {
  [key: string]: number | undefined;
  sum?: number;
  count?: number;
  avg?: number;
  low?: number;
  max?: number;
}

interface Result {
  _id: string;
  date?: DateObject;
  metrics: Metrics;
}

interface DisplayOptions {
  aggregate?: MetricKey; // Changed 'key' to 'aggregate'
  index?: string;
  category?: string;
  title?: string;
  n_style?: Intl.NumberFormatOptions;
}

interface KPI {
  title?: string;
  index?: string;
  category?: string;
  categories: string[];
  metric: {
    current: string;
    prev: string;
  };
  delta: {
    value: string;
    type: 'moderateIncrease' | 'moderateDecrease';
  };
}

const display_matrices = (
  results: Result[],
  options: DisplayOptions
): { data: Record<string, any>[]; kpi: KPI } | null => {
  const metricsKeys: MetricKey[] = ['sum', 'count', 'avg', 'low', 'max'];
  const dateKeys: ('month' | 'year')[] = ['month', 'year'];

  if (results.length < 2) {
    return null;
  }

  // options.aggregate = Object.keys(results[0][Object.keys(results[0]).at(-1)][0]);

  options.index = options.index || '_id';

  const isMetricKey = metricsKeys.includes(options.aggregate);
  const isDateKey = dateKeys.includes(options.aggregate);
  const keyType = isMetricKey ? 'metrics' : isDateKey ? 'date' : null;

  if (!isMetricKey && !isDateKey) {
    throw new Error('Invalid KEY: ' + options.aggregate);
  }

  const categories = results.map(item => item._id).sort();
  options.category = options.category || options.aggregate;

  const nFormatter = (number: number, style?: Intl.NumberFormatOptions) =>
    Intl.NumberFormat(undefined, style || options.n_style).format(number);

  const value: number = results[0][keyType][options.aggregate];
  const prev_value: number = results[1][keyType][options.aggregate];

  if (!value || !prev_value) {
    throw new Error('Result has no key called ' + options.aggregate);
  }

  const delta = (value - prev_value) / prev_value;

  const kpi: KPI = {
    title: options.title,
    index: options.index || '_id',
    category: options.category,
    categories,
    metric: {
      current: nFormatter(value),
      prev: nFormatter(prev_value),
    },
    delta: {
      value: nFormatter(delta, {
        style: 'percent',
      }),
      type: delta > 0 ? 'moderateIncrease' : 'moderateDecrease',
    },
  };

  const dFormatter = ({ year, month, day }: DateObject) =>
    new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
    }).format(new Date(year, month - 1, day || new Date().getDate()));

  const data = results.map(item => {
    const { date } = item;

    if (isDateKey && date) {
      const _key = date.year && date.month ? 'month' : 'year';
      return {
        [_key]: dFormatter(date),
        [options.aggregate as MetricKey]: item.metrics[options.aggregate as MetricKey],
      };
    }

    return {
      [options.index as string]: item._id,
      [options.category as string]: item[keyType][options.aggregate as MetricKey],
    };
  });

  return { data, kpi };
};

export default display_matrices;
