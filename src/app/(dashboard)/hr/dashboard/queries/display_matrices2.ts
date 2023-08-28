const display_matrices2 = (
  results: {
    total?: number;
    data?: any;
    date: {
      year: number;
      month: number;
    };
  }[],
  key: string,
  style = undefined
) => {
  if (results.length < 2 || !results[0].date) {
    return null;
  }

  const dFormatter = (year: number, month?: number, day?: number) => {
    const options: any = { year: '2-digit' };

    if (month !== undefined) {
      // Adjust month by subtracting 1 to match JavaScript's zero-based months
      options.month = 'short';
      month--; // Subtract 1 from the month value
    }

    if (day !== undefined) {
      // Adjust day by subtracting 1 to match JavaScript's zero-based days
      options.day = 'numeric';
      day--; // Subtract 1 from the day value
    }

    return new Intl.DateTimeFormat(undefined, options).format(new Date(year, month || 0, day));
  };

  const data = results.map(({ date: { year, month }, total, data }) => {
    return {
      [month ? month : year]: dFormatter(year, month),
      [key]: total,
      ...data,
    };
  });

  if (!results[0]?.total) {
    return { data, style };
  }

  const delta = (results[0].total - results[1].total) / results[1].total;

  const kpi = {
    title: key,
    metric: nFormatter(results[0].total, style),
    metric_prev: nFormatter(results[1].total, style),
    delta: {
      value: nFormatter(delta, {
        style: 'percent',
      }),
      type: delta > 0 ? 'moderateIncrease' : 'moderateDecrease',
    },
  };

  return { data, kpi, style };
};

export default display_matrices2;
