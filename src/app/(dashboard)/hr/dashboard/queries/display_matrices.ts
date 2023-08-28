const display_matrices = (
  results: {
    total: number;
    date: {
      year: number;
      month: number;
    };
  }[],
  key: string,
  n_style?: Intl.NumberFormatOptions
) => {
  if (results.length < 2 || !results[0].date) {
    return null;
  }

  const nFormatter = (number: number, style?: object) =>
    Intl.NumberFormat(undefined, style || n_style).format(number);

  const dFormatter = (year: number, month: number) =>
    new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
    }).format(new Date(year, month, new Date().getDate()));

  const data = results.map(({ date: { year, month }, total }) => {
    return {
      month: dFormatter(year, month),
      [key]: total,
    };
  });

  const delta = (results[0].total - results[1].total) / results[1].total;

  const kpi = {
    title: key,
    index: 'month',
    metric: nFormatter(results[0].total),
    metric_prev: nFormatter(results[1].total),
    delta: {
      value: nFormatter(delta, {
        style: 'percent',
      }),
      type: delta > 0 ? 'moderateIncrease' : 'moderateDecrease',
    },
  };

  return { data, kpi, style: n_style };
};

export default display_matrices;
